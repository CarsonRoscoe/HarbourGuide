using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HarbourGuideServerAndDB {
    public class Request {
        public String Type { get; set; }
        public String URL { get; set; }
        public String Host { get; set; }

        public static Boolean Valid;

        private Request(String type, String url, String host) {
            Type = type;
            URL = url;
            Host = host;
        }

        public Boolean getValid() {
            return Valid;
        }

        public static Request GetRequest(String request) {
            if (String.IsNullOrEmpty(request))
                return null;

            String[] dataTokens = null;
            String[] tokens = request.Split(' ');
            String type = tokens[0];
            String url = tokens[1];
            String host = tokens[4];
            Console.WriteLine(url);
            if (url.Contains("DATA;")) {
                dataTokens = url.Split(';');
            }

            if (dataTokens != null)
                Valid = HandleData(dataTokens);



            return new Request(type, url, host);
        }

        private static bool HandleData(String[] dataGiven) {
            String[] dataTokens = dataGiven;

            //Checks if data being passed in is valid
            foreach (string s in dataTokens)
                if (String.IsNullOrEmpty(s))
                    return false;

            if (dataTokens.Length != 5)
                return false;

            foreach(char c in dataTokens[1])
                if (!Char.IsLetter(c))
                    return false;

            foreach (char c in dataTokens[2])
                if (!Char.IsDigit(c))
                    return false;

            foreach (char c in dataTokens[3])
                if (!Char.IsDigit(c))
                    return false;

            foreach (char c in dataTokens[4])
                if (!Char.IsDigit(c))
                    return false;

            foreach (String s in dataTokens)
                Console.Write(s + ", ");

            //Moves all data one index lower, then makes the highest one carry a newline character.
            for (int i = 0; i < dataTokens.Length - 2; i++) {
                dataTokens[i] = dataTokens[i + 1];
            }

            // Write the stream contents to a new file named "AllTxtFiles.txt".
            /*using (StreamWriter savefile = new StreamWriter(Environment.CurrentDirectory + HTTPServer.WEB_DIR + @"\DataFile.txt")) {
                for (int i = 0; i < dataTokens.Length - 1; i++) {
                    String temp = dataTokens[i].ToString();
                    if (i != dataTokens.Length - 2)
                        //Data token + ;
                        savefile.Write(temp + ";");
                    else if (i == dataTokens.Length - 1)
                        //New line since data reading is done
                        savefile.Write(temp + "\n");
                }
            }*/
            Database.SetScore(dataTokens, 2);
            Database.GetScore(2, "Scoreboard");

            return true;
        }
    }
}
