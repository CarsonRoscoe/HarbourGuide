using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Cors;

namespace HarbourGuideServerAndDB {

    /*
     * Request class which handles the users HTTP requests.
     */
    public class Request {

        /* Type of HTTP request */
        public String Type { get; set; }

        /* URL in the request for header */
        public String URL { get; set; }

        /* Host of the request for header */
        public String Host { get; set; }

        /* If the request was valid or not */
        public static Boolean Valid;

        /* Which trigger was called */
        public static String Call;

        /* All achievements to be saved to JSONP object to send */
        public static String Achievements;

        /* Constructor for object. Takes in a HTTP request type, URL and host */
        public Request(String type, String url, String host) {
            Type = type;
            URL = url;
            Host = host;
        }

        /* Getter for if the request was valid. */
        public Boolean getValid() {
            return Valid;
        }

        /* Getter for trigger called */
        public String getCall() {
            return Call;
        }

        /* Gets a request object generated based on String of data
         * being passed in. */
        public static Request GetRequest(String request) {
            if (String.IsNullOrEmpty(request))
                return null;

            String[] dataTokens = null;
            String[] tokens = request.Split(' '); 
            String type = null;
            String url = null;
            String host = null;
            try
            {
                type = tokens[0];
                url = tokens[1];
                host = tokens[4];
                Console.WriteLine(url);
                url = PrepDecoder(url);
                url = Decoder.DecryptStringAES(url);
                Console.WriteLine(url);
                if (url.Contains("DATA;")) {
                    if (url[url.Length-1] == ';')
                        url = url.Remove(url.Length - 1);

                    dataTokens = url.Split(';');
                    Console.WriteLine("\nDataString: " + dataTokens[0] + "," + dataTokens[1] + "," + dataTokens[2] + "," + dataTokens[3] + "," + dataTokens[4] + ",");
                    Call = "Data";
                    if (dataTokens != null)
                        Valid = HandleData(dataTokens);
                }
                else if (url.Contains("GETSCORE;"))
                {
                    Call = "Getscore";
                }
                else if (url.Contains("/index.html"))
                {
                    Call = "Index";
                } else
                {
                    Call = "Invalid";
                }

            }
            catch (System.Exception e)
            {
                Console.WriteLine("Error:" + e + "\n\n\n" + tokens[0] + "\n" + tokens[1] + "\n" + tokens[2]);
                return null;
            }


            return new Request(type, url, host);
        }

        /* Prepares the string that will be sent via GET to have AES encryption */
        private static string PrepDecoder(string str)
        {
            Console.WriteLine(str.Length);
            var strtemp = "";
            for (var i = 1; str[i] != '?'; i++)
            {
                strtemp += str[i];
            }
            Console.WriteLine("Prepped: " + strtemp);
            return strtemp;
        }

        /* Function which takes in the data and checks if it is
         * valid or not to be stored. */
        private static bool HandleData(String[] dataGiven) {
            Console.WriteLine("Handling Data");
            String[] dataTokens = dataGiven;

            //Checks if data being passed in is valid
            foreach (string s in dataTokens)
                if (String.IsNullOrEmpty(s))
                    return false;

            foreach(char c in dataTokens[1])
                if (!Char.IsLetter(c) && !Char.IsDigit(c))
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
            for (int i = 0; i <= 3; i++) {
                dataTokens[i] = dataTokens[i + 1];
            }
            Console.WriteLine("Handled Data\nHandling Achievements");
            DetermineAchievements da = new DetermineAchievements(Int32.Parse(dataTokens[1]), Int32.Parse(dataTokens[2]), Int32.Parse(dataTokens[3]));
            Console.WriteLine("Dif: " + Int32.Parse(dataTokens[2]) + ", Time: " + Int32.Parse(dataTokens[3]));
            Achievements = da.getAchievements();
            Console.WriteLine("Handled Achievments");
            Database.SetScore(dataTokens, ++Program.counter);

            return true;
        }
    }
}
