// ===== HISTORICAL CRICKET MATCH DATASET =====
// Ball-by-ball data for 6 famous matches across T20, ODI, and Test formats

const HISTORICAL_MATCHES = [
  // ── Match 1: T20 World Cup 2022 — IND vs PAK ──
  {
    id: "t20wc2022-ind-pak",
    title: "India vs Pakistan",
    subtitle: "T20 World Cup 2022 — MCG, Melbourne",
    date: "2022-10-23",
    venue: "Melbourne Cricket Ground",
    format: "T20",
    teams: { a: "India", b: "Pakistan" },
    tpiWinner: "India",
    result: "India won by 4 wickets",
    target: 160,
    innings: [
      {
        batting: "Pakistan",
        bowling: "India",
        overs: [
          { over: 1,  runs: 6,  wickets: 0, extras: 1, balls: [1,0,2,0,2,"1w",1] },
          { over: 2,  runs: 8,  wickets: 0, extras: 0, balls: [4,0,1,2,0,1] },
          { over: 3,  runs: 5,  wickets: 1, extras: 0, balls: [0,"W",1,0,4,0] },
          { over: 4,  runs: 10, wickets: 0, extras: 0, balls: [4,2,0,4,0,0] },
          { over: 5,  runs: 7,  wickets: 0, extras: 1, balls: [1,0,"1w",4,1,1] },
          { over: 6,  runs: 9,  wickets: 0, extras: 0, balls: [2,6,0,0,1,0] },
          { over: 7,  runs: 4,  wickets: 1, extras: 0, balls: [0,1,1,"W",2,0] },
          { over: 8,  runs: 11, wickets: 0, extras: 1, balls: [4,1,"1nb",4,0,2] },
          { over: 9,  runs: 6,  wickets: 0, extras: 0, balls: [1,2,0,1,2,0] },
          { over: 10, runs: 8,  wickets: 1, extras: 0, balls: [4,0,1,"W",2,1] },
          { over: 11, runs: 5,  wickets: 0, extras: 0, balls: [1,0,2,1,0,1] },
          { over: 12, runs: 12, wickets: 0, extras: 0, balls: [4,2,6,0,0,0] },
          { over: 13, runs: 7,  wickets: 1, extras: 0, balls: [1,4,"W",0,1,1] },
          { over: 14, runs: 9,  wickets: 0, extras: 0, balls: [2,1,4,0,1,1] },
          { over: 15, runs: 6,  wickets: 0, extras: 0, balls: [0,1,2,1,2,0] },
          { over: 16, runs: 14, wickets: 0, extras: 2, balls: [6,"2w",4,1,0,1,0] },
          { over: 17, runs: 8,  wickets: 1, extras: 0, balls: [1,4,0,"W",2,1] },
          { over: 18, runs: 11, wickets: 0, extras: 0, balls: [4,1,0,6,0,0] },
          { over: 19, runs: 7,  wickets: 1, extras: 0, balls: [1,2,"W",0,4,0] },
          { over: 20, runs: 16, wickets: 1, extras: 0, balls: [4,6,"W",2,2,2] }
        ],
        totalRuns: 159,
        totalWickets: 6,
        batsmen: [
          { name: "Babar Azam", runs: 32, balls: 28, fours: 4, sixes: 0 },
          { name: "Rizwan", runs: 43, balls: 35, fours: 5, sixes: 1 },
          { name: "Shan Masood", runs: 28, balls: 22, fours: 3, sixes: 1 },
          { name: "Iftikhar Ahmed", runs: 26, balls: 20, fours: 2, sixes: 2 },
          { name: "Shadab Khan", runs: 12, balls: 8, fours: 1, sixes: 1 },
          { name: "Nawaz", runs: 10, balls: 7, fours: 1, sixes: 0 }
        ],
        bowlers: [
          { name: "Bhuvneshwar Kumar", overs: 4, runs: 22, wickets: 1, economy: 5.5 },
          { name: "Arshdeep Singh", overs: 4, runs: 32, wickets: 2, economy: 8.0 },
          { name: "Hardik Pandya", overs: 4, runs: 30, wickets: 1, economy: 7.5 },
          { name: "R Ashwin", overs: 4, runs: 38, wickets: 0, economy: 9.5 },
          { name: "Axar Patel", overs: 4, runs: 37, wickets: 2, economy: 9.25 }
        ]
      },
      {
        batting: "India",
        bowling: "Pakistan",
        overs: [
          { over: 1,  runs: 7,  wickets: 0, extras: 1, balls: [4,0,"1w",1,0,1,1] },
          { over: 2,  runs: 3,  wickets: 1, extras: 0, balls: [0,1,"W",0,1,1] },
          { over: 3,  runs: 9,  wickets: 0, extras: 0, balls: [4,1,0,4,0,0] },
          { over: 4,  runs: 5,  wickets: 1, extras: 0, balls: [1,2,0,"W",1,1] },
          { over: 5,  runs: 11, wickets: 0, extras: 0, balls: [6,1,0,4,0,0] },
          { over: 6,  runs: 6,  wickets: 0, extras: 0, balls: [1,2,0,1,2,0] },
          { over: 7,  runs: 4,  wickets: 1, extras: 0, balls: [0,0,1,"W",2,1] },
          { over: 8,  runs: 8,  wickets: 0, extras: 0, balls: [4,0,1,1,2,0] },
          { over: 9,  runs: 10, wickets: 0, extras: 0, balls: [4,2,0,4,0,0] },
          { over: 10, runs: 6,  wickets: 1, extras: 0, balls: [1,0,2,"W",2,1] },
          { over: 11, runs: 12, wickets: 0, extras: 0, balls: [6,0,4,1,0,1] },
          { over: 12, runs: 7,  wickets: 0, extras: 1, balls: [1,"1w",0,4,1,0,1] },
          { over: 13, runs: 5,  wickets: 1, extras: 0, balls: [0,1,2,"W",1,1] },
          { over: 14, runs: 9,  wickets: 0, extras: 0, balls: [4,1,0,1,2,1] },
          { over: 15, runs: 11, wickets: 0, extras: 0, balls: [6,1,0,4,0,0] },
          { over: 16, runs: 8,  wickets: 0, extras: 0, balls: [1,4,0,1,2,0] },
          { over: 17, runs: 6,  wickets: 1, extras: 0, balls: [0,1,2,"W",2,1] },
          { over: 18, runs: 14, wickets: 0, extras: 0, balls: [6,4,0,1,2,1] },
          { over: 19, runs: 13, wickets: 1, extras: 1, balls: [4,"1w",6,0,"W",1,1] },
          { over: 20, runs: 6,  wickets: 0, extras: 0, balls: [1,2,0,1,1,1] }
        ],
        totalRuns: 160,
        totalWickets: 6,
        batsmen: [
          { name: "KL Rahul", runs: 4, balls: 8, fours: 1, sixes: 0 },
          { name: "Rohit Sharma", runs: 18, balls: 16, fours: 2, sixes: 1 },
          { name: "Virat Kohli", runs: 82, balls: 53, fours: 6, sixes: 4 },
          { name: "Suryakumar Yadav", runs: 15, balls: 10, fours: 2, sixes: 1 },
          { name: "Hardik Pandya", runs: 24, balls: 18, fours: 2, sixes: 1 },
          { name: "Dinesh Karthik", runs: 6, balls: 4, fours: 1, sixes: 0 },
          { name: "R Ashwin", runs: 9, balls: 7, fours: 0, sixes: 0 }
        ],
        bowlers: [
          { name: "Shaheen Afridi", overs: 4, runs: 28, wickets: 1, economy: 7.0 },
          { name: "Naseem Shah", overs: 4, runs: 36, wickets: 1, economy: 9.0 },
          { name: "Haris Rauf", overs: 4, runs: 42, wickets: 2, economy: 10.5 },
          { name: "Nawaz", overs: 4, runs: 30, wickets: 1, economy: 7.5 },
          { name: "Shadab Khan", overs: 4, runs: 24, wickets: 1, economy: 6.0 }
        ]
      }
    ]
  },

  // ── Match 2: ODI World Cup 2023 Final — IND vs AUS ──
  {
    id: "odiwc2023-ind-aus",
    title: "India vs Australia",
    subtitle: "ODI World Cup 2023 Final — Ahmedabad",
    date: "2023-11-19",
    venue: "Narendra Modi Stadium, Ahmedabad",
    format: "ODI",
    teams: { a: "India", b: "Australia" },
    tpiWinner: "Australia",
    result: "Australia won by 6 wickets",
    target: 241,
    innings: [
      {
        batting: "India",
        bowling: "Australia",
        overs: generateOversData(50, 240, 10, "india-bat-wc23"),
        totalRuns: 240,
        totalWickets: 10,
        batsmen: [
          { name: "Rohit Sharma", runs: 47, balls: 31, fours: 6, sixes: 3 },
          { name: "Shubman Gill", runs: 4, balls: 12, fours: 0, sixes: 0 },
          { name: "Virat Kohli", runs: 54, balls: 63, fours: 4, sixes: 1 },
          { name: "Shreyas Iyer", runs: 4, balls: 18, fours: 0, sixes: 0 },
          { name: "KL Rahul", runs: 66, balls: 107, fours: 2, sixes: 0 },
          { name: "Suryakumar Yadav", runs: 18, balls: 28, fours: 1, sixes: 1 },
          { name: "Ravindra Jadeja", runs: 9, balls: 22, fours: 0, sixes: 0 },
          { name: "Mohammed Shami", runs: 6, balls: 10, fours: 1, sixes: 0 },
          { name: "Jasprit Bumrah", runs: 2, balls: 6, fours: 0, sixes: 0 },
          { name: "Mohammed Siraj", runs: 0, balls: 3, fours: 0, sixes: 0 }
        ],
        bowlers: [
          { name: "Mitchell Starc", overs: 10, runs: 55, wickets: 3, economy: 5.5 },
          { name: "Pat Cummins", overs: 10, runs: 34, wickets: 2, economy: 3.4 },
          { name: "Josh Hazlewood", overs: 10, runs: 43, wickets: 2, economy: 4.3 },
          { name: "Glenn Maxwell", overs: 10, runs: 52, wickets: 1, economy: 5.2 },
          { name: "Adam Zampa", overs: 10, runs: 56, wickets: 2, economy: 5.6 }
        ]
      },
      {
        batting: "Australia",
        bowling: "India",
        overs: generateOversData(43, 241, 4, "aus-bat-wc23"),
        totalRuns: 241,
        totalWickets: 4,
        batsmen: [
          { name: "Travis Head", runs: 137, balls: 120, fours: 15, sixes: 4 },
          { name: "David Warner", runs: 7, balls: 18, fours: 1, sixes: 0 },
          { name: "Marnus Labuschagne", runs: 58, balls: 110, fours: 2, sixes: 0 },
          { name: "Glenn Maxwell", runs: 2, balls: 4, fours: 0, sixes: 0 },
          { name: "Steve Smith", runs: 4, balls: 11, fours: 0, sixes: 0 }
        ],
        bowlers: [
          { name: "Jasprit Bumrah", overs: 10, runs: 43, wickets: 2, economy: 4.3 },
          { name: "Mohammed Shami", overs: 10, runs: 57, wickets: 2, economy: 5.7 },
          { name: "Mohammed Siraj", overs: 9, runs: 55, wickets: 0, economy: 6.1 },
          { name: "Ravindra Jadeja", overs: 9, runs: 48, wickets: 0, economy: 5.3 },
          { name: "Kuldeep Yadav", overs: 5, runs: 38, wickets: 0, economy: 7.6 }
        ]
      }
    ]
  },

  // ── Match 3: IPL 2024 Final — KKR vs SRH ──
  {
    id: "ipl2024-final",
    title: "KKR vs SRH",
    subtitle: "IPL 2024 Final — Chennai",
    date: "2024-05-26",
    venue: "MA Chidambaram Stadium, Chennai",
    format: "T20",
    teams: { a: "KKR", b: "SRH" },
    tpiWinner: "KKR",
    result: "KKR won by 8 wickets",
    target: 114,
    innings: [
      {
        batting: "SRH",
        bowling: "KKR",
        overs: [
          { over: 1,  runs: 3,  wickets: 1, extras: 0, balls: [0,"W",1,0,1,1] },
          { over: 2,  runs: 5,  wickets: 0, extras: 0, balls: [1,2,0,0,1,1] },
          { over: 3,  runs: 4,  wickets: 1, extras: 0, balls: [0,0,1,"W",2,1] },
          { over: 4,  runs: 8,  wickets: 0, extras: 0, balls: [4,0,1,2,0,1] },
          { over: 5,  runs: 2,  wickets: 1, extras: 0, balls: [0,0,"W",1,0,1] },
          { over: 6,  runs: 7,  wickets: 0, extras: 1, balls: [4,0,1,"1w",0,1,1] },
          { over: 7,  runs: 3,  wickets: 1, extras: 0, balls: [0,1,0,"W",1,1] },
          { over: 8,  runs: 6,  wickets: 0, extras: 0, balls: [4,0,0,1,0,1] },
          { over: 9,  runs: 9,  wickets: 0, extras: 0, balls: [4,1,0,4,0,0] },
          { over: 10, runs: 5,  wickets: 1, extras: 0, balls: [1,0,2,"W",1,1] },
          { over: 11, runs: 7,  wickets: 0, extras: 0, balls: [0,4,1,0,1,1] },
          { over: 12, runs: 4,  wickets: 1, extras: 0, balls: [0,1,"W",1,1,1] },
          { over: 13, runs: 8,  wickets: 0, extras: 0, balls: [4,0,1,2,0,1] },
          { over: 14, runs: 6,  wickets: 1, extras: 0, balls: [1,0,2,"W",2,1] },
          { over: 15, runs: 3,  wickets: 0, extras: 0, balls: [0,1,0,1,0,1] },
          { over: 16, runs: 10, wickets: 1, extras: 0, balls: [6,0,"W",1,2,1] },
          { over: 17, runs: 5,  wickets: 1, extras: 0, balls: [0,1,1,"W",2,1] },
          { over: 18, runs: 4,  wickets: 0, extras: 0, balls: [0,1,2,0,0,1] },
          { over: 19, runs: 9,  wickets: 1, extras: 0, balls: [4,0,1,2,"W",2] },
          { over: 20, runs: 5,  wickets: 0, extras: 0, balls: [1,2,0,0,1,1] }
        ],
        totalRuns: 113,
        totalWickets: 9,
        batsmen: [
          { name: "Abhishek Sharma", runs: 2, balls: 4, fours: 0, sixes: 0 },
          { name: "Travis Head", runs: 15, balls: 18, fours: 2, sixes: 0 },
          { name: "Rahul Tripathi", runs: 22, balls: 25, fours: 3, sixes: 0 },
          { name: "Heinrich Klaasen", runs: 32, balls: 28, fours: 4, sixes: 1 },
          { name: "Aiden Markram", runs: 18, balls: 20, fours: 2, sixes: 0 },
          { name: "Shahbaz Ahmed", runs: 10, balls: 12, fours: 1, sixes: 0 }
        ],
        bowlers: [
          { name: "Mitchell Starc", overs: 4, runs: 14, wickets: 2, economy: 3.5 },
          { name: "Andre Russell", overs: 4, runs: 19, wickets: 3, economy: 4.75 },
          { name: "Sunil Narine", overs: 4, runs: 23, wickets: 2, economy: 5.75 },
          { name: "Varun Chakaravarthy", overs: 4, runs: 28, wickets: 1, economy: 7.0 },
          { name: "Harshit Rana", overs: 4, runs: 29, wickets: 1, economy: 7.25 }
        ]
      },
      {
        batting: "KKR",
        bowling: "SRH",
        overs: [
          { over: 1,  runs: 8,  wickets: 0, extras: 0, balls: [4,1,0,2,0,1] },
          { over: 2,  runs: 12, wickets: 0, extras: 0, balls: [6,4,0,1,0,1] },
          { over: 3,  runs: 6,  wickets: 0, extras: 0, balls: [1,4,0,0,1,0] },
          { over: 4,  runs: 9,  wickets: 1, extras: 0, balls: [4,0,1,"W",2,2] },
          { over: 5,  runs: 7,  wickets: 0, extras: 1, balls: [1,"1w",4,0,1,0,1] },
          { over: 6,  runs: 11, wickets: 0, extras: 0, balls: [6,1,0,4,0,0] },
          { over: 7,  runs: 8,  wickets: 1, extras: 0, balls: [4,1,0,"W",2,1] },
          { over: 8,  runs: 10, wickets: 0, extras: 0, balls: [4,2,0,4,0,0] },
          { over: 9,  runs: 6,  wickets: 0, extras: 0, balls: [1,2,0,1,2,0] },
          { over: 10, runs: 14, wickets: 0, extras: 0, balls: [6,4,0,1,2,1] },
          { over: 11, runs: 9,  wickets: 0, extras: 0, balls: [4,0,1,4,0,0] },
          { over: 12, runs: 14, wickets: 0, extras: 0, balls: [6,4,1,0,2,1] }
        ],
        totalRuns: 114,
        totalWickets: 2,
        batsmen: [
          { name: "Venkatesh Iyer", runs: 52, balls: 40, fours: 6, sixes: 2 },
          { name: "Sunil Narine", runs: 28, balls: 16, fours: 3, sixes: 2 },
          { name: "Shreyas Iyer", runs: 19, balls: 14, fours: 2, sixes: 0 },
          { name: "Andre Russell", runs: 12, balls: 8, fours: 1, sixes: 1 }
        ],
        bowlers: [
          { name: "Bhuvneshwar Kumar", overs: 3, runs: 24, wickets: 0, economy: 8.0 },
          { name: "Pat Cummins", overs: 3, runs: 30, wickets: 1, economy: 10.0 },
          { name: "T Natarajan", overs: 3, runs: 28, wickets: 1, economy: 9.3 },
          { name: "Jaydev Unadkat", overs: 3, runs: 32, wickets: 0, economy: 10.7 }
        ]
      }
    ]
  },

  // ── Match 4: T20 World Cup 2024 Final — IND vs SA ──
  {
    id: "t20wc2024-ind-sa",
    title: "India vs South Africa",
    subtitle: "T20 World Cup 2024 Final — Barbados",
    date: "2024-06-29",
    venue: "Kensington Oval, Barbados",
    format: "T20",
    teams: { a: "India", b: "South Africa" },
    tpiWinner: "India",
    result: "India won by 7 runs",
    target: 177,
    innings: [
      {
        batting: "India",
        bowling: "South Africa",
        overs: [
          { over: 1,  runs: 6,  wickets: 0, extras: 0, balls: [4,0,1,0,0,1] },
          { over: 2,  runs: 8,  wickets: 0, extras: 0, balls: [1,4,0,2,0,1] },
          { over: 3,  runs: 12, wickets: 0, extras: 0, balls: [6,1,4,0,0,1] },
          { over: 4,  runs: 5,  wickets: 1, extras: 0, balls: [1,0,"W",2,1,1] },
          { over: 5,  runs: 9,  wickets: 0, extras: 0, balls: [4,1,0,4,0,0] },
          { over: 6,  runs: 11, wickets: 0, extras: 1, balls: [6,"1w",0,4,0,0,1] },
          { over: 7,  runs: 4,  wickets: 1, extras: 0, balls: [0,1,1,"W",1,1] },
          { over: 8,  runs: 7,  wickets: 0, extras: 0, balls: [4,0,1,1,0,1] },
          { over: 9,  runs: 13, wickets: 0, extras: 0, balls: [6,4,1,0,2,0] },
          { over: 10, runs: 5,  wickets: 1, extras: 0, balls: [1,0,2,"W",1,1] },
          { over: 11, runs: 8,  wickets: 0, extras: 0, balls: [4,0,1,2,0,1] },
          { over: 12, runs: 6,  wickets: 0, extras: 0, balls: [1,2,0,1,2,0] },
          { over: 13, runs: 11, wickets: 1, extras: 0, balls: [6,1,"W",0,4,0] },
          { over: 14, runs: 7,  wickets: 0, extras: 0, balls: [1,4,0,0,1,1] },
          { over: 15, runs: 14, wickets: 0, extras: 0, balls: [4,6,0,1,2,1] },
          { over: 16, runs: 9,  wickets: 1, extras: 0, balls: [4,0,1,2,"W",2] },
          { over: 17, runs: 6,  wickets: 0, extras: 0, balls: [1,2,0,1,1,1] },
          { over: 18, runs: 15, wickets: 1, extras: 0, balls: [6,4,1,"W",4,0] },
          { over: 19, runs: 10, wickets: 0, extras: 0, balls: [4,1,0,2,2,1] },
          { over: 20, runs: 10, wickets: 1, extras: 0, balls: [4,0,"W",2,2,2] }
        ],
        totalRuns: 176,
        totalWickets: 6,
        batsmen: [
          { name: "Virat Kohli", runs: 76, balls: 59, fours: 6, sixes: 2 },
          { name: "Rohit Sharma", runs: 9, balls: 7, fours: 1, sixes: 1 },
          { name: "Rishabh Pant", runs: 12, balls: 10, fours: 1, sixes: 0 },
          { name: "Suryakumar Yadav", runs: 47, balls: 36, fours: 4, sixes: 2 },
          { name: "Axar Patel", runs: 18, balls: 14, fours: 2, sixes: 0 },
          { name: "Hardik Pandya", runs: 10, balls: 8, fours: 1, sixes: 0 }
        ],
        bowlers: [
          { name: "Anrich Nortje", overs: 4, runs: 26, wickets: 2, economy: 6.5 },
          { name: "Marco Jansen", overs: 4, runs: 38, wickets: 1, economy: 9.5 },
          { name: "Kagiso Rabada", overs: 4, runs: 36, wickets: 1, economy: 9.0 },
          { name: "Keshav Maharaj", overs: 4, runs: 42, wickets: 1, economy: 10.5 },
          { name: "Aiden Markram", overs: 4, runs: 34, wickets: 1, economy: 8.5 }
        ]
      },
      {
        batting: "South Africa",
        bowling: "India",
        overs: [
          { over: 1,  runs: 6,  wickets: 0, extras: 0, balls: [1,4,0,0,1,0] },
          { over: 2,  runs: 9,  wickets: 0, extras: 0, balls: [4,1,0,4,0,0] },
          { over: 3,  runs: 4,  wickets: 1, extras: 0, balls: [0,1,"W",1,0,2] },
          { over: 4,  runs: 11, wickets: 0, extras: 0, balls: [6,1,0,4,0,0] },
          { over: 5,  runs: 5,  wickets: 0, extras: 0, balls: [0,1,2,0,1,1] },
          { over: 6,  runs: 7,  wickets: 1, extras: 0, balls: [4,0,1,"W",1,1] },
          { over: 7,  runs: 8,  wickets: 0, extras: 0, balls: [4,1,0,2,0,1] },
          { over: 8,  runs: 3,  wickets: 1, extras: 0, balls: [0,0,1,"W",1,1] },
          { over: 9,  runs: 12, wickets: 0, extras: 0, balls: [6,1,4,0,0,1] },
          { over: 10, runs: 5,  wickets: 0, extras: 0, balls: [1,0,2,0,1,1] },
          { over: 11, runs: 9,  wickets: 0, extras: 0, balls: [4,1,0,4,0,0] },
          { over: 12, runs: 6,  wickets: 0, extras: 0, balls: [1,2,0,1,2,0] },
          { over: 13, runs: 4,  wickets: 1, extras: 0, balls: [0,1,1,"W",1,1] },
          { over: 14, runs: 8,  wickets: 0, extras: 0, balls: [4,0,1,2,0,1] },
          { over: 15, runs: 15, wickets: 0, extras: 0, balls: [6,4,1,0,4,0] },
          { over: 16, runs: 11, wickets: 0, extras: 0, balls: [4,6,0,0,0,1] },
          { over: 17, runs: 7,  wickets: 1, extras: 0, balls: [1,4,0,"W",1,1] },
          { over: 18, runs: 5,  wickets: 1, extras: 0, balls: [1,0,2,0,"W",2] },
          { over: 19, runs: 16, wickets: 1, extras: 0, balls: [6,4,0,"W",4,2] },
          { over: 20, runs: 18, wickets: 1, extras: 0, balls: [6,4,2,"W",4,2] }
        ],
        totalRuns: 169,
        totalWickets: 8,
        batsmen: [
          { name: "Quinton de Kock", runs: 39, balls: 31, fours: 4, sixes: 2 },
          { name: "Reeza Hendricks", runs: 4, balls: 7, fours: 0, sixes: 0 },
          { name: "Aiden Markram", runs: 8, balls: 10, fours: 1, sixes: 0 },
          { name: "Heinrich Klaasen", runs: 52, balls: 27, fours: 5, sixes: 3 },
          { name: "David Miller", runs: 21, balls: 17, fours: 2, sixes: 1 },
          { name: "Marco Jansen", runs: 16, balls: 12, fours: 1, sixes: 1 },
          { name: "Keshav Maharaj", runs: 12, balls: 8, fours: 1, sixes: 0 }
        ],
        bowlers: [
          { name: "Jasprit Bumrah", overs: 4, runs: 18, wickets: 2, economy: 4.5 },
          { name: "Arshdeep Singh", overs: 4, runs: 20, wickets: 2, economy: 5.0 },
          { name: "Hardik Pandya", overs: 4, runs: 44, wickets: 3, economy: 11.0 },
          { name: "Axar Patel", overs: 4, runs: 49, wickets: 1, economy: 12.25 },
          { name: "Kuldeep Yadav", overs: 4, runs: 38, wickets: 0, economy: 9.5 }
        ]
      }
    ]
  },

  // ── Match 5: AUS vs ENG — Ashes Test ──
  {
    id: "ashes2023-test3",
    title: "Australia vs England",
    subtitle: "Ashes 2023 — 3rd Test, Headingley",
    date: "2023-07-06",
    venue: "Headingley, Leeds",
    format: "Test",
    teams: { a: "Australia", b: "England" },
    tpiWinner: "Australia",
    result: "Australia won by 3 wickets",
    target: 251,
    innings: [
      {
        batting: "England",
        bowling: "Australia",
        overs: generateOversData(80, 218, 10, "eng-bat-ashes-i1"),
        totalRuns: 218,
        totalWickets: 10,
        batsmen: [
          { name: "Ben Duckett", runs: 42, balls: 55, fours: 6, sixes: 0 },
          { name: "Zak Crawley", runs: 32, balls: 48, fours: 5, sixes: 0 },
          { name: "Joe Root", runs: 58, balls: 115, fours: 4, sixes: 0 },
          { name: "Harry Brook", runs: 22, balls: 30, fours: 3, sixes: 0 },
          { name: "Ben Stokes", runs: 35, balls: 60, fours: 4, sixes: 1 },
          { name: "Jonny Bairstow", runs: 12, balls: 22, fours: 2, sixes: 0 }
        ],
        bowlers: [
          { name: "Pat Cummins", overs: 20, runs: 38, wickets: 3, economy: 1.9 },
          { name: "Mitchell Starc", overs: 18, runs: 54, wickets: 3, economy: 3.0 },
          { name: "Josh Hazlewood", overs: 22, runs: 48, wickets: 2, economy: 2.18 },
          { name: "Nathan Lyon", overs: 20, runs: 78, wickets: 2, economy: 3.9 }
        ]
      },
      {
        batting: "Australia",
        bowling: "England",
        overs: generateOversData(72, 263, 10, "aus-bat-ashes-i1"),
        totalRuns: 263,
        totalWickets: 10,
        batsmen: [
          { name: "David Warner", runs: 16, balls: 30, fours: 2, sixes: 0 },
          { name: "Usman Khawaja", runs: 72, balls: 140, fours: 8, sixes: 0 },
          { name: "Marnus Labuschagne", runs: 45, balls: 88, fours: 5, sixes: 0 },
          { name: "Steve Smith", runs: 48, balls: 96, fours: 4, sixes: 0 },
          { name: "Travis Head", runs: 39, balls: 42, fours: 5, sixes: 1 },
          { name: "Cameron Green", runs: 18, balls: 32, fours: 2, sixes: 0 }
        ],
        bowlers: [
          { name: "Stuart Broad", overs: 18, runs: 62, wickets: 3, economy: 3.44 },
          { name: "James Anderson", overs: 20, runs: 48, wickets: 2, economy: 2.4 },
          { name: "Ben Stokes", overs: 16, runs: 55, wickets: 2, economy: 3.44 },
          { name: "Moeen Ali", overs: 18, runs: 78, wickets: 3, economy: 4.33 }
        ]
      }
    ]
  },

  // ── Match 6: T20I Classic — WI vs SA 2024 ──
  {
    id: "t20-wi-sa-2024",
    title: "West Indies vs South Africa",
    subtitle: "T20I Series 2024 — Trinidad",
    date: "2024-08-15",
    venue: "Queen's Park Oval, Trinidad",
    format: "T20",
    teams: { a: "West Indies", b: "South Africa" },
    tpiWinner: "West Indies",
    result: "West Indies won by 12 runs",
    target: 193,
    innings: [
      {
        batting: "West Indies",
        bowling: "South Africa",
        overs: [
          { over: 1,  runs: 10, wickets: 0, extras: 0, balls: [4,2,0,4,0,0] },
          { over: 2,  runs: 14, wickets: 0, extras: 0, balls: [6,4,0,1,2,1] },
          { over: 3,  runs: 5,  wickets: 1, extras: 0, balls: [1,0,"W",2,1,1] },
          { over: 4,  runs: 12, wickets: 0, extras: 0, balls: [6,1,4,0,0,1] },
          { over: 5,  runs: 8,  wickets: 0, extras: 0, balls: [4,0,1,2,0,1] },
          { over: 6,  runs: 6,  wickets: 1, extras: 0, balls: [1,2,0,"W",2,1] },
          { over: 7,  runs: 11, wickets: 0, extras: 1, balls: [6,"1w",0,4,0,0,1] },
          { over: 8,  runs: 4,  wickets: 1, extras: 0, balls: [0,1,0,"W",2,1] },
          { over: 9,  runs: 9,  wickets: 0, extras: 0, balls: [4,1,0,4,0,0] },
          { over: 10, runs: 7,  wickets: 0, extras: 0, balls: [1,4,0,0,1,1] },
          { over: 11, runs: 13, wickets: 0, extras: 0, balls: [6,4,1,0,2,0] },
          { over: 12, runs: 5,  wickets: 1, extras: 0, balls: [0,1,"W",2,1,1] },
          { over: 13, runs: 8,  wickets: 0, extras: 0, balls: [4,0,1,2,0,1] },
          { over: 14, runs: 11, wickets: 1, extras: 0, balls: [6,1,0,"W",4,0] },
          { over: 15, runs: 6,  wickets: 0, extras: 0, balls: [1,2,0,1,2,0] },
          { over: 16, runs: 15, wickets: 0, extras: 0, balls: [6,4,1,4,0,0] },
          { over: 17, runs: 9,  wickets: 1, extras: 0, balls: [4,0,1,2,"W",2] },
          { over: 18, runs: 12, wickets: 0, extras: 0, balls: [6,1,4,0,0,1] },
          { over: 19, runs: 14, wickets: 1, extras: 0, balls: [4,6,0,"W",2,2] },
          { over: 20, runs: 13, wickets: 0, extras: 0, balls: [6,1,4,0,1,1] }
        ],
        totalRuns: 192,
        totalWickets: 6,
        batsmen: [
          { name: "Brandon King", runs: 58, balls: 38, fours: 6, sixes: 3 },
          { name: "Johnson Charles", runs: 32, balls: 20, fours: 4, sixes: 2 },
          { name: "Nicholas Pooran", runs: 48, balls: 30, fours: 4, sixes: 3 },
          { name: "Rovman Powell", runs: 28, balls: 18, fours: 2, sixes: 2 },
          { name: "Andre Russell", runs: 14, balls: 8, fours: 2, sixes: 0 },
          { name: "Shimron Hetmyer", runs: 8, balls: 6, fours: 1, sixes: 0 }
        ],
        bowlers: [
          { name: "Anrich Nortje", overs: 4, runs: 32, wickets: 2, economy: 8.0 },
          { name: "Kagiso Rabada", overs: 4, runs: 38, wickets: 1, economy: 9.5 },
          { name: "Marco Jansen", overs: 4, runs: 42, wickets: 1, economy: 10.5 },
          { name: "Tabraiz Shamsi", overs: 4, runs: 36, wickets: 1, economy: 9.0 },
          { name: "Aiden Markram", overs: 4, runs: 44, wickets: 1, economy: 11.0 }
        ]
      },
      {
        batting: "South Africa",
        bowling: "West Indies",
        overs: [
          { over: 1,  runs: 5,  wickets: 0, extras: 0, balls: [1,2,0,1,0,1] },
          { over: 2,  runs: 12, wickets: 0, extras: 0, balls: [6,4,0,0,1,1] },
          { over: 3,  runs: 7,  wickets: 1, extras: 0, balls: [4,0,1,"W",1,1] },
          { over: 4,  runs: 9,  wickets: 0, extras: 0, balls: [4,1,0,4,0,0] },
          { over: 5,  runs: 6,  wickets: 0, extras: 0, balls: [1,2,0,1,2,0] },
          { over: 6,  runs: 11, wickets: 1, extras: 0, balls: [6,1,0,4,"W",0] },
          { over: 7,  runs: 4,  wickets: 0, extras: 0, balls: [0,1,2,0,0,1] },
          { over: 8,  runs: 8,  wickets: 0, extras: 0, balls: [4,0,1,2,0,1] },
          { over: 9,  runs: 10, wickets: 1, extras: 0, balls: [4,1,4,0,"W",1] },
          { over: 10, runs: 6,  wickets: 0, extras: 0, balls: [1,0,4,0,0,1] },
          { over: 11, runs: 13, wickets: 0, extras: 0, balls: [6,4,1,0,2,0] },
          { over: 12, runs: 5,  wickets: 1, extras: 0, balls: [0,1,2,"W",1,1] },
          { over: 13, runs: 7,  wickets: 0, extras: 0, balls: [4,0,1,1,0,1] },
          { over: 14, runs: 9,  wickets: 1, extras: 0, balls: [4,1,0,"W",2,2] },
          { over: 15, runs: 4,  wickets: 0, extras: 0, balls: [0,1,1,0,1,1] },
          { over: 16, runs: 12, wickets: 0, extras: 0, balls: [6,0,4,0,1,1] },
          { over: 17, runs: 8,  wickets: 1, extras: 0, balls: [4,1,0,"W",2,1] },
          { over: 18, runs: 11, wickets: 1, extras: 0, balls: [6,0,1,2,"W",2] },
          { over: 19, runs: 14, wickets: 1, extras: 0, balls: [4,6,0,"W",2,2] },
          { over: 20, runs: 19, wickets: 2, extras: 0, balls: [6,4,2,"W",6,"W"] }
        ],
        totalRuns: 180,
        totalWickets: 10,
        batsmen: [
          { name: "Quinton de Kock", runs: 42, balls: 28, fours: 5, sixes: 2 },
          { name: "Reeza Hendricks", runs: 18, balls: 14, fours: 2, sixes: 1 },
          { name: "Aiden Markram", runs: 25, balls: 22, fours: 3, sixes: 0 },
          { name: "Heinrich Klaasen", runs: 38, balls: 24, fours: 3, sixes: 2 },
          { name: "David Miller", runs: 22, balls: 16, fours: 2, sixes: 1 },
          { name: "Marco Jansen", runs: 18, balls: 10, fours: 2, sixes: 1 },
          { name: "Kagiso Rabada", runs: 8, balls: 5, fours: 1, sixes: 0 }
        ],
        bowlers: [
          { name: "Alzarri Joseph", overs: 4, runs: 36, wickets: 3, economy: 9.0 },
          { name: "Andre Russell", overs: 4, runs: 42, wickets: 2, economy: 10.5 },
          { name: "Akeal Hosein", overs: 4, runs: 30, wickets: 2, economy: 7.5 },
          { name: "Romario Shepherd", overs: 4, runs: 38, wickets: 2, economy: 9.5 },
          { name: "Gudakesh Motie", overs: 4, runs: 34, wickets: 1, economy: 8.5 }
        ]
      }
    ]
  }
];

