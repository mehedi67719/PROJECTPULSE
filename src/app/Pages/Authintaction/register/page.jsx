"use client";

import React from 'react';
import Link from 'next/link';

const RegisterPage = () => {
    const handleRegister = (e) => {
        e.preventDefault();
        console.log("Registration Attempted");
    };

    const handleGoogleRegister = () => {
        console.log("Registering with Google");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12">
            <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Create Account</h2>
                    <p className="text-gray-400 mt-2">Join us and start your journey</p>
                </div>

                <form className="space-y-4" onSubmit={handleRegister}>
               
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none transition"
                            placeholder="John Doe"
                            required 
                        />
                    </div>

               
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none transition"
                            placeholder="name@example.com"
                            required 
                        />
                    </div>

               
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none transition"
                            placeholder="••••••••"
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg mt-2"
                    >
                        Sign Up
                    </button>
                </form>

           
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-900 text-gray-400 uppercase">Or register with</span>
                    </div>
                </div>

              
                <button 
                    type="button"
                    onClick={handleGoogleRegister}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg transition-all transform active:scale-95"
                >
                    <img 
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                        alt="Google" 
                        className="w-5 h-5"
                    />
                    Sign up with Google
                </button>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    Already have an account? 
                    <Link href="/Pages/Authintaction/login" className="text-blue-500 hover:underline ml-1 font-medium">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;