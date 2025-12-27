"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const MyTasks = () => {
    const [projects, setProjects] = useState([]);
    const { data: session } = useSession();
    const user = session?.user;

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                if (!user) return;
                const res = await fetch(
                    `http://localhost:5000/all-projects/${user.email}/${user.role}`
                );
                const data = await res.json();
                setProjects(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProjects();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-200">
                Loading user data...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-4 md:p-6 text-gray-100">
            <h1 className="text-3xl font-bold text-white mb-6">
                📝 My Assigned Projects
            </h1>

            {projects.length === 0 ? (
                <p className="text-gray-400">No projects assigned yet.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all"
                        >
                            <h2 className="text-xl font-semibold text-white mb-2">
                                {project.name}
                            </h2>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                                {project.description}
                            </p>

                            <div className="mb-2">
                                <p className="text-gray-300 text-sm">
                                    <span className="font-semibold">Start:</span>{" "}
                                    {new Date(project.startDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-300 text-sm">
                                    <span className="font-semibold">End:</span>{" "}
                                    {new Date(project.endDate).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="mb-3">
                                <span
                                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                                        project.status === "pending"
                                            ? "bg-yellow-600 text-yellow-100"
                                            : project.status === "on-track"
                                            ? "bg-green-600 text-green-100"
                                            : project.status === "at-risk"
                                            ? "bg-orange-600 text-orange-100"
                                            : "bg-red-600 text-red-100"
                                    }`}
                                >
                                    {project.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="mb-3">
                                <p className="text-gray-300 text-sm font-semibold mb-1">
                                    Client:
                                </p>
                                <p className="text-gray-100 text-sm truncate">
                                    {project.client?.name || "N/A"}
                                </p>
                            </div>

                            <div className="mb-2">
                                <p className="text-gray-300 text-sm font-semibold mb-1">
                                    Team:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.employees?.map((emp) => (
                                        <span
                                            key={emp.email}
                                            className="bg-blue-700 text-white px-2 py-1 rounded-full text-xs"
                                        >
                                            {emp.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all">
                                Submit Weekly Check-in
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTasks;
