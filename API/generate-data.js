// Generate realistic betting data for 90 games
const fs = require('fs');

// Helper function to generate realistic odds with proper margins
function generateOdds(probability, margin = 1.06) {
  const fairOdds = 1 / probability;
  return +(fairOdds * margin).toFixed(2);
}

// Generate balanced 1X2 odds
function generate1X2() {
  const homeProb = 0.25 + Math.random() * 0.4; // 25-65%
  const drawProb = 0.2 + Math.random() * 0.15; // 20-35%
  const awayProb = 1 - homeProb - drawProb;
  
  return {
    home: generateOdds(homeProb),
    draw: generateOdds(drawProb),
    away: generateOdds(awayProb)
  };
}

// Generate Over/Under odds
function generateOverUnder(line) {
  const overProb = 0.35 + Math.random() * 0.3; // 35-65%
  const underProb = 1 - overProb;
  
  return {
    over: generateOdds(overProb),
    under: generateOdds(underProb)
  };
}

// Generate handicap odds
function generateHandicap(handicap) {
  const prob1 = 0.35 + Math.random() * 0.3;
  const prob2 = 1 - prob1;
  
  return {
    home: generateOdds(prob1),
    away: generateOdds(prob2)
  };
}

// Generate correct score odds for football
function generateCorrectScore() {
  const scores = [
    '0-0', '1-0', '2-0', '3-0', '4-0',
    '0-1', '1-1', '2-1', '3-1', '4-1',
    '0-2', '1-2', '2-2', '3-2', '4-2',
    '0-3', '1-3', '2-3', '3-3',
    '0-4', '1-4', '2-4'
  ];
  
  const odds = {};
  scores.forEach(score => {
    odds[score] = +(5 + Math.random() * 45).toFixed(2);
  });
  odds['other'] = +(15 + Math.random() * 10).toFixed(2);
  
  return odds;
}

// Football teams
const footballTeams = [
  { home: 'Liverpool', away: 'Arsenal' },
  { home: 'Real Madrid', away: 'Barcelona' },
  { home: 'Bayern Munich', away: 'Borussia Dortmund' },
  { home: 'Manchester City', away: 'Manchester United' },
  { home: 'Chelsea', away: 'Tottenham' },
  { home: 'PSG', away: 'Marseille' },
  { home: 'Juventus', away: 'AC Milan' },
  { home: 'Inter Milan', away: 'AS Roma' },
  { home: 'Atletico Madrid', away: 'Sevilla' },
  { home: 'Ajax', away: 'PSV' },
  { home: 'Benfica', away: 'Porto' },
  { home: 'Celtic', away: 'Rangers' },
  { home: 'RB Leipzig', away: 'Bayer Leverkusen' },
  { home: 'Valencia', away: 'Villarreal' },
  { home: 'Newcastle', away: 'Leeds United' },
  { home: 'Everton', away: 'West Ham' },
  { home: 'Leicester', away: 'Wolves' },
  { home: 'Napoli', away: 'Lazio' },
  { home: 'Monaco', away: 'Lyon' },
  { home: 'Sporting CP', away: 'Braga' },
  { home: 'Feyenoord', away: 'AZ Alkmaar' },
  { home: 'River Plate', away: 'Boca Juniors' },
  { home: 'Flamengo', away: 'Palmeiras' },
  { home: 'Santos', away: 'Corinthians' },
  { home: 'Club America', away: 'Guadalajara' },
  { home: 'LA Galaxy', away: 'LAFC' },
  { home: 'Seattle Sounders', away: 'Portland Timbers' },
  { home: 'Atlanta United', away: 'Orlando City' },
  { home: 'NYCFC', away: 'NY Red Bulls' },
  { home: 'Toronto FC', away: 'Montreal Impact' }
];

