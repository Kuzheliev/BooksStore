using BooksStore.Server.DAL;
using BooksStore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BooksStore.Server.BLL
{
    public class BookBusinessLogic : IBookBusinessLogic
    {
        private readonly ILogger<BookBusinessLogic> _logger;
        private readonly IBooksRepository _booksRepository;

        public BookBusinessLogic(ILogger<BookBusinessLogic> logger, IBooksRepository booksRepository)
        {
            _logger = logger;
            _booksRepository = booksRepository;
        }

        public async Task<Book> CreateBookAsync(Book model)
        {
            try
            {
                if (model.Image != null)
                {
                    var fileName = Path.GetFileName(model.Image.FileName);
                    var imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");

                    if (!Directory.Exists(imagesFolder))
                    {
                        Directory.CreateDirectory(imagesFolder);
                    }

                    var filePath = Path.Combine(imagesFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.Image.CopyToAsync(stream);
                    }

                    model.ImageUrl = $"/images/{fileName}";
                }

                var createdBook = await _booksRepository.CreateAsync(model);
                return createdBook;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating book");
                throw;
            }
        }

        public async Task<Book?> GetBookByIdAsync(int id)
        {
            var book = await _booksRepository.GetBookByIdAsync(id);
            return book;
        }

        public async Task<IEnumerable<Book>> GetBooksAsync(string? search, string? genre)
        {
            var booksQuery = _booksRepository.GetBooks();

            if (!string.IsNullOrWhiteSpace(search))
            {
                booksQuery = booksQuery.Where(b => b.Name != null &&
                                                   b.Name.ToLower().Contains(search.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(genre))
            {
                booksQuery = booksQuery.Where(b => b.Genre != null &&
                                                   b.Genre.ToLower() == genre.ToLower());
            }

            var books = await booksQuery.ToListAsync();

            return books;
        }

        public async Task<Book?> UpdateBookAsync(Book model, IFormFile? Image)
        {
            try
            {

                if (Image != null)
                {
                    var fileName = Path.GetFileName(Image.FileName);
                    var imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");

                    if (!Directory.Exists(imagesFolder))
                    {
                        Directory.CreateDirectory(imagesFolder);
                    }

                    var filePath = Path.Combine(imagesFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await Image.CopyToAsync(stream);
                    }

                    model.ImageUrl = $"/images/{fileName}";
                }

                var updated = await _booksRepository.UpdateAsync(model);

                return updated;

            }catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Concurrency error updating book with ID {BookId}", model.Id);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating book with ID {BookId}", model.Id);
                throw;
            }
        }
    }
}
