import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import * as Swal from 'sweetalert2';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ModalAgregarInsumo from "../../components/consts/modal";
import handleAddInsumo from '../Insumos/agregarInsumo';
import ModalAgregarProveedor from "../../components/consts/modal";
import handleAddProveedor from '../Compras/agregarProveedor';
import ModalDetalleInsumos from "../../components/consts/modalDetalleInsumos";
import CamposObligatorios from "../../components/consts/camposVacios";
import Fab from '@mui/material/Fab';

const CrearCompra = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate(); 
  const [compras, setCompras] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [idProveedor, setIdProveedor] = useState('');
  const [fecha_compra, setFechaCompra] = useState('');
  const [descuento_compra, setDescuentoCompra] = useState(0);
  const [iva_compra, setIvaCompra] = useState(0);
  const [subtotal_compra, setSubtotalCompra] = useState(0);
  const [total_compra, setTotalCompra] = useState(0);
  const [estado_compra, setEstadoCompra] = useState('');
  const [modalData, setModalData] = useState(null);
  const [openModalAgregarInsumo, setOpenModalAgregarInsumo] = useState(false);
  const [openModalAgregarProveedor, setOpenModalAgregarProveedor] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [detallesCompra, setDetallesCompra] = useState([]);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [insumosAgregados, setInsumosAgregados] = useState([]);  
  const [cantidad_insumo, setCantidadInsumo] = useState({});
  const [precio_unitario, setPrecioUnitario] = useState({});
  const [totalValorInsumos, settotalValorInsumos] = useState('');

  const abrirModal = () => {
    setModalAbierto(true);
  };
  
  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const [isFieldDisabled, setIsFieldDisabled] = useState({
    fecha_compra: false,
    descuento_compra: false,
    iva_compra: false,
    subtotal_compra: false,
    estado_compra: false,
  });

  useEffect(() => {
    fetchCompras();
    fetchInsumos();
    fetchCategorias();
    fetchProveedores();
    setFechaCompra(maxDate);
  }, []);

const fetchCompras = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/compras');
      setCompras(response.data);
    } catch (error) {
      console.error('Error fetching Compras:', error);
    }
};

const fetchInsumos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/insumos');
      setInsumos(response.data);
    } catch (error) {
      console.error('Error fetching Insumos:', error);
    }
};

const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching Categorias:', error);
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

const handleSubmitInsumos = (formData) => {
  handleAddInsumo(formData, handleCloseModalAgregar, fetchInsumos);
};

const handleSubmitProveedor = (formData) => {
  handleAddProveedor(formData, handleCloseModalAgregar, fetchProveedores);
};

const getNombreCategoria = (idCategoria) => {
    const categoria = categorias.find((cat) => cat.IdCategoria === idCategoria);
    return categoria ? categoria.nombre_categoria : "Desconocido";
};

const calcularSubtotal = (detalles) => {
  return detalles.reduce((acc, detalle) => acc + detalle.totalValorInsumos, 0);
};

const calcularIva = (totalValorInsumos) => {
  return 0.19 * totalValorInsumos;
};

const calcularTotal = (totalValorInsumos, descuento) => {
  return totalValorInsumos - descuento;
};

const actualizarTotales = (detalles, descuento) => {
  const totalValorInsumos = calcularSubtotal(detalles);
  const iva = calcularIva(totalValorInsumos);
  const subtotalCompra = totalValorInsumos - iva;
  const totalCompra = calcularTotal(totalValorInsumos, descuento);
  console.log("Total Valor Insumos:", totalValorInsumos);
  console.log("IVA:", iva);
  console.log("Subtotal Compra:", subtotalCompra);
  console.log("Total Compra:", totalCompra);

  setSubtotalCompra(subtotalCompra);
  setIvaCompra(iva);
  setTotalCompra(totalCompra);
};

const actualizarDetallesCompra = (nuevaCantidadInsumo, nuevoPrecioUnitario) => {
  const nuevosDetallesCompra = insumosSeleccionados.map((insumo) => {
    const cantidad = nuevaCantidadInsumo[insumo.IdInsumos] || 0;
    const precio = nuevoPrecioUnitario[insumo.IdInsumos] || 0;
    
    return {
      IdInsumo: insumo.IdInsumos,
      cantidad_insumo: cantidad,
      precio_unitario: precio,
      totalValorInsumos: cantidad * precio,
    };
  });

  setDetallesCompra(nuevosDetallesCompra);
  actualizarTotales(nuevosDetallesCompra, descuento_compra);
};