// Tennis players
const tennisMatches = [
  { player1: 'Novak Djokovic', player2: 'Rafael Nadal' },
  { player1: 'Carlos Alcaraz', player2: 'Daniil Medvedev' },
  { player1: 'Stefanos Tsitsipas', player2: 'Alexander Zverev' },
  { player1: 'Jannik Sinner', player2: 'Andrey Rublev' },
  { player1: 'Holger Rune', player2: 'Taylor Fritz' },
  { player1: 'Casper Ruud', player2: 'Felix Auger-Aliassime' },
  { player1: 'Hubert Hurkacz', player2: 'Cameron Norrie' },
  { player1: 'Frances Tiafoe', player2: 'Karen Khachanov' },
  { player1: 'Lorenzo Musetti', player2: 'Sebastian Korda' },
  { player1: 'Ben Shelton', player2: 'Tommy Paul' },
  { player1: 'Iga Swiatek', player2: 'Aryna Sabalenka' },
  { player1: 'Coco Gauff', player2: 'Elena Rybakina' },
  { player1: 'Jessica Pegula', player2: 'Ons Jabeur' },
  { player1: 'Caroline Garcia', player2: 'Maria Sakkari' },
  { player1: 'Petra Kvitova', player2: 'Belinda Bencic' },
  { player1: 'Beatriz Haddad Maia', player2: 'Daria Kasatkina' },
  { player1: 'Karolina Muchova', player2: 'Marketa Vondrousova' },
  { player1: 'Madison Keys', player2: 'Barbora Krejcikova' },
  { player1: 'Elina Svitolina', player2: 'Victoria Azarenka' },
  { player1: 'Qinwen Zheng', player2: 'Liudmila Samsonova' },
  { player1: 'Alexander Bublik', player2: 'Nicolas Jarry' },
  { player1: 'Grigor Dimitrov', player2: 'Alex de Minaur' },
  { player1: 'Ugo Humbert', player2: 'Adrian Mannarino' },
  { player1: 'Francisco Cerundolo', player2: 'Alejandro Davidovich Fokina' },
  { player1: 'Christopher Eubanks', player2: 'Jiri Lehecka' },
  { player1: 'Sebastian Baez', player2: 'Roberto Bautista Agut' },
  { player1: 'Tomas Martin Etcheverry', player2: 'Borna Coric' },
  { player1: 'Laslo Djere', player2: 'Daniel Evans' },
  { player1: 'Yoshihito Nishioka', player2: 'Aslan Karatsev' },
  { player1: 'Jan-Lennard Struff', player2: 'Matteo Berrettini' }
];

// Basketball teams
const basketballTeams = [
  { home: 'Los Angeles Lakers', away: 'Boston Celtics' },
  { home: 'Golden State Warriors', away: 'Phoenix Suns' },
  { home: 'Milwaukee Bucks', away: 'Philadelphia 76ers' },
  { home: 'Denver Nuggets', away: 'Miami Heat' },
  { home: 'Brooklyn Nets', away: 'New York Knicks' },
  { home: 'Dallas Mavericks', away: 'San Antonio Spurs' },
  { home: 'Memphis Grizzlies', away: 'New Orleans Pelicans' },
  { home: 'Sacramento Kings', away: 'LA Clippers' },
  { home: 'Cleveland Cavaliers', away: 'Chicago Bulls' },
  { home: 'Toronto Raptors', away: 'Atlanta Hawks' },
  { home: 'Portland Trail Blazers', away: 'Utah Jazz' },
  { home: 'Minnesota Timberwolves', away: 'Oklahoma City Thunder' },
  { home: 'Indiana Pacers', away: 'Detroit Pistons' },
  { home: 'Orlando Magic', away: 'Charlotte Hornets' },
  { home: 'Washington Wizards', away: 'Houston Rockets' },
  { home: 'Real Madrid', away: 'Barcelona' },
  { home: 'Olympiacos', away: 'Panathinaikos' },
  { home: 'CSKA Moscow', away: 'Fenerbahce' },
  { home: 'Maccabi Tel Aviv', away: 'Bayern Munich' },
  { home: 'Anadolu Efes', away: 'Zalgiris Kaunas' },
  { home: 'Virtus Bologna', away: 'Olimpia Milano' },
  { home: 'Monaco', away: 'ASVEL' },
  { home: 'Baskonia', away: 'Valencia' },
  { home: 'Alba Berlin', away: 'Partizan Belgrade' },
  { home: 'Red Star Belgrade', away: 'Armani Milan' },
  { home: 'Melbourne United', away: 'Sydney Kings' },
  { home: 'Perth Wildcats', away: 'Brisbane Bullets' },
  { home: 'Adelaide 36ers', away: 'New Zealand Breakers' },
  { home: 'Cairns Taipans', away: 'Illawarra Hawks' },
  { home: 'South East Melbourne', away: 'Tasmania JackJumpers' }
];

