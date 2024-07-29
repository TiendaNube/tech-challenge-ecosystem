using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TechChallenge.Core.Entities;

namespace TechChallenge.Core.Interfaces
{
    public interface IReceivablesRepository
    {
        public Task<dynamic> SelectReceivablesByMerchantId(string merchantId);
        public Task<int> InsertReceivableAsync(string merchantId, string status, Decimal total, Decimal discount, DateTime createDate, Decimal transactionAmount);
    }
}
