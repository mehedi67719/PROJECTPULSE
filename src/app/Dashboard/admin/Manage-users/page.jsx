'use client';
import React, { useEffect, useState } from 'react';
import { FaUserShield, FaUserTie, FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:5000/users");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await fetch(`http://localhost:5000/user/${userId}/role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            const data = await res.json();

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Role Updated!",
                    text: "User role has been updated successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, role: newRole } : user
                    )
                );
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Update Failed",
                    text: data.message,
                });
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update role",
            });
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-10 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold text-blue-500 mb-6">Manage Users</h1>
            <p className="text-gray-300 mb-6">
                View all users and update their roles using the buttons below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user._id} className="bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center">
                            <img
                                src={user.image || "User"}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-blue-500"
                            />
                            <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                            <p className="text-gray-300">{user.email}</p>
                            <span
                                className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${user.role === "admin"
                                        ? "bg-red-500 text-white"
                                        : user.role === "employee"
                                            ? "bg-green-500 text-white"
                                            : "bg-blue-500 text-white"
                                    }`}
                            >
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => handleRoleChange(user._id, "admin")}
                                    disabled={user.role === "admin"}
                                    className={`relative p-3 rounded-full transition text-white group ${user.role === "admin"
                                        ? "bg-red-300 cursor-not-allowed"
                                        : "bg-red-600 hover:bg-red-700"}`
                                    }
                                >
                                    <FaUserShield size={20} />
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">
                                        Make Admin
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleRoleChange(user._id, "employee")}
                                    disabled={user.role === "employee"}
                                    className={`relative p-3 rounded-full transition text-white group ${user.role === "employee"
                                        ? "bg-green-300 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"}`
                                    }
                                >
                                    <FaUserTie size={20} />
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">
                                        Make Employee
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleRoleChange(user._id, "client")}
                                    disabled={user.role === "client"}
                                    className={`relative p-3 rounded-full transition text-white group ${user.role === "client"
                                        ? "bg-blue-300 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"}`
                                    }
                                >
                                    <FaUser size={20} />
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">
                                        Make Client
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 col-span-full text-center">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
