using BooksStore.Server.BLL;
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
        private readonly IOrderBusinessLogic _orderBl;
        private readonly ILogger<OrderController> _logger;

        public OrderController(IOrderBusinessLogic orderBl, ILogger<OrderController> logger)
        {
            _orderBl = orderBl;
            _logger = logger;
        }

        // POST /Order
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (order == null) return BadRequest("Order cannot be null.");

            var created = await _orderBl.CreateOrderAsync(order);
            return CreatedAtAction(nameof(GetOrderById), new { id = created.Id }, created);
        }

        // GET /Order/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderBl.GetOrderByIdAsync(id);
            if (order == null) return NotFound();

            return Ok(order);
        }

        // GET /Order
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderBl.GetAllOrdersAsync();
            return Ok(orders);
        }

        // PUT /Order/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
        {
            if (order == null || id != order.Id) return BadRequest("Invalid order data.");

            var updated = await _orderBl.UpdateOrderAsync(order);

            if (updated == null) return NotFound();

            return Ok(updated);
        }
        
    }
}
