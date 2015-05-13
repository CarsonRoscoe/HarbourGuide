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

// Add using statements to access AWS SDK for .NET services. 
// Both the Service and its Model namespace need to be added 
// in order to gain access to a service. For example, to access
// the EC2 service, add:
// using Amazon.EC2;
// using Amazon.EC2.Model;

namespace HarbourGuideServerAndDB
{
    public class Database
    {
        private static AmazonDynamoDBClient client = new AmazonDynamoDBClient();

		public Database() {
			/*
            try
            {
                // Get  - Get a book item.
                String[] newEntry = { "Carson", "14", "17", "12" };
                SetScore(newEntry, 1);
                GetScore(1, "Scoreboard");
            }
            catch (AmazonDynamoDBException e) { Console.WriteLine(e.Message); }
            catch (AmazonServiceException e) { Console.WriteLine(e.Message); }
            catch (Exception e) { Console.WriteLine(e.Message); }

            

            Console.Read();*/
		}

        public static bool SetScore(String[] s, int id) {
            try {
                // Load data (using the .NET document API)
                Table productCatalogTable = Table.LoadTable(client, "Scoreboard");
                // ********** Add A Score *********************
                var user = new Document();
                user["ScoreID"] = id;
                user["Name"] = s[0];
                user["Score"] = s[1];
                user["Difficulty"] = s[2];
                user["Time"] = s[3];

                productCatalogTable.PutItem(user);

                Console.WriteLine("Data loaded...");
                Console.ReadLine();
            }
            catch (AmazonDynamoDBException e) { Console.WriteLine(e.Message); return false; }
            catch (AmazonServiceException e) { Console.WriteLine(e.Message); return false; }
            catch (Exception e) { Console.WriteLine(e.Message); return false; }

            return true;
        }

        public static void GetScore(int id, string tableName)
        {
            var request = new GetItemRequest
            {
                    TableName = tableName,
                    Key = new Dictionary<string, AttributeValue>()
                {
                { "ScoreID", new AttributeValue { N = id.ToString() } }
                },
                ReturnConsumedCapacity = "TOTAL"
            };
            var response = client.GetItem(request);

            PrintItem(response.Item);

            Console.WriteLine("To continue, press Enter");
            Console.ReadLine();
        }

        private static void PrintItem(Dictionary<string, AttributeValue> attributeList)
            {
            foreach (var kvp in attributeList)
                {
                string attributeName = kvp.Key;
                AttributeValue value = kvp.Value;

                Console.WriteLine(
                  attributeName + " " +
                  (value.S == null ? "" : value.S) +
                  (value.N == null ? "" : value.N) +
                  (value.SS == null ? "" : string.Join(",", value.SS.ToArray())) +
                  (value.NS == null ? "" : string.Join(",", value.NS.ToArray()))
                );
                }
            Console.WriteLine("************************************************");
            }
        }

        
    }
