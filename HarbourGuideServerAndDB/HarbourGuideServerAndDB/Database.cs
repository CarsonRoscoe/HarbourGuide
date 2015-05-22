using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.Runtime;
using Amazon.DynamoDBv2.Model;

namespace HarbourGuideServerAndDB
{
    /*
     * Database class is used as a static object to reference all
     * things to do with the database. It is essentially used as
     * the communication layer between our NoSQL database and our
     * server application.
     */
    public class Database
    {
        /* The client object to access the database. */
        private static AmazonDynamoDBClient client = new AmazonDynamoDBClient();

        /* Name of the table we will be referencing. */
        private static String table = "Scoreboard";

        /* Default constructor */
		public Database() {
		}

        /* Returns the amount of total entries in the database. */
        public static int GetSize()
        {
            var tempInt = 1;
            var request = new ScanRequest
            {
                TableName = table,
            };

            var response = client.Scan(request);
            var result = response.ScanResult;

            foreach (Dictionary<string, AttributeValue> item in response.ScanResult.Items)
            {
                tempInt++;
            }

            return tempInt;
        }

        /* Used to save the data given from a string of ints by a given
         * ID into the database.*/
        public static bool SetScore(String[] s, int id) {
                String json = "{"
                    + "\"ScoreID\" : " + id +" ,"
                    + "\"Name\" : \"" + s[0] + "\" ,"
                    + "\"Score\" : " + s[1] + " ,"
                    + "\"Difficulty\" : " + s[2] + " ,"
                    + "\"Time\" : " + s[3]
                    + "}";
            try {
                // Load data (using the .NET document API)
                Table scoreboardTable = Table.LoadTable(client, table);
                // ********** Add A Score *********************
                var user = new Document();
                user["ScoreID"] = id;
                user["Score"] = s[1];
                user["document"] = json;

                scoreboardTable.PutItem(user);

                Console.WriteLine("Data loaded...");
            }
            catch (AmazonDynamoDBException e) { Console.WriteLine(e.Message); return false; }
            catch (AmazonServiceException e) { Console.WriteLine(e.Message); return false; }
            catch (Exception e) { Console.WriteLine(e.Message); return false; }

            return true;
        }

        /* Returns a String containing the JSON object by ID */
        public static String GetScore(int id)
        {
            var request = new GetItemRequest
            {
                    TableName = table,
                    Key = new Dictionary<string, AttributeValue>()
                    {
                        { "ScoreID", new AttributeValue { N = id.ToString() } }
                    }
            };
            var response = client.GetItem(request);

            return PrintItem(response.Item);
        }

        /* Prints to console the data within the object passed in. */
        private static String PrintItem(Dictionary<string, AttributeValue> attributeList)
            {
                String s = null;
                foreach (var kvp in attributeList)
                    {
                    string attributeName = kvp.Key;
                    AttributeValue value = kvp.Value;

                    if (attributeName == "document")
                        s = (
                          (value.S == null ? "" : value.S) +
                          (value.N == null ? "" : value.N) +
                          (value.SS == null ? "" : string.Join(",", value.SS.ToArray())) +
                          (value.NS == null ? "" : string.Join(",", value.NS.ToArray()))
                        );
                    }
                return s;


            }
        }

        
    }
