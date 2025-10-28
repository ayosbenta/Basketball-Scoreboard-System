
import React from 'react';
import { Page, Game } from '../../types';
import { initialGame, scheduledGames, standings } from '../../data/mockData';
import { BasketballIcon } from '../icons';

interface PublicDashboardProps {
  navigateTo: (page: Page, game: Game) => void;
}

const PublicDashboard: React.FC<PublicDashboardProps> = ({ navigateTo }) => {

  const LiveGameCard: React.FC<{game: Game}> = ({game}) => (
     <div className="bg-red-600 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
        <div className="absolute -top-4 -right-4 text-red-400/50">
            <BasketballIcon className="w-32 h-32 transform rotate-12" />
        </div>
        <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">LIVE</span>
                <span className="text-sm font-semibold">{game.venue}</span>
            </div>
            <div className="text-center mb-6">
                <div className="flex justify-around items-center">
                    <div className="flex-1 text-center">
                        <img src={game.team1.logoUrl} alt={game.team1.name} className="w-20 h-20 mx-auto rounded-full border-4 border-white/50 mb-2"/>
                        <h3 className="font-bold text-lg">{game.team1.name}</h3>
                    </div>
                    <span className="text-4xl font-black mx-4">VS</span>
                    <div className="flex-1 text-center">
                        <img src={game.team2.logoUrl} alt={game.team2.name} className="w-20 h-20 mx-auto rounded-full border-4 border-white/50 mb-2"/>
                        <h3 className="font-bold text-lg">{game.team2.name}</h3>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => navigateTo(Page.SCOREBOARD, game)}
                className="w-full bg-white text-red-600 font-bold py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
            >
                View Live Scoreboard
            </button>
        </div>
    </div>
  );

  const UpcomingGameCard: React.FC<{game: Game}> = ({game}) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{game.date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            <p className="font-bold">{game.team1.name} vs {game.team2.name}</p>
        </div>
        <div className="text-right">
             <p className="text-sm text-gray-500 dark:text-gray-400">{game.venue}</p>
             <p className="font-semibold text-primary">{game.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
    </div>
  );

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Fan Dashboard</h1>
        <LiveGameCard game={initialGame} />
        <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Upcoming Games</h2>
            <div className="space-y-3">
                {scheduledGames.map(game => <UpcomingGameCard key={game.id} game={game} />)}
            </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">League Standings</h2>
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden">
             <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Team</th>
                        <th scope="col" className="px-2 py-3 text-center">W</th>
                        <th scope="col" className="px-2 py-3 text-center">L</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((s, index) => (
                        <tr key={s.team} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                             <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                {index + 1}. {s.team}
                             </td>
                             <td className="px-2 py-4 text-center">{s.wins}</td>
                             <td className="px-2 py-4 text-center">{s.losses}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
