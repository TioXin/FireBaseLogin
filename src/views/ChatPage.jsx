import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { collection, query, where, orderBy, addDoc, serverTimestamp, onSnapshot, getDoc, doc } from "firebase/firestore";
import Header from '../components/Header';
// import './Chat.css'

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [contact, setContact] = useState(null);
  const myUserId =  auth.currentUser.uid 

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const contactRef = doc(db, 'contacts', id);
        const contactSnap = await getDoc(contactRef);
        if (contactSnap.exists()) {
          setContact(contactSnap.data());
        }
      } catch (error) {
        console.error("Erro ao buscar contato:", error);
      }
    };
  
    fetchContact();
  }, [id]);

  useEffect(() => {
    if (!contact || !contact.contactUserId || !myUserId) return;
  
    const chatKey = [myUserId, contact.contactUserId].sort().join('_');
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, where('chatKey', '==', chatKey), orderBy('timestamp', 'asc'));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesList);
    });
  
    return () => unsubscribe();
  }, [contact, myUserId]);

   
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !contact || !contact.contactUserId) return;

    const chatKey = [myUserId, contact.contactUserId].sort().join('_');

    try {
      await addDoc(collection(db, 'messages'), {
        contactId: id,
        senderId: myUserId,
        chatKey,
        text: newMessage,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };


  return (
	<>
	  <Header pageTitle='💬 Conversa' />
	  
	  {contact && (
		<div className="chat-header">
		  <img src={contact.photo} alt={contact.fullName} className="contact-photo" />
		  <div className="contact-info">
			<h3>{contact.fullName}</h3>
			<p>{contact.phone}</p>
		  </div>
		</div>
	  )}

	  <div className="chat-container">
		<div className="chat-messages">
		  {messages.map(msg => (
			<div key={msg.id} className={`chat-message ${msg.senderId === myUserId ? 'sent' : 'received'}`}>
			  <p>{msg.text}</p>
			</div>
		  ))}
		</div>

		<div className="chat-input">
		<form 
          onSubmit={(e) => {
            e.preventDefault(); // Evita o recarregamento da página
            handleSendMessage();
          }} 
          className="chat-input"
         >
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Digite uma mensagem..."
          />
          <button type="submit">Enviar</button>
        </form>
		</div>
	  </div>
	</>
  );
};

export default Chat;