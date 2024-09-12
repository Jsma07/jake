import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VerificarCodigo = () => {
  const [codigo, setCodigo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/Jackenail/verificarCodigo', { codigoVerificacion: codigo });
      console.log('Respuesta del servidor:', response.data); // Verifica la estructura de la respuesta
  
      const { IdCliente } = response.data; // Asegúrate de que el nombre es correcto
  
      if (!IdCliente) {
        throw new Error('ID del cliente no encontrado en la respuesta.');
      }
  
      toast.success('Código verificado correctamente.');
      navigate(`/cambiarContrasena/${IdCliente}`);
    } catch (err) {
      console.error('Error en la verificación:', err); // Para debugging
      toast.error('Código de verificación inválido o expirado.');
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
        <h2 className="text-2xl mb-6 text-center text-gray-800 mb-12"><i className='bx bx-user-check'></i> Verificar Código</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="codigo" className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <i className='bx bx-lock' style={{ fontSize: '20px' }}></i>
              Código de Verificación:
            </label>

            <input
              id="codigo"
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-12"
              required
              placeholder='Ingrese el código'
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md py-2 px-4 flex items-center justify-center gap-2 mb-8"
          >
            Verificar <i className='bx bx-check' style={{ fontSize: '20px' }}></i>
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

export default VerificarCodigo;
