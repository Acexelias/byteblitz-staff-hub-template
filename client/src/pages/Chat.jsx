import React from 'react';
import ChatRoom from '../components/ChatRoom.jsx';

/**
 * Chat page: wraps the ChatRoom component. Having its own page makes
 * it easy to add to the router and navigation.
 */
export default function Chat() {
  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold mb-2">Team Chat</h2>
      <ChatRoom />
    </div>
  );
}