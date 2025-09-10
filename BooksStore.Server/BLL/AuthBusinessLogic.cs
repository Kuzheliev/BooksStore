using BooksStore.Server.Controllers;
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

namespace BooksStore.Server.BLL
{
    public class AuthBusinessLogic : IAuthBusinessLogic
    {

        private readonly AppDbContext _context;
        private readonly ILogger<AuthBusinessLogic> _logger;
        private readonly IConfiguration _config;
        public AuthBusinessLogic(AppDbContext context, IConfiguration config, ILogger<AuthBusinessLogic> logger)
        {
            _config = config;
            _context = context;
            _logger = logger;
        }

        public async Task<LoginResponse?> Login(Models.LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            
            var hasher = new PasswordHasher<Models.Users>();
            var result = hasher.VerifyHashedPassword(user, user.Password, request.Password);

            if (result == PasswordVerificationResult.Failed)
                return null;

            var token = GenerateJwtToken(user);

            return new LoginResponse
            {
                Token = token,
                User = new UsersDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    IsAdmin = user.IsAdmin
                }
            };
        }

        public async Task<LoginResponse> Register(Models.Users request)
        {
            var hasher = new PasswordHasher<Models.Users>();

            var user = new Models.Users
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                City = request.City,
                Address = request.Address,
                Country = request.Country,
                IsAdmin = false
            };

            user.Password = hasher.HashPassword(user, request.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return new LoginResponse
            {
                Token = token,
                User = new UsersDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    IsAdmin = user.IsAdmin
                }
            };
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
