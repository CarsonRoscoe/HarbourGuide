using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HarbourGuideServerAndDB {
    public class HTTPServer {
        public const String MSG_DIR = "/root/msg/";
        public const String WEB_DIR = "/root/web/";
        public const String VERSION = "HTTP/1.1";
        public const String NAME = "HarbourGuide HTTP Server V0.1";
        public Database database = null;


        private bool running = false;

        private TcpListener listener;

        public HTTPServer(int port, Database db) {
            listener = new TcpListener(IPAddress.Any, port);
            database = db;
        }

        public void Start() {
            Thread serverThread = new Thread(new ThreadStart(Run));
            serverThread.Start();
        }

        private void Run() {
            running = true;
            listener.Start();
            while (running) {
                Console.WriteLine("Waiting for connection...");
                TcpClient client = listener.AcceptTcpClient();
                Console.WriteLine("Client connected");
                HandleClient(client);

                client.Close();
            }

            running = false;

            listener.Stop();
        }

        private void HandleClient(TcpClient client) {
            StreamReader reader = new StreamReader(client.GetStream());
            String msg = "";
            while (reader.Peek() != -1) {
                msg += reader.ReadLine() + "\n";
            }
            Debug.WriteLine("Request: \n" + msg);

            Request req = Request.GetRequest(msg);
            Response resp = Response.From(req);
            resp.Post(client.GetStream());
        }
    }
}
