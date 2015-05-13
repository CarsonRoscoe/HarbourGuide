using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace HarbourGuideServerAndDB
{
    public class Response {
        private Byte[] data = null;
        private String status = null;
        private String mime = null;
        private Response(String status, String mime, Byte[] data) {
            this.data = data;
            this.status = status;
            this.mime = mime;
        }

        public static Response From(Request request)
        {
            if (request == null)
                return MakeNullRequest();
            if (request.Type == "GET")
            {
                if (request.getValid())
                    return DataStoredRequest();
                else
                    return DataFailedRequest();
            }
            return MakeNullRequest();
        }

        private static Response DataStoredRequest()
        {
            String file = Environment.CurrentDirectory + HTTPServer.MSG_DIR + "received.html";
            FileInfo fi = new FileInfo(file);
            FileStream fs = fi.OpenRead();
            BinaryReader reader = new BinaryReader(fs);
            Byte[] d = new Byte[fs.Length];
            reader.Read(d, 0, d.Length);
            fs.Close();

            return new Response("Worked", "html/text", d);
        }

        private static Response DataFailedRequest()
        {
            String file = Environment.CurrentDirectory + HTTPServer.MSG_DIR + "failed.html";
            FileInfo fi = new FileInfo(file);
            FileStream fs = fi.OpenRead();
            BinaryReader reader = new BinaryReader(fs);
            Byte[] d = new Byte[fs.Length];
            reader.Read(d, 0, d.Length);
            fs.Close();

            return new Response("Failed", "html/text", d);
        }

        private static Response MakeNullRequest() {
            String file = Environment.CurrentDirectory + HTTPServer.MSG_DIR + "400.html";
            FileInfo fi = new FileInfo(file);
            FileStream fs = fi.OpenRead();
            BinaryReader reader = new BinaryReader(fs);
            Byte[] d = new Byte[fs.Length];
            reader.Read(d, 0, d.Length);
            fs.Close();

            return new Response("400 Bad Request", "html/text", d);
        }

        public void Post(NetworkStream stream) {
            StreamWriter writer = new StreamWriter(stream);
            writer.WriteLine(String.Format("{0} {1}\r\nServer: {2}\r\nContent-Type: {3}\r\nAccept-Ranges: bytes\r\nContent-Length: {4}\r\n",
                HTTPServer.VERSION, status, HTTPServer.NAME, mime, data.Length));

            stream.Write(data, 0, data.Length);
        }
    }
}
