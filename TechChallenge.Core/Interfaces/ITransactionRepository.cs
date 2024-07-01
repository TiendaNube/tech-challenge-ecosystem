using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TechChallenge.Core.Entities;

namespace TechChallenge.Core.Interfaces
{
    public interface ITransactionRepository
    {
        public Task<dynamic> InsertTransaction(AuthorizationRequest request, string paymentId);
    }
}
