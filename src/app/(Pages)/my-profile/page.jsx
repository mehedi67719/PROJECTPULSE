'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { FaUserCircle, FaEnvelope, FaUserShield, FaCheckCircle } from 'react-icons/fa'

const MyProfile = () => {
    const { data: session } = useSession()
    const user = session?.user

    return (
        <div className="min-h-screen bg-gray-950 px-6 py-10 text-white">
            <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-xl overflow-hidden">

                <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 flex items-center gap-6">
                    {user?.image ? (
                        <img
                            src={user.image}
                            alt="profile"
                            className="w-20 h-20 rounded-full object-cover border-2 border-white"
                        />
                    ) : (
                        <FaUserCircle className="text-6xl text-gray-300" />
                    )}
                    <div>
                        <h2 className="text-2xl font-semibold">{user?.name || 'User'}</h2>
                        <p className="text-sm text-gray-300">My Profile</p>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="space-y-2">
                        <p className="text-sm text-gray-400">Full Name</p>
                        <div className="p-3 rounded-lg border border-gray-700 bg-gray-800">
                            {user?.name || 'N/A'}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-400">Email Address</p>
                        <div className="p-3 rounded-lg border border-gray-700 bg-gray-800 flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" />
                            <span>{user?.email || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-400">Role</p>
                        <div className="p-3 rounded-lg border border-gray-700 bg-gray-800 flex items-center gap-2">
                            <FaUserShield className="text-gray-400" />
                            <span>{user?.role || 'User'}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-400">Account Status</p>
                        <div className="p-3 rounded-lg border border-gray-700 bg-green-900 text-green-400 font-medium flex items-center gap-2">
                            <FaCheckCircle />
                            Active
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MyProfile
