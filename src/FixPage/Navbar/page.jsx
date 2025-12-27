"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/Component/Logo/page';
import Button from '@/Component/Button/page';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { data: session, status } = useSession();
    const dropdownRef = useRef(null);
    const user = session?.user;


    console.log(user)
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
        let links = [{ name: 'Dashboard', href:'/Dashboard'}];

        if (user.role === 'admin') {
            links.push({ name: 'All Projects', href:'/All-projects' });
            links.push({ name: 'All Teams', href:'/All-teams' });
            links.push({ name: 'All Risks', href: '/all-risks' });
        }

        if (user.role === 'employee') {
            links.push({ name: 'My Tasks', href: '/My-tasks' });
            links.push({ name: 'Submit Check-in', href: '/Dashboard/check-ins' });
            links.push({ name: 'Report Risk', href: '/Dashboard/risks' });
        }

        if (user.role === 'client') {
            links.push({ name: 'Project Health', href: '/Dashboard/status' });
            links.push({ name: 'Give Feedback', href: '/Dashboard/feedback' });
        }

        links.push({ name: 'Activity Log', href: '/timeline' });
        return links;
    };

    const navLinks = getNavLinks();

    return (
        <nav className="bg-gray-950 text-white shadow-2xl border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-18 py-3">

                    <div className="flex-shrink-0">
                        <Link href="/">
                            <Logo />
                        </Link>
                    </div>

                   
                    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 hover:text-blue-400 transition-all"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="flex items-center border-l border-gray-800 pl-4 ml-2">
                            {status === "authenticated" ? (
                                <div className="relative" ref={dropdownRef}>
                                  
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-900 transition-all border border-transparent hover:border-gray-700 focus:outline-none"
                                    >
                                        <div className="text-right hidden lg:block">
                                            <p className="text-sm font-semibold truncate max-w-[120px]">{user.name}</p>
                                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-tight">{user.role}</p>
                                        </div>
                                        <img
                                            src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`}
                                            className="h-10 w-10 rounded-full border-2 border-gray-700 object-cover"
                                            alt="User Profile"
                                        />
                                    </button>

                                 
                                    {isProfileOpen && (
                                        <div
                                            className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-[100] transform origin-top-right animate-in fade-in zoom-in duration-150"
                                            style={{ right: '0px' }} 
                                        >
                                            <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/50 rounded-t-xl">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Authorized As</p>
                                                <p className="text-sm font-bold text-blue-400 truncate">{user.name}</p>
                                                <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <Link href="/my-profile" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2 text-sm hover:bg-gray-800 transition-colors">
                                                    My Profile
                                                </Link>
                                                <Link href="/Dashboard/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2 text-sm hover:bg-gray-800 transition-colors">
                                                    Settings
                                                </Link>
                                            </div>
                                            <div className="border-t border-gray-800 mt-1 pt-1">
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        signOut({ callbackUrl: '/Authintaction/login' });
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-950/40 transition-colors font-medium"
                                                >
                                                    Sign out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : status === "loading" ? (
                                <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Link href='/Authintaction/login'>
                                    <Button className="bg-blue-600 hover:bg-blue-700">Login</Button>
                                </Link>
                            )}
                        </div>
                    </div>

             
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-400 hover:text-white focus:outline-none">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

           
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen border-t border-gray-800 bg-gray-950' : 'max-h-0'}`}>
                <div className="p-4 space-y-4">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                            {link.name}
                        </Link>
                    ))}
                    <hr className="border-gray-800" />
                    {user ? (
                        <div className="space-y-3 px-4 pb-4">
                            <div className="flex items-center gap-3">
                                <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}`} className="h-10 w-10 rounded-full border border-gray-700" alt="" />
                                <div>
                                    <p className="text-sm font-bold">{user.name}</p>
                                    <p className="text-xs text-blue-400 uppercase tracking-widest">{user.role}</p>
                                </div>
                            </div>
                            <button onClick={() => signOut()} className="w-full text-center py-2.5 text-red-400 bg-red-950/20 rounded-lg font-bold">Log out</button>
                        </div>
                    ) : (
                        <Link href='/Authintaction/login' onClick={() => setIsOpen(false)} className="block text-center bg-blue-600 py-2.5 rounded-lg font-bold">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;