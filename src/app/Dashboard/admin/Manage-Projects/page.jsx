'use client';

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AssignProject = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const resUsers = await fetch("http://localhost:5000/users");
            const resProjects = await fetch("http://localhost:5000/all-projects");
            setUsers(await resUsers.json());
            setProjects(await resProjects.json());
        };
        fetchData();
    }, []);

    const clients = users.filter(u => u.role === "client");
    const employees = users.filter(u => u.role === "employee");

    const handleClientSelect = async (projectId, client) => {
        const project = projects.find(p => p._id === projectId);
        const today = new Date();
        if (project.endDate && new Date(project.endDate) < today) {
            Swal.fire("Info", "Cannot assign client. Project has ended.", "info");
            return;
        }

        const confirm = await Swal.fire({
            title: "Assign Client?",
            text: `Assign ${client.name} to this project?`,
            icon: "question",
            showCancelButton: true,
            background: "#1f2937",
            color: "#fff",
        });

        if (!confirm.isConfirmed) return;

        const res = await fetch(`http://localhost:5000/all-projects/${projectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client }),
        });

        if (res.ok) {
            setProjects(prev =>
                prev.map(p =>
                    p._id === projectId ? { ...p, client } : p
                )
            );
            Swal.fire("Success", "Client assigned successfully", "success");
        }
    };

    const handleEmployeeSelect = async (projectId, employee) => {
        const project = projects.find(p => p._id === projectId);
        const today = new Date();
        if (project.endDate && new Date(project.endDate) < today) {
            Swal.fire("Info", "Cannot assign employee. Project has ended.", "info");
            return;
        }

        const confirm = await Swal.fire({
            title: "Assign Employee?",
            text: `Assign ${employee.name} to this project?`,
            icon: "question",
            showCancelButton: true,
            background: "#1f2937",
            color: "#fff",
        });

        if (!confirm.isConfirmed) return;

        const existingEmployees = project.employees || [];

        if (existingEmployees.find(e => e._id === employee._id)) {
            Swal.fire("Info", "Employee already assigned", "info");
            return;
        }

        const updatedEmployees = [
            ...existingEmployees,
            { _id: employee._id, name: employee.name, email: employee.email }
        ];

        const res = await fetch(`http://localhost:5000/all-projects/${projectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employees: updatedEmployees }),
        });

        if (res.ok) {
            setProjects(prev =>
                prev.map(p =>
                    p._id === projectId
                        ? { ...p, employees: updatedEmployees, status: "On Track" }
                        : p
                )
            );
            Swal.fire("Success", "Employee assigned successfully", "success");
        }
    };

    const getStatusColor = (status, endDate) => {
        const today = new Date();
        if (endDate && new Date(endDate) < today) return "bg-gray-700"; 
        switch (status?.toLowerCase()) {
            case "on track": return "bg-green-500";
            case "pending": return "bg-yellow-500";
            case "at risk": return "bg-orange-500";
            case "critical": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    const getStatusText = (status, endDate) => {
        const today = new Date();
        if (endDate && new Date(endDate) < today) return "Completed";
        return status || "Pending";
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6 md:p-10">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
                Assign Clients & Employees
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => {
                    const today = new Date();
                    const ended = project.endDate && new Date(project.endDate) < today;

                    return (
                        <div key={project._id} className="bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-white mb-2">{project.name}</h2>
                                <p className="text-gray-300 mb-2">{project.description || "No description"}</p>
                                <div className="flex flex-wrap gap-2 text-sm mb-2">
                                    <span className="px-2 py-1 rounded bg-blue-700 text-white">Start: {project.startDate || "N/A"}</span>
                                    <span className="px-2 py-1 rounded bg-blue-700 text-white">End: {project.endDate || "N/A"}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(project.status, project.endDate)}`}>
                                    {getStatusText(project.status, project.endDate)}
                                </span>

                                <div className="mt-3">
                                    <p className="text-gray-400 mb-1">Client</p>
                                    {project.client ? (
                                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">{project.client.name}</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm">No client</span>
                                    )}
                                </div>

                                <div className="mt-3">
                                    <p className="text-gray-400 mb-1">Employees</p>
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

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <select
                                    className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    defaultValue=""
                                    onChange={e => {
                                        const c = clients.find(x => x._id === e.target.value);
                                        if (c) handleClientSelect(project._id, c);
                                    }}
                                    disabled={ended}
                                >
                                    <option value="">{ended ? "Project Ended" : "Select Client"}</option>
                                    {clients.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>

                                <select
                                    className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    defaultValue=""
                                    onChange={e => {
                                        const emp = employees.find(x => x._id === e.target.value);
                                        if (emp) handleEmployeeSelect(project._id, emp);
                                    }}
                                    disabled={ended}
                                >
                                    <option value="">{ended ? "Project Ended" : "Select Employee"}</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AssignProject;
