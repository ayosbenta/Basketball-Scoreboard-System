
import React from 'react';
import { UserRole } from '../types';
import { BasketballIcon, WhistleIcon, UsersIcon } from './icons';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const RoleCard: React.FC<{ role: UserRole; onClick: () => void; icon: React.ReactNode; description: string }> = ({ role, onClick, icon, description }) => (
  <button
    onClick={onClick}
    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-white text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold">{role}</h3>
    <p className="text-sm text-gray-300 mt-1">{description}</p>
  </button>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const roles = [
    { role: UserRole.VIEWER_FANS, icon: <UsersIcon className="w-12 h-12 text-primary" />, description: "View live scores and standings." },
    { role: UserRole.SCOREKEEPER, icon: <BasketballIcon className="w-12 h-12 text-primary" />, description: "Manage scoring and game events." },
    { role: UserRole.TEAM_COACH_MANAGER, icon: <UsersIcon className="w-12 h-12 text-primary" />, description: "Manage team roster and players." },
    { role: UserRole.COMMITTEE_ADMIN, icon: <WhistleIcon className="w-12 h-12 text-primary" />, description: "Approve teams and validate scores." },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4" style={{ backgroundImage: "url('https://picsum.photos/seed/basketball-court/1920/1080')" }}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 w-full max-w-4xl text-center">
        <div className="flex justify-center items-center gap-4 mb-6">
          <BasketballIcon className="w-16 h-16 text-primary" />
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">HoopsHub</h1>
        </div>
        <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
          The digital colosseum for every dribble, shot, and victory. Select your role to get started.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map(({ role, icon, description }) => (
            <RoleCard key={role} role={role} onClick={() => onLogin(role)} icon={icon} description={description} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
