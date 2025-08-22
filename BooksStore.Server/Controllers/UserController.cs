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
        private readonly IUsersRepository _userRepository;

        public UserController(ILogger<UserController> logger, IUsersRepository userRepository)
        {
            _logger = logger;
            _userRepository = userRepository;
        }

        [HttpGet(Name = "GetAllUsers")]
        public IEnumerable<Users> GetUsers()
        {
            return _userRepository.GetUsers();
        }
    }
}
