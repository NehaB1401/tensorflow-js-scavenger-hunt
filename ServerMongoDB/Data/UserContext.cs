using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ServerMongoDB.Model;

namespace ServerMongoDB.Data
{
    public class UserContext
    {
        private readonly IMongoDatabase _database = null;

        public UserContext(IOptions<Settings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            if (client != null)
                _database = client.GetDatabase(settings.Value.Database);
        }

        public IMongoCollection<User> Users
        {
            get
            {
                return _database.GetCollection<User>("User");
            }
        }
    }
}
