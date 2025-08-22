using BooksStore.Server.DAL;
using BooksStore.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BooksStore.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly ILogger<BookController> _logger;
        private readonly IBooksRepository _booksRepository;

        public BookController(ILogger<BookController> logger, IBooksRepository booksRepository)
        {
            _logger = logger;
            _booksRepository = booksRepository;
        }

        [HttpGet(Name = "GetAllBooks")]
        public IEnumerable<Book> GetBooks()
        {
            return _booksRepository.GetBooks();
        }

        //[HttpGet(Name = "GetBookByID")]
        //public Book? GetBook(int id)
        //{
        //    return _booksRepository.GetBookByID(id);
        //}


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, Book book)
        {
            if (id != book.Id)
                return BadRequest();

            var updated = await _booksRepository.UpdateAsync(book);

            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

    }
}
