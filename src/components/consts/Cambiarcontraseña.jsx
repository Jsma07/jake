import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CambiarContrasena = () => {
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const navigate = useNavigate();
  
  // Obtener idCliente de los parámetros de la URL
  const { idCliente } = useParams();

  // Función para validar la contraseña
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < minLength) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!hasUppercase) {
      return 'La contraseña debe contener al menos una letra mayúscula.';
    }
    if (!hasNumber) {
      return 'La contraseña debe contener al menos un número.';
    }
    return '';
  };

  // Validar la contraseña en tiempo real
  useEffect(() => {
    const error = validatePassword(nuevaContrasena);
    setPasswordError(error);
    setPasswordValid(error === '');
  }, [nuevaContrasena]);

  // Validar la coincidencia de contraseñas en tiempo real
  useEffect(() => {
    if (nuevaContrasena !== confirmarContrasena) {
      setPasswordMatchError('Las contraseñas no coinciden.');
    } else {
      setPasswordMatchError('');
    }
  }, [confirmarContrasena, nuevaContrasena]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError) {
      toast.error('La nueva contraseña no cumple con los requisitos.');
      return;
    }

    if (passwordMatchError) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/Jackenail/CambiarContrasena/${idCliente}`, { nuevaContrasena });
      
      if (response.status === 200) {
        toast.success('Contraseña cambiada correctamente.');
        navigate('/iniciarSesion');
      } else {
        toast.error('Error al cambiar la contraseña.');
      }
    } catch (err) {
      toast.error('Error al cambiar la contraseña.');
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      style={{ 
        backgroundImage: "url('/fondo.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >      
      <div style={{ borderRadius: '25px' }} className="p-10 max-w-md w-full bg-white shadow-md rounded-xl border border-gray-900">
        <img 
          src="/jacke.png" 
          alt="Logo" 
          className="w-32 h-32 rounded-full mx-auto mb-8"
        />
        <h2 className="text-2xl mb-6 text-center text-gray-800 mb-12"><i className='bx bx-lock-open'></i> Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="nuevaContrasena" className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <i className='bx bx-lock' style={{ fontSize: '20px' }}></i>
              Nueva Contraseña:
            </label>
            <input
              id="nuevaContrasena"
              type="password"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              className={`block w-full p-3 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4`}
              required
              placeholder='Ingrese la nueva contraseña'
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmarContrasena" className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <i className='bx bx-lock' style={{ fontSize: '20px' }}></i>
              Confirmar Contraseña:
            </label>
            <input
              id="confirmarContrasena"
              type="password"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className={`block w-full p-3 border ${passwordMatchError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-12`}
              required
              placeholder='Confirme la nueva contraseña'
            />
            {passwordMatchError && (
              <p className="text-red-500 text-sm mt-1">{passwordMatchError}</p>
            )}
          </div>
          <button 
            type="submit" 
            className={`w-full ${passwordValid && !passwordMatchError ? 'bg-blue-500' : 'bg-gray-500'} text-white hover:${passwordValid && !passwordMatchError ? 'bg-blue-600' : 'bg-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md py-2 px-4 flex items-center justify-center gap-2 mb-8`}
            disabled={!passwordValid || !!passwordMatchError}
          >
            Cambiar Contraseña <i className='bx bx-check' style={{ fontSize: '20px' }}></i>
          </button>
          <a 
            href="/iniciarSesion"
            className="inline-flex items-center bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md px-4 py-2 text-center font-medium transition-colors"
          >
            <i className='bx bx-chevron-left' style={{ fontSize: '24px', marginRight: '8px' }}></i>
            Volver
          </a>
        </form>
      </div>
    </div>
  );
};

export default CambiarContrasena;
