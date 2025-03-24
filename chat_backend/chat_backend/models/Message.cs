using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace chat_backend.Models
{
    public class Message
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string SenderUsername { get; set; }  // Foreign key for sender

        [Required]
        public string ReceiverUsername { get; set; }  // Foreign key for receiver

        [Required]
        [MaxLength(3000)]  // Limit message size
        public string Content { get; set; } = string.Empty;

        public bool IsSeen { get; set; } = false;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
