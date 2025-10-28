
import React, { useState } from 'react';
import { UserRole, Page, Game } from '../types';
import { BasketballIcon, BarChartIcon } from './icons';

interface HeaderProps {
  userRole: UserRole;
  onLogout: () => void;
  navigateTo: (page: Page, game?: Game) => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, onLogout, navigateTo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { page: Page.DASHBOARD, label: 'Dashboard', icon: <BasketballIcon className="w-5 h-5" /> },
    { page: Page.PLAYER_STATS, label: 'Player Stats', icon: <BarChartIcon className="w-5 h-5" /> },
  ];

  const renderNavLinks = (isMobile: boolean) => (
    navItems.map(item => (
        <button
            key={item.label}
            onClick={() => {
                navigateTo(item.page);
                if (isMobile) setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-secondary-light hover:text-white transition-colors"
        >
            {item.icon}
            <span>{item.label}</span>
        </button>
    ))
  );

  return (
    <header className="bg-secondary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 text-white">
              <BasketballIcon className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">HoopsHub</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {renderNavLinks(false)}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <span className="text-gray-400 text-sm mr-4">Role: {userRole}</span>
              <button
                onClick={onLogout}
                className="bg-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-secondary-light inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-secondary-light focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderNavLinks(true)}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{userRole}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={onLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
