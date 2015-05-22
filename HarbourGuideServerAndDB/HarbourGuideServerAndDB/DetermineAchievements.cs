using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HarbourGuideServerAndDB
{
    /* 
     * Used to determine what online achievements the client has earned
     * based on their score, difficulty and time submitted.
     */
    public class DetermineAchievements
    {
        /* LinkedList of the data stored in the database. */
        LinkedList<StoredDataStruct> DataList = new LinkedList<StoredDataStruct> { };

        /* LinkedList of achievements indexes for the client*/
        LinkedList<int> AchievementList = new LinkedList<int> { };

        /* Struct for the users data that was passed in via constructor. */
        StoredDataStruct newData;

        /* int to hold the amount of entries in a database. */
        int totalSize = Database.GetSize();

        /* Constructor for the class which takes in a score, difficulty and time. */
        public DetermineAchievements(int newScore, int newDif, int newTime) {
            newData = new StoredDataStruct(newScore, newDif, newTime);
            Console.WriteLine("DetermineAchievements Created\n" +
                "Score: " + newData.score + " Dif " + newData.dif + "Time" + newData.time);
            getData();
            checkScore();
            checkDif();
            checkTime();
        }

        /* Returns the string, which will be a JSONP file to the user, which
         * contains the getAchievement function of the client with an array of
         achievement indexes passed in.*/
        public String getAchievements()
        {
            String str = "getAchievements([";
            str += ConvertAchievmentsToJSON(AchievementList);
            str += "]);";

            Console.WriteLine(str);
            return str;
        }

        /* Converts our achievement LinkedList into the needed string format. */
        public String ConvertAchievmentsToJSON(LinkedList<int>list)
        {
            string str = "";
            for (var i = 0; i < AchievementList.Count; i++)
            {
                int temp = AchievementList.ElementAt(i);
                str += temp + ",";
            }

            if (str.Length != 0)
                str = str.Remove(str.Length - 1);

            return str;
        }

        /* Checks if your score deserves any achievements and adds to 
         * achievements linked list if so. */
        private void checkScore() {
            DataList.OrderByDescending(t => t.score);
            var i = 0;
            int top = 0;
            int percent = 0;
            var higherScores = 0;
            for (; i < DataList.Count; i++)
                if (DataList.ElementAt(i).score > newData.score)
                    higherScores++;

            top = (higherScores < 50) ? 
                ((higherScores < 25) ? 
                    ((higherScores < 10) ? 
                        ((higherScores < 5) ?
                            ((higherScores == 1) ?
                                top = 1:
                                top  = 5)
                            : top = 10) 
                        : top = 25) 
                    : top = 50) 
                : top = 0;

            percent = ((top + 1) / totalSize) * 100;
            Console.WriteLine("Score: " + newData.score + ", Top: " + top + ", higherScores: " + higherScores);

             if (top != 0)
             {
                 switch (top)
                 {
                     case 1:
                         AchievementList.AddLast(0);
                         AchievementList.AddLast(1);
                         AchievementList.AddLast(2);
                         AchievementList.AddLast(3);
                         AchievementList.AddLast(4);
                         break;
                     case 5:
                         AchievementList.AddLast(1);
                         AchievementList.AddLast(2);
                         AchievementList.AddLast(3);
                         AchievementList.AddLast(4);
                         break;
                     case 10:
                         AchievementList.AddLast(2);
                         AchievementList.AddLast(3);
                         AchievementList.AddLast(4);
                         break;
                     case 25:
                         AchievementList.AddLast(3);
                         AchievementList.AddLast(4);
                         break;
                     case 50:
                         AchievementList.AddLast(4);
                         break;
                 }
             }


             if (percent < 25 && percent != 0)
             {
                 if (percent < 10)
                 {
                     if (percent < 5)
                     {
                         AchievementList.AddLast(5);
                         AchievementList.AddLast(6);
                         AchievementList.AddLast(7);
                     }
                     else
                     {
                         AchievementList.AddLast(6);
                         AchievementList.AddLast(7);
                     }
                 }
                 else
                 {
                     AchievementList.AddLast(7);
                 } 
             }
        }

        /* Determines if the users difficulty submitted deserves achievements
         * and adds them to the achievement list is so. */
        private void checkDif()
        {
            Console.WriteLine("Checking Difficulty");
            DataList.OrderByDescending(t => t.dif);
            var i = 0;
            int top = 0;
            int percent = 0;
            var higherdifs = 0;
            for (; i < DataList.Count; i++)
                if (DataList.ElementAt(i).dif > newData.dif)
                    higherdifs++;

            top = (higherdifs < 50) ? 
                ((higherdifs < 25) ?
                    ((higherdifs < 10) ? 
                        top = 10
                        : top = 25) 
                    : top = 50) 
                : top = 0;

            if (top != 0)
            {
                switch (top)
                {
                    case 10:
                        AchievementList.AddLast(8);
                        AchievementList.AddLast(9);
                        AchievementList.AddLast(10);
                        break;
                    case 25:
                        AchievementList.AddLast(9);
                        AchievementList.AddLast(10);
                        break;
                    case 50:
                        AchievementList.AddLast(10);
                        break;
                }
            }

            percent = ((top + 1) / totalSize) * 100;

            if (percent < 25 && percent != 0)
            {
                if (percent < 10)
                {
                    if (percent < 5)
                    {
                        percent = 5;
                        AchievementList.AddLast(11);
                        AchievementList.AddLast(12);
                        AchievementList.AddLast(13);
                    }
                    else
                    {
                        percent = 10;
                        AchievementList.AddLast(12);
                        AchievementList.AddLast(13);
                    }
                }
                else
                {
                    percent = 25;
                    AchievementList.AddLast(13);
                }
            }
        }

        /* Checks if the users submitted time deserves achievements and if so
         * adds them to the achievement linked list. */
        private void checkTime()
        {
            Console.WriteLine("Checking Time");
            DataList.OrderBy(t => t.time);
            var i = 0;
            var lowerTimes = 0;
            for (; i < DataList.Count; i++)
                if (DataList.ElementAt(i).time < newData.time)
                    lowerTimes++;
            Console.WriteLine(lowerTimes + ", " + Math.Round((double)(totalSize / 10)));
            if (lowerTimes < Math.Round((double) (totalSize/10)) && newData.dif  > 70) {
                AchievementList.AddLast(14);
            }
        }

        /* Gets the data from the database and temporarily saves it in an
         * linked list of structs. */
        private void getData()
        {
            Console.WriteLine("Getting Data From Database");
            string str = "";
            for (int i = 0; i < Database.GetSize(); i++)
            {
                if (Database.GetScore(i) != null)
                {
                    str = Database.GetScore(i);
                    var tempStruct = makeStruct(str);
                    DataList.AddLast(tempStruct);
                }
            }
        }

        /* Struct for the data stored in each entry */
        private StoredDataStruct makeStruct(String str)
        {
            StoredDataStruct tempStruct = new StoredDataStruct(getScore(str),getDif(str),getTime(str));
            Console.WriteLine("Score: " + tempStruct.score + " Difficulty: " + tempStruct.dif + " Time: " + tempStruct.time);
            return tempStruct;
        }

        /* Returns the score from a given JSON object */
        private int getScore(String str)
        {
            var toFind = "Score\"";
            var scoreIndex = str.IndexOf(toFind) + 9;
            var scoreValue = 0;
            while (Char.IsDigit(str[scoreIndex]))
            {
                scoreValue = scoreValue * 10 + (int)char.GetNumericValue(str[scoreIndex++]);
            }
            return scoreValue;          
        }

        /* Returns the difficulty from a given JSON object */
        private int getDif(String str)
        {
            var toFind = "Difficulty\"";
            var difIndex = str.IndexOf(toFind) + 14;
            var difValue = 0;
            while (Char.IsDigit(str[difIndex]))
                difValue = difValue * 10 + (int)char.GetNumericValue(str[difIndex++]);

            return difValue;
        }

        /* Gets the time from a given JSON object */
        private int getTime(String str)
        {
            var toFind = "Time\"";
            var timeIndex = str.IndexOf(toFind) + 8;
            var timeValue = 0;
            while (Char.IsDigit(str[timeIndex]))
                timeValue = timeValue * 10 + (int)char.GetNumericValue(str[timeIndex++]);

            return timeValue;
        }
    }

    /* Struct for the stored data */
    public struct StoredDataStruct {
        private int _score;
        private int _dif;
        private int _time;

        public StoredDataStruct(int s, int d, int t)
        {
            _score = s;
            _dif = d;
            _time = t;
        }
        public int score
        {
            get { return _score; }
            set {_score = score;}
        }

        public int dif
        {
            get  {return _dif;}
            set {if (dif > 0 && dif < 101 )
                    _dif = dif;}
        }

        public int time
        {
            get{return _time;}
            set{_time = time;}
        }
    }
}
