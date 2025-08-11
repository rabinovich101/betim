# BETIM Fake Odds API

A comprehensive fake betting odds API with 90 sporting events across football, tennis, and basketball. Built with JSON Server for testing and development purposes.

## 🚀 Running the API

```bash
# Install dependencies (if not already done)
npm install

# Generate fresh data
node generate-data.js

# Start the API server
npm start
```

The API runs on **http://localhost:3333**

## 📊 Data Overview

- **90 Total Events**
  - 30 Football matches
  - 30 Tennis matches  
  - 30 Basketball games
- **Live Events**: ~30% of events are live with scores
- **Featured Events**: Top 10 most popular events
- **Comprehensive Markets**: Each sport includes realistic betting markets

## 🔗 API Endpoints

### All Events
```
GET http://localhost:3333/events
```

### Events by Sport
```
GET http://localhost:3333/events?sport=football
GET http://localhost:3333/events?sport=tennis
GET http://localhost:3333/events?sport=basketball
```

### Live Events
```
GET http://localhost:3333/live
```

### Upcoming Events
```
GET http://localhost:3333/upcoming
```

### Featured Events
```
GET http://localhost:3333/featured
```

### Single Event
```
GET http://localhost:3333/events/{id}
```

### Sports List
```
GET http://localhost:3333/sports
```

## 🎯 Available Markets

### Football Markets
- **Main Markets**: 1X2, Double Chance, Draw No Bet
- **Goals**: Over/Under (0.5 to 6.5), Both Teams to Score
- **Handicaps**: Asian Handicap, European Handicap
- **Specials**: Correct Score, Half Time/Full Time
- **Team Markets**: Team Goals, Clean Sheet, Win to Nil
- **Stats**: Corners, Cards, Odd/Even
- **Player Markets**: First/Anytime Goal Scorer

### Tennis Markets
- **Match**: Winner, Set Betting, Set Score
- **Games**: Total Games Over/Under, Game Handicaps
- **Sets**: Set Totals, First Set Winner
- **Specials**: Tie Break Yes/No, Odd/Even Games
- **Player**: Total Aces, To Win At Least One Set

### Basketball Markets
- **Main**: Moneyline, Point Spread
- **Totals**: Total Points Over/Under
- **Periods**: Quarter/Half betting
- **Team**: Team Totals
- **Margins**: Winning Margin ranges
- **Race**: Race to X Points
- **Player Props**: Points, Rebounds, Assists

## 📝 Example Requests

### Get first 5 football matches
```bash
curl "http://localhost:3333/events?sport=football&_limit=5"
```

### Get live tennis matches
```bash
curl "http://localhost:3333/events?sport=tennis&isLive=true"
```

### Get a specific event with all markets
```bash
curl "http://localhost:3333/events/1"
```

### Pagination
```bash
curl "http://localhost:3333/events?_page=1&_limit=10"
```

### Sorting
```bash
curl "http://localhost:3333/events?_sort=startTime&_order=asc"
```

## 🔄 Regenerate Data

To generate fresh data with new odds and events:
```bash
node generate-data.js
```

## 📊 Data Structure Example

```json
{
  "id": 1,
  "sport": "football",
  "league": "Premier League",
  "homeTeam": "Liverpool",
  "awayTeam": "Arsenal",
  "startTime": "2024-08-11T15:00:00.000Z",
  "isLive": true,
  "minute": 45,
  "homeScore": 1,
  "awayScore": 0,
  "markets": {
    "1X2": {
      "home": 2.10,
      "draw": 3.40,
      "away": 3.50
    },
    "overUnder": {
      "2.5": {
        "over": 1.85,
        "under": 1.95
      }
    },
    // ... many more markets
  }
}
```

## 🛠️ Technologies Used
- **JSON Server**: REST API with zero coding
- **Node.js**: Data generation scripts
- **Realistic Odds**: Properly balanced betting margins (~105-110%)