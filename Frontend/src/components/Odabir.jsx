import React from 'react';
import { Link } from 'react-router-dom';

const Odabir = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="w-full max-w-md dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">VUV VIJESTI</h2>
        <div className="mb-4 text-center text-white">
          <p className="mb-2">Vec posjedujete profil?</p>
          <Link to="/login">
            <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 w-full mb-4">
              Login
            </button>
          </Link>
        </div>
        <div className="text-center text-white">
          <p className="mb-2">Ne posjedujete profil?</p>
          <Link to="/register">
            <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200 w-full">
              Registracija
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Odabir;
