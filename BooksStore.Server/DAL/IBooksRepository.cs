using BooksStore.Server.Models;

namespace BooksStore.Server.DAL
{
    public interface IBooksRepository
    {
        IEnumerable<Book> GetBooks();

        Book? GetBookByID(int id);

        Task<Book?> UpdateAsync(Book book);
    }
}
