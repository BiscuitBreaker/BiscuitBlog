import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Hero: React.FC = () => {
  const prefersReduced = useReducedMotion();

  return (
    <section className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto mb-6 h-28 w-28 rounded-full overflow-hidden relative">
          <img alt="BiscuitBreaker" src="/avatar.jpg" className="h-full w-full object-cover" />
          {!prefersReduced && (
            <motion.span
              className="absolute inset-0 rounded-full ring-2 ring-white/10"
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(99,102,241,0.3)',
                  '0 0 0 8px rgba(236,72,153,0.15)',
                  '0 0 0 0 rgba(45,212,191,0.25)'
                ] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
        </div>
        <h1 className="font-sora text-4xl font-semibold">BiscuitBreaker</h1>
        <p className="mt-3 text-white/75">Minimal, playful notes and builds.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to="/blogs" className="btn-primary">
            Blogs <span className="text-white/50 text-xs ml-1">(B)</span>
          </Link>
          <Link to="/memories" className="btn-primary">
            Cooked By Biscuit <span className="text-white/50 text-xs ml-1">(C)</span>
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-white/70">
          <a href="#" aria-label="GitHub" className="hover:text-white">
            <Github size={18} />
          </a>
          <a href="#" aria-label="Twitter/X" className="hover:text-white">
            <Twitter size={18} />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-white">
            <Linkedin size={18} />
          </a>
        </div>
      </motion.div>
    </section>
  );
};

const FeaturedPost: React.FC = () => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-white/90">Featured Post</h2>
      <Link to="/blogs/hello-biscuit" className="block glass rounded-lg p-6 transition-all hover:scale-[1.02]">
        <h3 className="text-lg font-medium text-white mb-2">Hello, Biscuit! 🍪</h3>
        <p className="text-white/70 text-sm mb-3">
          Welcome to my new blog! This is where I'll be sharing my thoughts, 
          experiences, and learnings about technology, programming, and life.
        </p>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>5 min read</span>
          <span>•</span>
          <span>Technology</span>
        </div>
      </Link>
    </section>
  );
};

const MemoriesPeek: React.FC = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white/90">Recent Memories</h2>
        <Link to="/memories" className="text-accent-teal text-sm hover:text-white transition">
          View all →
        </Link>
      </div>
      <div className="glass rounded-lg p-6">
        <div className="text-center text-white/50">
          <p className="text-sm">No memories yet.</p>
          <p className="text-xs mt-1">Start creating some magical moments!</p>
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  return (
    <main className="px-6 py-12 bakery-bg">
      <div className="max-w-3xl mx-auto">
        <Hero />
        <div className="mt-12">
          <FeaturedPost />
        </div>
        <div className="mt-12">
          <MemoriesPeek />
        </div>
      </div>
    </main>
  );
};

export default Home;