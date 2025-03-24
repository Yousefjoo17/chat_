using System.Security.Cryptography;
using System.Text;
using chat_backend.Data;
using chat_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;

namespace chat_backend.Routes
{
    public static class MessageEndpoints
    {
        private static readonly string EncryptionKey = "YourSecretKey123!"; // 🔹 Change this to a secure key

        public static void MapMessageEndpoints(IEndpointRouteBuilder app)
        {
            // 🔹 Send a message (Encrypt before saving)
            app.MapPost("/messages/send", async (AppDbContext db, Message message) =>
            {
                var senderExists = await db.Users.AnyAsync(u => u.Username == message.SenderUsername);
                var receiverExists = await db.Users.AnyAsync(u => u.Username == message.ReceiverUsername);

                if (!senderExists || !receiverExists)
                {
                    return Results.BadRequest("Sender or receiver does not exist.");
                }

                // Encrypt message content
                message.Content = Encrypt(message.Content);

                // Save message
                db.Messages.Add(message);
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Message sent successfully.", messageId = message.Id });
            });

            // 🔹 Get messages between two users (Decrypt before sending)
            app.MapGet("/messages/{user1}/{user2}", async (AppDbContext db, string user1, string user2) =>
            {
                var messages = await db.Messages
                    .Where(m => (m.SenderUsername == user1 && m.ReceiverUsername == user2) ||
                                (m.SenderUsername == user2 && m.ReceiverUsername == user1))
                    .OrderBy(m => m.Timestamp)
                    .ToListAsync();

                // Decrypt messages before returning
                foreach (var msg in messages)
                {
                    msg.Content = Decrypt(msg.Content);
                }

                return Results.Json(messages);
            });

            // 🔹 Update message isSeen to true (for marking a message as seen)
            app.MapPut("/messages/{messageId}/seen", async (AppDbContext db, int messageId) =>
            {
                var message = await db.Messages.FindAsync(messageId);

                if (message == null)
                {
                    return Results.NotFound("Message not found.");
                }

                // Update the 'isSeen' field to true
                message.IsSeen = true;

                // Save changes to the database
                await db.SaveChangesAsync();

                return Results.Ok(new { message = "Message marked as seen successfully." });
            });
        }

        // 🔹 AES Encryption Method
        private static string Encrypt(string plainText)
        {
            using Aes aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(EncryptionKey.PadRight(32)); // Ensure 256-bit key
            aes.IV = new byte[16]; // Zero IV (for simplicity, should be random in production)

            using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
            byte[] inputBytes = Encoding.UTF8.GetBytes(plainText);
            byte[] encryptedBytes = encryptor.TransformFinalBlock(inputBytes, 0, inputBytes.Length);
            return Convert.ToBase64String(encryptedBytes);
        }

        // 🔹 AES Decryption Method
        private static string Decrypt(string cipherText)
        {
            using Aes aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(EncryptionKey.PadRight(32));
            aes.IV = new byte[16];

            using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
            byte[] encryptedBytes = Convert.FromBase64String(cipherText);
            byte[] decryptedBytes = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
            return Encoding.UTF8.GetString(decryptedBytes);
        }
    }
}
