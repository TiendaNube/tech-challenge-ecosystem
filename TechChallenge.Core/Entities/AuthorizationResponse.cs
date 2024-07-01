using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TechChallenge.Core.Entities
{
    public class AuthorizationResponse
    {
        public string TransactionId { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public Decimal Amount { get; set; }
    }
}
