using Microsoft.AspNetCore.Mvc;
using TechChallenge.Core.Entities;
using TechChallenge.Core.Services;
namespace TechChallengeApplication.Controllers
{
    [Route("api/transaction")]
    [ApiController]
    public class TransactionAuthorizationController : ControllerBase
    {
        private readonly TransactionAuthorizationService _authorizationService;

        public TransactionAuthorizationController(TransactionAuthorizationService service)
        {
            _authorizationService = service;
        }

        [HttpPost]
        [Route("authorize")]
        public async Task<IActionResult> AuthorizeTransaction([FromBody] AuthorizationRequest transaction)
        {
            if (transaction == null)
            {
                return BadRequest();
            }

            var result = await _authorizationService.AuthorizeTransaction(transaction);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}
