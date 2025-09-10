using BooksStore.Server.BLL;
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
        private readonly IConfiguration _config;
        private readonly ILogger<AuthController> _logger;
        private readonly IAuthBusinessLogic _authBusinessLogic;

        public AuthController(IAuthBusinessLogic authBusinessLogic, IConfiguration config, ILogger<AuthController> logger)
        {
            _authBusinessLogic = authBusinessLogic;
            _config = config;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(Models.LoginRequest request)
        {
            var response = await _authBusinessLogic.Login(request);

            if (response == null)
                return Unauthorized("Invalid email or password.");

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(Models.Users request)
        {
            var response = await _authBusinessLogic.Register(request);
            return Ok(response);
        }
    }
}
