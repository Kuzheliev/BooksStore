using BooksStore.Server.Migrations;
using BooksStore.Server.Models;
using Microsoft.AspNetCore.Mvc;

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

        public IQueryable<Book> GetBooks()
        {
            return _context.Books.AsQueryable();
        }

        public async Task<Book?> GetBookByIdAsync(int id)
        {
            return await _context.Books.FindAsync(id); 
        }

        public async Task<Book?> UpdateAsync(Book book)
        {
            var existing = await _context.Books.FindAsync(book.Id);
            if (existing == null) return null;

            existing.Name = book.Name;
            existing.Description = book.Description;
            existing.Author = book.Author;
            existing.Title = book.Title;
            existing.Price = book.Price;
            existing.Genre = book.Genre;
            existing.inStock = book.inStock;    

            if (!string.IsNullOrEmpty(book.ImageUrl))
                existing.ImageUrl = book.ImageUrl;

            await _context.SaveChangesAsync();
            return existing;
        }

        [HttpPost]
        public async Task<Book> CreateAsync(Book book)
        {
            book.Id = 0;

            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return book;
        }
    }
}
