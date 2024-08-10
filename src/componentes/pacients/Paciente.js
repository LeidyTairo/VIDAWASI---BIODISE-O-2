import React, { useCallback, useEffect, useState, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Asegúrate de ajustar la ruta
import '../../styles/historial.css';
import handleDownloadPDF from "./handlePDF";

const Paciente = ({ paciente, medico }) => {
    const [span, setSpan] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [box, boxSet] = useState(false);

    // Refs para evitar que cambios en `box` y `descripcion` desencadenen re-renderizados
    const boxRef = useRef(box);
    const descripcionRef = useRef(descripcion);

    const handleSubmit = async () => {
        await handleDownloadPDF(paciente, descripcionRef.current, setSpan, medico);
        console.log(descripcionRef.current);
        const response = await getIsDescription();
        boxSet(response);
    }

    const getDescription = useCallback(async () => {
        try {
            const docRef = doc(db, "patients", paciente.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return data;
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document:", error);
        }
    }, [paciente]);

    const getIsDescription = async () => {
        const response = await getDescription();
        return response?.message || false;
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await getDescription();
            if (response) {
                boxSet(response.message);
                boxRef.current = response.message; // Actualizamos el valor en la ref
                if (response.descripcion) {
                    setDescripcion(response.descripcion);
                    descripcionRef.current = response.descripcion; // Actualizamos el valor en la ref
                } else {
                    setDescripcion("");
                    descripcionRef.current = ""; // Actualizamos el valor en la ref
                }
                console.log(boxRef.current);
                console.log(descripcionRef.current);
            }
        };
        fetchData();
    }, [getDescription]); // No se requiere box ni descripcion en el array de dependencias

    const setPaciente = async () => {
        try {
            const docRef = doc(db, "patients", paciente.id);
            await updateDoc(docRef, {
                pdf: false,
                descripcion: ''
            });
            const response = await getDescription();
            boxSet(response.message);
            boxRef.current = response.message; // Actualizamos el valor en la ref
        } catch (error) {
            console.error("Error updating document:", error);
        }
    }

    return (
        <div className="historial-details">
            <h3>Detalles del Paciente</h3>
            <div className="historial-details-data">
                <div className="historial-details-1">
                    {medico === "medico" ? (
                        <>
                            <p><strong>Apellido Paterno:</strong> {paciente.apellido_paterno}</p>
                            <p><strong>Apellido Materno:</strong> {paciente.apellido_materno}</p>
                            <p><strong>Nombres:</strong> {paciente.nombresCompletos}</p>
                            <p><strong>DNI:</strong> {paciente.dni}</p>
                            <p><strong>Celular de Contacto:</strong> {paciente.celularContacto}</p>
                        </>
                    ) : <></>}
                    <p><strong>Fecha de Nacimiento:</strong> {new Date(paciente.fechaNacimiento).toLocaleDateString()}</p>
                    <p><strong>Edad:</strong> {paciente.edad}</p>
                    <p><strong>Género:</strong> {paciente.genero}</p>
                    <p><strong>Peso:</strong> {paciente.peso} kg</p>
                    <p><strong>Talla:</strong> {paciente.talla} m</p>
                    <p><strong>Fecha de Ingreso:</strong> {new Date(paciente.fechaIngreso).toLocaleDateString()}</p>
                </div>
                <div className="historial-details-2">
                    <p><strong>Nombre del Servicio:</strong> {paciente.nombre_servicio}</p>
                    <p><strong>Código del Servicio:</strong> {paciente.codigo_servicio}</p>
                    <p><strong>Imagen:</strong> {paciente.imagen}</p>
                    <p><strong>Región:</strong> {paciente.region}</p>
                    <p><strong>Dimensión:</strong> {paciente.dimension}</p>
                    <p><strong>Equipo:</strong> {paciente.equipo}</p>
                    <p><strong>Tipo de Imagen:</strong> {paciente.tipo_imagen}</p>
                </div>
            </div>
            <div className="historial-details-ia">
                <p><strong>Imágenes:</strong></p>
                <div className="historial-ia-image-container">
                    {paciente.imagenes && paciente.imagenes.map((imagen, index) => (
                        <img key={index} src={imagen} alt={`Imagen ${index + 1}`} className="historial-image" />
                    ))}
                </div>
                {medico !== "medico" && (
                    <p><strong>Resultado Predictivo: </strong></p>
                )}
                {medico !== "medico" && paciente.resultados && (
                    <div className="resultado-predictivo">
                        {paciente.resultados.split("\n").map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                )}

                {(medico === "radiologo") && (
                    <>
                        {box ? (
                            <>
                                <span>ATENCIÓN: Usted ya ha realizado un comentario sobre este paciente. ¿Desea cambiarlo?</span>
                                <button className="historial-item-button" onClick={setPaciente}>Cambiar</button>
                            </>
                        ) : (
                            <>
                                <p><strong>Inserte comentario:</strong></p>
                                <input
                                    type="textbox"
                                    id="radiologo-texbox"
                                    placeholder="Ingrese descripcion del paciente"
                                    value={descripcion}
                                    onChange={e => {
                                        setDescripcion(e.target.value);
                                        descripcionRef.current = e.target.value; // Actualizamos el valor en la ref
                                    }}
                                />
                            </>
                        )}
                        {descripcion === "" ? (
                            <span id="span-text-paciente">{span}</span>
                        ) : (
                            <></>
                        )}
                    </>
                )}
                {
                    ((medico === "radiologo" && !box) || (medico === "medico" && paciente.pdf && box)) && (
                        <button className="historial-item-button" onClick={() => handleSubmit(descripcionRef.current, setSpan, medico)}>Generar Reporte</button>
                    )
                }
            </div>
        </div>
    );
};

export default Paciente;
