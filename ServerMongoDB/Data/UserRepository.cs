using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

using ServerMongoDB.Interfaces;
using ServerMongoDB.Model;
using MongoDB.Bson;

namespace ServerMongoDB.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly UserContext _context = null;

        public UserRepository(IOptions<Settings> settings)
        {
            _context = new UserContext(settings);
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            try
            {
                return await _context.Users.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }

        public async Task<User> GetUser(string username)
        {
            var filter = Builders<User>.Filter.Eq("Username", username);

            try
            {
                return await _context.Users
                                .Find(filter)
                                .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }

        public async Task AddUser(User item)
        {
            try
            {
                await _context.Users.InsertOneAsync(item);
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }

        public async Task<bool> RemoveUser(string id)
        {
            try
            {
                DeleteResult actionResult = await _context.Users.DeleteOneAsync(
                     Builders<User>.Filter.Eq("Id", id));

                return actionResult.IsAcknowledged 
                    && actionResult.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }

        public async Task<bool> UpdateUser(string id, string username, string password)
        {
            var filter = Builders<User>.Filter.Eq(s => s.Id, id);
            var update = Builders<User>.Update
                                       .Set(s => s.Username, username)
                                       .Set(s => s.Password, password)
                            .CurrentDate(s => s.UpdatedOn);

            try
            {
                UpdateResult actionResult = await _context.Users.UpdateOneAsync(filter, update);

                return actionResult.IsAcknowledged
                    && actionResult.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }


        // Demo function - full document update
        public async Task<bool> UpdateUserScore(string username, string password, int score)
        {
            var item = await GetUser(username) ?? new User();
            item.Username = username;
            item.Password = password;
            item.UpdatedOn = DateTime.Now;

			return true;// await UpdateUser(id, item);
        }

        public async Task<bool> RemoveAllUsers()
        {
            try
            {
                DeleteResult actionResult = await _context.Users.DeleteManyAsync(new BsonDocument());

                return actionResult.IsAcknowledged
                    && actionResult.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }

        // it creates a compound index (first using username)
        // MongoDb automatically detects if the index already exists - in this case it just returns the index details
        public async Task<string> CreateIndex()
        {
            try
            {
                return await _context.Users.Indexes
                                           .CreateOneAsync(Builders<User>
                                                                .IndexKeys
                                                           .Ascending(item => item.Username));
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }
    }
}
