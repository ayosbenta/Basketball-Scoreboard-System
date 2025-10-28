
import React from 'react';
import { Page, Game, UserRole, Player, Team } from '../../types';
import { initialGame, team1 } from '../../data/mockData';
import { BasketballIcon, UsersIcon } from '../icons';

interface TeamDashboardProps {
  navigateTo: (page: Page, game?: Game) => void;
  userRole: UserRole;
}

const PlayerCard: React.FC<{player: Player}> = ({player}) => (
    <div className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg flex items-center space-x-4">
        <img src={player.imageUrl} alt={player.firstName} className="w-12 h-12 rounded-full" />
        <div>
            <p className="font-bold text-slate-800 dark:text-white">{player.firstName} {player.lastName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">#{player.jerseyNumber} - {player.position}</p>
        </div>
    </div>
);

const TeamDashboard: React.FC<TeamDashboardProps> = ({ navigateTo, userRole }) => {
  const myTeam: Team = team1;
  const nextGame: Game = initialGame;

  return (
    <div className="container mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{userRole} Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
                 <div className="flex items-center space-x-4 mb-6">
                    <img src={myTeam.logoUrl} alt={myTeam.name} className="w-20 h-20 rounded-full"/>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{myTeam.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">Coach: {myTeam.coach}</p>
                    </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-primary mb-2">Next Game</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                         <div>
                            <p className="font-bold text-slate-800 dark:text-white">{nextGame.team1.name} vs {nextGame.team2.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{nextGame.date.toLocaleString()} at {nextGame.venue}</p>
                        </div>
                        <button 
                            onClick={() => navigateTo(Page.SCOREBOARD, nextGame)}
                            className="mt-3 sm:mt-0 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            Go to Scoreboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Team Roster</h2>
                <button className="px-3 py-1 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-md">+ Add Player</button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {myTeam.players.map(player => (
                    <PlayerCard key={player.id} player={player} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
