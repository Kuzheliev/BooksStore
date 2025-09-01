using BooksStore.Server.DAL;
using BooksStore.Server.Migrations;
using BooksStore.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BooksStore.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AppDbContext context, IConfiguration config, ILogger<AuthController> logger)
        {
            _context = context;
            _config = config;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(Models.LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null) return Unauthorized();

            var hasher = new PasswordHasher<Models.Users>();
            var result = hasher.VerifyHashedPassword(user, user.Password, request.Password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized();

            var token = GenerateJwtToken(user);
            return Ok(new { token, user = new { user.Id, user.Email, user.IsAdmin, user.Name } });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(Models.Users request)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email is already registered." });
            }

            var hasher = new PasswordHasher<Models.Users>();

            var user = new Models.Users
            {
                Name = request.Name,
                Email = request.Email,
                Phone= request.Phone,
                City = request.City,
                Address = request.Address,
                Country = request.Country,
                IsAdmin = false // default
            };

            // Hash the password
            user.Password = hasher.HashPassword(user, request.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Email,
                    user.IsAdmin,
                    user.Name,
                    user.City,
                    user.Country
                }
            });
        }


        private string GenerateJwtToken(Models.Users user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
