using BooksStore.Server.Models;

namespace BooksStore.Server.BLL
{
    public interface IOrderBusinessLogic
    {
        Task<Order> CreateOrderAsync(Order order);
        Task<Order?> GetOrderByIdAsync(int id);
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<Order?> UpdateOrderAsync(Order order);
    }
}
