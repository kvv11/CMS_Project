import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DodajClanak = () => {
  const [formData, setFormData] = useState({
    naslov: '',
    sadrzaj: '',
    kategorija: '',
    slike: [],
    ocjena: 0, 
    novinarId: localStorage.getItem('userId') 
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { naslov, sadrzaj, kategorija } = formData;
    const isFormValid = naslov && sadrzaj && kategorija && selectedFiles.length > 0;
    setIsSubmitDisabled(!isFormValid);
  }, [formData, selectedFiles]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      kategorija: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const invalidFiles = files.filter(file => file.type !== 'image/jpeg');

    if (invalidFiles.length > 0) {
      setErrorMessage('Slika mora biti .jpg formata!');
      setSelectedFiles([]);
      setIsSubmitDisabled(true);
    } else {
      setErrorMessage('');
      setSelectedFiles(files);
      const { naslov, sadrzaj, kategorija } = formData;
      const isFormValid = naslov && sadrzaj && kategorija && files.length > 0;
      setIsSubmitDisabled(!isFormValid);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const slike = [];
    for (const file of selectedFiles) {
      const base64 = await convertToBase64(file);
      slike.push({ slika: base64 });
    }

    const data = { ...formData, slike };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://localhost:5001/clanci', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error('There was an error adding the article!', error);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-6 text-center">Dodaj Članak</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="naslov">
            Naslov
          </label>
          <input
            type="text"
            name="naslov"
            id="naslov"
            value={formData.naslov}
            onChange={handleChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="sadrzaj">
            Sadržaj
          </label>
          <textarea
            name="sadrzaj"
            id="sadrzaj"
            value={formData.sadrzaj}
            onChange={handleChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="kategorija">
            Kategorija
          </label>
          <select
            name="kategorija"
            id="kategorija"
            value={formData.kategorija}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            required
          >
            <option value="">Odaberite kategoriju</option>
            <option value="Sport">Sport</option>
            <option value="Politika">Politika</option>
            <option value="Zabava">Zabava</option>
            <option value="Vrijeme">Vrijeme</option>
            <option value="TV">TV</option>
            <option value="Razno">Razno</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="slike">
            Slike
          </label>
          <input
            type="file"
            name="slike"
            id="slike"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            required
          />
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`w-full px-4 py-2 font-bold text-white rounded-lg focus:outline-none focus:shadow-outline ${isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
            disabled={isSubmitDisabled}
          >
            Dodaj
          </button>
        </div>
      </form>
    </div>
  );
};

export default DodajClanak;
