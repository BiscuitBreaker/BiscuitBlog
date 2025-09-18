import React from 'react';
import { useQuery } from 'react-query';
import { memoriesAPI, Memory } from '../services/api';
import { Calendar, Heart, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Memories: React.FC = () => {
  const { data, isLoading, error } = useQuery(
    'memories',
    memoriesAPI.getAll,
    { refetchOnWindowFocus: false }
  );

  const memories = data?.data.memories || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimelineDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Error Loading Memories</h2>
          <p className="text-white/70">Unable to fetch memories. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cooked By Biscuit
          </h1>
          <p className="text-xl text-white/70">
            A collection of moments that shaped our journey
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
          </div>
        )}

        {/* Memories Timeline */}
        {!isLoading && memories.length > 0 && (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-accent-teal via-accent-blue to-accent-pink"></div>

            <div className="space-y-12">
              {memories.map((memory: Memory, index: number) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-teal rounded-full border-4 border-bg z-10"></div>

                  {/* Memory Card */}
                  <div className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <div className="glass p-6 rounded-lg hover:scale-[1.02] transition-all duration-300">
                      {/* Date Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-accent-teal/20 text-accent-teal px-3 py-1 rounded-full text-sm font-medium border border-accent-teal/30">
                          {formatTimelineDate(memory.date)}
                        </span>
                        <div className="flex items-center gap-2 text-white/50 text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(memory.date)}
                        </div>
                      </div>

                      {/* Memory Image */}
                      {memory.image && (
                        <div className="mb-4 rounded-lg overflow-hidden border border-white/10">
                          <img
                            src={memory.image}
                            alt={memory.title}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Memory Content */}
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {memory.title}
                      </h3>

                      {memory.description && (
                        <p className="text-white/70 mb-4">
                          {memory.description}
                        </p>
                      )}

                      {memory.content && (
                        <div className="text-white/80 text-sm leading-relaxed">
                          <p>{memory.content}</p>
                        </div>
                      )}

                      {/* Memory Stats */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1 text-white/50 text-sm">
                          <Heart className="w-4 h-4" />
                          Memory
                        </div>
                        {memory.image && (
                          <div className="flex items-center gap-1 text-white/50 text-sm">
                            <ImageIcon className="w-4 h-4" />
                            Photo
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && memories.length === 0 && (
          <div className="glass p-12 rounded-lg text-center">
            <div className="w-16 h-16 bg-accent-teal/20 border border-accent-teal/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-accent-teal" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">No Memories Yet</h2>
            <p className="text-white/70 mb-6">
              The memory timeline is empty. Start creating beautiful memories to share with the world.
            </p>
            <div className="text-sm text-gray-500">
              Admins can add memories through the admin panel
            </div>
          </div>
        )}

        {/* Stats */}
        {!isLoading && memories.length > 0 && (
          <div className="mt-16 glass p-6 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Memory Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{memories.length}</div>
                  <div className="text-sm text-gray-400">Total Memories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {memories.filter(m => m.image).length}
                  </div>
                  <div className="text-sm text-gray-400">With Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {new Set(memories.map(m => formatTimelineDate(m.date))).size}
                  </div>
                  <div className="text-sm text-gray-400">Years Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {Math.min(...memories.map(m => formatTimelineDate(m.date)))}
                  </div>
                  <div className="text-sm text-gray-400">First Year</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Memories;