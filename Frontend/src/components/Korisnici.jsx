import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Korisnici = () => {
  const [korisnici, setKorisnici] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKorisnici = async () => {
      try {
        const response = await axios.get('https://localhost:5001/osobe');
        setKorisnici(response.data);
      } catch (error) {
        console.error('There was an error fetching the users!', error);
      }
    };

    fetchKorisnici();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredKorisnici = korisnici.filter(
    korisnik =>
      korisnik.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      korisnik.prezime.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 mt-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Korisnici</h1>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Pretraži korisnike..."
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Ime</th>
              <th className="py-2 px-4 border-b">Prezime</th>
              <th className="py-2 px-4 border-b">Uloga</th>
              <th className="py-2 px-4 border-b">Datum Registracije</th>
            </tr>
          </thead>
          <tbody>
            {filteredKorisnici.map(korisnik => (
              <tr
                key={korisnik.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/profil/${korisnik.id}`)}
              >
                <td className="py-2 px-4 border-b">{korisnik.ime}</td>
                <td className="py-2 px-4 border-b">{korisnik.prezime}</td>
                <td className="py-2 px-4 border-b">{korisnik.uloga}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(korisnik.datumRegistracije).toLocaleDateString('hr-HR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Korisnici;
