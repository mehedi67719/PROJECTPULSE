'use client';

import React, { useEffect, useState } from 'react';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("http://localhost:5000/all-projects");
                const data = await res.json();
                setProjects(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen max-w-[95%] mx-auto  p-6 md:p-10 bg-gray-950 text-white">
            <h1 className="text-3xl font-bold text-blue-500 mb-8">Manage Projects</h1>

            {projects.length === 0 ? (
                <p className="text-gray-400">No projects found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-2xl transition">
                            <h2 className="text-xl font-bold text-blue-400 mb-2">{project.name}</h2>
                            <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span><strong>Start:</strong> {project.startDate}</span>
                                <span><strong>End:</strong> {project.endDate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageProjects;
