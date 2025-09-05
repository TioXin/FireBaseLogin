import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';


const UserProfileForm = () => {

  const pageTitle = "Perfil usuário ";
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    photo: '',
    birthDate: '',
    phone: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

//   const auth = getAuth();
//   const db = getFirestore();

  useEffect(() => {
    // Carrega dados existentes do usuário se houver
    const loadUserData = async () => {
      try {
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            setFormData(userDoc.data());
          }
        }
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados do usuário', err);
        setLoading(false);
      }
    };

    loadUserData();
  }, [auth.currentUser, db]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      if (!auth.currentUser) {
        throw new Error('Usuário não está autenticado');
      }

      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        ...formData,
        email: auth.currentUser.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSuccess(true);
      navigate("/");

    } catch (err) {
      setError('Erro ao salvar dados. Por favor, tente novamente.');
      console.error('Erro:', err);
    }
  };

if (loading) {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="loading-icon"></div>
        <span>Carregando...</span>
      </div>
    </div>
  );
}


  return (
    <>

    <div className="container">
      <Header pageTitle={pageTitle} />
      <h2 className="text-2xl font-bold mb-6">Complete seu Perfil</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Dados salvos com sucesso!
        </div>
      )  }

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

         <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Numero De Telefone
          </label>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Foto URL
          </label>
          <input
            type="text"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Data de Nascimento
          </label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <button type="submit" className="active btn btn-block"        >          Salvar Dados        </button>
      </form>
    </div>
    </>
  );
};

export default UserProfileForm;