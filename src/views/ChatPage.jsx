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
	// Buscar informações do contato
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

	// Buscar mensagens em tempo real
	const fetchMessages = () => {
	  const messagesRef = collection(db, 'messages');
	  const q = query(messagesRef, where('contactId', '==', id), orderBy('timestamp', 'asc'));

	  return onSnapshot(q, (snapshot) => {
		const messagesList = snapshot.docs.map(doc => ({
		  id: doc.id,
		  ...doc.data()
		}));
		setMessages(messagesList);
	  });
	};

	fetchContact();
	const unsubscribe = fetchMessages();

	return () => unsubscribe(); // Limpa o listener ao desmontar
  }, [id]);

  const handleSendMessage = async () => {
	if (newMessage.trim() === '') return;

	try {
	  await addDoc(collection(db, 'messages'), {
		contactId: id,
		senderId: myUserId,
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
		  <input 
			type="text" 
			value={newMessage} 
			onChange={(e) => setNewMessage(e.target.value)} 
			placeholder="Digite uma mensagem..."
		  />
		  <button onClick={handleSendMessage}>Enviar</button>
		</div>
	  </div>
	</>
  );
};

export default Chat;