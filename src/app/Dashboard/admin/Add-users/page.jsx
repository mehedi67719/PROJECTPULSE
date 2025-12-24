'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AddUsers = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Employee',
        image: '',
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            ...user,
            createdAt: new Date().toISOString()
        };

        try {
            const res = await fetch("http://localhost:5000/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            const data = await res.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'User Created!',
                    text: `${user.name} has been added successfully.`,
                    timer: 2000,
                    showConfirmButton: false,
                });

                setUser({
                    name: '',
                    email: '',
                    password: '',
                    role: 'Employee',
                    image: '',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to create user!',
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong!',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 p-6 md:p-10 flex justify-center items-start">
            <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl p-8 md:p-12">
                <h1 className="text-4xl font-bold text-blue-500 mb-6 text-center">Add New User</h1>
                <p className="text-gray-300 mb-8 text-center">
                    Create a user account with role assignment and profile image.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-300 mb-2 font-medium">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-300 mb-2 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-300 mb-2 font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-300 mb-2 font-medium">Role</label>
                            <select
                                name="role"
                                value={user.role}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                
                                <option value="Employee">Employee</option>
                                <option value="Client">Client</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2 font-medium">Profile Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={user.image}
                            onChange={handleChange}
                            placeholder="Enter image URL"
                            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 transition-all text-white font-bold py-3 rounded-lg shadow-lg"
                    >
                        Create User
                    </button>
                </form>

                <div className="mt-8 p-6 bg-gray-900/50 rounded-xl shadow-inner text-gray-300">
                    <h2 className="text-xl font-semibold text-blue-400 mb-2">User Info Tips</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Use a valid email address for the user account.</li>
                        <li>Assign roles carefully ( Employee, Client).</li>
                        <li>Provide a profile image URL to enhance dashboard visibility.</li>
                        <li>The createdAt field is automatically added on submission.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AddUsers;
