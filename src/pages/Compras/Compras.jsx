import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import * as Swal from 'sweetalert2';
import Table from "../../components/consts/Tabla";
import Fab from '@mui/material/Fab';
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [buscar, setBuscar] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompras();
    fetchProveedores();
  }, []);

const fetchCompras = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/compras');
    const data = response.data;

    // Ordenar por IdCompra en orden descendente
    data.sort((a, b) => b.IdCompra - a.IdCompra);
    setCompras(data); 
  } catch (error) {
    console.error('Error fetching Compras:', error);
  }
};

const fetchProveedores = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/proveedores");
    console.log("proveedores fetched:", response.data); 
    setProveedores(response.data);
  } catch (error) {
    console.error("Error fetching proveedores:", error);
  }
};

const filtrar = compras.filter(compra => {
    return (
      (compra.fecha_compra && compra.fecha_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.descuento_compra && compra.descuento_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.iva_compra && compra.iva_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.subtotal_compra && compra.subtotal_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.total_compra && compra.total_compra.toLowerCase().includes(buscar.toLowerCase())) ||
      (compra.estado_compra && compra.estado_compra.toLowerCase().includes(buscar.toLowerCase()))
    );
});

  const handleClick = () => {
    navigate('/compras/crearCompra'); 
  };

  const DetalleCompra = (id) => {
    console.log('Navigating to:', `/compras/DetalleCompra/${id}`);
    navigate(`/compras/DetalleCompra/${id}`);
  };

  const AnularCompra = async (IdCompra) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: '¿Quieres anular esta compra?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/api/compras/Anular/${IdCompra}`);
        fetchCompras(); 
        Swal.fire({
          icon: 'success',
          title: 'Compra anulada',
          text: 'La compra ha sido anulada correctamente.',
        });
      } catch (error) {
        console.error('Error al anular la compra:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al anular la compra. Por favor, inténtalo de nuevo más tarde.',
        });
      }
    }
  };

  const cambiarEstadoCompra = async (IdCompra, nuevoEstado) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/compras/cambiarEstado/${IdCompra}`,
        { estado_compra: nuevoEstado },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        fetchCompras();
        Swal.fire({
          icon: 'success',
          title: 'Estado cambiado',
          text: 'El estado de la compra ha sido cambiado exitosamente.',
        });
      }
    } catch (error) {
      console.error("Error al cambiar el estado:", error.response?.data || error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cambiar el estado. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  };

  const handleEstadoClick = async (IdCompra, estadoActual) => {
    if (estadoActual === "En espera") {
      const confirmacion = await Swal.fire({
        title: "¿Estás seguro de cambiar el estado a Terminada?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      });

      if (confirmacion.isConfirmed) {
        cambiarEstadoCompra(IdCompra, "Terminada");
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Cambio de estado no permitido',
        text: 'Ya no puedes cambiar el estado de una compra que no está pendiente.',
      });
    }
  };

  const canAnular = (fecha_compra) => {
    const [day, month, year] = fecha_compra.split('/').map(Number);
    const fechaCompra = new Date(year, month - 1, day);

    const hoy = new Date();
    const fechaActual = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const diffTime = fechaActual - fechaCompra;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log('Fecha de compra:', fechaCompra);
    console.log('Fecha actual:', fechaActual);
    console.log('Diferencia en días:', diffDays);

    return diffDays <= 3;
  };

  return (
    <div>
      <Table
        columns={[
          { field: 'fecha_compra', headerName: 'FECHA', width: 'w-36' },
          { field: 'empresa_proveedor', headerName: 'EMPRESA', width: 'w-36' },
          { field: 'nombre_proveedor', headerName: 'NOMBRE', width: 'w-36' },
          { field: 'descuento_compra', headerName: 'DESCUENTO', width: 'w-36' },
          { field: 'total_compra', headerName: 'TOTAL', width: 'w-36' },
          {
            field: 'estado_compra',
            headerName: "ESTADO",
            width: "w-36",
            renderCell: (params) => (
              <button
                className={`px-3 py-1.5 text-white text-sm font-medium rounded-lg shadow-md focus:outline-none ${
                  params.row.estado_compra === "En espera"
                    ? "bg-blue-500"
                    : params.row.estado_compra === "Terminada"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                onClick={() =>
                  params.row.estado_compra === "En espera" &&
                  handleEstadoClick(params.row.IdCompra, params.row.estado_compra)
                }
                disabled={params.row.estado_compra !== "En espera"}
              >
                {params.row.estado_compra}
              </button>
            ),
          },
          {
            field: 'Acciones',
            headerName: 'ACCIONES',
            width: 'w-48',
            renderCell: (params) => (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => params && DetalleCompra(params.row.IdCompra)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white"
                >
                  <RemoveRedEyeIcon /> 
                </button>
                {params.row.estado_compra !== 'Anulada' && canAnular(params.row.fecha_compra) && (
                  <button
                    onClick={() => AnularCompra(params.row.IdCompra)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white"
                  >
                    <DeleteIcon /> 
                  </button>
                )}
              </div>
            ),
          }
        ]}
        data={filtrar}
        title={'Gestion de Compras'}
      />
      <Fab
        aria-label="add"
        style={{
          border: '0.5px solid grey',
          backgroundColor: '#94CEF2',
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 1000, 
        }}
        onClick={() => handleClick(true)}
      >
        <i className='bx bx-plus' style={{ fontSize: '1.3rem' }}></i>
      </Fab>
    </div>
  );
  
};

export default Compras;
