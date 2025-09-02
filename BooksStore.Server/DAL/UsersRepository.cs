using BooksStore.Server.Controllers;
using BooksStore.Server.Migrations;
using BooksStore.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace BooksStore.Server.DAL
{
    public class UsersRepository : IUsersRepository 
    {

        private readonly ILogger<UsersRepository> _logger;
        private readonly AppDbContext _context;

        public UsersRepository(ILogger<UsersRepository> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public Models.Users? GetUserById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }

        IEnumerable<Models.Users> IUsersRepository.GetUsers()
        {
            return _context.Users.ToList();
        }
    }
}
