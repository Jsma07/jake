import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const correo = location.state?.correo;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/actualizarContrasena', {
        correo,
        nuevaContrasena: newPassword
      });

      if (response.data.mensaje === 'Contraseña actualizada correctamente') {
        navigate('/iniciarSesion'); // Redirigir al inicio de sesión después de cambiar la contraseña
      } else {
        setError(response.data.mensaje || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setError('Error al actualizar la contraseña. Por favor, inténtalo de nuevo.');
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
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1,
        }}
      ></div>
      <div
        style={{
          borderRadius: '25px',
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
        <h2 className="text-2xl mb-6 text-center text-gray-800 mb-12">
          <i className='bx bx-lock'></i> Restablecer Contraseña
        </h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="newPassword" className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <i className='bx bx-lock' style={{ fontSize: '20px' }}></i>
              Nueva Contraseña:
            </label>
            <input
                        placeholder='*********'

              style={{ borderRadius: '20px' }}
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <i className='bx bx-lock' style={{ fontSize: '20px' }}></i>
              Confirmar Contraseña:
            </label>
            <input
            placeholder='*********'
              style={{ borderRadius: '20px' }}
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4"
              required
            />
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button 
                     style={{borderRadius:'20px'}}

  type="submit" 
  className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md py-2 px-4 flex items-center justify-center gap-2 mt-8"
>
  Actualizar contraseña <i className='bx bx-send' style={{fontSize: '20px'}}></i>
</button>
          <a
            href="/iniciarSesion"
            className="inline-flex items-center bg-gray-100 text-gray-700 hover:bg-gray-300 rounded-md px-4 py-2 text-center font-medium transition-colors mt-8"
          >
            <i className='bx bx-chevron-left' style={{ fontSize: '24px', marginRight: '8px' }}></i>
            Volver
          </a>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
