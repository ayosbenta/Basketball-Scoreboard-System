
export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  COMMITTEE_ADMIN = 'Committee Admin',
  TEAM_COACH_MANAGER = 'Team Coach/Manager',
  SCOREKEEPER = 'Scorekeeper',
  VIEWER_FANS = 'Viewer/Fan',
}

export enum PlayerPosition {
  PG = 'Point Guard',
  SG = 'Shooting Guard',
  SF = 'Small Forward',
  PF = 'Power Forward',
  C = 'Center',
}

export enum GameEventType {
  TWO_POINTS_MADE = '2PT Made',
  THREE_POINTS_MADE = '3PT Made',
  FREE_THROW_MADE = 'Free Throw Made',
  ASSIST = 'Assist',
  REBOUND = 'Rebound',
  STEAL = 'Steal',
  BLOCK = 'Block',
  TURNOVER = 'Turnover',
  FOUL = 'Foul',
  GAME_START = 'Game Start',
  QUARTER_END = 'Quarter End',
  GAME_END = 'Game End',
}

export interface Player {
  id: number;
  teamId: number;
  firstName: string;
  lastName: string;
  position: PlayerPosition;
  jerseyNumber: number;
  imageUrl: string;
  stats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
    fouls: number;
  };
}

export interface Team {
  id: number;
  name: string;
  coach: string;
  logoUrl: string;
  players: Player[];
}

export interface Game {
  id: number;
  team1: Team;
  team2: Team;
  venue: string;
  date: Date;
  status: 'scheduled' | 'live' | 'finished';
}

export interface GameEvent {
  id: number;
  gameId: number;
  playerId: number | null;
  teamId: number | null;
  type: GameEventType;
  points: number;
  timestamp: Date;
  description: string;
}

export enum Page {
    DASHBOARD = 'DASHBOARD',
    SCOREBOARD = 'SCOREBOARD',
    PLAYER_STATS = 'PLAYER_STATS',
    SCHEDULE = 'SCHEDULE',
}
