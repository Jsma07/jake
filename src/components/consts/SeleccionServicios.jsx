import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServicioSeleccionado = ({ servicios }) => {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

  const handleServicioChange = (event) => {
    const servicioId = event.target.value;
    const servicio = serviciosDisponibles.find(servicio => servicio.IdServicio === servicioId);
    setServicioSeleccionado(servicio);
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/servicios");
      setServiciosDisponibles(response.data);
    } catch (error) {
      console.error("Error fetching servicios:", error);
    }
  };

  return (
    <section className="content">
      <div 
        style={{
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(128, 0, 128, 0.1)",
          position: "fixed",    
          top: "100px",           
          left: "100px",
          width: "90%",
          maxWidth: "400px",
          backgroundColor: "#f0f0f0",
          display: servicioSeleccionado ? 'block' : 'none'  
        }}
      >
         {servicioSeleccionado && (
          <>
            <div className="form-group">
              <label htmlFor="Servicio">Servicio:</label>
              <p>{servicioSeleccionado.Nombre_Servicio}</p>
            </div>
            <div className="form-group">
              <label htmlFor="Precio">Precio:</label>
              <p>{servicioSeleccionado.Precio}</p>
            </div>
            <div className="form-group">
              <label htmlFor="Tiempo">Tiempo:</label>
              <p>{servicioSeleccionado.Tiempo}</p>
            </div>
            <div className="form-group">
              <label htmlFor="Imagen">Imagen:</label>
              {servicioSeleccionado.ImgServicio && (
                <img 
                  src={`http://localhost:5000${servicioSeleccionado.ImgServicio}`}
                  alt={servicioSeleccionado.Nombre_Servicio} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>
          </>
        )}
      </div>




      <div
       style={{
        paddingTop: "10px",
        margin: "0 auto",
        borderRadius: "30px",
        marginTop: "20px",
        boxShadow: "0 4px 12px rgba(128, 0, 128, 0.25)",
        position: "fixed",
        top: "500px",
        left: "100px",
        width: "calc(38% - 100px)",
        padding: "20px", 
      }} 
       
        >
        <label htmlFor="Servicios">Seleccione un servicio:</label>
        <select
          name="Servicios"
          id="Servicios"
          className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:border-gray-200 dark:text-gray-400 dark:border-gray-700"
          data-live-search="true"
          onChange={handleServicioChange}
          required
        >
          <option value="">Seleccione un servicio</option>
          {serviciosDisponibles.map(servicio => (
            <option key={servicio.IdServicio} value={servicio.IdServicio}>
              {servicio.Nombre_Servicio}
            </option>
          ))}
        </select>
      </div>

     

    </section>
  );
};

export default ServicioSeleccionado;

