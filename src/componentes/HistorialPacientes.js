import React, { useState, useEffect } from "react";
import '../styles/historial.css';
import Paciente from "./pacients/Paciente";
import { IoIosWarning } from "react-icons/io";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const HistorialPacientes = ({ medico }) => {
    const [pacientes, setPacientes] = useState([]);
    const [view, setView] = useState("");
    const [paciente, setPaciente] = useState({});
    const firestore = getFirestore();

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const pacientesCollection = collection(firestore, "patients");
                const pacientesSnapshot = await getDocs(pacientesCollection);
                const pacientesList = pacientesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const sortedData = pacientesList.sort((a, b) => getGValue(b.resultados) - getGValue(a.resultados));
                setPacientes(sortedData);
            } catch (error) {
                console.error("Error al obtener pacientes:", error);
            }
        };

        fetchPacientes();
    }, [firestore]);

    const getGValue = (resultados) => {
        if (!resultados) return 0;
        const match = resultados.match(/G(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    };

    const handleHistorialButton = (paciente) => {
        setView('paciente');
        setPaciente(paciente);
    };

    const handlePacientButton = (e) => {
        e.preventDefault();
        setView('');
        setPaciente({});
    };

    return (
        <section className="historial-container">
            {view === "" ? (
                <>
                    <h2 className="historial-form-title">Historial de Pacientes</h2>
                    <div className="historial-list">
                        {pacientes.map((paciente, index) => (
                            <div key={paciente.id} className="historial-item">
                                <div className="historial-item-1">
                                    <span className={getGValue(paciente.resultados) > 2 && medico === "medico" ? 'historial-item-nombre' : 'historial-item-nombre.alt'}>
                                        {medico === "medico" ? (
                                            <>
                                                {paciente.apellido_paterno} {paciente.apellido_materno}, {paciente.nombresCompletos}
                                            </>
                                        ) : (
                                            <>
                                                Paciente {paciente.id}
                                            </>
                                        )}
                                    </span>
                                    <button className="historial-item-button" onClick={() => handleHistorialButton(paciente)}>
                                        Ver más
                                    </button>
                                </div>
                                {getGValue(paciente.resultados) > 2 ? (
                                    <>
                                        <div className="historial-item-2">
                                            <IoIosWarning color="red" />
                                            <span className="historial-item-nombre">
                                                Paciente requiere atención urgente.
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                    </>
                                )}
                                {medico === "medico" && paciente.pdf && paciente.pdf !== null && (
                                    <div className="historial-item-radiologo">
                                        <IoIosWarning color="green" />
                                        <span className="historial-item-nombre-">
                                            El radiólogo ha generado un PDF en este paciente.
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <Paciente paciente={paciente} medico={medico} />
                    <button className="historial-item-button" onClick={handlePacientButton}>Regresar</button>
                </>
            )}
        </section>
    );
};

export default HistorialPacientes;
