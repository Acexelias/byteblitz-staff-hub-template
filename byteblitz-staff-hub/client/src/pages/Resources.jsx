import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import ResourceList from '../components/ResourceList.jsx';

export default function Resources() {
  const [resources, setResources] = useState([]);

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources');
      setResources(res.data);
    } catch (err) {
      console.error('Failed to fetch resources', err);
    }
  };
  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold">Resource Library</h2>
      <ResourceList resources={resources} />
    </div>
  );
}