"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        
       
        console.log("Submitting with:", { email, password });

        const res = await signIn('credentials', {
            email: email, 
            password: password,
            redirect: false,
        });

        if (res?.ok) {
            router.push('/Dashboard'); 
        } else {
            alert("Login Failed! Please check your email and password.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                    <p className="text-gray-400 mt-2">Please enter your details</p>
                </div>

                <form className="space-y-5" onSubmit={handleEmailLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none transition"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white outline-none transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg"
                    >
                        Sign In
                    </button>
                </form>

              
                <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
                    <span className="relative px-2 bg-gray-900 text-gray-400 uppercase text-xs">Or continue with</span>
                </div>

                <button
                    onClick={() => signIn('google', { callbackUrl: '/Dashboard' })}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg transition-all"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Login with Google
                </button>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    Don't have an account?
                    <Link href="/Authintaction/register" className="text-blue-500 hover:underline ml-1 font-medium">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;