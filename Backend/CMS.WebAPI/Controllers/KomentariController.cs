using Microsoft.AspNetCore.Mvc;
using CMS.Service.Common;
using CMS.Model;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;

namespace CMS.WebApi.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class KomentariController : ControllerBase
    {
        private readonly IService _service;
        private readonly ILogger<KomentariController> _logger;

        public KomentariController(IService service, ILogger<KomentariController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> AddKomentar([FromBody] KomentarDomain komentar)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for komentar: {ModelState}", ModelState);
                return BadRequest(ModelState);
            }

            try
            {
                _logger.LogInformation("Adding a new komentar: {Komentar}", komentar);
                await _service.AddKomentar(komentar);
                return Ok(new { message = "Komentar added successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding komentar: {Komentar}", komentar);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{clanakId}")]
        public ActionResult<IEnumerable<KomentarDomain>> GetKomentariZaClanak(int clanakId)
        {
            var komentari = _service.PrikaziKomentareZaClanak(clanakId);
            return Ok(komentari);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKomentar(int id)
        {
            try
            {
                var komentar = await _service.GetKomentarById(id);
                if (komentar == null)
                {
                    return NotFound(new { message = "Komentar not found" });
                }

                await _service.DeleteKomentar(id);
                return Ok(new { message = "Komentar deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting komentar with id: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

    }
}
