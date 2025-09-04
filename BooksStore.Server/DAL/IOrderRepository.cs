using BooksStore.Server.Models;

namespace BooksStore.Server.DAL
{
    public interface IOrderRepository
    {
        Task<Order?> UpdateAsync(Order order);

        Task<Order> AddAsync(Order order);

        Task<Order?> GetByIdAsync(int id);

        Task<List<Order>> GetAllAsync();
    }
}
