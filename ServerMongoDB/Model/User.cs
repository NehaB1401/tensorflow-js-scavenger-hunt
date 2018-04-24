using System;
using MongoDB.Bson.Serialization.Attributes;

namespace ServerMongoDB.Model
{
    public class User
    {
        [BsonId]
		public string Id { get; set; }
		public string Username { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public DateTime UpdatedOn { get; set; } = DateTime.Now;
		public DateTime CreatedOn { get; set; } = DateTime.Now;
		public int Score { get; set; } = 0;

	}
}
