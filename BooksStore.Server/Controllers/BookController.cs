    using BooksStore.Server.DAL;
    using BooksStore.Server.Models;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

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

            //[HttpGet(Name = "GetAllBooks")]
            //public IEnumerable<Book> GetBooks()
            //{
            //    return _booksRepository.GetBooks();
            //}

            [HttpGet]
            public async Task<IActionResult> GetBooks([FromQuery] string? search)
            {
                var booksQuery = _booksRepository.GetBooks();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    booksQuery = booksQuery.Where(b => b.Name != null &&
                                                       b.Name.ToLower().Contains(search.ToLower()));
                }

                var books = await booksQuery.ToListAsync(); 
                return Ok(books);
            }
            [HttpGet("id/{id}")]
            public async Task<IActionResult> GetBookById(int id)
            {
                var book = await _booksRepository.GetBookByIdAsync(id);
                if (book == null) return NotFound();
                return Ok(book);
            }


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


            [HttpPost]
            public async Task<IActionResult> CreateBook([FromBody] Book newBook)
            {
                var createdBook = await _booksRepository.CreateAsync(newBook);
                return Ok(createdBook);
            }

        }

    }
