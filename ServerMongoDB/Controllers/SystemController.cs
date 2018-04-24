using System;
using Microsoft.AspNetCore.Mvc;

using ServerMongoDB.Interfaces;
using ServerMongoDB.Model;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace ServerMongoDB.Controllers
{
    [Route("api/[controller]")]
    public class SystemController : Controller
    {
        private readonly IUserRepository _userRepository;

        public SystemController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Call an initialization -      
        [HttpGet("{setting}")]
        public string Get(string setting)
        {
            if (setting == "init")
            {
                _userRepository.RemoveAllUsers();
                var name = _userRepository.CreateIndex();

                _userRepository.AddUser(new User() { Id = "1", FirstName = "Meven", LastName = "DCunha", Username = "meven",  Password = "meven", CreatedOn = DateTime.Now, UpdatedOn = DateTime.Now});
                _userRepository.AddUser(new User() { Id = "2", FirstName = "Hemant", LastName = "Kamath", Username = "hemant", Password = "hemant", CreatedOn = DateTime.Now, UpdatedOn = DateTime.Now});
                _userRepository.AddUser(new User() { Id = "3", FirstName = "Ravi", LastName = "Munde", Username = "ravi",   Password = "ravi", CreatedOn = DateTime.Now, UpdatedOn = DateTime.Now});
                _userRepository.AddUser(new User() { Id = "4", FirstName = "Neha", LastName = "Bhangale", Username = "neha",   Password = "neha", CreatedOn = DateTime.Now, UpdatedOn = DateTime.Now}); 


                
				return "Database NotesDb was created, and collection 'Rooms' was filled with 4 sample items";
            }

            return "Unknown";
        }
    }
}
