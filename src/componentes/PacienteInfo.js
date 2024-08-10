import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import './../styles/pacienteInfo.css';

const PacienteInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pacientData, setPacientData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "patients", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPacientData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    // Initialize video.js player
    if (pacientData && pacientData.imagenes) {
      pacientData.imagenes.forEach((url, index) => {
        if (url.endsWith('.mp4')) {
          const player = videojs(`video-${index}`);
          player.src({ src: url, type: 'video/mp4' });
        }
      });
    }
  }, [pacientData]);

  if (!pacientData) {
    return <div className="loading">Cargando...</div>;
  }

  // const handleVideoClick = (event) => {
  //   const videoElement = event.target;

  //   if (videoElement.requestFullscreen) {
  //     videoElement.requestFullscreen();
  //   } else if (videoElement.mozRequestFullScreen) { // Firefox
  //     videoElement.mozRequestFullScreen();
  //   } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
  //     videoElement.webkitRequestFullscreen();
  //   } else if (videoElement.msRequestFullscreen) { // IE/Edge
  //     videoElement.msRequestFullscreen();
  //   }
  // };

  // const renderFile = (url) => {
  //   const fileExtension = url.split('.').pop().toLowerCase();
  //   console.log(`File URL: ${url}`);
  //   console.log(`File Extension: ${fileExtension}`);
    
  //   if (fileExtension.match(/(jpg|jpeg|png|gif)/)) {
  //     return <img src={url} alt="Imagen del paciente" />;
  //   } else if (fileExtension.match(/(mp4|webm|ogg)/)) {
  //     return (
  //       <div className="video-container">
  //         <video controls onClick={handleVideoClick} preload="auto">
  //           <source src={url} type={`video/${fileExtension}`} />
  //           Tu navegador no soporta la reproducción de video.
  //         </video>
  //       </div>
  //     );
  //   } else if (fileExtension === 'dcm' || fileExtension === 'dicom') {
  //     return (
  //       <a href={url} download>
  //         Descargar archivo DICOM
  //       </a>
  //     );
  //   } else {
  //     return (
  //       <a href={url} download>
  //         Descargar archivo
  //       </a>
  //     );
  //   }
  // };

  return (
    <div className="paciente-info">
      <h1>Información del Paciente</h1>
      <div className="info-section">
        <h2>Datos Personales</h2>
        <p><strong>Apellido Paterno:</strong> {pacientData.apellido_paterno}</p>
        <p><strong>Apellido Materno:</strong> {pacientData.apellido_materno}</p>
        <p><strong>Nombres:</strong> {pacientData.nombresCompletos}</p>
        <p><strong>DNI:</strong> {pacientData.dni}</p>
        <p><strong>Fecha de Nacimiento:</strong> {pacientData.fechaNacimiento}</p>
        <p><strong>Edad:</strong> {pacientData.edad}</p>
        <p><strong>Género:</strong> {pacientData.genero}</p>
        <p><strong>Peso:</strong> {pacientData.peso}</p>
        <p><strong>Talla:</strong> {pacientData.talla}</p>
        <p><strong>Fecha de Ingreso:</strong> {pacientData.fechaIngreso}</p>
        <p><strong>Celular de Contacto:</strong> {pacientData.celularContacto}</p>
        <p><strong>Nombre del Servicio:</strong> {pacientData.nombre_servicio}</p>
        <p><strong>Código del Servicio:</strong> {pacientData.codigo_servicio}</p>
      </div>
      <div className="info-section">
        <h2>Detalles de la Imagen</h2>
        <p><strong>Tipo de Imagen:</strong> {pacientData.imagen}</p>
        <p><strong>Región:</strong> {pacientData.region}</p>
        <p><strong>Dimensión:</strong> {pacientData.dimension}</p>
        <p><strong>Equipo:</strong> {pacientData.equipo}</p>
        <p><strong>Tipo de Imagen Específica:</strong> {pacientData.tipo_imagen}</p>
      </div>
      <div className="info-section">
        <h2>Archivos del Paciente</h2>
        <div className="archivos">
          {pacientData.imagenes.map((url, index) => (
            <div key={index} className="archivo">
              {url.endsWith('.mp4') ? (
                <div data-vjs-player>
                  <video id={`video-${index}`} className="video-js vjs-default-skin" controls>
                    <source src={url} type="video/mp4" />
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </div>
              ) : (
                <a href={url} download>
                  Descargar archivo
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
      <button className="back-button" onClick={() => navigate('/')}>Volver</button>
    </div>
  );
};

export default PacienteInfo;
