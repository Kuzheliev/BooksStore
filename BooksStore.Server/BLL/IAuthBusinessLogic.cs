using BooksStore.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace BooksStore.Server.BLL
{
    public interface IAuthBusinessLogic
    {
        Task<LoginResponse?> Login(LoginRequest request);

        Task<LoginResponse> Register(Users request);
    }
}
