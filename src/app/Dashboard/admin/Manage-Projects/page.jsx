"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AssignProject = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedClient, setSelectedClient] = useState({});
    const [selectedEmployees, setSelectedEmployees] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resUsers = await fetch("http://localhost:5000/users");
                const dataUsers = await resUsers.json();
                setUsers(dataUsers || []);

                const resProjects = await fetch("http://localhost:5000/all-projects");
                const dataProjects = await resProjects.json();
                setProjects(dataProjects || []);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    const clients = users?.filter((u) => u.role === "client") || [];
    const employees = users?.filter((u) => u.role === "employee") || [];

    const handleClientSelect = async (projectId, client) => {
        const result = await Swal.fire({
            title: "Assign Client?",
            text: `Are you sure you want to assign ${client.name} as client?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            background: "#1f2937",
            color: "#f9fafb",
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:5000/all-projects/${projectId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ client }),
                });

                if (response.ok) {
                    setSelectedClient((prev) => ({
                        ...prev,
                        [projectId]: client,
                    }));

                    setProjects((prevProjects) =>
                        prevProjects.map((p) =>
                            p._id === projectId ? { ...p, client } : p
                        )
                    );

                    Swal.fire("Success!", `${client.name} assigned successfully`, "success");
                } else {
                    Swal.fire("Error!", "Failed to assign client", "error");
                }
            } catch (error) {
                console.log(error);
                Swal.fire("Error!", "Something went wrong", "error");
            }
        }
    };

    const handleEmployeeSelect = async (projectId, employee) => {
        const result = await Swal.fire({
            title: "Assign Employee?",
            text: `Assign ${employee.name} to this project?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            background: "#1f2937",
            color: "#f9fafb",
        });

        if (result.isConfirmed) {
            try {
                const existingEmployees = selectedEmployees[projectId] || projects.find(p => p._id === projectId)?.employees || [];

                if (!existingEmployees.find((e) => e._id === employee._id)) {
                    const updatedEmployees = [
                        ...existingEmployees,
                        { name: employee.name, email: employee.email, _id: employee._id },
                    ];

                    const response = await fetch(`http://localhost:5000/all-projects/${projectId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ employees: updatedEmployees }),
                    });

                    if (response.ok) {
                        setSelectedEmployees((prev) => ({
                            ...prev,
                            [projectId]: updatedEmployees,
                        }));

                        setProjects((prevProjects) =>
                            prevProjects.map((p) =>
                                p._id === projectId ? { ...p, employees: updatedEmployees } : p
                            )
                        );

                        Swal.fire("Success!", `${employee.name} assigned successfully`, "success");
                    } else {
                        Swal.fire("Error!", "Failed to assign employee", "error");
                    }
                }
            } catch (error) {
                console.log(error);
                Swal.fire("Error!", "Something went wrong", "error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-black p-4 md:p-6 text-gray-100">
            <div className="max-w-7xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-white">
                    📌 Assign Client & Employees
                </h1>

                {projects.map((project) => {
                    const client = project.client || selectedClient[project._id];
                    const employeesList = selectedEmployees[project._id] || project.employees || [];
                    const unassignedEmployees = employees.filter(
                        (emp) => !employeesList.find((e) => e._id === emp._id)
                    );

                    return (
                        <div
                            key={project._id}
                            className="bg-gray-900 rounded-xl shadow-lg p-5 space-y-4"
                        >
                            <div>
                                <h2 className="text-xl font-semibold text-white">{project.name}</h2>
                                <p className="text-sm text-gray-400">
                                    {project.description?.slice(0, 120)}...
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 font-medium text-gray-200">Select Client</label>
                                    {client ? (
                                        <p className="text-green-400 font-medium">{client.name}</p>
                                    ) : (
                                        <select
                                            className="w-full border border-gray-700 rounded-lg p-2 bg-gray-800 text-gray-100"
                                            onChange={(e) => {
                                                const c = clients.find((c) => c._id === e.target.value);
                                                if (c) handleClientSelect(project._id, c);
                                            }}
                                        >
                                            <option value="">Choose client</option>
                                            {clients.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium text-gray-200">Select Employees</label>
                                    {unassignedEmployees.length > 0 ? (
                                        <select
                                            className="w-full border border-gray-700 rounded-lg p-2 bg-gray-800 text-gray-100"
                                            onChange={(e) => {
                                                const emp = employees.find((u) => u._id === e.target.value);
                                                if (emp) handleEmployeeSelect(project._id, emp);
                                            }}
                                        >
                                            <option value="">Choose employee</option>
                                            {unassignedEmployees.map((emp) => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-gray-400">All employees assigned</p>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {employeesList.map((emp) => (
                                            <span
                                                key={emp.email}
                                                className="px-3 py-1 text-sm bg-blue-700 text-white rounded-full"
                                            >
                                                {emp.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AssignProject;
