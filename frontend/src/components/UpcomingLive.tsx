'use client';

interface Match {
  id: string;
  teams: string;
  time: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  icon: string;
  sport: 'football' | 'basketball' | 'tennis' | 'baseball';
}

export default function UpcomingLive() {
  const matches: Match[] = [
    {
      id: '1',
      teams: 'Liverpool\nArsenal',
      time: '18:00',
      odds: { home: 1.90, draw: 3.60, away: 4.20 },
      icon: '⚽',
      sport: 'football'
    },
    {
      id: '2',
      teams: 'Real Madrid\nBarcelona',
      time: '20:00',
      odds: { home: 1.96, draw: 3.60, away: 3.90 },
      icon: '⚽',
      sport: 'football'
    },
    {
      id: '3',
      teams: 'Golden State\nLos Angeles',
      time: '20:30',
      odds: { home: 2.40, draw: 3.30, away: 4.10 },
      icon: '🏀',
      sport: 'basketball'
    },
    {
      id: '4',
      teams: 'Tsitsipas\nDjokovic',
      time: '21:00',
      odds: { home: 2.10, draw: 3.50, away: 4.30 },
      icon: '🎾',
      sport: 'tennis'
    },
    {
      id: '5',
      teams: 'New York Yankees\nChicago Cubs',
      time: '21:30',
      odds: { home: 1.80, draw: 3.60, away: 4.40 },
      icon: '⚾',
      sport: 'baseball'
    }
  ];

  const getSportColor = (sport: string) => {
    switch(sport) {
      case 'football': return 'from-[#2563eb] to-[#1e40af]';
      case 'basketball': return 'from-[#ea580c] to-[#c2410c]';
      case 'tennis': return 'from-[#84cc16] to-[#65a30d]';
      case 'baseball': return 'from-[#6b7280] to-[#4b5563]';
      default: return 'from-[#2563eb] to-[#1e40af]';
    }
  };

  return (
    <div className="w-[80%] mx-auto mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">UPCOMING LIVE</h2>
      
      <div className="bg-gradient-to-br from-[#1a2c38]/60 via-[#0f2027]/60 to-[#1a2c38]/60 rounded-2xl p-6 backdrop-blur-sm border border-white/5">
        <div className="space-y-4">
          {matches.map((match) => (
            <div 
              key={match.id}
              className="flex items-center justify-between p-4 bg-[#0a1a1f]/50 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200 group hover:bg-[#0a1a1f]/70"
            >
              {/* Sport Icon */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getSportColor(match.sport)} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                  {match.icon}
                </div>
                
                {/* Teams */}
                <div className="text-white">
                  {match.teams.split('\n').map((team, index) => (
                    <div key={index} className={`font-medium ${index === 0 ? '' : 'text-sm opacity-90'}`}>
                      {team}
                    </div>
                  ))}
                </div>
              </div>

              {/* Time and Odds */}
              <div className="flex items-center gap-6">
                {/* Time */}
                <div className="text-[#a0a0b8] font-medium">
                  {match.time}
                </div>

                {/* Odds */}
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-[#232438] rounded-lg border border-white/10 hover:border-[#00ff87] hover:bg-[#2a2b3f] transition-all duration-200 min-w-[65px]">
                    <span className="text-white font-bold">{match.odds.home.toFixed(2)}</span>
                  </button>
                  <button className="px-4 py-2 bg-[#232438] rounded-lg border border-white/10 hover:border-[#00ff87] hover:bg-[#2a2b3f] transition-all duration-200 min-w-[65px]">
                    <span className="text-white font-bold">{match.odds.draw.toFixed(2)}</span>
                  </button>
                  <button className="px-4 py-2 bg-[#232438] rounded-lg border border-white/10 hover:border-[#00ff87] hover:bg-[#2a2b3f] transition-all duration-200 min-w-[65px]">
                    <span className="text-white font-bold">{match.odds.away.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}