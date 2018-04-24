using System.Collections.Generic;
using System.Threading.Tasks;
using ServerMongoDB.Model;

namespace ServerMongoDB.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUser(string id);

        // add new user document
        Task AddUser(User item);

        // remove a single document / user
        Task<bool> RemoveUser(string id);

        // update just a single document / user
        Task<bool> UpdateUser(string id, string username, string password);

        // demo interface - full document update
        Task<bool> UpdateUserScore(string username, string password, int score);

        // should be used with high cautious, only in relation with demo setup
        Task<bool> RemoveAllUsers();

        // creates a sample index
        Task<string> CreateIndex();
    }
}