// Generate football match data
function generateFootballMatch(id, teams, index) {
  const now = new Date();
  const startTime = new Date(now.getTime() + (index * 3600000) + Math.random() * 86400000);
  const isLive = Math.random() > 0.7;
  const minute = isLive ? Math.floor(Math.random() * 90) : null;
  
  const mainOdds = generate1X2();
  const btts = Math.random() > 0.5 ? { yes: 1.75, no: 2.05 } : { yes: 2.10, no: 1.65 };
  
  return {
    id,
    sport: 'football',
    league: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'][Math.floor(Math.random() * 5)],
    homeTeam: teams.home,
    awayTeam: teams.away,
    startTime: startTime.toISOString(),
    isLive,
    minute,
    homeScore: isLive ? Math.floor(Math.random() * 4) : null,
    awayScore: isLive ? Math.floor(Math.random() * 4) : null,
    markets: {
      '1X2': mainOdds,
      'doubleChance': {
        '1X': generateOdds(0.65 + Math.random() * 0.2),
        '12': generateOdds(0.7 + Math.random() * 0.15),
        'X2': generateOdds(0.6 + Math.random() * 0.25)
      },
      'bothTeamsToScore': btts,
      'overUnder': {
        '0.5': generateOverUnder(0.5),
        '1.5': generateOverUnder(1.5),
        '2.5': generateOverUnder(2.5),
        '3.5': generateOverUnder(3.5),
        '4.5': generateOverUnder(4.5),
        '5.5': generateOverUnder(5.5)
      },
      'asianHandicap': {
        '-2.5': generateHandicap(-2.5),
        '-1.5': generateHandicap(-1.5),
        '-0.5': generateHandicap(-0.5),
        '0': generateHandicap(0),
        '+0.5': generateHandicap(0.5),
        '+1.5': generateHandicap(1.5),
        '+2.5': generateHandicap(2.5)
      },
      'correctScore': generateCorrectScore(),
      'halfTimeFullTime': {
        '1/1': generateOdds(0.25),
        '1/X': generateOdds(0.06),
        '1/2': generateOdds(0.02),
        'X/1': generateOdds(0.08),
        'X/X': generateOdds(0.15),
        'X/2': generateOdds(0.08),
        '2/1': generateOdds(0.02),
        '2/X': generateOdds(0.06),
        '2/2': generateOdds(0.25)
      },
      'firstGoalScorer': {
        'anytime': {
          [`${teams.home} Player 1`]: generateOdds(0.25),
          [`${teams.home} Player 2`]: generateOdds(0.2),
          [`${teams.home} Player 3`]: generateOdds(0.15),
          [`${teams.away} Player 1`]: generateOdds(0.25),
          [`${teams.away} Player 2`]: generateOdds(0.2),
          [`${teams.away} Player 3`]: generateOdds(0.15)
        }
      },
      'totalCorners': {
        'over8.5': generateOdds(0.5),
        'under8.5': generateOdds(0.5),
        'over9.5': generateOdds(0.4),
        'under9.5': generateOdds(0.6),
        'over10.5': generateOdds(0.3),
        'under10.5': generateOdds(0.7)
      },
      'totalCards': {
        'over2.5': generateOdds(0.45),
        'under2.5': generateOdds(0.55),
        'over3.5': generateOdds(0.35),
        'under3.5': generateOdds(0.65),
        'over4.5': generateOdds(0.25),
        'under4.5': generateOdds(0.75)
      },
      'oddEven': {
        'odd': generateOdds(0.5),
        'even': generateOdds(0.5)
      },
      'winToNil': {
        'home': generateOdds(0.25),
        'away': generateOdds(0.25)
      },
      'cleanSheet': {
        'home': generateOdds(0.35),
        'away': generateOdds(0.35)
      },
      'teamGoals': {
        'home': {
          'over0.5': generateOdds(0.75),
          'over1.5': generateOdds(0.45),
          'over2.5': generateOdds(0.2)
        },
        'away': {
          'over0.5': generateOdds(0.75),
          'over1.5': generateOdds(0.45),
          'over2.5': generateOdds(0.2)
        }
      }
    }
  };
}

