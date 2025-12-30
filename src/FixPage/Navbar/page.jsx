"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/Component/Button/page';
import { useSession, signOut } from 'next-auth/react';
import Logo from '@/Component/Logo/page';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { data: session, status } = useSession();
    const dropdownRef = useRef(null);
    const user = session?.user;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getNavLinks = () => {
        if (!user) return [];
        let links = [];
        links.push({ name: 'Home', href: '/' });
        if (user.role === 'admin') {
            links.push({ name: 'Dashboard', href: '/Dashboard' });
            links.push({ name: 'All Projects', href: '/All-projects' });
            links.push({ name: 'All Teams', href: '/All-teams' });
            links.push({ name: 'All Risks', href: '/all-risks' });
        }

        if (user.role === 'employee') {
            links.push({ name: 'My Tasks', href: '/My-tasks' });
            links.push({ name: 'Submit Check-in', href: '/Submit-chake-in' });
            links.push({ name: 'Report Risk', href: '/Report-Risk' });
        }

        if (user.role === 'client') {
            links.push({ name: 'Project Health', href: '/Projects-Health' });
            links.push({ name: 'Give Feedback', href: '/Give-feedback' });
        }


        return links;
    };

    const navLinks = getNavLinks();

    return (
        <nav className="bg-gray-950 text-white border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-[95%] mx-auto px-4">
                <div className="flex justify-between items-center py-3">

                    <Link href="/">
                        <Logo />
                    </Link>

                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 hover:text-blue-400"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="border-l border-gray-800 pl-4 ml-2">
                            {status === "authenticated" ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-900"
                                    >
                                        <div className="hidden lg:block text-right">
                                            <p className="text-sm font-semibold truncate max-w-[120px]">{user.name}</p>
                                            <p className="text-[10px] text-blue-400 uppercase">{user.role}</p>
                                        </div>
                                        <img
                                            src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                                            className="h-10 w-10 rounded-full border border-gray-700"
                                            alt=""
                                        />
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl">
                                            <div className="px-4 py-3 border-b border-gray-800">
                                                <p className="text-sm font-bold text-blue-400 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            <Link href="/my-profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 hover:bg-gray-800">
                                                My Profile
                                            </Link>
                                            <Link href="/Dashboard/settings" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 hover:bg-gray-800">
                                                Settings
                                            </Link>
                                            <button
                                                onClick={() => signOut({ callbackUrl: '/Authintaction/login' })}
                                                className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-950/40"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href="/Authintaction/login">
                                    <Button className="bg-blue-600 hover:bg-blue-700">Login</Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-400">
                        ☰
                    </button>
                </div>
            </div>

            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-gray-950 border-t border-gray-800`}>
                <div className="p-4 space-y-3">
                    {navLinks.map(link => (
                        <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block px-4 py-2 rounded-lg hover:bg-gray-800">
                            {link.name}
                        </Link>
                    ))}
                    {user && (
                        <button onClick={() => signOut()} className="w-full py-2 text-red-400 bg-red-950/30 rounded-lg">
                            Log out
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
