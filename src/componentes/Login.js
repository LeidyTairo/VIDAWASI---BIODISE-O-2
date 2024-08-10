import React, { useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import '../styles/login.css';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado:', userCredential.user);

      // Aquí puedes redirigir al usuario a la página adecuada según su tipo
      // Esto depende de cómo estés almacenando el tipo de usuario en Firestore
      // Si tienes un campo en Firestore con el tipo de usuario, lo puedes obtener así:
      const userDoc = await getDoc(doc(getFirestore(), "usuarios", userCredential.user.uid));
      const userData = userDoc.data();

      if (userData.tipo_usuario === "Personal Medico") {
        navigate(`/medico-main`);
      } else {
        navigate(`/radiologo-main`);
      }

    } catch (error) {
      console.error('Error en la autenticación:', error);
      setError("Error en la autenticación. Por favor, verifica tus credenciales.");
      setEmail("");
      setPassword("");
    }
  };



  return (
    // <form onSubmit={handleLogin}>
    //   <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
    //   <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
    //   <button type="submit">Login</button>
    // </form>
    
    <section className="login-all">
    <div className="login-img-container">
        <img src={require('../img/qualiky.jpeg')} alt="source-img" className="login-image"/>
    </div>
    <section className="login-container">
        <div className="login-subcontainer">
        <h3>Iniciar Sesión</h3>
        <p>Identifícate para continuar</p>
        <form className="login-forms" onSubmit={handleLogin}>
            <p>Email</p>
            <section className="login-forms-c1">
                <MdEmail />
                <input id="email-login" type="text" value={email} onChange={e => setEmail(e.target.value)} />
            </section>
            <p>Contraseña</p>
            <section className="login-forms-c2">
                <RiLockPasswordFill />
                <input id="password-login" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </section>
            {error && <span className="login-error">{error}</span>}
            <div className="botones-opciones">
                <button id="button-regresar" type="button" onClick={() => navigate('/')}>Regresar</button>
                <button id="button-enviar" type="submit">Enviar</button>
            </div>
        </form>
        </div>
    </section>
</section>


  );
};

export default Login;