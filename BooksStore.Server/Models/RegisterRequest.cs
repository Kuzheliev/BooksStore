namespace BooksStore.Server.Models
{
    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Name { get; set; }
        public bool IsAdmin { get; set; } = false;
    }
}