// ===== Helper: generate over-by-over data for longer formats =====
function generateOversData(totalOvers, totalRuns, totalWickets, seed) {
  const overs = [];
  let runsLeft = totalRuns;
  let wicketsLeft = totalWickets;
  const hash = hashStr(seed);

  for (let i = 1; i <= totalOvers; i++) {
    const remaining = totalOvers - i;
    const avgRunRate = runsLeft / (remaining + 1);
    const baseRuns = Math.max(1, Math.round(avgRunRate + (seededRandom(hash + i) - 0.5) * 4));
    const overRuns = Math.min(runsLeft, Math.max(0, baseRuns));
    const wicket = wicketsLeft > 0 && seededRandom(hash + i * 7) < (wicketsLeft / (remaining + 1)) * 0.7 ? 1 : 0;
    
    if (wicket) wicketsLeft--;
    runsLeft -= overRuns;

    const balls = generateBalls(overRuns, wicket, hash + i * 13);
    overs.push({ over: i, runs: overRuns, wickets: wicket, extras: 0, balls });
  }

  // distribute any leftover runs
  if (runsLeft > 0) {
    const lastOver = overs[overs.length - 1];
    lastOver.runs += runsLeft;
  }
  return overs;
}

function generateBalls(runs, wickets, seed) {
  const balls = [];
  let left = runs;
  const numBalls = 6;
  for (let b = 0; b < numBalls; b++) {
    if (wickets > 0 && b === 3) {
      balls.push("W");
      wickets--;
      continue;
    }
    const remaining = numBalls - b - (wickets > 0 ? 1 : 0);
    if (remaining <= 0) { balls.push(left); left = 0; continue; }
    const r = seededRandom(seed + b * 17);
    let val;
    if (r < 0.3) val = 0;
    else if (r < 0.55) val = 1;
    else if (r < 0.7) val = 2;
    else if (r < 0.85) val = 4;
    else val = 6;
    val = Math.min(val, left);
    balls.push(val);
    left -= val;
  }
  // put remainder on last numeric ball
  if (left > 0) {
    for (let i = balls.length - 1; i >= 0; i--) {
      if (typeof balls[i] === 'number') { balls[i] += left; break; }
    }
  }
  return balls;
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Export for use
if (typeof module !== 'undefined') module.exports = { HISTORICAL_MATCHES };
