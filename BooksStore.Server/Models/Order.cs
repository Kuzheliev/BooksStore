using System.Globalization;

namespace BooksStore.Server.Models
{
    public class Order
    {

        public int Id { get; set; }
        public string? UserId { get; set; }
        public Users? User { get; set; }

        public string City { get; set; }

        public string Country { get; set; }

        public string Address { get; set; }

        public string Email { get; set; }

        public string PaymentMethod { get; set; }

        public string Status { get; set; } = "Pending"; 
        public string Name { get; set; }

        public string Phone { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime CheckOutDate { get; set; }

        public decimal Price { get; set; }

        public List<OrderItem>? Items { get; set; } = new();


    }
}
