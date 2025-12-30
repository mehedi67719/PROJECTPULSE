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

    const getStatusColor = (status, endDate) => {
        const today = new Date();
        const projectEnd = endDate ? new Date(endDate) : null;

        if (projectEnd && projectEnd < today) return "bg-gray-700"; 
        switch (status?.toLowerCase()) {
            case "on track":
                return "bg-green-500";
            case "pending":
                return "bg-yellow-500";
            case "at risk":
                return "bg-orange-500";
            case "critical":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getStatusText = (status, endDate) => {
        const today = new Date();
        const projectEnd = endDate ? new Date(endDate) : null;

        if (projectEnd && projectEnd < today) return "Completed";
        return status || "Pending";
    };

    return (
        <div className="min-h-screen max-w-[95%] mx-auto p-6 md:p-10 bg-gray-950 text-white">
            <h1 className="text-3xl font-bold text-blue-500 mb-8">Manage Projects</h1>

            {projects.length === 0 ? (
                <p className="text-gray-400">No projects found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-2xl transition flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-blue-400 mb-2">{project.name}</h2>
                                <p className="text-gray-300 mb-4 line-clamp-3">{project.description || "No description"}</p>
                                <div className="flex justify-between text-gray-400 text-sm mb-3">
                                    <span><strong>Start:</strong> {project.startDate || "N/A"}</span>
                                    <span><strong>End:</strong> {project.endDate || "N/A"}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(project.status, project.endDate)}`}>
                                    {getStatusText(project.status, project.endDate)}
                                </span>

                                <div className="mt-3">
                                    <p className="text-gray-400 mb-1 text-sm">Client</p>
                                    {project.client ? (
                                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">{project.client.name}</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm">No client</span>
                                    )}
                                </div>

                                <div className="mt-3">
                                    <p className="text-gray-400 mb-1 text-sm">Employees</p>
                                    {project.employees?.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {project.employees.map(emp => (
                                                <span key={emp._id} className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">{emp.name}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm">No employees</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageProjects;
