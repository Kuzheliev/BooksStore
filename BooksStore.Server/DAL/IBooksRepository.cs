using BooksStore.Server.Models;

namespace BooksStore.Server.DAL
{
    public interface IBooksRepository
    {
        IQueryable<Book> GetBooks();

        Book? GetBookByID(int id);

        Task<Book?> UpdateAsync(Book book);

        Task<Book?> GetBookByIdAsync(int id);

         Task<Book> CreateAsync(Book book);
    }
}
