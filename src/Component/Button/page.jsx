import React, { Children } from 'react';

const Button = ({children}) => {
    return (
        <button className='text-white font-bold bg-blue-700 rounded-xl py-2 px-4' >{children}</button>
    );
};

export default Button;