import React from 'react'
import Logo from '@/Component/Logo/page'
import { FaFacebookF, FaLinkedinIn, FaGithub } from 'react-icons/fa'

const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer className="bg-gray-950 border-t max-w-[95%] mx-auto border-gray-800 text-gray-400 mt-20">
            <div className="w-full mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                
                <div className="space-y-3">
                    <Logo />
                    <p className="text-sm text-gray-500 leading-relaxed">
                        A smart project management & health monitoring system
                        designed for admins, clients, and employees.
                    </p>
                </div>

               
                <div className="text-sm space-y-2">
                    <p>
                        <span className="text-gray-300 font-medium">System:</span> ProjectPulse
                    </p>
                    <p>
                        <span className="text-gray-300 font-medium">Version:</span> 1.0.0
                    </p>
                    <p>
                        <span className="text-gray-300 font-medium">Status:</span>{' '}
                        <span className="text-green-400">Online</span>
                    </p>
                </div>

               
                <div className="space-y-3 md:text-right">
                    <p className="text-gray-300 font-medium">Connect with us</p>

                    <div className="flex md:justify-end gap-4">
                        <a
                            href="https://www.facebook.com/mehedi.hasana.835189"
                            className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition"
                        >
                            <FaFacebookF className="text-white text-sm" />
                        </a>

                        <a
                            href="https://www.linkedin.com/in/mehedihassanjashore/"
                            className="p-2 rounded-full bg-gray-800 hover:bg-blue-500 transition"
                        >
                            <FaLinkedinIn className="text-white text-sm" />
                        </a>

                        <a
                            href="https://github.com/mehedi67719"
                            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
                        >
                            <FaGithub className="text-white text-sm" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom */}   <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
                © {year} ProjectPulse. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer
