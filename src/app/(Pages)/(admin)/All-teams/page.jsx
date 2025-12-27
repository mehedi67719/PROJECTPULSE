"use client";
import React, { useEffect, useState } from "react";

const AllTeams = () => {
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

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <div className="max-w-[95%] mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          👥 All Teams
        </h1>

        <div className="hidden md:block bg-gray-900 shadow-lg rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Created</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-4">{index + 1}</td>

                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={user.image}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium">{user.name}</span>
                  </td>

                  <td className="p-4">{user.email}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4 text-sm text-gray-200">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden grid gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-gray-900 rounded-xl shadow p-4 flex gap-4"
            >
              <img
                src={user.image}
                alt=""
                className="w-14 h-14 rounded-full object-cover"
              />

              <div className="flex-1">
                <h2 className="font-semibold text-lg">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>

                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {user.role}
                  </span>

                  <span className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTeams;
