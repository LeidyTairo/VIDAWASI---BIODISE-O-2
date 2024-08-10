import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import profilePicPlaceholder from "../img/inicio.png"; // Imagen placeholder
import "../styles/medico.css";
import Loading from "./loading";
import { FaRegUser } from "react-icons/fa";
// import ProfilePicUpload from "./profilepicture";
import HistorialPacientes from "./HistorialPacientes"; // Importa el componente HistorialPacientes
import { uploadProfilePic } from "./utils/uploadProfilePic";
import { FaListAlt } from "react-icons/fa";
import { PiGreaterThan } from "react-icons/pi";
import { TbLogout2 } from "react-icons/tb";
// Para vincularlo con firebase
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";


const Medico = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('perfil'); // Estado para manejar la vista actual
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null); // Referencia al input de archivo
    const auth = getAuth();
    const firestore = getFirestore();
    const user = auth.currentUser;

    useEffect(() => {
        if(!user){
            navigate('/');
            return ;
        }

        const fetchData = async () => {
            try {
                const docRef = doc(firestore,'usuarios', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                   setUserData(docSnap.data());
                   setLoading(false);
                } else {
                    console.log('No se tiene ese usuario')
                }
            } catch (err) {
                console.log('Error al obtener datos del usuario ',err.message);
            }
        };

        fetchData();
    }, [navigate,firestore,user]);

    const handleProfilePicUpload = (path) => {
        setUserData({ ...userData, profile_pic: path });
    };

    const handleLogout = async() => {
        try{
            await signOut(auth);
            navigate('/');
        }catch(error){
            console.log('Error al cerrar sesión', error.message)
        }
        
    };

    const handleImageClick = () => {
        fileInputRef.current.click(); // Dispara el input de archivo cuando se hace clic en la imagen
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadProfilePic(file,handleProfilePicUpload);
        } 
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <section className="medico-main-component">
            <div className="medico-menu">
                <img src={userData.profile_pic ? `/${userData.profile_pic}` : profilePicPlaceholder} alt="Perfil" />
                <p>{`${userData.nombres} ${userData.apellidos}`}</p>
                <p>{userData.email}</p>
                <button onClick={() => setView('perfil')}><FaRegUser /> Perfil</button>
                <div className="medico-menu-funciones">
                    <p><FaListAlt/> Funciones</p>
                    <button onClick={() => setView('historial')}><PiGreaterThan/> Historias de pacientes</button>
                </div>
                <button id="button-cerrarsession-medico-radiologo" onClick={handleLogout}><TbLogout2/> Cerrar Sesión</button>
            </div>
            {view === 'perfil' && (
                <div className="medico-content">
                    <div className="medico-profile">
                        <img
                            src={userData.profile_pic ? `/${userData.profile_pic}` : profilePicPlaceholder}
                            alt="Perfil"
                            onClick={handleImageClick} // Maneja el clic en la imagen
                            style={{ cursor: 'pointer' }} // Cambia el cursor para indicar que la imagen es clicable
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }} // Oculta el input de archivo
                            onChange={handleFileChange} // Maneja el cambio de archivo
                        />
                        <div className="medico-profile-info-radiologo">
                        <h2>{`${userData.nombres} ${userData.apellidos}`}</h2>
                        <h3>Especialista Radiólogo</h3>
                        </div>
                        {/* <ProfilePicUpload onUpload={handleProfilePicUpload} /> */}
                    </div>
                    <div className="profile-info">
                        <div className="profile-info-div">

                        <h2>Datos Personales</h2>
                        <div className="info-box">
                            <p><strong>Nombres:</strong> {userData.nombres}</p>
                            <p><strong>Apellidos:</strong> {userData.apellidos}</p>
                            <p><strong>Edad:</strong> {userData.edad}</p>
                            <p><strong>Fecha de nacimiento:</strong> {new Date(userData.fecha_nacimiento).toLocaleDateString()}</p>
                            <p><strong>Género:</strong> {userData.genero}</p>
                        </div>
                        </div>
                        <div className="profile-info-div">
                        <h2>Datos de la cuenta</h2>
                        <div className="info-box">
                            <p><strong>E-mail:</strong> {userData.email}</p>
                            <p><strong>Celular:</strong> {userData.celular}</p>
                        </div>
                        </div>
                    </div>
                </div>
            )}
            {view === 'historial' && <HistorialPacientes medico='radiologo'/>}
        </section>
    );
}

export default Medico;