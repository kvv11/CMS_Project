import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UrediClanak = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    naslov: '',
    sadrzaj: '',
    kategorija: '',
    slike: [],
    ocjena: 0,
    novinarId: localStorage.getItem('userId')
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingSlike, setExistingSlike] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    const fetchClanak = async () => {
      const response = await axios.get(`https://localhost:5001/clanci/${id}`);
      setFormData(response.data);
      setExistingSlike(response.data.slike);
    };

    fetchClanak();
  }, [id]);

  useEffect(() => {
    const { naslov, sadrzaj, kategorija } = formData;
    const isFormValid = naslov && sadrzaj && kategorija && (existingSlike.length > 0 || selectedFiles.length > 0);
    setIsSubmitDisabled(!isFormValid);
  }, [formData, existingSlike, selectedFiles]);

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
      const isFormValid = naslov && sadrzaj && kategorija && (existingSlike.length > 0 || files.length > 0);
      setIsSubmitDisabled(!isFormValid);
    }
  };

  const handleImageDelete = async (index, slikaId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:5001/clanci/${id}/slika/${slikaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newSlike = existingSlike.filter((_, i) => i !== index);
      setExistingSlike(newSlike);
      if (newSlike.length === 0 && selectedFiles.length === 0) {
        setIsSubmitDisabled(true);
      }
    } catch (error) {
      console.error('There was an error deleting the image!', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const slike = [...existingSlike];
    for (const file of selectedFiles) {
      const base64 = await convertToBase64(file);
      slike.push({ slika: base64 });
    }

    const data = { ...formData, slike };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://localhost:5001/clanci/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error('There was an error updating the article!', error);
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
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h2 className="text-2xl mb-6 text-center">Uredi Članak</h2>
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
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none h-64"
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
          />
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Postojeće Slike
          </label>
          <div className="flex flex-wrap">
            {existingSlike.map((slika, index) => (
              <div key={index} className="relative w-20 h-20 m-1">
                <img
                  src={`data:image/jpeg;base64,${slika.slika}`}
                  alt="Existing"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => handleImageDelete(index, slika.id)}
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  onClick={() => handleImageDelete(index, slika.id)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`w-full px-4 py-2 font-bold text-white rounded-lg focus:outline-none focus:shadow-outline ${isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
            disabled={isSubmitDisabled}
          >
            Ažuriraj
          </button>
        </div>
      </form>
    </div>
  );
};

export default UrediClanak;
