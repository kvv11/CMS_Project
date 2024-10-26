import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

const Clanak = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clanak, setClanak] = useState(null);
  const [komentari, setKomentari] = useState([]);
  const [newKomentar, setNewKomentar] = useState('');
  const [ocjena, setOcjena] = useState('');
  const [osobe, setOsobe] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);
  const [confirmDeleteKomentarModalIsOpen, setConfirmDeleteKomentarModalIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prosjekOcjena, setProsjekOcjena] = useState(0);
  const [userId, setUserId] = useState('');
  const [komentarToDelete, setKomentarToDelete] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isNovinar, setIsNovinar] = useState(false);

  useEffect(() => {
    const fetchClanak = async () => {
      try {
        const response = await axios.get(`https://localhost:5001/clanci/${id}`);
        setClanak(response.data);
      } catch (error) {
      }
    };

    const fetchKomentari = async () => {
      try {
        const response = await axios.get(`https://localhost:5001/komentari/${id}`);
        setKomentari(response.data);

        const ocjene = response.data.map(k => k.ocjena);
        const prosjek = ocjene.reduce((a, b) => a + b, 0) / ocjene.length || 0;
        setProsjekOcjena(prosjek);
        console.log(response.data);
      } catch (error) {
      }
    };

    const fetchOsobe = async () => {
      try {
        const response = await axios.get('https://localhost:5001/osobe');
        setOsobe(response.data);
        console.log(response.data);
      } catch (error) {
      }
    };

    fetchClanak();
    fetchKomentari();
    fetchOsobe();
    checkUserRole();

    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setUserId(localStorage.getItem('userId'));
    const role = localStorage.getItem('userRole');

  }, [id]);

  const checkUserRole = () => {
    const role = localStorage.getItem('role');
    if (role === 'Novinar') {
      setIsNovinar(true);
    }
    if (role === 'Admin') {
      setIsAdmin(true);
    }
  };

  const handleKomentarSubmit = async (e) => {
    e.preventDefault();
    if (newKomentar.length < 3) {
      alert('Komentar mora sadržavati barem 3 slova.');
      return;
    }
    if (!ocjena || ocjena === 'Odaberite') {
      alert('Molimo odaberite ocjenu.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!userId) {
      console.error(error);
      return;
    }
    try {
      const komentar = {
        citateljId: userId,
        clanakId: parseInt(id),
        sadrzaj: newKomentar,
        ocjena: ocjena,
        datumKreiranja: new Date().toISOString()
      };
      await axios.post('https://localhost:5001/komentari', komentar, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewKomentar('');
      setOcjena('');
      const responseKomentari = await axios.get(`https://localhost:5001/komentari/${id}`);
      setKomentari(responseKomentari.data);

      const ocjene = responseKomentari.data.map(k => k.ocjena);
      const prosjek = ocjene.reduce((a, b) => a + b, 0) / ocjene.length || 0;
      setProsjekOcjena(prosjek);
    } catch (error) {
      console.error( error);
    }
  };

  const getOsobaIme = (osobaId) => {
    const osoba = osobe.find(osoba => osoba.id === osobaId);
    return osoba ? (
      <span
        className="text-blue-500 hover:underline cursor-pointer"
        onClick={() => navigate(`/profil/${osobaId}`)}
      >
        {osoba.ime} {osoba.prezime}
      </span>
    ) : 'Nepoznato';
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? clanak.slike.length - 1 : prevIndex - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === clanak.slike.length - 1 ? 0 : prevIndex + 1));
  };

  const handleEditClanak = () => {
    navigate(`/uredi-clanak/${clanak.id}`);
  };

  const handleDeleteClanak = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://localhost:5001/clanci/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfirmDeleteModalIsOpen(false);
      navigate('/');
    } catch (error) {
    }
  };

  const handleDeleteKomentar = async () => {
    if (!komentarToDelete) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://localhost:5001/komentari/${komentarToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKomentari(komentari.filter(k => k.id !== komentarToDelete));
      setConfirmDeleteKomentarModalIsOpen(false);
      setKomentarToDelete(null);
    } catch (error) {
    }
  };

  const hasCommented = komentari.some(k => k.citateljId === userId);

  return (
    <div className="container mx-auto px-4 py-8">
      {clanak ? (
        <div className="bg-white p-6 rounded-lg shadow-md relative">
          {(clanak.novinarId === userId || isAdmin) && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <button 
                onClick={handleEditClanak} 
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-200"
              >
                Uredi Članak
              </button>
              <button 
                onClick={() => setConfirmDeleteModalIsOpen(true)} 
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
              >
                Izbriši Članak
              </button>
            </div>
          )}
          <h1 className="text-3xl font-bold mb-1 mt-16">{clanak.naslov}</h1>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <p>Datum objave: {new Date(clanak.datumKreiranja).toLocaleDateString('hr-HR')}</p>
            <p>Kategorija: {clanak.kategorija}</p>
          </div>
          {clanak.slike.length > 0 && (
            <img 
              src={`data:image/jpeg;base64,${clanak.slike[0].slika}`} 
              alt="Main" 
              className="w-full mb-4 cursor-pointer" 
              onClick={() => openModal(0)} 
            />
          )}
          {clanak.slike.length > 1 && (
            <div className="flex justify-center mb-6">
              {clanak.slike.slice(1).map((slika, index) => (
                <img
                  key={index}
                  src={`data:image/jpeg;base64,${slika.slika}`}
                  alt={`Additional ${index}`}
                  className="w-24 h-24 object-cover mx-1 cursor-pointer"
                  onClick={() => openModal(index + 1)}
                />
              ))}
            </div>
          )}
          <p className="text-gray-700 text-lg mb-3">{clanak.sadrzaj}</p>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <p>Ocjena čitatelja: {prosjekOcjena.toFixed(2)}</p>
            <p className="text-lg">Članak napisao: {getOsobaIme(clanak.novinarId)}</p>
          </div>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Komentari</h2>
          {komentari.length > 0 ? (
            komentari.map((komentar) => (
              <div key={komentar.id} className="bg-gray-100 p-4 mb-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex">
                    <img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png" alt="Avatar" className="w-8 h-8 mr-2" />
                    <div>
                      <p className="text-sm text-gray-700 font-bold inline">
                        <span
                          className="text-blue-500 hover:underline cursor-pointer"
                          onClick={() => navigate(`/profil/${komentar.citateljId}`)}
                        >
                          {getOsobaIme(komentar.citateljId)}
                        </span>: 
                      </p>
                      <p className="text-gray-700 inline">   {komentar.sadrzaj}</p>
                      <p className="text-sm text-left text-gray-500 mt-1">Datum objave: {new Date(komentar.datumKreiranja).toLocaleDateString('hr-HR')} | Ocjena: {komentar.ocjena}</p>
                    </div>
                  </div>
                  {(komentar.citateljId === userId || isAdmin) && (
                    <button 
                      onClick={() => {
                        setKomentarToDelete(komentar.id);
                        setConfirmDeleteKomentarModalIsOpen(true);
                      }}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                    >
                      Obriši
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">Ovaj članak još nema komentara.</p>
          )}
          <h2 className="text-2xl font-semibold mt-6 mb-4">Komentirajte članak:</h2>
          {isAuthenticated ? (
            isNovinar || isAdmin ? (
              <p className="text-gray-700">Komentirati mogu samo čitatelji.</p>
            ) : hasCommented ? (
              <p className="text-gray-700">Već ste komentirali članak.</p>
            ) : (
              <form onSubmit={handleKomentarSubmit}>
                <textarea
                  value={newKomentar}
                  onChange={(e) => setNewKomentar(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                  placeholder="Vaš komentar"
                  required
                  minLength="3"
                />
                <p>Ocijenite članak:</p>
                <select
                  value={ocjena}
                  onChange={(e) => setOcjena(parseInt(e.target.value))}
                  className="w-full p-2 mb-4 border rounded"
                  required
                >
                  <option value="" disabled>Odaberite</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Pošalji
                </button>
              </form>
            )
          ) : (
            <p className="text-gray-700">Prijavite se kako biste mogli objaviti komentar.</p>
          )}
        </div>
      ) : (
        <p className="text-gray-700">Učitavanje članka...</p>
      )}

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal} 
        className="flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        {clanak && (
          <div className="relative">
            <img 
              src={`data:image/jpeg;base64,${clanak.slike[currentImageIndex].slika}`} 
              alt={`Image ${currentImageIndex}`} 
              className="max-h-screen max-w-screen" 
            />
            <button onClick={previousImage} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-75 px-4 py-2 m-2 rounded">
              Previous
            </button>
            <button onClick={nextImage} className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-75 px-4 py-2 m-2 rounded">
              Next
            </button>
            <button onClick={closeModal} className="absolute top-0 right-0 bg-white bg-opacity-75 px-4 py-2 m-2 rounded">
              Close
            </button>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal} 
        className="flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        {clanak && (
          <div className="relative">
            <img 
              src={`data:image/jpeg;base64,${clanak.slike[currentImageIndex].slika}`} 
              alt={`Image ${currentImageIndex}`} 
              className="max-h-screen max-w-screen" 
            />
            <button onClick={previousImage} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-75 px-4 py-2 m-2 rounded">
              Previous
            </button>
            <button onClick={nextImage} className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-75 px-4 py-2 m-2 rounded">
              Next
            </button>
            <button onClick={closeModal} className="absolute top-0 right-0 bg-white bg-opacity-75 px-4 py-2 m-2 rounded">
              Close
            </button>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={confirmDeleteModalIsOpen} 
        onRequestClose={() => setConfirmDeleteModalIsOpen(false)} 
        className="flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto">
          <h2 className="text-xl font-bold mb-4">Potvrda brisanja</h2>
          <p className="text-gray-700 mb-4">Jeste li sigurni da želite obrisati ovaj članak?</p>
          <div className="flex justify-end">
            <button 
              onClick={() => setConfirmDeleteModalIsOpen(false)} 
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200 mr-2"
            >
              Odustani
            </button>
            <button 
              onClick={handleDeleteClanak} 
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
            >
              Izbriši
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={confirmDeleteKomentarModalIsOpen} 
        onRequestClose={() => setConfirmDeleteKomentarModalIsOpen(false)} 
        className="flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto">
          <h2 className="text-xl font-bold mb-4">Potvrda brisanja</h2>
          <p className="text-gray-700 mb-4">Jeste li sigurni da želite obrisati ovaj komentar?</p>
          <div className="flex justify-end">
            <button 
              onClick={() => setConfirmDeleteKomentarModalIsOpen(false)} 
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200 mr-2"
            >
              Odustani
            </button>
            <button 
              onClick={handleDeleteKomentar} 
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
            >
              Izbriši
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Clanak;

