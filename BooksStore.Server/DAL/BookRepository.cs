using BooksStore.Server.Models;

namespace BooksStore.Server.DAL
{
    public class BookRepository : IBooksRepository
    {
        private readonly ILogger<BookRepository> _logger;
        private readonly AppDbContext _context;


        public BookRepository(ILogger<BookRepository> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public Book? GetBookByID(int id)
        {
            return _context.Books.FirstOrDefault(x => x.Id == id);
        }

        public IEnumerable<Book> GetBooks()
        {
            return _context.Books.ToList();
        }

        public async Task<Book?> UpdateAsync(Book updatedBook)
        {
            var product = await _context.Books.FindAsync(updatedBook.Id);
            if (product == null) return null;

            product.Name = updatedBook.Name;
            product.Price = updatedBook.Price;

            await _context.SaveChangesAsync();
            return product;
        }
    }
}
