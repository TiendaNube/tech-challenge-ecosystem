using Microsoft.VisualBasic;
using TechChallenge.Core.Entities;
using TechChallenge.Core.Interfaces;

namespace TechChallenge.Core.Services
{
    public class TransactionAuthorizationService
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly ReceivablesService _receivablesService;
        public TransactionAuthorizationService(ITransactionRepository transactionRepository, ReceivablesService receivablesService)
        {
            _transactionRepository = transactionRepository;
            _receivablesService = receivablesService;
        }

        public async Task<AuthorizationResponse> AuthorizeTransaction(AuthorizationRequest transaction)
        {
            AuthorizationResponse response = new();

            try
            {
                var id = Guid.NewGuid().ToString();
                response.TransactionId = id;
                response.Amount = transaction.Amount;
                transaction.CardNumber = transaction.CardNumber[^4..];

                DateTime transactionDate = DateTime.Now;
                var transactionResult = await _transactionRepository.InsertTransaction(transaction, id, transactionDate);
               
                var receivablesResult = await this.CreateTransactionReceivables(transaction, id, transactionDate);

                if (transactionResult > 0 && receivablesResult > 0)
                {
                    response.Status = "Approved";
                }
                else
                {
                    response.Status = "Declined";
                }

                return response;
            }
            catch 
            {
                response.Status = "Declined";
                return response;
            }
        }

        private async Task<int> CreateTransactionReceivables (AuthorizationRequest transaction, string paymentId, DateTime transactionDate)
        {
            var feePercentage = transaction.PaymentMethod == "debit_card" ? 0.02m : 0.04m;
            var status = transaction.PaymentMethod == "debit_card" ? "paid" : "waiting_funds";
            var createDate = transaction.PaymentMethod == "debit_card" ? transactionDate : transactionDate.AddDays(30);
            var discount = transaction.Amount * feePercentage;
            var total = transaction.Amount - discount;
            var subtotal = transaction.Amount;

            return await _receivablesService.CreateReceivablesAsync(paymentId, status, total, discount, createDate, subtotal);
        }
    }
}
