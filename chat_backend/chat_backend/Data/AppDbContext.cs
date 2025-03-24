using Microsoft.EntityFrameworkCore;
using chat_backend.models;
using chat_backend.Models;

namespace chat_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }  // Table for users
        public DbSet<Message> Messages { get; set; }  // Messages table
    }
}
