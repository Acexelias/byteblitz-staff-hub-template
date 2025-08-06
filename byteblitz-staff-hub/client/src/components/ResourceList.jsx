import React from 'react';

export default function ResourceList({ resources }) {
  // Group resources by category
  const grouped = resources.reduce((acc, res) => {
    acc[res.category] = acc[res.category] || [];
    acc[res.category].push(res);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.keys(grouped).map((category) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-2 text-text-dark">{category}</h3>
          <ul className="space-y-1">
            {grouped[category].map((item) => (
              <li key={item.id} className="bg-bg-dark border border-bg-light/20 rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-text-dark">{item.title}</p>
                  {item.description && <p className="text-xs text-text-dark/60 mt-1">{item.description}</p>}
                </div>
                <div className="mt-2 md:mt-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Open
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}