
import React, { useState, useMemo } from 'react';
import { Player } from '../types';
import { team1, team2 } from '../data/mockData';

const allPlayers: Player[] = [...team1.players, ...team2.players].map(p => ({
    ...p,
    stats: { // Add random stats for demonstration
        points: Math.floor(Math.random() * 300),
        rebounds: Math.floor(Math.random() * 150),
        assists: Math.floor(Math.random() * 100),
        steals: Math.floor(Math.random() * 50),
        blocks: Math.floor(Math.random() * 30),
        turnovers: Math.floor(Math.random() * 40),
        fouls: Math.floor(Math.random() * 60),
    }
}));

type SortKey = keyof Player['stats'] | 'name';
type SortDirection = 'asc' | 'desc';

const PlayerStats: React.FC = () => {
    const [sortKey, setSortKey] = useState<SortKey>('points');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const sortedPlayers = useMemo(() => {
        return [...allPlayers].sort((a, b) => {
            let valA, valB;
            
            if (sortKey === 'name') {
                valA = `${a.firstName} ${a.lastName}`;
                valB = `${b.firstName} ${b.lastName}`;
            } else {
                valA = a.stats[sortKey as keyof Player['stats']];
                valB = b.stats[sortKey as keyof Player['stats']];
            }

            if (valA < valB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [sortKey, sortDirection]);

    const handleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('desc');
        }
    };

    const headers: { key: SortKey; label: string; shortLabel: string }[] = [
        { key: 'name', label: 'Player', shortLabel: 'Player' },
        { key: 'points', label: 'Points', shortLabel: 'PTS' },
        { key: 'rebounds', label: 'Rebounds', shortLabel: 'REB' },
        { key: 'assists', label: 'Assists', shortLabel: 'AST' },
        { key: 'steals', label: 'Steals', shortLabel: 'STL' },
        { key: 'blocks', label: 'Blocks', shortLabel: 'BLK' },
        { key: 'turnovers', label: 'Turnovers', shortLabel: 'TO' },
        { key: 'fouls', label: 'Fouls', shortLabel: 'PF' },
    ];
    
    const SortIndicator: React.FC<{ direction: SortDirection }> = ({ direction }) => (
        <span className="ml-1">{direction === 'asc' ? '▲' : '▼'}</span>
    );

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">Player Leaderboard</h1>
            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
                            <tr>
                                {headers.map(header => (
                                    <th key={header.key} scope="col" className="px-4 py-3 cursor-pointer" onClick={() => handleSort(header.key)}>
                                        <div className="flex items-center">
                                            <span className="hidden sm:inline">{header.label}</span>
                                            <span className="sm:hidden">{header.shortLabel}</span>
                                            {sortKey === header.key && <SortIndicator direction={sortDirection} />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlayers.map((player, index) => (
                                <tr key={player.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600">
                                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="w-10 h-10 rounded-full mr-3" src={player.imageUrl} alt={`${player.firstName} ${player.lastName}`} />
                                            <div>
                                                <div className="font-bold">{player.firstName} {player.lastName}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">#{player.jerseyNumber} - {player.position}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-bold">{player.stats.points}</td>
                                    <td className="px-4 py-4">{player.stats.rebounds}</td>
                                    <td className="px-4 py-4">{player.stats.assists}</td>
                                    <td className="px-4 py-4">{player.stats.steals}</td>
                                    <td className="px-4 py-4">{player.stats.blocks}</td>
                                    <td className="px-4 py-4">{player.stats.turnovers}</td>
                                    <td className="px-4 py-4">{player.stats.fouls}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlayerStats;
