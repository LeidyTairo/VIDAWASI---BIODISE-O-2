import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/createaccount.css";
import { FaUserDoctor } from "react-icons/fa6";
import { BsFillFileEarmarkMedicalFill } from "react-icons/bs";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 

const TipoUsuarioForm = ({ setTipoUsuario, setTipo }) => (
    <section className="createaccount-section tipo-usuario">
        <div className="createaccount-image-container">
            <img src={require('../img/qualiky.jpeg')} alt="source-img" className="createaccount-image" />
        </div>
        <div className="createaccount-div-2">
            <h2>Bienvenido a Qhalikay</h2>
            <h3>¿Quien Eres?</h3>
            <div className="createaccount-medic">
                <button id="b1" onClick={() => { setTipoUsuario("2"); setTipo("Personal Medico"); }}><FaUserDoctor size={`30px`} /> Personal Médico</button>
            </div>
            <div className="createaccount-medic">
                <button id="b2" onClick={() => { setTipoUsuario("2"); setTipo("Especialista Radiologo"); }}><BsFillFileEarmarkMedicalFill size={`30px`} /> Especialista radiólogo</button>
            </div>
        </div>
    </section>
);

const CreateAccountForm = ({ celular, setNombre, setApellido, setEdad, setGenero, setTelefono, setFecha, setTipoUsuario, nombre, apellido, edad, genero, fecha }) => {
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!nombre) newErrors.nombre = "Por favor ingrese nombre.";
        if (!apellido) newErrors.apellido = "Por favor ingrese apellido.";
        if (!edad || edad < 18) newErrors.edad = "Debe ser mayor de 18 años para registrarse.";
        const hoy = new Date();
        const fechaNacimiento = new Date(fecha);
        let edadUsuario = hoy.getFullYear() - fechaNacimiento.getFullYear();
        if (hoy.getMonth() < fechaNacimiento.getMonth() || (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate())) {
            edadUsuario--;
        }
        if (edadUsuario !== edad) newErrors.edadUsuario = "Las edades no coinciden"; else if (edadUsuario < 18) newErrors.edadUsuario = "Debe tener al menos 18 años para registrarse.";
        if (!genero) newErrors.genero = "Por favor seleccione un género.";
        if (celular.toString().length !== 9) newErrors.celular = "Por favor ingrese un celular válido";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setTipoUsuario("3");
    };

    const handleDateChange = (e) => {
        const fechaNacimiento = e.target.value;
        setFecha(fechaNacimiento);
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

    return (
        <section className="createaccount-section createaccount-container">
            <div className="createaccount-image-container">
                <img src={require('../img/qualiky.jpeg')} alt="source-img" className="createaccount-image" />
            </div>
            <div className="createaccount-div-2">
                <h3>Crear Cuenta</h3>
                <p>Identifícate para continuar</p>
                <form className="createaccount-forms" onSubmit={handleSubmit}>
                    <label>
                        Nombres
                        <input type="text" placeholder="Ingrese nombres" value={nombre} onChange={e => setNombre(e.target.value)} />
                        {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                    </label>
                    <label>
                        Apellidos
                        <input type="text" placeholder="Ingrese apellidos" value={apellido} onChange={e => setApellido(e.target.value)} />
                        {errors.apellido && <span className="error-message">{errors.apellido}</span>}
                    </label>
                    <label>
                        Celular
                        <input type="number" onChange={e => setTelefono(parseInt(e.target.value))} />
                        {errors.celular && <span className="error-message">{errors.celular}</span>}
                    </label>
                    <label>
                        Género
                        <select name="genero" value={genero} onChange={e => setGenero(e.target.value)}>
                            <option value="">Seleccione una opción</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                        </select>
                        {errors.genero && <span className="error-message">{errors.genero}</span>}
                    </label>
                    <label>
                        Fecha de nacimiento
                        <input type="date" value={fecha} onChange={handleDateChange} />
                    </label>
                    <label>
                        Edad
                        <input type="number" value={edad} onChange={e => setEdad(parseInt(e.target.value))} readOnly />
                        {errors.edad && <span className="error-message">{errors.edad}</span>}
                        {errors.edadUsuario && <span className="error-message">{errors.edadUsuario}</span>}
                    </label>
                    <button type="button" onClick={() => setTipoUsuario("1")}>Regresar</button>
                    <button type="submit">Siguiente</button>
                </form>
            </div>
        </section>
    );
};

const SubmitUserForm = ({ email, password, setEmail, setPassword, submitUser, setTipoUsuario }) => {
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!email) newErrors.email = "Por favor ingrese email.";
        if (!password) newErrors.password = "Por favor ingrese contraseña.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        submitUser();
    };

    return (
        <section className="createaccount-section submit-user">
            <div className="createaccount-image-container">
                <img src={require('../img/qualiky.jpeg')} alt="source-img" className="createaccount-image" />
            </div>
            <div className="createaccount-div-2">
                <h3>Crear Cuenta</h3>
                <p>Identifícate para continuar</p>
                <form className="createaccount-forms submit-user-forms" onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input type="email" placeholder="Ingresa email" onChange={e => setEmail(e.target.value)} />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </label>
                    <label>
                        Contraseña
                        <input type="password" placeholder="Ingresa contraseña" onChange={e => setPassword(e.target.value)} />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </label>
                    <button type="button" onClick={() => setTipoUsuario("2")}>Regresar</button>
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </section>
    );
};

const CreateAccount = () => {
    const [tipoUsuario, setTipoUsuario] = useState("1");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [edad, setEdad] = useState(0);
    const [genero, setGenero] = useState("");
    const [fecha, setFecha] = useState("");
    const [tipo, setTipo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [telefono, setTelefono] = useState(0);
    const navigate = useNavigate();

    const submitUser = async () => {
        const auth = getAuth();
        const db = getFirestore();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "usuarios", user.uid), {
                nombres: nombre,
                apellidos: apellido,
                edad: edad,
                genero: genero,
                celular: telefono,
                fecha_nacimiento: fecha,
                tipo_usuario: tipo,
                email: email,
            });
            navigate("/login");
        } catch (error) {
            console.error("Error al crear la cuenta:", error);
            // Manejar el error (mostrar mensaje de error al usuario)
        }
    };

    return (
        <>
            {tipoUsuario === "1" && <TipoUsuarioForm setTipoUsuario={setTipoUsuario} setTipo={setTipo} />}
            {tipoUsuario === "2" && (
                <CreateAccountForm
                    celular={telefono}
                    setNombre={setNombre}
                    setApellido={setApellido}
                    setEdad={setEdad}
                    setGenero={setGenero}
                    setTelefono={setTelefono}
                    setFecha={setFecha}
                    setTipoUsuario={setTipoUsuario}
                    nombre={nombre}
                    apellido={apellido}
                    edad={edad}
                    genero={genero}
                    fecha={fecha}
                />
            )}
            {tipoUsuario === "3" && (
                <SubmitUserForm
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    submitUser={submitUser}
                    setTipoUsuario={setTipoUsuario}
                />
            )}
        </>
    );
};

export default CreateAccount;
