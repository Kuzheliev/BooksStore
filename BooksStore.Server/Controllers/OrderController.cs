using BooksStore.Server.DAL;
using BooksStore.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BooksStore.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ILogger<OrderController> _logger;

        public OrderController(IOrderRepository orderRepository, ILogger<OrderController> logger)
        {
            _orderRepository = orderRepository;
            _logger = logger;
        }

        // POST /Order
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (order == null) return BadRequest("Order cannot be null.");

            var created = await _orderRepository.AddAsync(order);
            return CreatedAtAction(nameof(GetOrderById), new { id = created.Id }, created);
        }

        // GET /Order/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null) return NotFound();

            return Ok(order);
        }

        // GET /Order
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderRepository.GetAllAsync();
            return Ok(orders);
        }

        // PUT /Order/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
        {
            if (order == null || id != order.Id) return BadRequest("Invalid order data.");

            var updated = await _orderRepository.UpdateAsync(order);
            if (updated == null) return NotFound();

            return Ok(updated);
        }
        
    }
}
