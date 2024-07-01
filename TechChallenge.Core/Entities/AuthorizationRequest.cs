using System.ComponentModel.DataAnnotations;

namespace TechChallenge.Core.Entities
{
    public class AuthorizationRequest
    {
        [Required]
        public string MerchantId { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        [Required]
        public string PaymentMethod { get; set; } = string.Empty;
        [Required]
        [CreditCard]
        public string CardNumber { get; set; } = string.Empty;
        [Required]
        public string CardHolderName { get; set; } = string.Empty;
        [Required]
        [StringLength(7, MinimumLength = 7)]
        public string CardExpirationDate { get; set; } = String.Empty;
        [Required]
        [StringLength(4, MinimumLength = 3)]
        public string CardCVV { get; set; } = string.Empty;
        [Required]
        public Decimal Amount { get; set; }
    }
}
