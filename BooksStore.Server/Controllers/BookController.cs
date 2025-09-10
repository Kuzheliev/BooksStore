using BooksStore.Server.BLL;
using BooksStore.Server.DAL;
using BooksStore.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Net.Mime.MediaTypeNames;

namespace BooksStore.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly ILogger<BookController> _logger;
        private readonly IBookBusinessLogic _booksBL;

        public BookController(ILogger<BookController> logger, IBookBusinessLogic booksBl)
        {
            _logger = logger;
            _booksBL = booksBl;
        }


        [HttpGet]
        public async Task<IActionResult> GetBooks([FromQuery] string? search, [FromQuery] string? genre)
        {
            var books = await _booksBL.GetBooksAsync(search, genre);
            return Ok(books);
        }

        [HttpGet("id/{id}")]
        public async Task<IActionResult> GetBookById(int id)
        {
            var book = await _booksBL.GetBookByIdAsync(id);
            if (book == null) return NotFound();
            return Ok(book);
        }


        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateBook(int id, [FromForm] Book model, IFormFile? Image)
        {
            if (id != model.Id)
                return BadRequest();

            var updated = await _booksBL.UpdateBookAsync(model, Image);


            if (updated == null)
                return NotFound($"Book with ID {id} was not found.");

            return Ok(updated);
        }



        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateBook([FromForm] Book model)
        {
            var createdBook = await _booksBL.CreateBookAsync(model);
            return Ok(createdBook);
        }

    }

}
