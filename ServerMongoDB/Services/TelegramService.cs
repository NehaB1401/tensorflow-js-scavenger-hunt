using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;

namespace HotelReservation.Services
{
    public class TelegramService
    {
        private  static readonly String TelegramULR = "https://api.telegram.org/500314184:AAGUza99IvjfL3V4bhezNqRo10XvdcI7u98/sendMessage?chat_id=";

        private static readonly HttpClient client = new HttpClient();
        private static async Task SendMessage(String UserId, String Message)
        {
            if(UserId != null && Message != null)
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json"));
                client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");
                var stringTask = client.GetStringAsync(TelegramULR+ UserId +"&text=" + Message);
                var msg = await stringTask;
            }
        }
    }
}
