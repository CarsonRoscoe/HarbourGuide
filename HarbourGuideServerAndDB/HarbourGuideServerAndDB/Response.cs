﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Cors;

namespace HarbourGuideServerAndDB
{
    /* 
     * Response class is an object that handles responding data back to the
     * client after the clients request has been processed.
     */
    public class Response {

        /* Data to be sent */
        private Byte[] data = null;

        /* Status of response */
        private String status = null;

        /* Type of data being sent */
        private String mime = null;

        /* Amount of data to sent for the leaderboards */
        private static int topAmount = 50;

        /* Constructor for response that takes in a status, mine and data */
        private Response(String status, String mime, Byte[] data) {
            this.data = data;
            this.status = status;
            this.mime = mime;
        }

        /* Checks what type of request it was, and if it was valid checks
         * what trigger was requested. If everything checks out, returns
         * The appropriate Response to user. */
        public static Response From(Request request)
        {
            if (request == null)
                return MakeNullRequest();
            if (request.Type == "GET")
            {
                if (request.getCall() == "Data")
                {
                    if (request.getValid())
                        return DataSaveRequest();
                    else
                        return DataFailedRequest();
                }
                else if (request.getCall() == "Getscore")
                {
                    return DataStoredRequest();
                }
                else
                {
                    return MakeNullRequest();
                }
            }
            return MakeNullRequest();
        }

        /* Request for the top scorers on the leaderboards */
        private static Response DataStoredRequest()
        {
            String str = "";
            for (int i = 0; i < Database.GetSize(); i++)
            {
                if (Database.GetScore(i) != null)
                {
                    str += Database.GetScore(i);
                    str += "/";
                }
            }
            
            if (str.Length != 0) 
                 str = str.Remove(str.Length - 1);

            str = HandleData(str);
            System.IO.StreamWriter before = new System.IO.StreamWriter(Environment.CurrentDirectory + HTTPServer.MSG_DIR + "data.JSON");
            before.WriteLine(str);
            before.Close();

            String file = Environment.CurrentDirectory + HTTPServer.MSG_DIR + "data.JSON";
            FileInfo fi = new FileInfo(file);
            FileStream fs = fi.OpenRead();
            BinaryReader reader = new BinaryReader(fs);
            Byte[] d = new Byte[fs.Length];
            reader.Read(d, 0, d.Length);
            fs.Close();

            return new Response("Worked", "application/javascript", d);
        }

        /*  Handles the getScore data to be in JSONP format for the string. */
        private static String HandleData(String data)
        {
            string[] dataArray = data.Split('/');
            Array.Sort(dataArray, compareJSON);

            String str = "getScore({\"ScoreboardStats\":[";
            for (int i = 0; i < ((dataArray.Length < topAmount) ? dataArray.Length : topAmount); i++)
            {
                str += dataArray[i];
                str += ",";

            }
            str = str.Remove(str.Length - 1);
            str += "]});";
            return str;
        }

        /* Compares two JSON objects based on score */
        private static int compareJSON(String a, String b)
        {
            var toFind = "Score\"";
            var aIndex = a.IndexOf(toFind) + 9;
            var bIndex = b.IndexOf(toFind) + 9;
            Console.WriteLine(aIndex + "/" + a.Length + ", " + bIndex + "/" + b.Length);
            var aValue = 0;
            var bValue = 0;
            while (Char.IsDigit(a[aIndex]))
                aValue = aValue * 10 + Convert.ToInt32(a[aIndex++]);
            while (Char.IsDigit(b[bIndex]))
                bValue = bValue * 10 + Convert.ToInt32(b[bIndex++]);

            return (aValue > bValue)?-1:1;
        }

        /* Returns a response for failed. */
        private static Response DataFailedRequest()
        {
            String file = Environment.CurrentDirectory + HTTPServer.MSG_DIR + "failed.JSON";
            FileInfo fi = new FileInfo(file);
            FileStream fs = fi.OpenRead();
            BinaryReader reader = new BinaryReader(fs);
            Byte[] d = new Byte[fs.Length];
            reader.Read(d, 0, d.Length);
            fs.Close();

            return new Response("Failed", "application/javascript", d);
        }

        /* For when the request was to save data. Returns achievements earned */
        private static Response DataSaveRequest()
        {
            System.IO.StreamWriter before = new System.IO.StreamWriter(Environment.CurrentDirectory + HTTPServer.MSG_DIR + "achievements.JSON");
            before.WriteLine(Request.Achievements);
            before.Close();

            String file = Environment.CurrentDirectory + HTTPServer.MSG_DIR + "achievements.JSON";
            FileInfo fi = new FileInfo(file);
            FileStream fs = fi.OpenRead();
            BinaryReader reader = new BinaryReader(fs);
            Byte[] d = new Byte[fs.Length];
            reader.Read(d, 0, d.Length);
            fs.Close();

            return new Response("Worked", "application/javascript", d);
        }

        /* Request was bad and null */
        private static Response MakeNullRequest() {
            String file = Environment.CurrentDirectory + HTTPServer.MSG_DIR + "failed.JSON";
            FileInfo fi = new FileInfo(file);
            FileStream fs = fi.OpenRead();
            BinaryReader reader = new BinaryReader(fs);
            Byte[] d = new Byte[fs.Length];
            reader.Read(d, 0, d.Length);
            fs.Close();

            return new Response("400 Bad Request", "application/javascript", d);
        }

        /* Generates a stream from the string */
        public static Stream GenerateStreamFromString(string s)
        {
            MemoryStream stream = new MemoryStream();
            StreamWriter writer = new StreamWriter(stream);
            writer.Write(s);
            writer.Flush();
            stream.Position = 0;
            return stream;
        }

        /* Creates the header file for cross-origin for the client out of
         * the stream sent into it. */
        public void Post(NetworkStream stream) {
            StreamWriter writer = new StreamWriter(stream);
            writer.WriteLine(String.Format("{0} {1}\r\nServer: {2}\r\nContent-Type: {3}\r\nAccept-Ranges: bytes\r\nContent-Length: {4}\r\n\n",
                HTTPServer.VERSION, status, HTTPServer.NAME, mime, data.Length));

            stream.Write(data, 0, data.Length);
        }
    }
}
