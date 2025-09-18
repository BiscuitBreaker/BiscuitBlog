import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-strong border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-white hover:text-accent-teal transition-colors">
              BiscuitBreaker
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link to="/landing" className="text-white/70 hover:text-white transition-colors">
                Landing
              </Link>
              <Link to="/blogs" className="text-white/70 hover:text-white transition-colors">
                Blogs
              </Link>
              <Link to="/memories" className="text-white/70 hover:text-white transition-colors">
                Cooked By Biscuit
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white/70">Hello, {user.name}</span>
                {user.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-white/20"
                  />
                )}
                <Link 
                  to="/admin" 
                  className="text-white/70 hover:text-accent-teal transition-colors"
                >
                  Admin
                </Link>
                <button
                  onClick={logout}
                  className="glass hover:bg-red-500/20 text-white/90 hover:text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <a
                href="/api/auth/google"
                className="glass hover:bg-accent-teal/20 text-white/90 hover:text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;