// Generate tennis match data
function generateTennisMatch(id, players, index) {
  const now = new Date();
  const startTime = new Date(now.getTime() + (index * 3600000) + Math.random() * 86400000);
  const isLive = Math.random() > 0.7;
  
  const player1Prob = 0.3 + Math.random() * 0.4;
  const player2Prob = 1 - player1Prob;
  
  return {
    id,
    sport: 'tennis',
    tournament: ['Wimbledon', 'US Open', 'French Open', 'Australian Open', 'ATP Masters'][Math.floor(Math.random() * 5)],
    player1: players.player1,
    player2: players.player2,
    startTime: startTime.toISOString(),
    isLive,
    currentSet: isLive ? Math.floor(Math.random() * 3) + 1 : null,
    player1Sets: isLive ? Math.floor(Math.random() * 3) : null,
    player2Sets: isLive ? Math.floor(Math.random() * 3) : null,
    player1Games: isLive ? Math.floor(Math.random() * 7) : null,
    player2Games: isLive ? Math.floor(Math.random() * 7) : null,
    markets: {
      'matchWinner': {
        'player1': generateOdds(player1Prob),
        'player2': generateOdds(player2Prob)
      },
      'setBetting': {
        '2-0': generateOdds(0.35),
        '2-1': generateOdds(0.3),
        '0-2': generateOdds(0.35),
        '1-2': generateOdds(0.3)
      },
      'totalGames': {
        'over20.5': generateOdds(0.5),
        'under20.5': generateOdds(0.5),
        'over21.5': generateOdds(0.45),
        'under21.5': generateOdds(0.55),
        'over22.5': generateOdds(0.4),
        'under22.5': generateOdds(0.6)
      },
      'gameHandicap': {
        '-3.5': {
          'player1': generateOdds(0.45),
          'player2': generateOdds(0.55)
        },
        '-1.5': {
          'player1': generateOdds(0.5),
          'player2': generateOdds(0.5)
        },
        '+1.5': {
          'player1': generateOdds(0.55),
          'player2': generateOdds(0.45)
        },
        '+3.5': {
          'player1': generateOdds(0.6),
          'player2': generateOdds(0.4)
        }
      },
      'firstSetWinner': {
        'player1': generateOdds(player1Prob * 1.05),
        'player2': generateOdds(player2Prob * 1.05)
      },
      'setTotals': {
        'set1': {
          'over9.5': generateOdds(0.45),
          'under9.5': generateOdds(0.55)
        },
        'set2': {
          'over9.5': generateOdds(0.45),
          'under9.5': generateOdds(0.55)
        }
      },
      'tieBreak': {
        'yes': generateOdds(0.3),
        'no': generateOdds(0.7)
      },
      'oddEvenGames': {
        'odd': generateOdds(0.5),
        'even': generateOdds(0.5)
      },
      'toWinAtLeastOneSet': {
        'player1': generateOdds(0.8),
        'player2': generateOdds(0.8)
      },
      'totalAces': {
        'over10.5': generateOdds(0.45),
        'under10.5': generateOdds(0.55)
      }
    }
  };
}

