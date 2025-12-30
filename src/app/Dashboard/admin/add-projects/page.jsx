'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AddProjects = () => {
    const [project, setProject] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'pending',
    });

    const handleChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const addProject = async () => {
            try {
                const res = await fetch("https://projectpules-server.onrender.com/all-projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(project)
                });

                const data = await res.json();
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Project Created!',
                        text: 'The project has been added successfully.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    setProject({
                        name: '',
                        description: '',
                        startDate: '',
                        endDate: '',
                        status: 'pending',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed',
                        text: 'Failed to create project.',
                    });
                }
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while creating the project.',
                });
            }
        };

        addProject();
    };

    return (
        <div className="min-h-screen w-full p-6 md:p-10">
            <div className="max-full mx-auto bg-gray-900 rounded-xl shadow-xl p-6 md:p-10">
                
                <h1 className="text-3xl font-bold text-blue-500 mb-6">Add New Project</h1>

                <p className="text-gray-300 mb-6">
                    Use this form to create a new project, assign employees & clients, and track progress.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900/40 p-6 rounded-lg shadow-lg">

                    <div>
                        <label className="block text-gray-300 mb-2 font-medium">Project Name</label>
                        <input
                            type="text"
                            name="name"
                            value={project.name}
                            onChange={handleChange}
                            placeholder="Enter project name"
                            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2 font-medium">Description</label>
                        <textarea
                            name="description"
                            value={project.description}
                            onChange={handleChange}
                            placeholder="Enter project description"
                            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-300 mb-2 font-medium">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={project.startDate}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-300 mb-2 font-medium">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={project.endDate}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 transition-all text-white font-bold py-3 rounded-lg shadow-lg"
                    >
                        Create Project
                    </button>
                </form>

                <div className="mt-8 p-6 bg-gray-900/50 rounded-lg shadow-lg text-gray-300">
                    <h2 className="text-xl font-semibold text-blue-400 mb-2">Project Health Score</h2>
                    <p>
                        Once employees submit weekly progress and clients provide feedback, the system will
                        automatically calculate a health score (0-100).
                        <br />
                        <strong>Interpretation:</strong> 80–100: On Track, 60–79: At Risk, below 60: Critical
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddProjects;
