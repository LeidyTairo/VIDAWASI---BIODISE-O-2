import React, { useState, useRef } from "react";
import './../styles/procesamiento.css';
import { db, storage } from './../firebase/firebaseConfig';  // Asegúrate de importar storage
import { collection, addDoc } from "firebase/firestore";
import {  ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"; // Importa las funciones necesarias de storage
import { useNavigate } from "react-router-dom";

const ProcesamientoImagenes = () => {
  const navigate = useNavigate(); // Inicializa useNavigate
  const [docId,setDocId] = useState(null);
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [nombres, setNombres] = useState("");
  const [dni, setDni] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [peso, setPeso] = useState("");
  const [talla, setTalla] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [celularContacto, setCelularContacto] = useState("");
  const [nombre_servicio, setNombreServicio] = useState("");
  const [codigo_servicio, setCodigoServicio] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [imagen, setImagen] = useState("");
  const [region, setRegion] = useState("");
  const [dimension, setDimension] = useState("");
  const [equipo, setEquipo] = useState("");
  const [tipodeimagen, setTipoImagen] = useState("");

  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    setImagenes([...e.target.files]);
  };

  const resetForm = () => {
    setApellidoPaterno("");
    setApellidoMaterno("");
    setNombres("");
    setDni("");
    setFechaNacimiento("");
    setEdad("");
    setGenero("");
    setPeso("");
    setTalla("");
    setFechaIngreso("");
    setCelularContacto("");
    setNombreServicio("");
    setCodigoServicio("");
    setImagenes([]);
    setImagen("");
    setRegion("");
    setDimension("");
    setEquipo("");
    setTipoImagen("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!apellidoPaterno) newErrors.apellidoPaterno = "Llena el atributo Apellido Paterno";
    if (!apellidoMaterno) newErrors.apellidoMaterno = "Llena el atributo Apellido Materno";
    if (!nombres) newErrors.nombres = "Llena el atributo Nombres";
    if (!dni) newErrors.dni = "Llena el atributo DNI"; else if (dni.length !== 8) newErrors.dni = "El DNI debe tener 8 dígitos.";
    if (!fechaNacimiento) newErrors.fechaNacimiento = "Llena el atributo Fecha de Nacimiento";
    if (!edad) newErrors.edad = "Llena el atributo Edad";
    if (!genero) newErrors.genero = "Llena el atributo Género";
    if (!peso) newErrors.peso = "Llena el atributo Peso";
    if (!talla) newErrors.talla = "Llena el atributo Talla";
    if (!fechaIngreso) newErrors.fechaIngreso = "Llena el atributo Fecha de Ingreso";
    if (!celularContacto) newErrors.celularContacto = "Llena el atributo Celular de Contacto"; else if (celularContacto.length !== 9) newErrors.celularContacto = "El número celular debe tener 9 dígitos.";
    if (!nombre_servicio) newErrors.nombre_servicio = "Llena el atributo Nombre del Servicio";
    if (!codigo_servicio) newErrors.codigo_servicio = "Llena el atributo Código del Servicio";
    if (!imagen) newErrors.imagen = "Selecciona el tipo de imagen";
    if (!region) newErrors.region = "Selecciona la región";
    if (!dimension) newErrors.dimension = "Selecciona la dimensión";
    if (!equipo) newErrors.equipo = "Selecciona el equipo";
    if (!tipodeimagen) newErrors.tipodeimagen = "Selecciona el tipo de imagen específica";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitPacient = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
  
    const pacientData = {
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      nombresCompletos: nombres,
      dni: dni,
      fechaNacimiento: fechaNacimiento,
      edad: edad,
      genero: genero,
      peso: peso,
      talla: talla,
      fechaIngreso: fechaIngreso,
      celularContacto: celularContacto,
      nombre_servicio: nombre_servicio,
      codigo_servicio: codigo_servicio,
      imagen: imagen,
      region: region,
      dimension: dimension,
      equipo: equipo,
      tipo_imagen: tipodeimagen,
    };
  
    try {
      // Subir las imágenes a Firebase Storage y obtener sus URLs
      const imageUrls = await Promise.all(imagenes.map(async (file) => {
        const storageReference = storageRef(storage, `patients/${dni}/${file.name}`);
        await uploadBytes(storageReference, file);
        const downloadURL = await getDownloadURL(storageReference);
        return downloadURL;
      }));
  
      // Añadir URLs de imágenes a los datos del paciente
      pacientData.imagenes = imageUrls;
  
      const docRef = await addDoc(collection(db, "patients"), pacientData);
      console.log("Document written with ID: ", docRef.id);
      setDocId(docRef.id);
      resetForm();
      setSubmitMessage("Paciente añadido correctamente");
    } catch (e) {
      console.error("Error adding document: ", e);
      setSubmitMessage("Error al añadir paciente");
    }
  };
  

  const handleDateChange = (e) => {
    const fechaNacimiento = e.target.value;
    setFechaNacimiento(fechaNacimiento);
    const age = calculateAge(fechaNacimiento);
    setEdad(age);
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  const ref = useRef();
  const ref2 = useRef();

  return (
    <div className="procesamiento-form-container">
      <form onSubmit={submitPacient} className="procesamiento-patient-form">
        <h2 className="procesamiento-form-title">Añadir Paciente</h2>
        <div className="procesamiento-form-row">
          <div className="procesamiento-atributo-error">
            {errors.apellidoPaterno && <span className="error-message">{errors.apellidoPaterno}</span>}
            <input type="text" placeholder="Apellido Paterno" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} />
          </div>
          <div className="procesamiento-atributo-error">
            {errors.apellidoMaterno && <span className="error-message">{errors.apellidoMaterno}</span>}
            <input type="text" placeholder="Apellido Materno" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} />
          </div>
        </div>
        <div className="procesamiento-form-row">
          <div className="procesamiento-atributo-error">
            {errors.nombres && <span className="error-message">{errors.nombres}</span>}
            <input type="text" placeholder="Nombres completos del paciente" value={nombres} onChange={(e) => setNombres(e.target.value)} />
          </div>
        </div>
        <div className="procesamiento-form-row">
          <div className="procesamiento-atributo-error">
            {errors.dni && <span className="error-message">{errors.dni}</span>}
            <input type="text" placeholder="DNI" value={dni} onChange={(e) => setDni(e.target.value)} />
          </div>
          <div className="procesamiento-atributo-error">
            {errors.fechaNacimiento && <span className="error-message">{errors.fechaNacimiento}</span>}
            <input type="input" ref={ref} onFocus={() => (ref.current.type = "date")} onBlur={() => (ref.current.type = "date")} placeholder="Fecha de Nacimiento" value={fechaNacimiento} onChange={handleDateChange} />
          </div>
        </div>
        <div className="procesamiento-form-row">
          <div className="procesamiento-atributo-error">
            {errors.edad && <span className="error-message">{errors.edad}</span>}
            <input type="text" placeholder="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} />
          </div>
          <div className="procesamiento-atributo-error">
            {errors.genero && <span className="error-message">{errors.genero}</span>}
            <select value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value="">Selecciona el género</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </div>
        </div>
        <div className="procesamiento-form-row">
          <div className="procesamiento-atributo-error">
            {errors.peso && <span className="error-message">{errors.peso}</span>}
            <input type="text" placeholder="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} />
          </div>
          <div className="procesamiento-atributo-error">
            {errors.talla && <span className="error-message">{errors.talla}</span>}
            <input type="text" placeholder="Talla" value={talla} onChange={(e) => setTalla(e.target.value)} />
          </div>
        </div>
        <div className="procesamiento-form-row">
          <div className="procesamiento-atributo-error">
            {errors.fechaIngreso && <span className="error-message">{errors.fechaIngreso}</span>}
            <input type="input" ref={ref2} onFocus={() => (ref2.current.type = "date")} onBlur={() => (ref2.current.type = "date")} placeholder="Fecha de ingreso" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} />
          </div>
          <div className="procesamiento-atributo-error">
            {errors.celularContacto && <span className="error-message">{errors.celularContacto}</span>}
            <input type="text" placeholder="Celular de Contacto" value={celularContacto} onChange={(e) => setCelularContacto(e.target.value)} />
          </div>
        </div>
        <div className="procesamiento-form-row">
          <div className="procesamiento-atributo-error">
            {errors.nombre_servicio && <span className="error-message">{errors.nombre_servicio}</span>}
            <input type="text" placeholder="Nombre del Servicio" value={nombre_servicio} onChange={(e) => setNombreServicio(e.target.value)} />
          </div>
          <div className="procesamiento-atributo-error">
            {errors.codigo_servicio && <span className="error-message">{errors.codigo_servicio}</span>}
            <input type="text" placeholder="Código del Servicio" value={codigo_servicio} onChange={(e) => setCodigoServicio(e.target.value)} />
          </div>
        </div>
        <div className="procesamiento-form-row">
          <div className="procesamiento-atributo-error">
            {errors.imagen && <span className="error-message">{errors.imagen}</span>}
            <select value={imagen} onChange={(e) => setImagen(e.target.value)}>
              <option value="">Tipo de Imagen</option>
              <option value="2D">2D</option>
              <option value="3D">3D</option>
            </select>
          </div>
          <div className="procesamiento-atributo-error">
            {errors.region && <span className="error-message">{errors.region}</span>}
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">Selecciona la Región</option>
              <option value="craneo">Craneo</option>
              <option value="torax">Torax</option>
              <option value="abdomen">Abdomen</option>
              <option value="miembroSuperior">Miembro superior</option>
              <option value="miembroInferior">Miembro inferior</option>
            </select>
          </div>
        </div>
        <div className="procesamiento-form-row">
          <div className="procesamiento-atributo-error">
            {errors.dimension && <span className="error-message">{errors.dimension}</span>}
            <select value={dimension} onChange={(e) => setDimension(e.target.value)}>
              <option value="">Selecciona la Dimensión</option>
              <option value="1D">1D</option>
              <option value="2D">2D</option>
              <option value="3D">3D</option>
            </select>
          </div>
          <div className="procesamiento-atributo-error">
            {errors.equipo && <span className="error-message">{errors.equipo}</span>}
            <select value={equipo} onChange={(e) => setEquipo(e.target.value)}>
              <option value="">Selecciona el Equipo</option>
              <option value="rx">Rayos X</option>
              <option value="rm">Resonancia Magnética</option>
              <option value="ecografia">Ecografía</option>
              <option value="tac">TAC</option>
            </select>
          </div>
        </div>
        <div className="procesamiento-form-row">
          <div className="procesamiento-atributo-error">
            {errors.tipodeimagen && <span className="error-message">{errors.tipodeimagen}</span>}
            <select value={tipodeimagen} onChange={(e) => setTipoImagen(e.target.value)}>
              <option value="">Selecciona el tipo de Imagen específica</option>
              <option value="craneo">Craneo</option>
              <option value="torax">Torax</option>
              <option value="abdomen">Abdomen</option>
              <option value="miembroSuperior">Miembro superior</option>
              <option value="miembroInferior">Miembro inferior</option>
            </select>
          </div>
        </div>
        <div className="procesamiento-form-row">
          <div className="procesamiento-atributo-error">
            {errors.imagenes && <span className="error-message">{errors.imagenes}</span>}
            <label htmlFor="imageUpload" className="custom-file-upload">
              Selecciona las imágenes
            </label>
            <input type="file" id="imageUpload" accept="image/*,video/*" multiple onChange={handleImageChange} />
          </div>
        </div>
        <div className="procesamiento-form-row">
          <button type="submit" className="procesamiento-form-button">Guardar Paciente</button>
        </div>
        
      </form>
      {docId && (
          <button className="next-button" onClick={() => navigate(`/paciente-info/${docId}`)}>Ver Paciente Información</button>
      )}
      {submitMessage && <p>{submitMessage}</p>}
    </div>
  );
};



// Descargar metadata archivo dcm

export default ProcesamientoImagenes;