const handleAgregarDetalleCompra = () => {
  const nuevosDetallesCompra = insumosSeleccionados.map((insumo) => ({
    IdInsumo: insumo.IdInsumos,
    cantidad_insumo: cantidad_insumo[insumo.IdInsumos] || 0,
    precio_unitario: precio_unitario[insumo.IdInsumos] || 0,
    totalValorInsumos: (cantidad_insumo[insumo.IdInsumos] || 0) * (precio_unitario[insumo.IdInsumos] || 0),
  }));

  console.log("Nuevos detalles de compra:", nuevosDetallesCompra);
  setDetallesCompra(nuevosDetallesCompra);
  actualizarTotales(nuevosDetallesCompra, descuento_compra);
};

const handleAddCompra = async () => {
    handleAgregarDetalleCompra();

     if (detallesCompra.length === 0) {
      Swal.fire({
          icon: 'error',
          title: 'Sin insumos',
          text: 'Debe haber al menos un insumo asociado a la compra.',
      });
      return;
    }

     if (descuento_compra > total_compra) {
      Swal.fire({
          icon: 'error',
          title: 'Descuento inválido',
          text: 'El descuento no puede ser mayor que el total de la compra.',
      });
      return; 
  }

   // Validar que los campos cantidad y precio sean numéricos válidos
   const invalidDetalles = detallesCompra.some(detalle => {
    const cantidad = parseFloat(detalle.cantidad_insumo);
    const precio = parseFloat(detalle.precio_unitario);
    return isNaN(cantidad) || isNaN(precio) || cantidad <= 0 || precio <= 0;
});

if (invalidDetalles) {
    Swal.fire({
        icon: 'error',
        title: 'Datos inválidos',
        text: 'Por favor, ingrese valores válidos para cantidad y precio unitario en los detalles de la compra.',
    });
    return;
}

    const formData = {fecha_compra, descuento_compra: parseFloat(descuento_compra), iva_compra: parseFloat(iva_compra),subtotal_compra: parseFloat(subtotal_compra),estado_compra, IdProveedor: idProveedor,
        detallesCompra: detallesCompra.map(detalle => ({
            ...detalle, cantidad_insumo: parseInt(detalle.cantidad_insumo),precio_unitario: parseFloat(detalle.precio_unitario),totalValorInsumos: parseFloat(detalle.totalValorInsumos),
        })),
    };
    console.log("Datos enviados al backend:", formData);
    const camposObligatorios = ['fecha_compra', 'descuento_compra', 'iva_compra', 'estado_compra', 'IdProveedor'];

    if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos de la compra.')) {
        return;
    }

    const detallesVacios = detallesCompra.some(detalle => detalle.cantidad_insumo === 0 || detalle.precio_unitario === 0);
    if (detallesVacios) {
        Swal.fire({
            icon: 'error',
            title: 'Campos vacíos',
            text: 'Por favor, complete todos los campos de cantidad y precio unitario en los detalles de la compra.',
        });
        return;
    }

    try {
        const confirmation = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres agregar esta compra?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, agregar',
            cancelButtonText: 'Cancelar',
        });

        if (confirmation.isConfirmed) {
            const postResponse = await axios.post('http://localhost:5000/api/compras/guardarCompra', formData);
            console.log('Respuesta del servidor:', postResponse.data);
            fetchCompras();
            Swal.fire({
              title: '¡Compra agregada!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500 
          });
            window.location.href = "/compras";
        }
    } catch (error) {
        console.error('Error al agregar la compra:', error);
        alert('No se pudo agregar la compra. Verifique la conexión al servidor.');
    }
};

const handleInputChange = (insumoId, field, value) => {
  if (value < 0) {
    Swal.fire({
      icon: 'error',
      title: 'Valor no permitido',
      text: 'No se permiten números negativos en los campos de cantidad o precio unitario.',
    });
    return;
  }

  if (field === 'cantidad_insumo') {
    setCantidadInsumo((prevState) => {
      const updatedCantidad = { ...prevState, [insumoId]: value };
      actualizarDetallesCompra(updatedCantidad, precio_unitario);
      return updatedCantidad;
    });
  } else {
    setPrecioUnitario((prevState) => {
      const updatedPrecio = { ...prevState, [insumoId]: value };
      actualizarDetallesCompra(cantidad_insumo, updatedPrecio);
      return updatedPrecio;
    });
  }
};

const handleDescuentoChange = (value) => {
  setDescuentoCompra(value);
  actualizarTotales(detallesCompra, value);
};

const handleChange = (name, value) => {
  setInsumoSeleccionado((prevInsumo) => ({
    ...prevInsumo,
    [name]: value,
  }));
};

const handleCloseModalAgregar = () => {
  setOpenModalAgregarInsumo(false);
  setOpenModalAgregarProveedor(false);
  setInsumoSeleccionado(null);
};

