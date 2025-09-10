namespace BooksStore.Server.Models
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty; // JWT token
        public UsersDto User { get; set; } = new UsersDto();
    }
    public class UsersDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Name { get; set; }
        public bool IsAdmin { get; set; }
    }
}
