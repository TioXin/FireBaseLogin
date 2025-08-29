// import { auth } from '../firebase/config.js';
import { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';

function LoginPage() {
    const [loginType, setLoginType] = useState('login');
    const [userCredentials, setUserCredentials] = useState({})
    const [error, setError] = useState('')
    const dict_errors = {
        "auth/weak-password": "A senha é muito fraca. Exija pelo menos 6 caracteres, incluindo números e letras.",
        "auth/invalid-email": "O endereço de e-mail é inválido.",
        "auth/user-not-found": "Não foi encontrada nenhuma conta com este e-mail ou número de telefone.",
        "auth/wrong-password": "A senha está incorreta.",
        "auth/email-already-in-use": "O endereço de e-mail já está sendo usado por outra conta.",
        "auth/operation-not-allowed": "Esta operação não é permitida para este projeto.",
        "auth/user-disabled": "Esta conta de usuário foi desativada.",
        "auth/too-many-requests": "Muitas tentativas de login. Tente novamente mais tarde.",
        "auth/invalid-api-key": "A chave da API fornecida é inválida.",
        "auth/requires-recent-login": "É necessário fazer login recentemente para realizar esta ação.",
        "auth/invalid-credential" : "E-mail ou senha Inválida",
        "auth/missing-password": "Senha inválida"
        // Adicione mais erros aqui conforme necessário
    }

    console.log(auth)

    function handleCredenciais(e) {
        setUserCredentials({...userCredentials,[e.target.name]:e.target.value})
    }

    function handleCriarConta(e) {
        e.preventDefault()
        setError('')

        createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user);
            console.log('Cadastro efetuado com sucesso')
            setError('')
            // ...
        })
        .catch((error) => {
            // const errorCode = error.code;
            setError( dict_errors[error.code] || error.message)
            // ..
        });
    }

    function handleEntrarConta(e) {
        e.preventDefault()
        setError('')

        const auth = getAuth();
        signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user);
            alert(`Login efetuado com sucesso. Usuáio: ${user.email}`);
            setError('')
            // ...
        })
        .catch((error) => {
            // const errorCode = error.code;
            setError( dict_errors[error.code] || error.message)
        });
    }

    const handleGoogleLogin = async(e) => {
        e.preventDefault();
        setError('')

        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)

            const user = result.user
            console.log ('Google login ok', user)
            setError('')

        } catch (error) {
            //const errorCode = error.code;
            setError( dict_errors[error.code] || error.message)
        }
    }

    function handlePasswordReset() {
        const email = prompt('Informe seu Email:')
        sendPasswordResetEmail(auth, email)
    }

    return (
        <>
            <div className="container login-page">
                <section>
                    <h1>Etec Albert Einstein</h1>
                    <p>Entre ou crie uma conta para continuar.</p>
                    <div className="login-type">
                        <button 
                            className={`btn ${loginType === 'login' ? 'selected' : ''}`}
                            onClick={() => setLoginType('login')}>
                            Entrar
                        </button>
                        <button 
                            className={`btn ${loginType === 'signup' ? 'selected' : ''}`}
                            onClick={() => setLoginType('signup')}>
                            Criar Conta
                        </button>
                    </div>
                    <form className="add-form login">
                        <div className="form-control">
                            <label>E-mail *</label>
                            <input onChange={(e) =>{handleCredenciais(e)}} type="text" name="email" placeholder="Informe seu email" />
                        </div>
                        <div className="form-control">
                            <label>Senha *</label>
                            <input onChange={(e) =>{handleCredenciais(e)}} type="password" name="password" placeholder="Informe a senha" />
                        </div>
                        {
                            loginType === 'login' ?
                            <button onClick={(e)=>{handleEntrarConta(e)}} className="active btn btn-block">Entrar</button>
                            : 
                            <button onClick={(e)=>{handleCriarConta(e)}} className="active btn btn-block">Criar Conta</button>
                        }
                        <br />
                        <button onClick={(e) => {handleGoogleLogin(e)}} className="active btn btn-block">Login com Google</button>
                        
                        {<div className='error'>{error}</div>}
                        
                        <p className="forgot-password" onClick={handlePasswordReset}>Esqueci minha senha.</p>
                    </form>
                </section>
            </div>
        </>
    );
}

export default LoginPage;