using Microsoft.AspNetCore.Mvc;
using CMS.Service.Common;
using CMS.Model;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace CMS.WebApi.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class OsobeController : ControllerBase
    {
        private readonly IService _service;
        private readonly ILogger<OsobeController> _logger;

        public OsobeController(IService service, ILogger<OsobeController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<OsobaDomain>> GetAll()
        {
            _logger.LogInformation("Fetching all osobe");
            var osobe = _service.PrikaziSveOsobe();
            return Ok(osobe);
        }

        [HttpGet("{id}")]
        public ActionResult<OsobaDomain> GetById(string id)
        {
            _logger.LogInformation($"Fetching osoba with id {id}");
            var osoba = _service.PrikaziOsobuPoId(id);
            if (osoba == null)
            {
                return NotFound();
            }
            return Ok(osoba);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> IzbrisiProfil(string id)
        {

            bool result = await _service.DeleteProfileAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return Ok(new { message = "Profil uspješno obrisan" });
        }

        [HttpPut("{id}")]

        public async Task<IActionResult> UpdateOpis(string id, [FromBody] OsobaDomain updatedOsoba)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.AzurirajOpisProfila(id, updatedOsoba.OpisProfila);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
