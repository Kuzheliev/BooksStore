using BooksStore.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace BooksStore.Server.DAL
{
    public interface IUsersRepository 
    {
        IEnumerable<Users> GetUsers();

        Users GetUserById(int id);
    }
}
