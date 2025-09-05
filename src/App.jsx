  import './App.css'
  import ContactItem from './components/ContactItem';
  import { AuthProvider } from './contexts/AuthContext'; // Importe o AuthProvider
  import { useAuth } from './contexts/AuthContext'; // Importe o hook useAuth
  import ContactList from './views/ContactListPage';
  import LoginPage from './views/LoginPage';
  import MainPage from './views/MainPage';
  import UserProfileForm from './views/UserProfilePage';
  import { Routes, Route  } from 'react-router-dom';


  function App() {
    return (
      <AuthProvider>
        <AuthContent />
      </AuthProvider>
    );
  }

  function AuthContent() {
    const { user } = useAuth(); 
    return (
      <>
        {user ?
          <Routes>
            <Route index element={<ContactList />} />
            <Route path="/user-prof" element={<UserProfileForm />} />
            <Route path="/add-cont" element={<ContactItem />} />

          </Routes>
        :   
        <LoginPage />}
      </>
    );

  }


  export default App;


