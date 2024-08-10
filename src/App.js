import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/Login';
import PacienteInfo from './componentes/PacienteInfo'; // Componente para mostrar información del paciente
import CreateAccount from './componentes/CreateAccount';
import Main from './componentes/Main';
import Medico from './componentes/Medico';
import Radiologo from './componentes/Radiologo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path='/medico-main' element={<Medico/>}/>
        <Route path='/radiologo-main' element={<Radiologo/>}/>
        <Route path="/paciente-info/:id" element={<PacienteInfo />} /> {/* Ruta para la información del paciente */}
      </Routes>
    </Router>
  );
}

export default App;
