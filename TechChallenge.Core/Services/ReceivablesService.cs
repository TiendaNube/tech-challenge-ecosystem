using TechChallenge.Core.Entities;
using TechChallenge.Core.Interfaces;

namespace TechChallenge.Core.Services
{
    public class ReceivablesService
    {
        private readonly IReceivablesRepository _receivablesRepository;
        public ReceivablesService(IReceivablesRepository receivablesRepository)
        {
            _receivablesRepository = receivablesRepository;
        }

        public async Task<dynamic> GetReceivablesAsync(string merchantId)
        {            
            try
            {
                var result = await _receivablesRepository.SelectReceivablesByMerchantId(merchantId);

                return result;
            }
            catch(Exception e)
            {
                return null;
            }
        }

        public async Task<int> CreateReceivablesAsync(string paymentId, string status, Decimal total, Decimal discount, DateTime createDate, Decimal subtotal)
        {
            return await _receivablesRepository.InsertReceivableAsync(paymentId, status, total, discount, createDate, subtotal);
        }
    }
}
