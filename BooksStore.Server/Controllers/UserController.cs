using BooksStore.Server.BLL;
using BooksStore.Server.DAL;
using BooksStore.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BooksStore.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly ILogger<UserController> _logger;
        private readonly IUserBusinessLogic _userBl;

        public UserController(ILogger<UserController> logger, IUserBusinessLogic userBl)
        {
            _logger = logger;
            _userBl = userBl;
        }

        [HttpGet(Name = "GetAllUsers")]
        public async Task<IEnumerable<Users>> GetUsers()
        {
            return  await _userBl.GetAllUsersAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUserById(int id)
        {
            var user = await _userBl.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(); 
            }
            return Ok(user);
        }
    }
}
