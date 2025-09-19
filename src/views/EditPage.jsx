import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';

const EditPage = () => {
  const pageTitle = "Editar Contato";
  const navigate = useNavigate();
  const { contactId } = useParams(); 

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    photo: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (contactId) {
      fetchContactData(contactId); 
    }
  }, [contactId]);

  const fetchContactData = async (id) => {
    try {
      const contactDocRef = doc(db, 'contacts', id);
      const contactSnapshot = await getDoc(contactDocRef);
      if (contactSnapshot.exists()) {
        const data = contactSnapshot.data();

        // Preenchimento seguro dos campos
        setFormData({
          email: data.email || '',
          fullName: data.fullName || '',
          photo: data.photo || '',
          phone: data.phone || ''
        });
      } else {
        setError("Contato não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar o contato:", err);
      setError("Erro ao buscar o contato.");
    }
  };

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

    if (!auth.currentUser) {
      setError('Usuário não autenticado.');
      return;
    }

    if (!formData.fullName || !formData.phone) {
      setError('Nome e telefone são obrigatórios.');
      return;
    }

    try {
      setLoading(true);

      const contactRef = doc(db, 'contacts', contactId);
      await updateDoc(contactRef, {
        fullName: formData.fullName,
        phone: formData.phone,
        photo: formData.photo,
        updatedAt: new Date().toISOString()
      });

      setSuccess(true);
      navigate("/");
    } catch (err) {
      setError(err.message || 'Erro ao atualizar o contato.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header pageTitle={pageTitle} />

      <div className="add-contact-container">
        <h2 className="text-2xl font-bold mb-6">{pageTitle}</h2>

        {error && <div className="user-profile-error">{error}</div>}
        {success && <div className="user-profile-success">Contato atualizado com sucesso!</div>}

        <form onSubmit={handleSubmit} className="user-profile-form">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
          />

          <label>Nome Completo</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label>Foto URL</label>
          <input
            type="text"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
          />

          <label>Telefone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Contato'}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditPage;
