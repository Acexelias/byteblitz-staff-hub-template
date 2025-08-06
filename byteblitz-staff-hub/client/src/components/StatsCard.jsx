import React from 'react';

export default function StatsCard({ title, value }) {
  return (
    <div className="bg-bg-dark rounded-lg shadow-md p-4 flex flex-col items-start justify-between border border-primary-dark">
      <p className="text-sm text-text-dark/70 uppercase">{title}</p>
      <p className="text-2xl font-semibold text-text-dark mt-2">{value}</p>
    </div>
  );
}