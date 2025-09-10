using BooksStore.Server.DAL;
using BooksStore.Server.Models;

namespace BooksStore.Server.BLL
{
    public class OrderBusinessLogic : IOrderBusinessLogic
    {
        private readonly ILogger<OrderBusinessLogic> _logger;
        private readonly IOrderRepository _orderRepository;
        public OrderBusinessLogic(ILogger<OrderBusinessLogic> logger, IOrderRepository orderRepository) 
        {
            _logger = logger;
            _orderRepository = orderRepository;
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            var created = await _orderRepository.AddAsync(order);
            return created;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllAsync();

            return orders;
        }

        public async Task<Order?> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            return order;
        }

        public async Task<Order?> UpdateOrderAsync(Order order)
        {
            var updated = await _orderRepository.UpdateAsync(order);
            return updated;
        }
    }
}
