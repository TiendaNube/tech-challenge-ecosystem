using Microsoft.AspNetCore.Mvc;
using TechChallenge.Core.Services;
namespace TechChallengeApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionAuthorizationController : ControllerBase
    {
        private readonly TransactionAuthorizationService _authorizationService;

        public TransactionAuthorizationController(TransactionAuthorizationService service)
        {
            _authorizationService = service;
        }
    }
}
