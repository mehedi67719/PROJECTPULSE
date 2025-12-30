'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { RiDashboardLine, RiUserAddLine, RiTeamLine, RiPulseLine } from 'react-icons/ri';
import { usePathname } from 'next/navigation';
import { FaUserFriends } from 'react-icons/fa';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { name: 'Add Projects', href: '/Dashboard/admin/add-projects', icon: <RiDashboardLine size={20} /> },
        { name: 'Manage Projects', href: '/Dashboard/admin/Manage-Projects', icon: <RiTeamLine size={20} /> },
        { name: 'Projects Health', href: '/Dashboard/admin/Projects-health', icon: <RiPulseLine size={20} /> },
        { name: 'Add Users', href: '/Dashboard/admin/Add-users', icon: <RiUserAddLine size={20} /> },
        { name: 'Manage Users', href: '/Dashboard/admin/Manage-users', icon: <FaUserFriends size={20} /> },
    ];

    return (
        <div className="min-h-screen flex bg-black text-white">

            <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-950 p-6 h-screen">
                <h2 className="text-2xl font-bold text-blue-500 mb-10 tracking-wide">Dashboard</h2>
                <ul className="flex flex-col gap-4">
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={index}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                                    ${isActive
                                        ? 'bg-blue-500/30 text-blue-400 font-semibold'
                                        : 'bg-gray-800/40 hover:bg-blue-500/20 hover:text-blue-400'}`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </aside>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-950 p-6 z-50 md:hidden transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <h2 className="text-2xl font-bold text-blue-500 mb-10 tracking-wide">Dashboard</h2>
                <ul className="flex flex-col gap-4">
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={index}>
                                <Link
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                                    ${isActive
                                        ? 'bg-blue-500/30 text-blue-400 font-semibold'
                                        : 'bg-gray-800/40 hover:bg-blue-500/20 hover:text-blue-400'}`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </aside>

            <div className="flex-1 h-screen flex flex-col">

                <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-blue-500">Dashboard</h2>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-full hover:bg-gray-800 transition"
                    >
                        {sidebarOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                    </button>
                </div>

                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
