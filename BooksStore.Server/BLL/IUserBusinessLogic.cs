using BooksStore.Server.Models;

namespace BooksStore.Server.BLL
{
    public interface IUserBusinessLogic
    {
        Task<Users> CreateUserAsync(Users user);
        Task<Users?> GetUserByIdAsync(int id);
        Task<IEnumerable<Users>> GetAllUsersAsync();
        Task<Users?> UpdateUserAsync(Users user);
    }
}
