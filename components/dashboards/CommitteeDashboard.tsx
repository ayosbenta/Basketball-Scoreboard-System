
import React from 'react';
import { Page, Game, UserRole } from '../../types';
// FIX: Import BasketballIcon
import { WhistleIcon, UsersIcon, BasketballIcon } from '../icons';

interface CommitteeDashboardProps {
  navigateTo: (page: Page, game?: Game) => void;
}

const Card: React.FC<{ title: string; value: string | number; icon: React.ReactNode; description: string }> = ({ title, value, icon, description }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">{title}</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{description}</p>
            </div>
            <div className="bg-primary/10 text-primary p-3 rounded-full">
                {icon}
            </div>
        </div>
    </div>
);

const CommitteeDashboard: React.FC<CommitteeDashboardProps> = ({ navigateTo }) => {
  const pendingRegistrations = [
    { name: 'Cosmic Comets', coach: 'Jane Doe' },
    { name: 'Solar Sailors', coach: 'John Smith' },
  ];

  const pendingResults = [
    { game: 'Vortex Vipers vs. Titan Thunder', score: '98-95' },
    { game: 'Quantum Quakes vs. Nebula Ninjas', score: '102-110' },
  ];

  return (
    <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Committee Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Teams Registered" value="12" icon={<UsersIcon className="w-6 h-6"/>} description="+2 this week" />
            <Card title="Games Played" value="48" icon={<BasketballIcon className="w-6 h-6"/>} description="Season is 50% complete" />
            <Card title="Pending Approvals" value={pendingRegistrations.length} icon={<UsersIcon className="w-6 h-6"/>} description="Team registrations" />
            <Card title="Results to Validate" value={pendingResults.length} icon={<WhistleIcon className="w-6 h-6"/>} description="Requires review" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Pending Team Registrations</h2>
                <ul className="space-y-4">
                    {pendingRegistrations.map(team => (
                        <li key={team.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md">
                            <div>
                                <p className="font-semibold">{team.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Coach: {team.coach}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-md">Approve</button>
                                <button className="px-3 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md">Deny</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Game Results to Validate</h2>
                 <ul className="space-y-4">
                    {pendingResults.map(result => (
                        <li key={result.game} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md">
                            <div>
                                <p className="font-semibold">{result.game}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Final Score: {result.score}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md">Validate</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default CommitteeDashboard;