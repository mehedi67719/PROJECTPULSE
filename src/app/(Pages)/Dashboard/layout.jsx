import Link from 'next/link';
import React, { Children } from 'react';

const Layout = ({ children }) => {
    return (
        <div className='flex mt-7'>
            <div className='flex flex-col gap-5 max-w-[10%] w-full'>
                <Link href={"/Dashboard/Projects"}>Projects</Link>
                <Link href={"/Dashboard/Users"}>Users</Link>
                <Link href={"/Dashboard/Risks"}>Risks</Link>
                <Link href={"/Dashboard/Activity"}>Activity</Link>
            </div>
            <div className='max-w-[90%] w-full'>
                {
                    children
                }
            </div>
        </div>
    );
};

export default Layout;