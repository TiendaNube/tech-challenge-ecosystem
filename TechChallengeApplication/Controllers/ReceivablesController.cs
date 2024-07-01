using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechChallenge.Core.Entities;
using TechChallenge.Core.Services;

namespace TechChallengeApplication.Controllers
{
    [Route("api/receivables")]
    public class ReceivablesController : Controller
    {
        private readonly ReceivablesService _receivablesService;

        public ReceivablesController(ReceivablesService service)
        {
            _receivablesService = service;
        }

        [HttpGet]
        [Route("{merchantId}/")]
        public async Task<IActionResult> GetReceivables(string merchantId)
        {
            if (string.IsNullOrEmpty(merchantId))
            {
                return BadRequest();
            }

            var result = await _receivablesService.GetReceivablesAsync(merchantId);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}
