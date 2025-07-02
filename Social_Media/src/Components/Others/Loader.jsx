import React from 'react';
import Navbar from '../Navbar/Navbar';

const Loader = () => {
  return (
    <>
        <Navbar/>

    <div className="fixed inset-0 flex justify-center items-center ">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
    </> 
  );
};

export default Loader;
