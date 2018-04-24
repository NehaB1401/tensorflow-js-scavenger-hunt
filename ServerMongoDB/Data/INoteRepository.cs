using System.Collections.Generic;
using System.Threading.Tasks;
using NotebookAppApi.Model;

namespace NotebookAppApi.Interfaces
{
    public interface IRoomRepository
    {
        Task<IEnumerable<Room>> GetAllRooms();
        Task<Room> GetRoom(string id);

        // add new room document
        Task AddRoom(Room item);

        // remove a single document / room
        Task<bool> RemoveRoom(string id);

        // update just a single document / room
        Task<bool> UpdateRoom(string id, string body);

        // demo interface - full document update
        Task<bool> UpdateRoomDocument(string id, string body);

        // should be used with high cautious, only in relation with demo setup
        Task<bool> RemoveAllRooms();

        // creates a sample index
        Task<string> CreateIndex();
    }
}
