import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Profil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [korisnik, setKorisnik] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [noviOpis, setNoviOpis] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchKorisnik = async () => {
      try {
        const response = await axios.get(`https://localhost:5001/osobe/${id}`);
        setKorisnik(response.data);
        const currentUserId = localStorage.getItem('userId');
        setIsOwner(response.data.id === currentUserId);
        const userRole = localStorage.getItem('role');
        setIsAdmin(userRole === 'Admin');
      } catch (error) {
        console.error('There was an error fetching the korisnik!', error);
      }
    };

    fetchKorisnik();
  }, [id]);

  const handleEditOpis = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://localhost:5001/osobe/${id}`,
        { id, opisProfila: noviOpis },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setKorisnik((prevKorisnik) => ({
        ...prevKorisnik,
        opisProfila: noviOpis,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('There was an error updating the profile!', error);
    }
  };

  const handleDeleteProfil = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:5001/osobe/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/logout');
    } catch (error) {
      console.error('There was an error deleting the profile!', error);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4 flex justify-center">
      {korisnik ? (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png"
            alt="Profil"
            className="w-24 h-24 rounded-full"
          />
          <div className="mt-4">
            <p className="text-xl font-bold">{korisnik.ime} {korisnik.prezime}</p>
            <p className="text-lg">Uloga: {korisnik.uloga}</p>
            <p className="text-lg">Datum Registracije: {new Date(korisnik.datumRegistracije).toLocaleDateString('hr-HR')}</p>
            <p className="text-lg">Opis profila: {korisnik.opisProfila}</p>
            {isOwner && (
              <>
                <p className="text-lg">Vaš email: {korisnik.email}</p>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
                  >
                    Uredi opis profila
                  </button>
                  {(!isAdmin || !isOwner) && (
                    <button
                      onClick={handleDeleteProfil}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-200"
                    >
                      Izbriši profil
                    </button>
                  )}
                </div>
                {isEditing && (
                  <div className="mt-4">
                    <textarea
                      value={noviOpis}
                      onChange={(e) => setNoviOpis(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Novi opis profila"
                    />
                    <div className="mt-4 space-x-2">
                      <button
                        onClick={handleEditOpis}
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-700 transition duration-200"
                      >
                        Spremi
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700 transition duration-200"
                      >
                        Odustani
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            {isAdmin && !isOwner && (
              <div className="mt-4 space-x-2">
                <button
                  onClick={handleDeleteProfil}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-200"
                >
                  Izbriši profil
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Učitavanje profila...</p>
      )}
    </div>
  );
};

export default Profil;
