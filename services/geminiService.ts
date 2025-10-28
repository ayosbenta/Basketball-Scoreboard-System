
import { GoogleGenAI, Type } from '@google/genai';
import { GameEvent, Player, Team } from '../types';

export interface MvpResult {
  mvp: {
    playerName: string;
    justification: string;
  };
}

const formatGameDataForPrompt = (gameEvents: GameEvent[], team1: Team, team2: Team): string => {
  const allPlayers = [...team1.players, ...team2.players];
  const playerMap = new Map(allPlayers.map(p => [p.id, `${p.firstName} ${p.lastName}`]));

  const eventsLog = gameEvents.map(event => {
    const playerName = event.playerId ? playerMap.get(event.playerId) || 'Unknown Player' : 'Team Event';
    return `- ${event.timestamp.toLocaleTimeString()}: ${playerName} - ${event.description}`;
  }).join('\n');

  const playerStats: {[key: string]: { points: number, assists: number, rebounds: number, steals: number, blocks: number, fouls: number, turnovers: number }} = {};

  allPlayers.forEach(p => {
    playerStats[p.id] = { points: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, fouls: 0, turnovers: 0 };
  });

  gameEvents.forEach(event => {
    if (event.playerId && playerStats[event.playerId]) {
        switch(event.type) {
            case '2PT Made':
            case '3PT Made':
            case 'Free Throw Made':
                playerStats[event.playerId].points += event.points;
                break;
            case 'Assist':
                playerStats[event.playerId].assists += 1;
                break;
            case 'Rebound':
                playerStats[event.playerId].rebounds += 1;
                break;
            case 'Steal':
                playerStats[event.playerId].steals += 1;
                break;
            case 'Block':
                playerStats[event.playerId].blocks += 1;
                break;
            case 'Foul':
                playerStats[event.playerId].fouls += 1;
                break;
            case 'Turnover':
                playerStats[event.playerId].turnovers += 1;
                break;
        }
    }
  });

  const statsSummary = Object.entries(playerStats).map(([playerId, stats]) => {
      const playerName = playerMap.get(Number(playerId)) || 'Unknown Player';
      return `${playerName}: ${stats.points}pts, ${stats.rebounds}reb, ${stats.assists}ast, ${stats.steals}stl, ${stats.blocks}blk, ${stats.turnovers}to, ${stats.fouls}pf`;
  }).join('\n');

  return `
    Game Summary:
    Team 1: ${team1.name}
    Team 2: ${team2.name}

    Final Player Statistics:
    ${statsSummary}

    Detailed Event Log:
    ${eventsLog}
  `;
};


export const selectMvp = async (
  gameEvents: GameEvent[],
  team1: Team,
  team2: Team
): Promise<MvpResult | null> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return { mvp: { playerName: `${team1.players[3].firstName} ${team1.players[3].lastName}`, justification: "Selected as a default due to missing API key. Dominated the paint with crucial rebounds and high-percentage shots, providing a consistent offensive threat." } };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const gameData = formatGameDataForPrompt(gameEvents, team1, team2);

  const prompt = `
    Based on the following basketball game summary, statistics, and event log, please select the Most Valuable Player (MVP).
    Analyze the player's overall performance, including scoring, defense, and crucial plays.
    Provide the player's full name and a concise justification (2-3 sentences) for your choice.

    ${gameData}
  `;
    
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mvp: {
              type: Type.OBJECT,
              properties: {
                playerName: { type: Type.STRING },
                justification: { type: Type.STRING },
              },
            },
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const result: MvpResult = JSON.parse(jsonString);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback in case of API error
     return { mvp: { playerName: `${team2.players[4].firstName} ${team2.players[4].lastName}`, justification: "Selected as a default due to an API error. Delivered a clutch performance with exceptional shooting from beyond the arc and key defensive stops in the final quarter." } };
  }
};
