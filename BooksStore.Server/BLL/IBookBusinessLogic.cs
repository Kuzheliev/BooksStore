using BooksStore.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace BooksStore.Server.BLL
{
    public interface IBookBusinessLogic
    {
        Task<IEnumerable<Book>> GetBooksAsync([FromQuery] string? search, [FromQuery] string? genre);
        Task<Book> GetBookByIdAsync(int id);

        Task<Book> UpdateBookAsync(Book model, IFormFile? Image);

        Task<Book> CreateBookAsync(Book model);
    }
}

