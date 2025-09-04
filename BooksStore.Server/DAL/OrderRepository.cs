using BooksStore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BooksStore.Server.DAL
{
    public class OrderRepository : IOrderRepository
    {


        private readonly ILogger<OrderRepository> _logger;
        private readonly AppDbContext _context;

        public OrderRepository(ILogger<OrderRepository> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<Order?> UpdateAsync(Order order)
        {
            try
            {
                var existingOrder = await _context.Orders
                    .Include(o => o.Items)
                    .FirstOrDefaultAsync(o => o.Id == order.Id);

                if (existingOrder == null)
                {
                    _logger.LogWarning("Order with ID {OrderId} not found for update.", order.Id);
                    return null;
                }

                // Update fields
                existingOrder.Name = order.Name;
                existingOrder.Email = order.Email;
                existingOrder.Phone = order.Phone;
                existingOrder.Address = order.Address;
                existingOrder.City = order.City;
                existingOrder.Country = order.Country;
                existingOrder.PaymentMethod = order.PaymentMethod;
                existingOrder.Status = order.Status;
                existingOrder.Price = order.Price;
                existingOrder.UpdatedAt = DateTime.UtcNow;

                // Optional: update items (replace all for simplicity)
                existingOrder.Items = order.Items;

                await _context.SaveChangesAsync();
                return existingOrder;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order with ID {OrderId}", order.Id);
                throw;
            }
        }

        public async Task<Order> AddAsync(Order order)
        {
            try
            {
                order.Id = 0; // Ensure EF Core treats this as a new entity
                order.CheckOutDate = DateTime.UtcNow;
                order.UpdatedAt = DateTime.UtcNow;
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                return order;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding new order");
                throw;
            }
        }

        public async Task<Order?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Orders
                    .Include(o => o.Items)
                    .ThenInclude(i => i.Book)
                    .Include(o => o.User)// Include related books
                    .FirstOrDefaultAsync(o => o.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order with ID {OrderId}", id);
                throw;
            }
        }


        public async Task<List<Order>> GetAllAsync()
        {
            try
            {
                return await _context.Orders
                     .Include(o => o.Items)
                        .ThenInclude(i => i.Book) 
                     .Include(o => o.User)        
            .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all orders");
                throw;
            }
        }


    }
}
