import './App.css'
import { AuthProvider } from './contexts/AuthContext'; // Importe o AuthProvider
import { useAuth } from './contexts/AuthContext'; // Importe o hook useAuth
import AddContactPage from './views/AddContactPage';
import ContactList from './views/ContactListPage';
import LoginPage from './views/LoginPage';
import MainPage from './views/MainPage';
import UserProfileForm from './views/UserProfilePage';
import { Routes, Route } from 'react-router-dom';
import Chat from './views/ChatPage';

function App() {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
}

function AuthContent() {
  const { user } = useAuth(); // Agora o useAuth() deve retornar o valor correto

  return (
    <>
      {user 
      ? 
      <Routes>
          <Route index element={<ContactList />} />
          <Route path="/user-prof" element={<UserProfileForm />} />
          <Route path="/add-cont"  element={<AddContactPage />} />
                  
          <Route path="/chat/:id"  element={<Chat />} />     

      </Routes>      
      
      : <LoginPage />}
    </>
  );
}

export default App;
