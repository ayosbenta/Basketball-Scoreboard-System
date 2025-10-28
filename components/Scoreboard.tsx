
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Game, UserRole, Player, GameEvent, GameEventType, Team } from '../types';
import { selectMvp, MvpResult } from '../services/geminiService';
import { TrophyIcon, BasketballIcon } from './icons';

interface ScoreboardProps {
  game: Game;
  userRole: UserRole;
}

const ScoreDisplay: React.FC<{ score: number }> = ({ score }) => (
    <div className="text-7xl md:text-9xl font-black text-white font-mono tracking-tighter">
        {score.toString().padStart(2, '0')}
    </div>
);

const ClockDisplay: React.FC<{ time: number }> = ({ time }) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return (
        <div className="text-5xl md:text-7xl font-bold font-mono text-white">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
    );
};

const Scoreboard: React.FC<ScoreboardProps> = ({ game, userRole }) => {
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);
    const [quarter, setQuarter] = useState(1);
    const [gameTime, setGameTime] = useState(12 * 60); // 12 minutes per quarter
    const [shotClock, setShotClock] = useState(24);
    const [isClockRunning, setIsClockRunning] = useState(false);
    const [team1Fouls, setTeam1Fouls] = useState(0);
    const [team2Fouls, setTeam2Fouls] = useState(0);
    const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
    const [activePlayer, setActivePlayer] = useState<Player | null>(null);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [mvpResult, setMvpResult] = useState<MvpResult | null>(null);
    const [isMvpLoading, setIsMvpLoading] = useState(false);

    const isScorekeeper = userRole === UserRole.SCOREKEEPER || userRole === UserRole.SUPER_ADMIN;
    
    const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
    const shotClockTimerRef = useRef<NodeJS.Timeout | null>(null);

    const stopClocks = useCallback(() => {
        if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        if (shotClockTimerRef.current) clearInterval(shotClockTimerRef.current);
        gameTimerRef.current = null;
        shotClockTimerRef.current = null;
    }, []);

    const startClocks = useCallback(() => {
        if (isGameFinished) return;
        gameTimerRef.current = setInterval(() => {
            setGameTime(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        shotClockTimerRef.current = setInterval(() => {
            setShotClock(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
    }, [isGameFinished]);

    useEffect(() => {
        if (isClockRunning) {
            startClocks();
        } else {
            stopClocks();
        }
        return () => stopClocks();
    }, [isClockRunning, startClocks, stopClocks]);
    
    useEffect(() => {
        if (gameTime === 0 && quarter < 4) {
            setIsClockRunning(false);
            addEvent(null, null, GameEventType.QUARTER_END, 0, `End of Quarter ${quarter}`);
        } else if (gameTime === 0 && quarter >= 4) {
            setIsClockRunning(false);
            setIsGameFinished(true);
            addEvent(null, null, GameEventType.GAME_END, 0, `End of Game`);
        }
    }, [gameTime, quarter]);

    const addEvent = (player: Player | null, team: Team | null, type: GameEventType, points: number, description: string) => {
        setGameEvents(prev => [
            { id: prev.length + 1, gameId: game.id, playerId: player?.id ?? null, teamId: team?.id ?? null, type, points, timestamp: new Date(), description },
            ...prev
        ]);
    };

    const handlePlayerAction = (player: Player, team: Team, type: GameEventType, points: number, description: string) => {
        if (!isScorekeeper || isGameFinished) return;

        addEvent(player, team, type, points, `${player.firstName} ${player.lastName} - ${description}`);

        if (points > 0) {
            if (team.id === game.team1.id) setTeam1Score(s => s + points);
            else setTeam2Score(s => s + points);
            setShotClock(24);
        }
        
        if (type === GameEventType.FOUL) {
             if (team.id === game.team1.id) setTeam1Fouls(f => f + 1);
             else setTeam2Fouls(f => f + 1);
        }
        setActivePlayer(null);
    };
    
    const handleNextQuarter = () => {
        if (quarter < 4) {
            setQuarter(q => q + 1);
            setGameTime(12 * 60);
            setShotClock(24);
            setIsClockRunning(false);
            if(quarter % 2 === 0) { // Halftime
              setTeam1Fouls(0);
              setTeam2Fouls(0);
            }
        }
    };
    
    const handleGetMvp = async () => {
        setIsMvpLoading(true);
        const result = await selectMvp(gameEvents, game.team1, game.team2);
        setMvpResult(result);
        setIsMvpLoading(false);
    };

    const actionButtons = useMemo(() => [
        { type: GameEventType.TWO_POINTS_MADE, points: 2, label: '2PT', color: 'bg-green-500 hover:bg-green-600' },
        { type: GameEventType.THREE_POINTS_MADE, points: 3, label: '3PT', color: 'bg-blue-500 hover:bg-blue-600' },
        { type: GameEventType.FREE_THROW_MADE, points: 1, label: 'FT', color: 'bg-teal-500 hover:bg-teal-600' },
        { type: GameEventType.ASSIST, points: 0, label: 'AST', color: 'bg-yellow-500 hover:bg-yellow-600' },
        { type: GameEventType.REBOUND, points: 0, label: 'REB', color: 'bg-purple-500 hover:bg-purple-600' },
        { type: GameEventType.FOUL, points: 0, label: 'FOUL', color: 'bg-red-500 hover:bg-red-600' },
        { type: GameEventType.TURNOVER, points: 0, label: 'TO', color: 'bg-gray-500 hover:bg-gray-600' },
    ], []);

    const PlayerButton: React.FC<{ player: Player; team: Team }> = ({ player, team }) => (
        <button
            onClick={() => setActivePlayer(player)}
            disabled={!isScorekeeper || isGameFinished}
            className="w-full text-left p-2 rounded-md bg-secondary-light hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <span className="font-bold text-white">#{player.jerseyNumber}</span>
            <span className="ml-2 text-gray-300">{player.firstName} {player.lastName}</span>
        </button>
    );
    
    return (
        <div className="space-y-4">
            {/* Main Scoreboard */}
            <div className="bg-secondary rounded-lg shadow-2xl p-4 md:p-6 text-center">
                <div className="grid grid-cols-3 items-center gap-4">
                    {/* Team 1 Info */}
                    <div className="flex flex-col items-center">
                        <img src={game.team1.logoUrl} alt={game.team1.name} className="w-16 h-16 md:w-24 md:h-24 rounded-full mb-2 border-4 border-gray-600" />
                        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">{game.team1.name}</h2>
                        <ScoreDisplay score={team1Score} />
                        <div className="mt-2 text-lg text-gray-300">Fouls: <span className="font-bold text-red-500">{team1Fouls}</span></div>
                    </div>
                    
                    {/* Game Clock & Info */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-2xl md:text-4xl font-bold text-primary">Q{quarter}</div>
                        <ClockDisplay time={gameTime} />
                        <div className="mt-4">
                            <div className="text-sm text-gray-400">SHOT CLOCK</div>
                            <div className="text-3xl font-bold text-primary">{shotClock}</div>
                        </div>
                    </div>

                    {/* Team 2 Info */}
                    <div className="flex flex-col items-center">
                        <img src={game.team2.logoUrl} alt={game.team2.name} className="w-16 h-16 md:w-24 md:h-24 rounded-full mb-2 border-4 border-gray-600" />
                        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">{game.team2.name}</h2>
                        <ScoreDisplay score={team2Score} />
                        <div className="mt-2 text-lg text-gray-300">Fouls: <span className="font-bold text-red-500">{team2Fouls}</span></div>
                    </div>
                </div>
            </div>
            
            {/* Scorekeeper Controls */}
            {isScorekeeper && !isGameFinished && (
                <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
                    <div className="flex justify-center items-center space-x-4 mb-4">
                         <button onClick={() => setIsClockRunning(p => !p)} className={`px-6 py-2 rounded-md font-bold text-white ${isClockRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                            {isClockRunning ? 'Stop Clock' : 'Start Clock'}
                        </button>
                        <button onClick={handleNextQuarter} disabled={isClockRunning || quarter >= 4} className="px-6 py-2 rounded-md font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed">
                            Next Quarter
                        </button>
                    </div>
                    {activePlayer && (
                        <div className="bg-secondary-light p-4 rounded-lg mb-4">
                            <h3 className="text-xl font-bold text-white text-center mb-4">Actions for #{activePlayer.jerseyNumber} {activePlayer.firstName}</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                                {actionButtons.map(action => (
                                    <button
                                        key={action.label}
                                        onClick={() => handlePlayerAction(activePlayer, activePlayer.teamId === game.team1.id ? game.team1 : game.team2, action.type, action.points, action.type)}
                                        className={`p-3 rounded-md text-white font-bold text-sm ${action.color} transition-transform transform hover:scale-105`}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setActivePlayer(null)} className="mt-4 w-full p-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white">Cancel</button>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">{game.team1.name}</h3>
                            <div className="space-y-1">
                                {game.team1.players.map(p => <PlayerButton key={p.id} player={p} team={game.team1} />)}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">{game.team2.name}</h3>
                            <div className="space-y-1">
                                {game.team2.players.map(p => <PlayerButton key={p.id} player={p} team={game.team2} />)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Game End & MVP */}
            {isGameFinished && (
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-3xl font-bold text-primary mb-4">Game Over</h2>
                    {mvpResult ? (
                        <div className="bg-secondary p-6 rounded-lg max-w-md mx-auto animate-fade-in-up">
                            <TrophyIcon className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                            <h3 className="text-2xl font-bold text-white">Most Valuable Player</h3>
                            <p className="text-3xl font-extrabold text-primary my-2">{mvpResult.mvp.playerName}</p>
                            <p className="text-gray-300">{mvpResult.mvp.justification}</p>
                        </div>
                    ) : (
                        <button
                            onClick={handleGetMvp}
                            disabled={isMvpLoading}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-primary hover:bg-primary-dark disabled:bg-gray-500 transition-all text-lg"
                        >
                            {isMvpLoading ? (
                                <>
                                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Analyzing...
                                </>
                            ) : (
                                <>
                                <TrophyIcon className="w-6 h-6"/>
                                Select MVP with AI
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
            
            {/* Event Log */}
            <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-2">Live Event Log</h3>
                <div className="h-64 overflow-y-auto space-y-2">
                    {gameEvents.map(event => (
                        <div key={event.id} className="text-sm p-2 bg-secondary-light rounded-md">
                           <span className="font-mono text-gray-400 mr-2">{event.timestamp.toLocaleTimeString()}</span> 
                           <span className="text-gray-200">{event.description}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Scoreboard;
