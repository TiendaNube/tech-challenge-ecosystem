using TechChallenge.Core.Entities;
using TechChallenge.Core.Interfaces;

namespace TechChallenge.Core.Services
{
    public class TransactionAuthorizationService
    {
        private readonly ITransactionRepository _transactionRepository;
        public TransactionAuthorizationService(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository; 
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
                var result = await _transactionRepository.InsertTransaction(transaction, id);
                if (result > 0)
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
    }
}