// Generate basketball game data
function generateBasketballGame(id, teams, index) {
  const now = new Date();
  const startTime = new Date(now.getTime() + (index * 3600000) + Math.random() * 86400000);
  const isLive = Math.random() > 0.7;
  const quarter = isLive ? Math.floor(Math.random() * 4) + 1 : null;
  
  const homeProb = 0.3 + Math.random() * 0.4;
  const awayProb = 1 - homeProb;
  
  return {
    id,
    sport: 'basketball',
    league: ['NBA', 'EuroLeague', 'NCAA', 'NBL', 'ACB'][Math.floor(Math.random() * 5)],
    homeTeam: teams.home,
    awayTeam: teams.away,
    startTime: startTime.toISOString(),
    isLive,
    quarter,
    homeScore: isLive ? 20 + Math.floor(Math.random() * 80) : null,
    awayScore: isLive ? 20 + Math.floor(Math.random() * 80) : null,
    markets: {
      'moneyline': {
        'home': generateOdds(homeProb),
        'away': generateOdds(awayProb)
      },
      'spread': {
        '-7.5': {
          'home': generateOdds(0.5),
          'away': generateOdds(0.5)
        },
        '-5.5': {
          'home': generateOdds(0.45),
          'away': generateOdds(0.55)
        },
        '-3.5': {
          'home': generateOdds(0.4),
          'away': generateOdds(0.6)
        },
        '+3.5': {
          'home': generateOdds(0.6),
          'away': generateOdds(0.4)
        },
        '+5.5': {
          'home': generateOdds(0.55),
          'away': generateOdds(0.45)
        },
        '+7.5': {
          'home': generateOdds(0.5),
          'away': generateOdds(0.5)
        }
      },
      'totalPoints': {
        'over210.5': generateOdds(0.5),
        'under210.5': generateOdds(0.5),
        'over215.5': generateOdds(0.45),
        'under215.5': generateOdds(0.55),
        'over220.5': generateOdds(0.4),
        'under220.5': generateOdds(0.6),
        'over225.5': generateOdds(0.35),
        'under225.5': generateOdds(0.65)
      },
      'halfTime': {
        'moneyline': {
          'home': generateOdds(homeProb * 1.05),
          'away': generateOdds(awayProb * 1.05)
        },
        'spread': {
          '-3.5': {
            'home': generateOdds(0.5),
            'away': generateOdds(0.5)
          }
        },
        'total': {
          'over105.5': generateOdds(0.5),
          'under105.5': generateOdds(0.5)
        }
      },
      'quarters': {
        'q1': {
          'moneyline': {
            'home': generateOdds(0.5),
            'away': generateOdds(0.5)
          },
          'total': {
            'over52.5': generateOdds(0.5),
            'under52.5': generateOdds(0.5)
          }
        },
        'q2': {
          'moneyline': {
            'home': generateOdds(0.5),
            'away': generateOdds(0.5)
          },
          'total': {
            'over52.5': generateOdds(0.5),
            'under52.5': generateOdds(0.5)
          }
        },
        'q3': {
          'moneyline': {
            'home': generateOdds(0.5),
            'away': generateOdds(0.5)
          },
          'total': {
            'over52.5': generateOdds(0.5),
            'under52.5': generateOdds(0.5)
          }
        },
        'q4': {
          'moneyline': {
            'home': generateOdds(0.5),
            'away': generateOdds(0.5)
          },
          'total': {
            'over52.5': generateOdds(0.5),
            'under52.5': generateOdds(0.5)
          }
        }
      },
      'teamTotals': {
        'home': {
          'over105.5': generateOdds(0.5),
          'under105.5': generateOdds(0.5),
          'over110.5': generateOdds(0.4),
          'under110.5': generateOdds(0.6)
        },
        'away': {
          'over105.5': generateOdds(0.5),
          'under105.5': generateOdds(0.5),
          'over110.5': generateOdds(0.4),
          'under110.5': generateOdds(0.6)
        }
      },
      'winningMargin': {
        'home1-5': generateOdds(0.15),
        'home6-10': generateOdds(0.12),
        'home11-15': generateOdds(0.08),
        'home16-20': generateOdds(0.05),
        'home21+': generateOdds(0.03),
        'away1-5': generateOdds(0.15),
        'away6-10': generateOdds(0.12),
        'away11-15': generateOdds(0.08),
        'away16-20': generateOdds(0.05),
        'away21+': generateOdds(0.03)
      },
      'raceToPoints': {
        '20': {
          'home': generateOdds(0.5),
          'away': generateOdds(0.5)
        },
        '50': {
          'home': generateOdds(homeProb),
          'away': generateOdds(awayProb)
        },
        '100': {
          'home': generateOdds(homeProb),
          'away': generateOdds(awayProb)
        }
      },
      'oddEven': {
        'odd': generateOdds(0.5),
        'even': generateOdds(0.5)
      },
      'highestScoringQuarter': {
        'q1': generateOdds(0.25),
        'q2': generateOdds(0.25),
        'q3': generateOdds(0.25),
        'q4': generateOdds(0.25)
      },
      'playerProps': {
        [`${teams.home} Star Player`]: {
          'points': {
            'over25.5': generateOdds(0.5),
            'under25.5': generateOdds(0.5)
          },
          'rebounds': {
            'over8.5': generateOdds(0.5),
            'under8.5': generateOdds(0.5)
          },
          'assists': {
            'over6.5': generateOdds(0.5),
            'under6.5': generateOdds(0.5)
          }
        },
        [`${teams.away} Star Player`]: {
          'points': {
            'over25.5': generateOdds(0.5),
            'under25.5': generateOdds(0.5)
          },
          'rebounds': {
            'over8.5': generateOdds(0.5),
            'under8.5': generateOdds(0.5)
          },
          'assists': {
            'over6.5': generateOdds(0.5),
            'under6.5': generateOdds(0.5)
          }
        }
      }
    }
  };
}

