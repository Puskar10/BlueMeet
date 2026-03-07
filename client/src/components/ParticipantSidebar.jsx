// components/ParticipantSidebar.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ParticipantSidebar = ({ participants = [], isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside 
          className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg"
          initial={{ x: 320 }}
          animate={{ x: 0 }}
          exit={{ x: 320 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">
                Participants <span className="ml-2 text-sm text-gray-500">({participants.length})</span>
              </h3>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Participants List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {participants.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No participants yet</p>
                <p className="text-gray-400 text-xs mt-1">Waiting for others to join...</p>
              </div>
            ) : (
              participants.map((participant, index) => (
                <motion.div
                  key={participant.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  {/* Avatar with status */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-medium">
                      {participant.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>

                  {/* Participant info */}
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">
                        {participant.name}
                        {participant.isLocal && (
                          <span className="ml-2 text-xs text-gray-500">(You)</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-400">● Connected</span>
                      {participant.isLocal && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          Host
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {participants.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-800 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Invite Participants</span>
              </button>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default ParticipantSidebar;