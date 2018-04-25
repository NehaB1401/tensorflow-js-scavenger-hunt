using System;
using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;

namespace ServerMongoDB.Model
{
    public class User
    {
        [BsonId]
		public Object Id { get; set; } 
		public string Username { get; set; } = string.Empty;
		public DateTime UpdatedOn { get; set; } = DateTime.Now;
		public DateTime CreatedOn { get; set; } = DateTime.Now;
        public List<int> Score { get; set; } = new List<int> { 0 };

	}
}
