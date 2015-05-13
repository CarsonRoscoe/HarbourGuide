using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HarbourGuideServerAndDB
{
    public class Program
    {
        public static int counter = 0;
        static void Main(string[] args) {
            Console.WriteLine("Starting server on port 8080");
            Database database = new Database();
            HTTPServer server = new HTTPServer(8080, database);
            server.Start();
        }
    }
}
