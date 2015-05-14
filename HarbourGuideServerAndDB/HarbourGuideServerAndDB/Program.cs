using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HarbourGuideServerAndDB
{
    public class Program
    {
        public static int counter = Database.GetSize() - 1;
        public static void Main(string[] args) {
            Console.WriteLine(counter);
            Console.WriteLine("Starting server on port 8080");
            Database database = new Database();
            HTTPServer server = new HTTPServer(8080, database);
            server.Start();
        }
    }
}
