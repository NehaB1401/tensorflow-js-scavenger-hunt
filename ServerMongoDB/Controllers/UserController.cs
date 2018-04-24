using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ServerMongoDB.Interfaces;
using ServerMongoDB.Model;
using ServerMongoDB.Infrastructure;
using System;
using System.Collections.Generic;

namespace ServerMongoDB.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
		private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [NoCache]
        [HttpGet]
        public Task<IEnumerable<User>> Get()
        {
            return GetUserInternal();
        }

        private async Task<IEnumerable<User>> GetUserInternal()
        {
            return await _userRepository.GetAllUsers();
        }

        // GET api/users/5
        [HttpGet("{username}")]
        public Task<User> Get(string username)
        {
            return GetUserByIdInternal(username);
        }

        private async Task<User> GetUserByIdInternal(string id)
        {
            return await _userRepository.GetUser(id) ?? new User();
        }

        // POST api/notes
        [HttpPost]
        public void Post([FromBody]string username, [FromBody]string password)
        {
            _userRepository.AddUser(new User() { Username = username, Password = password, CreatedOn = DateTime.Now, UpdatedOn = DateTime.Now });
        }

        // PUT api/notes/5
        [HttpPut("{id}")]
        public void Put([FromBody]string username, [FromBody]string password, [FromBody]int score)
        {
            _userRepository.UpdateUserScore(username, password,score);
        }

        // DELETE api/notes/23243423
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _userRepository.RemoveUser(id);
        }
    }
}
