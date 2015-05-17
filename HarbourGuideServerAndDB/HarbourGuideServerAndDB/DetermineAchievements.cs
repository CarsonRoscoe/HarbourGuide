using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HarbourGuideServerAndDB
{
    public class DetermineAchievements
    {
        LinkedList<StoredDataStruct> DataList = new LinkedList<StoredDataStruct> { };
        LinkedList<AchievementStruct> AchievementList = new LinkedList<AchievementStruct> { };
        StoredDataStruct newData;
        int totalSize = Database.GetSize();

        public DetermineAchievements(int newScore, int newDif, int newTime) {
            newData = new StoredDataStruct(newScore, newDif, newTime);
            Console.WriteLine("DetermineAchievements Created\n" +
                "Score: " + newData.score + " Dif " + newData.dif + "Time" + newData.time);
            getData();
            checkScore();
            checkDif();
            checkTime();
        }

        public String getAchievements()
        {
            String str = "getAchievements({\"Achievements\":[";
            str += ConvertAchievmentsToJSON(AchievementList);
            str += "]});";
            return str;
        }

        public String ConvertAchievmentsToJSON(LinkedList<AchievementStruct> list)
        {
            string str = "";
            for (var i = 0; i < AchievementList.Count; i++)
            {
                AchievementStruct temp = AchievementList.ElementAt(i);
                str += "{"
                    + "\"Title\" : " + temp.title + " ,"
                    + "\"Details\" : " + temp.details + " ,"
                    + "\"Image\" : " + temp.image
                    + "}";
                str += ",";
            }

            if (str.Length != 0)
                str = str.Remove(str.Length - 1);

            return str;
        }

        private void checkScore() {
            DataList.OrderByDescending(t => t.score);
            var i = 0;
            int top = 0;
            int percent = 0;
            var higherScores = 0;
            for (; i < DataList.Count; i++)
                if (DataList.ElementAt(i).score > newData.score)
                    higherScores++;

            top = (higherScores < 50) ? ((higherScores < 25) ? ((higherScores < 10) ? top = 10 : top = 25) : top = 50) : top = 0;
            percent = ((top + 1) / totalSize) * 100;
            Console.WriteLine("Score: " + newData.score + ", Top: " + top + ", higherScores: " + higherScores);
             if ((top == 50 || top == 25 || top == 10) && top != 0) {
                AchievementStruct temp = new AchievementStruct { };
                temp.title = "Top " + top + "!";
                temp.details = "Your score was ranked top " + top + " in the world";
                temp.image = "/scoreImg";
                AchievementList.AddLast(temp);
            }

             if (percent < 25 && percent != 0)
             {
                 if (percent < 10)
                 {
                     if (percent < 5)
                     {
                         percent = 5;
                     }
                     else
                     {
                         percent = 10;
                     }
                 }
                 else
                 {
                     percent = 25;
                 } 
             }

             if (percent != 0 && percent <= 25)
             {
                 AchievementStruct temp = new AchievementStruct { };
                 temp.title = "Top " + percent + "%!";
                 temp.details = "You scored was ranked in the top " + percent + "% in the world";
                 temp.image = "/scoreImg";
                 AchievementList.AddLast(temp);
             }
        }

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

            top = (higherdifs < 50) ? ((higherdifs < 25) ? ((higherdifs < 10) ? top = 10 : top = 25) : top = 50) : top = 0;
            percent = ((top + 1) / totalSize) * 100;

            if (top != 0)
            {
                AchievementStruct temp = new AchievementStruct { };
                temp.title = "Top " + top + " highest difficulty!";
                temp.details = "Your difficulty was ranked in the top " + top + " in the world";
                temp.image = "/difImg";
                AchievementList.AddLast(temp);
            }

            if (percent < 25 && percent != 0)
            {
                if (percent < 10)
                {
                    if (percent < 5)
                    {
                        percent = 5;
                    }
                    else
                    {
                        percent = 10;
                    }
                }
                else
                {
                    percent = 25;
                }
            }

            if (percent != 0 && percent <= 25)
            {
                AchievementStruct temp = new AchievementStruct { };
                temp.title = "Top " + percent + "% difficulty!";
                temp.details = "Your difficulty was ranked in the top " + percent + "% in the world";
                temp.image = "/difImg";
                AchievementList.AddLast(temp);
            }
        }

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
                AchievementStruct temp = new AchievementStruct { };
                temp.title = "Speed racer!";
                temp.details = "You finished a game above difficulty 70 faster then 90% of the world can!";
                temp.image = "/timeImg";
                AchievementList.AddLast(temp);
            }
        }

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

        private StoredDataStruct makeStruct(String str)
        {
            StoredDataStruct tempStruct = new StoredDataStruct(getScore(str),getDif(str),getTime(str));
            Console.WriteLine("Score: " + tempStruct.score + " Difficulty: " + tempStruct.dif + " Time: " + tempStruct.time);
            return tempStruct;
        }

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

        private int getDif(String str)
        {
            var toFind = "Difficulty\"";
            var difIndex = str.IndexOf(toFind) + 14;
            var difValue = 0;
            while (Char.IsDigit(str[difIndex]))
                difValue = difValue * 10 + (int)char.GetNumericValue(str[difIndex++]);

            return difValue;
        }

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

    public struct AchievementStruct
    {
        public String title;
        public String image;
        public String details;
    }

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
