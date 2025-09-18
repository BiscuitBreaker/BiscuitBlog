import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Sparkles, Coffee, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Mascot (1/3) */}
      <div className="w-1/3 flex items-center justify-center relative overflow-hidden">
        <div className="relative">
          {/* Animated Background Elements */}
          <motion.div
            className="absolute -top-10 -left-10 text-accent-teal/20"
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Cookie size={80} />
          </motion.div>
          
          <motion.div
            className="absolute -bottom-5 -right-5 text-accent-pink/20"
            animate={{ 
              rotate: -360,
              y: [0, -20, 0]
            }}
            transition={{ 
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Sparkles size={60} />
          </motion.div>

          {/* Main Mascot */}
          <motion.div
            className="glass-strong rounded-full p-8 relative z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: "elastic",
              delay: 0.2
            }}
            whileHover={{ 
              scale: 1.05,
              rotate: [0, -10, 10, 0]
            }}
          >
            <div className="text-6xl mb-4 text-center">🍪</div>
            <motion.div
              className="absolute -top-2 -right-2 text-accent-teal"
              animate={{ 
                rotate: [0, 20, -20, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles size={24} />
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 left-20 text-accent-blue/30"
            animate={{ 
              y: [0, -15, 0],
              x: [0, 5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Coffee size={40} />
          </motion.div>

          <motion.div
            className="absolute bottom-20 left-10 text-accent-pink/30"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <Heart size={35} />
          </motion.div>
        </div>
      </div>

      {/* Right Side - Content (2/3) */}
      <div className="w-2/3 flex items-center justify-center px-12">
        <motion.div
          className="max-w-lg"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Quirky Message */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-sora">
              Hey there,{' '}
              <motion.span
                className="text-accent-teal"
                animate={{ 
                  textShadow: [
                    '0 0 0 transparent',
                    '0 0 20px rgba(45,212,191,0.5)',
                    '0 0 0 transparent'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Cookie Monster!
              </motion.span>
            </h1>
            
            <motion.p
              className="text-xl text-white/80 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Ready to dive into some deliciously{' '}
              <span className="text-accent-pink font-medium">chaotic</span> content?
            </motion.p>
            
            <motion.p
              className="text-lg text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Where code meets cookies and memories get{' '}
              <span className="text-accent-blue font-medium">baked</span> to perfection! 🍪✨
            </motion.p>
          </motion.div>

          {/* Quirky OAuth Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <motion.a
              href="http://localhost:5000/api/auth/google"
              className="group relative inline-flex items-center gap-3 glass-strong px-8 py-4 rounded-full text-white/90 hover:text-white transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent-teal/20 via-accent-blue/20 to-accent-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              
              {/* Button Content */}
              <div className="relative z-10 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  🍪
                </motion.div>
                
                <div className="flex flex-col items-start">
                  <span className="text-lg font-semibold">
                    Let's Get This{' '}
                    <motion.span
                      className="text-accent-teal"
                      animate={{ 
                        color: ['#2dd4bf', '#60a5fa', '#f472b6', '#2dd4bf']
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      Bread!
                    </motion.span>
                  </span>
                  <span className="text-sm text-white/60 group-hover:text-white/80">
                    Sign in with Google (we don't bite... much)
                  </span>
                </div>

                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.div>
              </div>

              {/* Sparkle Effects */}
              <motion.div
                className="absolute top-1 right-1 text-accent-teal"
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <Sparkles size={16} />
              </motion.div>
            </motion.a>
            
            {/* Fun disclaimer */}
            <motion.p
              className="text-xs text-white/40 mt-3 text-center italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              *Only the coolest cookies allowed. 🍪 Terms & Crumbs apply.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;