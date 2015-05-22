using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HarbourGuideServerAndDB
{
    /* 
     * Runner class for the server, keeps track of how many new entries are
     * made and creates the server and database objects.
     */
    public class Program
    {
        /* Counter of new entries */
        public static int counter = Database.GetSize() - 1;

        /* Main of the program. Starts here. */
        public static void Main(string[] args) {
            Console.WriteLine(counter);
            Console.WriteLine("Starting server on port 8080");
            Database database = new Database();
            HTTPServer server = new HTTPServer(8080, database);
            server.Start();
        }
    }
}