const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

 // Obtener la fecha de hoy
 const today = new Date();
 const maxDate = getFormattedDate(today);
 // Calcular la fecha mínima permitida (5 días antes)
 const minDate = new Date();
 minDate.setDate(today.getDate() - 5);
 const minDateFormatted = getFormattedDate(minDate);

const handleRemove = (id) => {
  setInsumosSeleccionados(insumosSeleccionados.filter((insumo) => insumo.IdInsumos !== id));
  setInsumosAgregados(insumosAgregados.filter((insumoId) => insumoId !== id));
};

return (
  <div className="max-w-4xl mx-auto p-4">
   <section className="content">
  <div
    style={{
      paddingTop: "20px", 
      margin: "0 auto",
      borderRadius: "30px",
      marginTop: "20px",
      boxShadow: "0 4px 12px rgba(128, 0, 128, 0.25)",
      position: "fixed",
      top: "80px",
      left: "100px",
      width: "calc(38% - 100px)",
      padding: "20px",
    }}
  >
    <center>
      <h2 style={{ marginTop: '15px', fontSize: '24px', fontWeight: 'bold' }}>Registrar Compra</h2>
    </center>
    <br />
    <div className="col-md-12">
      <div className="grid grid-cols-1 gap-4">
          <div className="form-group mb-2">
            <label htmlFor="fecha_compra" className="block text-sm font-medium text-gray-900 dark:text-white">Fecha:</label>
            <input
              type="date"
              id="fecha_compra"
              value={fecha_compra}
              onChange={(e) => setFechaCompra(e.target.value)}
              className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500" 
              min={minDateFormatted}
              max={maxDate}
            />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="estado_compra" className="block text-sm font-medium text-gray-900 dark:text-white">Proveedor:</label>
            <select
                id="estado_compra"
                className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
                value={idProveedor} 
                onChange={(e) => setIdProveedor(e.target.value)}  
                required
            >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((proveedor) => (
                    <option key={proveedor.IdProveedor} value={proveedor.IdProveedor}>
                        {proveedor.empresa_proveedor} | {proveedor.nombre_proveedor}
                    </option>
                ))}
            </select>
        </div>

        <div className="form-group mb-2">
          <label htmlFor="descuento_compra" className="block text-sm font-medium text-gray-900 dark:text-white">Descuento:</label>
          <input
            type="number"
            id="descuento_compra"
            value={descuento_compra}
            onChange={(e) => handleDescuentoChange(parseFloat(e.target.value))}
            className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
            placeholder="Descuento"/>
        </div>

        <div className="form-group mb-2">
          <label htmlFor="estado_compra" className="block text-sm font-medium text-gray-900 dark:text-white">Estado:</label>
          <select
            id="estado_compra"
            value={estado_compra}
            onChange={(e) => setEstadoCompra(e.target.value)}
            className="form-select mt-1 block w-full py-2.5 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500" required>
            <option value="">Seleccione el estado</option>
            <option value="En espera">En espera</option>
            <option value="Terminada">Terminada</option>
          </select>
        </div>
        <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-12 mt-2 mb-3 mx-2 flex justify-center gap-4">
          <button
            type="button"
            className="bg-pink-200 hover:bg-black-300 focus:ring-4 focus:outline-none focus:ring-black-300 dark:focus:ring-black-800 shadow-lg shadow-black-500/50 dark:shadow-lg dark:shadow-black-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex items-center"
            onClick={() => setOpenModalAgregarProveedor(true)}
          >
            <GroupAddIcon />{" "}
          </button>
          <button
            type="button"
            className="bg-pink-200 hover:bg-black-300 focus:ring-4 focus:outline-none focus:ring-black-300 dark:focus:ring-black-800 shadow-lg shadow-black-500/50 dark:shadow-lg dark:shadow-black-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex items-center"
            onClick={() => setOpenModalAgregarInsumo(true)}
          >
            <AddShoppingCartIcon />{" "}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
        style={{
          paddingTop: "10px",
          margin: "0 auto",
          borderRadius: "30px",
          marginTop: "20px",
          boxShadow: "0 4px 12px rgba(128, 0, 128, 0.3)",
          position: "fixed",
          right: "20px", 
          top: "80px",
          width: "calc(65% - 100px)",
          padding: "20px", 
        }}
      >
          <h3 style={{ textAlign: "left", fontSize: "23px", fontWeight: "bold" }}>
            Detalle de la compra
          </h3>
          <br></br>

          <div style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
          <div
            style={{
              fontWeight: "bold",
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)", 
              gap: "10px",
              textAlign: "center",
            }}
          >
            <div>Imagen</div>
            <div>Categoria</div>
            <div>Insumo</div>
            <div>Cantidad</div>
            <div>P Unitario</div>
            <div>Actions</div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)", 
              gap: "10px",
              marginTop: "20px",
              overflowY: insumosSeleccionados.length > 2 ? "auto" : "visible",
              maxHeight: insumosSeleccionados.length > 2 ? "150px" : "none",
              textAlign: "center",
            }}
          >
            {insumosSeleccionados.map((insumo, index) => (
              <React.Fragment key={index}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <img 
                    src={`http://localhost:5000${insumo.imagen}`} 
                    alt={insumo.NombreInsumos} 
                    width="50" 
                    style={{ borderRadius: "50%", width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </div>
                <div>{getNombreCategoria(insumo.Idcategoria)}</div>
                <div>{insumo.NombreInsumos}</div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <input
                    type="number"
                    value={cantidad_insumo[insumo.IdInsumos] || ''}
                    onChange={(e) => handleInputChange(insumo.IdInsumos, 'cantidad_insumo', parseInt(e.target.value))}
                    style={{
                      width: "80px",
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      textAlign: "center",
                    }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <input
                    type="number"
                    value={precio_unitario[insumo.IdInsumos] || ''}
                    onChange={(e) => handleInputChange(insumo.IdInsumos, 'precio_unitario', parseFloat(e.target.value))}
                    style={{
                      width: "80px",
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      textAlign: "center",
                    }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <button
                      onClick={() => handleRemove(insumo.IdInsumos)}
                      className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full"
                    >
                      <i className="bx bxs-trash" style={{ fontSize: '24px' }}></i>
                </button>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: "40px",
            borderTop: "1px solid #ccc",
            paddingTop: "20px",
          }}
        >
           <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <div style={{ fontWeight: "bold", marginRight: "20px" }}>
              IVA:
            </div>
            <div>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(iva_compra)}</div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <div style={{ fontWeight: "bold", marginRight: "20px" }}>
              SUBTOTAL:
            </div>
            <div>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(subtotal_compra)}</div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <div style={{ fontWeight: "bold", marginRight: "20px" }}>
              TOTAL:
            </div>
            <div>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(total_compra)}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          <div className="form-group col-lg-3 col-md-3 col-sm-6 col-xs-12 mt-2 mb-3 mx-2 flex space-x-4">
            <a href="/compras">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                style={{
                  fontSize: "25px",
                }}
              >
                <i className="bx bx-arrow-back"></i>
              </button>
            </a>
            <button
              type="button"
              className="bg-pink-200 hover:bg-black-300 focus:ring-4 focus:outline-none focus:ring-black-300 dark:focus:ring-black-800 shadow-lg shadow-black-500/50 dark:shadow-lg dark:shadow-black-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
              onClick={abrirModal}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <ShoppingCartIcon />{" "}
            </button>
          </div>
        </div>
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
        onClick={handleAddCompra}
      >
        <i className='bx bx-save' style={{ fontSize: '1.3rem' }}></i>
      </Fab>
      </div>
      <ModalDetalleInsumos 
        open={modalAbierto} 
        handleClose={cerrarModal} 
        title="Seleccionar Insumos"
        insumos={insumos}
        insumosSeleccionados={insumosSeleccionados}
        setInsumosSeleccionados={setInsumosSeleccionados}
        insumosAgregados={insumosAgregados}
        setInsumosAgregados={setInsumosAgregados} 
      />

</section>
      <ModalAgregarInsumo
        open={openModalAgregarInsumo}
        handleClose={handleCloseModalAgregar}
        onSubmit={handleSubmitInsumos}
        title="Crear Nuevo Insumo"
        fields={[
          { name: "NombreInsumos", label: "Nombre insumo", type: "text" },
          {
            name: "IdCategoria",
            label: "Categoria insumo",
            type: "select",
            options: categorias
              .filter((categoria) => categoria.estado_categoria === 1)
              .map((categoria) => ({
                value: categoria.IdCategoria,
                label: categoria.nombre_categoria,
              })),
          },
          { name: "Imagen", label: "Imagen", type: "file" },
        ]}
        onChange={handleChange}
      />  
      <ModalAgregarProveedor
          open={openModalAgregarProveedor}
          handleClose={handleCloseModalAgregar}
          onSubmit={(formData) => handleSubmitProveedor(formData)} 
          title="Crear Nuevo Proveedor"
          fields={[
            { name: 'NIT', label: 'NIT', type: 'text' },
            { name: 'empresa_proveedor', label: 'Empresa', type: 'text' },
            { name: 'nombre_proveedor', label: 'Nombre', type: 'text' },
            { name: 'correo_proveedor', label: 'Correo', type: 'text' },
            { name: 'telefono_proveedor', label: 'Teléfono', type: 'text' },
            { name: 'direccion_proveedor', label: 'Direccion', type: 'text' },
          ]}
          onChange={handleChange}
        />    
</div>
 );
}

export default CrearCompra;
