import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

const Navigacija = () => {
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [logoutModalIsOpen, setLogoutModalIsOpen] = useState(false);
  const userId = localStorage.getItem('userId');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && userId) {
      setIsAuthenticated(true);
      const fetchUserName = async () => {
        try {
          const response = await axios.get(`https://localhost:5001/osobe/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const osoba = response.data;
          setUserName(`${osoba.ime} ${osoba.prezime}`);
          setUserRole(osoba.uloga);
          console.log(`User Role: ${osoba.uloga}`);
        } catch (error) {
          setIsAuthenticated(false); 
        }
      };

      fetchUserName();
    } else {
      setIsAuthenticated(false);
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserName('');
    setUserRole('');
    setLogoutModalIsOpen(false);
    navigate('/odabir');  
  };

  const openLogoutModal = () => {
    setLogoutModalIsOpen(true);
  };

  const closeLogoutModal = () => {
    setLogoutModalIsOpen(false);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-800 w-full fixed top-0 left-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          VUV Vijesti
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to={`/profil/${userId}`} className="text-sm text-gray-700 dark:text-gray-200 hover:underline">
                {userName}
              </Link>
              <button
                onClick={openLogoutModal}
                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Logout
              </button>
            </>
          ) : (
            location.pathname !== '/login' &&
            location.pathname !== '/register' &&
            location.pathname !== '/odabir' && (
              <Link to="/odabir" className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900">
                Login/Registracija
              </Link>
            )
          )}
        </div>
      </div>
      <Modal 
        isOpen={logoutModalIsOpen} 
        onRequestClose={closeLogoutModal} 
        className="flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto">
          <h2 className="text-xl font-bold mb-4">Potvrda odjave</h2>
          <p className="text-gray-700 mb-4">Jeste li sigurni da se želite odjaviti?</p>
          <div className="flex justify-end">
            <button 
              onClick={closeLogoutModal} 
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200 mr-2"
            >
              Odustani
            </button>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
            >
              Odjavi se
            </button>
          </div>
        </div>
      </Modal>
    </nav>
  );
};

export default Navigacija;
