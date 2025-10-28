
import { Team, Player, Game, PlayerPosition } from '../types';

const generatePlayers = (teamId: number, namePrefix: string): Player[] => {
  const positions = [
    PlayerPosition.PG, PlayerPosition.SG, PlayerPosition.SF, PlayerPosition.PF, PlayerPosition.C,
    PlayerPosition.SG, PlayerPosition.SF, PlayerPosition.C
  ];
  const firstNames = ['Mike', 'Chris', 'Kevin', 'LeBron', 'Steph', 'James', 'Kawhi', 'Anthony'];
  const lastNames = ['Jordan', 'Paul', 'Durant', 'James', 'Curry', 'Harden', 'Leonard', 'Davis'];

  return Array.from({ length: 8 }, (_, i) => ({
    id: teamId * 100 + i + 1,
    teamId: teamId,
    firstName: `${firstNames[i]}`,
    lastName: `${lastNames[i]}`,
    position: positions[i],
    jerseyNumber: Math.floor(Math.random() * 99) + 1,
    imageUrl: `https://picsum.photos/seed/${teamId * 100 + i + 1}/200/200`,
    stats: {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fouls: 0,
    },
  }));
};

export const team1: Team = {
  id: 1,
  name: 'Vortex Vipers',
  coach: 'Gregg Popovich',
  logoUrl: 'https://picsum.photos/seed/vipers/200',
  players: generatePlayers(1, 'Viper'),
};

export const team2: Team = {
  id: 2,
  name: 'Titan Thunder',
  coach: 'Steve Kerr',
  logoUrl: 'https://picsum.photos/seed/thunder/200',
  players: generatePlayers(2, 'Titan'),
};

export const initialGame: Game = {
  id: 101,
  team1: team1,
  team2: team2,
  venue: 'Championship Arena',
  date: new Date(),
  status: 'live',
};

export const scheduledGames: Game[] = [
    {
        id: 102,
        team1: { ...team1, name: 'Quantum Quakes' },
        team2: { ...team2, name: 'Nebula Ninjas' },
        venue: 'Galaxy Gymnasium',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
    },
    {
        id: 103,
        team1: { ...team1, name: 'Solar Flares' },
        team2: { ...team2, name: 'Meteor Mavericks' },
        venue: 'Cosmic Coliseum',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
    }
]

export const standings = [
    { team: 'Vortex Vipers', wins: 8, losses: 2, pointsFor: 890, pointsAgainst: 810 },
    { team: 'Titan Thunder', wins: 7, losses: 3, pointsFor: 912, pointsAgainst: 850 },
    { team: 'Quantum Quakes', wins: 6, losses: 4, pointsFor: 850, pointsAgainst: 840 },
    { team: 'Nebula Ninjas', wins: 5, losses: 5, pointsFor: 830, pointsAgainst: 835 },
];
