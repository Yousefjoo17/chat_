using chat_backend.Data;
using chat_backend.models;
using chat_backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace chat_backend.Routes
{
    public static class AuthEndpoints
    {
        public static void MapAuthEndpoints(IEndpointRouteBuilder app)
        {
            app.MapGet("/hello", () => Results.Ok("Hello"));

            // 🔹 Get All Usernames Endpoint
            app.MapGet("/users/{excludedUsername}", async (AppDbContext db, string excludedUsername) =>
            {
                var usernames = await db.Users
                    .Where(u => u.Username != excludedUsername)
                    .Select(u => u.Username)
                    .ToListAsync();
                return Results.Json(usernames);
            });

            // 🔹 Register Endpoint
            app.MapPost("/register", async (AppDbContext db, User user) =>
            {
                if (await db.Users.AnyAsync(u => u.Username == user.Username))
                {
                    return Results.Conflict("Username already exists.");
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
                db.Users.Add(user);
                await db.SaveChangesAsync();

                return Results.Ok("User registered successfully.");
            });

            // 🔹 Login Endpoint
            app.MapPost("/login", async (AppDbContext db, AuthService authService, User user) =>
            {
                var existingUser = await db.Users.SingleOrDefaultAsync(u => u.Username == user.Username);

                if (existingUser == null)
                {
                    return Results.Json(new { message = "User not found." }, statusCode: 401);
                }

                bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(user.PasswordHash, existingUser.PasswordHash);

                if (!isPasswordCorrect)
                {
                    return Results.Json(new { message = "Invalid password." }, statusCode: 401);
                }

                var token = authService.GenerateToken(existingUser);

                return Results.Json(new { message = "User authenticated", Token = token }, statusCode: 200);
            });

           
        }
    }
}
