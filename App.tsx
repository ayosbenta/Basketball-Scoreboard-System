
import React, { useState, useCallback } from 'react';
import { UserRole, Page, Game } from './types';
import Login from './components/Login';
import Scoreboard from './components/Scoreboard';
import PublicDashboard from './components/dashboards/PublicDashboard';
import CommitteeDashboard from './components/dashboards/CommitteeDashboard';
import TeamDashboard from './components/dashboards/TeamDashboard';
import PlayerStats from './components/PlayerStats';
import Header from './components/Header';
import { initialGame } from './data/mockData';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [selectedGame, setSelectedGame] = useState<Game | null>(initialGame);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage(Page.DASHBOARD);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage(Page.DASHBOARD);
  };
  
  const navigateTo = useCallback((page: Page, game?: Game) => {
    setCurrentPage(page);
    if(game) {
      setSelectedGame(game);
    }
  }, []);

  const renderContent = () => {
    if (!userRole) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case Page.SCOREBOARD:
        return selectedGame ? <Scoreboard game={selectedGame} userRole={userRole} /> : <div>No game selected</div>;
      case Page.PLAYER_STATS:
        return <PlayerStats />;
      case Page.DASHBOARD:
      default:
        switch (userRole) {
          case UserRole.VIEWER_FANS:
            return <PublicDashboard navigateTo={navigateTo} />;
          case UserRole.COMMITTEE_ADMIN:
            return <CommitteeDashboard navigateTo={navigateTo} />;
          case UserRole.TEAM_COACH_MANAGER:
          case UserRole.SCOREKEEPER:
            return <TeamDashboard navigateTo={navigateTo} userRole={userRole} />;
          default:
            return <PublicDashboard navigateTo={navigateTo} />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 font-sans">
      {userRole && <Header userRole={userRole} onLogout={handleLogout} navigateTo={navigateTo} />}
      <main className={userRole ? "p-4 sm:p-6 lg:p-8" : ""}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
