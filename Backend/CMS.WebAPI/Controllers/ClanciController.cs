using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CMS.Service.Common;
using CMS.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CMS.WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    
    public class ClanciController : ControllerBase
    {
        private readonly IService _service;

        public ClanciController(IService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ClanakDomain>> GetAll()
        {
            var clanci = _service.GetAllClanci();
            return Ok(clanci);
        }

        [HttpGet("{id}")]
        public ActionResult<ClanakDomain> GetById(int id)
        {
            var clanak = _service.GetClanakById(id);
            if (clanak == null)
            {
                return NotFound();
            }
            return Ok(clanak);
        }

        [HttpPost]
        

        public async Task<IActionResult> AddClanak([FromBody] ClanakDomain clanak)
        {
            await _service.AddClanak(clanak);
            return Ok(new { message = "Članak uspješno dodan" });
        }

        [HttpPut("{id}")]
        [Authorize]

        public async Task<IActionResult> UpdateClanak(int id, [FromBody] ClanakDomain updatedClanak)
        {
            if (id != updatedClanak.Id)
            {
                return BadRequest("ID članka se ne podudara.");
            }

            await _service.UpdateClanakAsync(updatedClanak);
            return Ok(new { message = "Članak uspješno ažuriran" });
        }

        [HttpDelete("{id}/slika/{slikaId}")]
        [Authorize]

        public async Task<IActionResult> DeleteSlika(int id, int slikaId)
        {
            var success = await _service.DeleteSlikaAsync(id, slikaId);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteClanak(int id)
        {
            var result = await _service.DeleteClanakAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Članak nije pronađen" });
            }
            return Ok(new { message = "Članak uspješno obrisan" });
        }

    }
}

