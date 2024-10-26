import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Glavna = () => {
  const [clanci, setClanci] = useState([]);
  const [isNovinar, setIsNovinar] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Najnovije vijesti');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClanci = async () => {
      try {
        const response = await axios.get('https://localhost:5001/clanci');
        setClanci(response.data);
      } catch (error) {
        console.error('There was an error fetching the clanci!', error);
      }
    };

    const checkUserRole = () => {
      const role = localStorage.getItem('role');
      if (role === 'Novinar') {
        setIsNovinar(true);
      }
      if (role === 'Admin') {
        setIsAdmin(true);
      }
    };

    fetchClanci();
    checkUserRole();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredClanci = clanci
    .filter(clanak => clanak.naslov.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(clanak => selectedCategory === 'Najnovije vijesti' || clanak.kategorija === selectedCategory)
    .sort((a, b) => new Date(b.datumKreiranja) - new Date(a.datumKreiranja));

  return (
    <div className="mt-12 container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{selectedCategory}</h1>
        <div className="flex space-x-4">
          {isNovinar && (
            <Link
              to="/dodaj-clanak"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Dodaj Clanak
            </Link>
          )}
          {isAdmin && (
            <>
              <Link
                to="/dodaj-novinara"
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Dodaj Novinara
              </Link>
              <Link
                to="/korisnici"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Pregled korisnika
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Pretraži vijesti..."
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <h2 className="text-xl font-bold mb-2">Odaberite kategoriju</h2>
          <ul className="space-y-2">
            {['Najnovije vijesti', 'Sport', 'Politika', 'Zabava', 'Vrijeme', 'TV', 'Razno'].map(category => (
              <li key={category} className="mb-2">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`text-lg ${selectedCategory === category ? 'font-bold text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-3/4">
          {filteredClanci.length > 0 ? (
            filteredClanci.map((clanak) => (
              <div
                key={clanak.id}
                className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer"
                onClick={() => navigate(`/clanak/${clanak.id}`)}
              >
                <h2 className="text-xl font-bold">{clanak.naslov}</h2>
                <p className="text-gray-600 mb-2">
                  {new Date(clanak.datumKreiranja).toLocaleDateString('hr-HR')} | Kategorija: {clanak.kategorija}
                </p>
                {clanak.slike.length > 0 && (
                  <img
                    src={`data:image/jpeg;base64,${clanak.slike[0].slika}`}
                    alt="Slika"
                    className="w-full h-full object-cover rounded-md mt-2"
                  />
                )}
              </div>
            ))
          ) : (
            <p>Nema dostupnih vijesti.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Glavna;