// Generate all events
const events = [];
let eventId = 1;

// Generate 30 football matches
for (let i = 0; i < 30; i++) {
  events.push(generateFootballMatch(eventId++, footballTeams[i], i));
}

// Generate 30 tennis matches
for (let i = 0; i < 30; i++) {
  events.push(generateTennisMatch(eventId++, tennisMatches[i], i));
}

// Generate 30 basketball games
for (let i = 0; i < 30; i++) {
  events.push(generateBasketballGame(eventId++, basketballTeams[i], i));
}

// Create featured events (top 10 most popular)
const featured = events
  .slice(0, 10)
  .map(event => ({
    ...event,
    isFeatured: true,
    viewCount: Math.floor(1000 + Math.random() * 9000)
  }));

// Create database structure
const database = {
  events,
  featured,
  sports: [
    { id: 1, name: 'Football', slug: 'football', eventCount: 30, icon: '⚽' },
    { id: 2, name: 'Tennis', slug: 'tennis', eventCount: 30, icon: '🎾' },
    { id: 3, name: 'Basketball', slug: 'basketball', eventCount: 30, icon: '🏀' }
  ],
  live: events.filter(e => e.isLive),
  upcoming: events.filter(e => !e.isLive)
};

// Write to db.json
fs.writeFileSync('db.json', JSON.stringify(database, null, 2));
console.log('✅ Generated db.json with 90 events successfully!');
console.log(`   - ${database.events.filter(e => e.sport === 'football').length} Football matches`);
console.log(`   - ${database.events.filter(e => e.sport === 'tennis').length} Tennis matches`);
console.log(`   - ${database.events.filter(e => e.sport === 'basketball').length} Basketball games`);
console.log(`   - ${database.live.length} Live events`);
console.log(`   - ${database.upcoming.length} Upcoming events`);
console.log(`   - ${database.featured.length} Featured events`);