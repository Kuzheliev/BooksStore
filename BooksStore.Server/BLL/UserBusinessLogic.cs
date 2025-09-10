using BooksStore.Server.DAL;
using BooksStore.Server.Models;
using System.Runtime.InteropServices;

namespace BooksStore.Server.BLL
{
    public class UserBusinessLogic : IUserBusinessLogic
    {
        private readonly IUsersRepository _usersRepository;
        private readonly ILogger<UserBusinessLogic> _logger;

        public UserBusinessLogic(DAL.IUsersRepository usersRepository, ILogger<UserBusinessLogic> logger)
        {
            _usersRepository = usersRepository;
            _logger = logger;
        }

        public Task<Users> CreateUserAsync(Users user)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Users>> GetAllUsersAsync()
        {
            return _usersRepository.GetUsers();
        }

        public Task<Users?> GetUserByIdAsync(int id)
        {
            var user = _usersRepository.GetUserById(id);
            return Task.FromResult(user);
        }

        public Task<Users?> UpdateUserAsync(Users user)
        {
            throw new NotImplementedException();
        }
    }
}
