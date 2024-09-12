// src/pages/VerificarCodigo.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const NUMBER_OF_BOXES = 6;

const VerificarCodigo = () => {
  const [code, setCode] = useState(Array(NUMBER_OF_BOXES).fill(''));
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Extrae el correo de los parámetros de la URL
  const query = new URLSearchParams(location.search);
  const correo = query.get('correo');

  const handleChange = (index, event) => {
    const value = event.target.value;
    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // Solo toma un carácter

    setCode(newCode);

    // Mueve el foco al siguiente campo si se ingresa un valor
    if (value && index < NUMBER_OF_BOXES - 1) {
      inputsRef.current[index + 1].focus();
    }

    // Mueve el foco al campo anterior si se borra el valor
    if (!value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const codeString = code.join('');
  
    // Validar longitud del código antes de enviar
    if (codeString.length !== NUMBER_OF_BOXES) {
      setError('Por favor, ingrese un código de verificación válido.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/verificar-codigo', {
        correo,
        codigo: codeString
      });
  
      if (response.data.mensaje === 'Código verificado correctamente') {
        navigate('/nuevaContrasena', { state: { correo } });
      } else {
        setError('Código incorrecto. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
      setError('Error al verificar el código. Por favor, inténtalo de nuevo.');
    }
  };
  
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      style={{ 
        backgroundImage: "url('/fondo2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >     
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Ajusta el color y la opacidad aquí
          zIndex: 1,
        }}
      ></div>
      <div 
        style={{
          borderRadius:'25px', 
          zIndex: 2, 
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.4)', 
          backgroundColor: '#F2EBFF',
        }} 
        className="p-10 max-w-md w-full bg-white shadow-md rounded-xl border border-gray-600"
      >
        <img 
          src="/jacke.png" 
          alt="Logo" 
          className="w-32 h-32 rounded-full mx-auto mb-8"
        />
        <h2 className="text-2xl mb-6 text-center text-gray-800 mb-12"><i className='bx bx-lock'></i> Verificar Código</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex gap-2 mb-4 justify-center">
            {Array(NUMBER_OF_BOXES).fill('').map((_, index) => (
              <input
              style={{borderRadius:'18px'}}
                key={index}
                type="text"
                maxLength="1"
                value={code[index]}
                onChange={(e) => handleChange(index, e)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md shadow-sm"
              />
            ))}
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button 
                     style={{borderRadius:'20px'}}

  type="submit" 
  className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md py-2 px-4 flex items-center justify-center gap-2 mt-12"
>
  Enviar código <i className='bx bx-send' style={{fontSize: '20px'}}></i>
</button>
          <a 
  href="/iniciarSesion"
  className="inline-flex items-center bg-gray-100 text-gray-700 hover:bg-gray-300 rounded-md px-4 py-2 text-center font-medium transition-colors mt-8"
>
  <i className='bx bx-chevron-left' style={{fontSize: '24px', marginRight: '8px'}}></i>
  Volver
</a>
        </form>
      </div>
    </div>
  );
};

export default VerificarCodigo;
