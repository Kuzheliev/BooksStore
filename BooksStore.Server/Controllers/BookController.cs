using BooksStore.Server.DAL;
using BooksStore.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

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


        [HttpGet]
        public async Task<IActionResult> GetBooks([FromQuery] string? search, [FromQuery] string? genre)
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
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateBook(int id, [FromForm] Book model, IFormFile? Image)
        {
            if (id != model.Id)
                return BadRequest();

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

            if (updated == null)
                return NotFound();

            return Ok(updated);
        }



        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateBook([FromForm] Book model)
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
            return Ok(createdBook);
        }

    }

}
