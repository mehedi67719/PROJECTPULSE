"use client";
import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/app/page';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Dashboard', href: '/dashboard', color: 'text-white' },
        { name: 'Projects', href: '/projects', color: 'text-white' },
        { name: 'Users', href: '/users', color: 'text-white' },
        { name: 'Risks', href: '/risks', color: 'text-red-400' },
        { name: 'Activity', href: '/activity', color: 'text-white' },
    ];

    return (
        <nav className="bg-gray-900 text-white shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    <div className="flex-shrink-0">
                        <Link href="/">
                           <Logo/>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name}
                                href={link.href} 
                                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-all ${link.color}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        <div className="flex items-center space-x-3 border-l border-gray-700 pl-4 ml-2">
                            <span className="text-xs text-gray-400">Admin</span>
                            <img 
                                src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" 
                                className="h-8 w-8 rounded-full border border-gray-600" 
                                alt="Admin" 
                            />
                        </div>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className={`${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} md:hidden overflow-hidden bg-gray-800 transition-all duration-300 ease-in-out border-t border-gray-700`}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            href={link.href} 
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 ${link.color}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-700 px-5 flex items-center">
                    <img className="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=Admin+User" alt="Admin" />
                    <div className="ml-3">
                        <div className="text-base font-medium text-white">Admin User</div>
                        <div className="text-sm font-medium text-gray-400">admin@projectpulse.com</div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;