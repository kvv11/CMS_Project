using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System;
using CMS.DAL.DataModel;
using Microsoft.AspNetCore.Cors;
using System.Linq;

namespace CMS.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly CMSContext _context;

        public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, CMSContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var user = new ApplicationUser { UserName = model.Username, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Citatelj");
                var osoba = new Osobe
                {
                    Id = user.Id,
                    Ime = model.Username,
                    Prezime = model.Prezime,
                    Email = model.Email,
                    Lozinka = "Skriveno",
                    DatumRegistracije = DateTime.Now,
                    OpisProfila = "VUV Citatelj",
                    Uloga = "Citatelj"
                };
                _context.Osobe.Add(osoba);
                await _context.SaveChangesAsync();

                var citatelj = new Citatelji
                {
                    Id = user.Id,
                };
                _context.Citatelji.Add(citatelj);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User registered successfully" });
            }
            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid login attempt." });
            }

            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, false, false);
            if (result.Succeeded)
            {
                var token = GenerateJwtToken(user);
                var roles = await _userManager.GetRolesAsync(user);
                return Ok(new { token, userId = user.Id, role = roles.FirstOrDefault() });
            }
            return Unauthorized();
        }

        [HttpGet("userrole")]
        public async Task<IActionResult> GetUserRole()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new { role = roles.FirstOrDefault() });
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(new { id = user.Id, username = user.UserName });
        }

        [HttpPost("add-novinar")]
        public async Task<IActionResult> AddNovinar([FromBody] RegisterModel model)
        {
            var user = new ApplicationUser { UserName = model.Username, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Novinar");
                var osoba = new Osobe
                {
                    Id = user.Id,
                    Ime = model.Username,
                    Prezime = model.Prezime,
                    Email = model.Email,
                    Lozinka = "Skriveno",
                    DatumRegistracije = DateTime.Now,
                    OpisProfila = "VUV Novinar",
                    Uloga = "Novinar"
                };
                _context.Osobe.Add(osoba);
                await _context.SaveChangesAsync();

                var novinar = new Novinari
                {
                    Id = user.Id,
                };
                _context.Novinari.Add(novinar);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Novinar added successfully" });
            }
            return BadRequest(result.Errors);
        }
    }
}
