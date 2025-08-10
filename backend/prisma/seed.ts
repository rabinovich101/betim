import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean database
  await prisma.notification.deleteMany();
  await prisma.favoriteTeam.deleteMany();
  await prisma.bet.deleteMany();
  await prisma.betSlip.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.session.deleteMany();
  await prisma.odds.deleteMany();
  await prisma.market.deleteMany();
  await prisma.event.deleteMany();
  await prisma.team.deleteMany();
  await prisma.sport.deleteMany();
  await prisma.user.deleteMany();
  await prisma.promoCode.deleteMany();

  console.log('✅ Database cleaned');

  // Create promo codes
  const promoCodes = await Promise.all([
    prisma.promoCode.create({
      data: {
        code: 'WELCOME100',
        description: 'Welcome bonus - 100% match up to $100',
        discountType: 'PERCENTAGE',
        discountValue: 100,
        minDeposit: 10,
        maxDiscount: 100,
        usageLimit: 1000,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    }),
    prisma.promoCode.create({
      data: {
        code: 'FREEBET20',
        description: 'Free $20 bet',
        discountType: 'FREE_BET',
        discountValue: 20,
        minDeposit: 50,
        usageLimit: 500,
      },
    }),
  ]);

  console.log('✅ Promo codes created');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@betim.com',
        username: 'admin',
        hashedPassword,
        fullName: 'Admin User',
        dateOfBirth: new Date('1990-01-01'),
        country: 'US',
        state: 'NJ',
        role: 'ADMIN',
        isVerified: true,
        kycStatus: 'VERIFIED',
        balance: 10000,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'john@example.com',
        username: 'johndoe',
        hashedPassword,
        fullName: 'John Doe',
        dateOfBirth: new Date('1995-05-15'),
        country: 'US',
        state: 'NJ',
        isVerified: true,
        kycStatus: 'VERIFIED',
        balance: 500,
        emailVerified: new Date(),
        promoCodeId: promoCodes[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane@example.com',
        username: 'janesmith',
        hashedPassword,
        fullName: 'Jane Smith',
        dateOfBirth: new Date('1992-08-20'),
        country: 'GB',
        balance: 250,
      },
    }),
  ]);

  console.log('✅ Users created');

  // Create sports
  const sports = await Promise.all([
    prisma.sport.create({
      data: {
        name: 'Football',
        slug: 'football',
        icon: '⚽',
        displayOrder: 1,
      },
    }),
    prisma.sport.create({
      data: {
        name: 'Basketball',
        slug: 'basketball',
        icon: '🏀',
        displayOrder: 2,
      },
    }),
    prisma.sport.create({
      data: {
        name: 'Tennis',
        slug: 'tennis',
        icon: '🎾',
        displayOrder: 3,
      },
    }),
    prisma.sport.create({
      data: {
        name: 'Baseball',
        slug: 'baseball',
        icon: '⚾',
        displayOrder: 4,
      },
    }),
  ]);

  console.log('✅ Sports created');

  // Create teams
  const footballTeams = await Promise.all([
    prisma.team.create({
      data: {
        name: 'Liverpool FC',
        shortName: 'LIV',
        country: 'England',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Arsenal FC',
        shortName: 'ARS',
        country: 'England',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Manchester United',
        shortName: 'MUN',
        country: 'England',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Chelsea FC',
        shortName: 'CHE',
        country: 'England',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Real Madrid',
        shortName: 'RMA',
        country: 'Spain',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Barcelona',
        shortName: 'BAR',
        country: 'Spain',
      },
    }),
  ]);

  const basketballTeams = await Promise.all([
    prisma.team.create({
      data: {
        name: 'Los Angeles Lakers',
        shortName: 'LAL',
        country: 'USA',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Boston Celtics',
        shortName: 'BOS',
        country: 'USA',
      },
    }),
  ]);

  console.log('✅ Teams created');

  // Create events with markets and odds
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const in3Hours = new Date(now.getTime() + 3 * 60 * 60 * 1000);

  // Featured match - Liverpool vs Arsenal
  const featuredEvent = await prisma.event.create({
    data: {
      sportId: sports[0].id,
      homeTeamId: footballTeams[0].id, // Liverpool
      awayTeamId: footballTeams[1].id, // Arsenal
      title: 'Premier League - Week 15',
      startTime: in3Hours,
      status: 'UPCOMING',
      venue: 'Anfield',
      competition: 'Premier League',
      round: 'Week 15',
      isFeatured: true,
      markets: {
        create: [
          {
            type: 'MATCH_WINNER',
            name: 'Match Result',
            odds: {
              create: [
                { selection: 'Home', value: 1.90 },
                { selection: 'Draw', value: 3.40 },
                { selection: 'Away', value: 3.80 },
              ],
            },
          },
          {
            type: 'OVER_UNDER',
            name: 'Total Goals Over/Under 2.5',
            odds: {
              create: [
                { selection: 'Over 2.5', value: 1.85 },
                { selection: 'Under 2.5', value: 1.95 },
              ],
            },
          },
          {
            type: 'BOTH_TEAMS_SCORE',
            name: 'Both Teams to Score',
            odds: {
              create: [
                { selection: 'Yes', value: 1.75 },
                { selection: 'No', value: 2.05 },
              ],
            },
          },
        ],
      },
    },
  });

  // Live match
  const liveEvent = await prisma.event.create({
    data: {
      sportId: sports[0].id,
      homeTeamId: footballTeams[2].id, // Man United
      awayTeamId: footballTeams[3].id, // Chelsea
      title: 'Premier League - Week 15',
      startTime: new Date(now.getTime() - 30 * 60 * 1000), // Started 30 mins ago
      status: 'LIVE',
      isLive: true,
      homeScore: 1,
      awayScore: 0,
      currentTime: 35,
      period: 'First Half',
      venue: 'Old Trafford',
      competition: 'Premier League',
      round: 'Week 15',
      markets: {
        create: [
          {
            type: 'MATCH_WINNER',
            name: 'Match Result',
            odds: {
              create: [
                { selection: 'Home', value: 1.65 },
                { selection: 'Draw', value: 3.80 },
                { selection: 'Away', value: 5.50 },
              ],
            },
          },
        ],
      },
    },
  });

  // More upcoming events
  const upcomingEvents = await Promise.all([
    prisma.event.create({
      data: {
        sportId: sports[0].id,
        homeTeamId: footballTeams[4].id, // Real Madrid
        awayTeamId: footballTeams[5].id, // Barcelona
        title: 'El Clásico',
        startTime: tomorrow,
        status: 'UPCOMING',
        venue: 'Santiago Bernabéu',
        competition: 'La Liga',
        round: 'Week 12',
        isFeatured: true,
        markets: {
          create: [
            {
              type: 'MATCH_WINNER',
              name: 'Match Result',
              odds: {
                create: [
                  { selection: 'Home', value: 2.20 },
                  { selection: 'Draw', value: 3.30 },
                  { selection: 'Away', value: 3.10 },
                ],
              },
            },
          ],
        },
      },
    }),
    prisma.event.create({
      data: {
        sportId: sports[1].id, // Basketball
        homeTeamId: basketballTeams[0].id, // Lakers
        awayTeamId: basketballTeams[1].id, // Celtics
        title: 'NBA Regular Season',
        startTime: tomorrow,
        status: 'UPCOMING',
        venue: 'Crypto.com Arena',
        competition: 'NBA',
        markets: {
          create: [
            {
              type: 'MATCH_WINNER',
              name: 'Money Line',
              odds: {
                create: [
                  { selection: 'Home', value: 1.75 },
                  { selection: 'Away', value: 2.10 },
                ],
              },
            },
            {
              type: 'HANDICAP',
              name: 'Point Spread -5.5',
              odds: {
                create: [
                  { selection: 'Home -5.5', value: 1.90 },
                  { selection: 'Away +5.5', value: 1.90 },
                ],
              },
            },
          ],
        },
      },
    }),
  ]);

  console.log('✅ Events with markets and odds created');

  // Create some bet history for users
  const market = await prisma.market.findFirst({
    where: { eventId: featuredEvent.id, type: 'MATCH_WINNER' },
    include: { odds: true },
  });

  if (market && users[1]) {
    const homeOdds = market.odds.find(o => o.selection === 'Home');
    if (homeOdds) {
      await prisma.bet.create({
        data: {
          userId: users[1].id,
          eventId: featuredEvent.id,
          marketId: market.id,
          oddsId: homeOdds.id,
          stake: 50,
          odds: homeOdds.value,
          selection: 'Liverpool',
          potentialWin: 95, // 50 * 1.90
          status: 'PENDING',
        },
      });
    }
  }

  console.log('✅ Sample bets created');

  // Create transactions
  if (users[1]) {
    await prisma.transaction.create({
      data: {
        userId: users[1].id,
        type: 'DEPOSIT',
        amount: 100,
        status: 'COMPLETED',
        paymentMethod: 'Credit Card',
        reference: 'DEP-' + Date.now(),
        completedAt: new Date(),
      },
    });
  }

  console.log('✅ Sample transactions created');

  console.log('🎉 Seed completed successfully!');
  console.log('📝 Test credentials:');
  console.log('   Admin: admin@betim.com / password123');
  console.log('   User: john@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });