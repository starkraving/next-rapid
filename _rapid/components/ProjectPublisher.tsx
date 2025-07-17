import React from 'react';
import useRapid from '../hooks/useRapid';

export default function ProjectPublisher() {
  const { allRoutes, selectedRoutes } = useRapid();

  return (
    <section className="bg-white p-6 pt-1 rounded-md shadow-md mt-6 max-w-screen-xl mx-auto format">
        <h2 className="mb-2">Publish Files</h2>
        
        <ul>
            {Object.keys(allRoutes).map((route, index) => (
                <li key={index} className="mb-2">
                    <input
                        type="checkbox"
                        name="selectedRoute"
                        value={route}
                        defaultChecked={selectedRoutes.includes(route)}
                    />
                    <span className="text-gray-700">{route}</span>
                </li>
            ))}
        </ul>
    </section>
  );
}