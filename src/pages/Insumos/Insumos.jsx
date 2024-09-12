import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../../components/consts/Tabla";
import ModalAgregarInsumo from "../../components/consts/modal";
import ModalEditarInsumo from "../../components/consts/modalEditar";
import CamposObligatorios from "../../components/consts/camposVacios";
import handleAddInsumo from './agregarInsumo';
import Fab from "@mui/material/Fab";

const Insumos = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [insumos, setInsumos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [buscar, setBuscar] = useState("");

  useEffect(() => {
    fetchInsumos();
    fetchCategorias();
  }, []);

  const fetchInsumos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/insumos");
      console.log("Insumos fetched:", response.data); 
      setInsumos(response.data);
    } catch (error) {
      console.error("Error fetching insumos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const filtrar = insumos.filter((insumo) => {
    const {NombreInsumos,Cantidad,PrecioUnitario,IdCategoria,IdInsumos,Estado,} = insumo;
    const terminoABuscar = buscar.toLowerCase();

    const IdInsumoString = IdInsumos?.toString() || "";
    const PrecioUnitarioString = PrecioUnitario?.toString() || "";
    const CantidadString = Cantidad?.toString() || "";
    const IdCategoriaString = IdCategoria?.toString() || "";

    const categoria = categorias.find((c) => c.IdCategoria === IdCategoria);
    const nombreCategoria = categoria
      ? categoria.nombre_categoria.toLowerCase()
      : "";

    return (
      NombreInsumos.toLowerCase().includes(terminoABuscar) ||
      Estado.toLowerCase().includes(terminoABuscar) ||
      PrecioUnitarioString.includes(terminoABuscar) ||
      CantidadString.includes(terminoABuscar) ||
      nombreCategoria.includes(terminoABuscar) ||
      IdInsumoString.includes(terminoABuscar)
    );
  });

  const handleEditInsumo = async (formData) => {
    try {
      const camposObligatorios = ["NombreInsumos","Imagen","Idcategoria"];

      if (
        !CamposObligatorios(
          formData,
          camposObligatorios,
          "Por favor, complete todos los campos del insumo."
        )
      ) {
        return;
      }

      const formatNombreInsumo = (nombre) => {
        const nombreSinEspacios = nombre.trim();
        const nombreMinusculas = nombreSinEspacios.toLowerCase();
        const nombreFormateado = nombreMinusculas.charAt(0).toUpperCase() + nombreMinusculas.slice(1);
        return nombreFormateado;
    };

    formData.NombreInsumos = formatNombreInsumo(formData.NombreInsumos);
    const response = await axios.get('http://localhost:5000/api/insumos');
    const insumos = response.data;
    const insumoExistente = insumos.find(insumo => insumo.NombreInsumos === formData.NombreInsumos && insumo.IdInsumos !== formData.IdInsumos);

      if (insumoExistente) {
        window.Swal.fire({
          icon: "warning",
          title: "Insumo ya registrado",
          text: "El insumo ingresado ya está registrado.",
        });
        return;
      }
  
      const confirmation = await window.Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres actualizar este insumo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
      });
  
      if (confirmation.isConfirmed) {
        const formDataWithNumbers = new FormData();
        formDataWithNumbers.append("NombreInsumos", formData.NombreInsumos);
        formDataWithNumbers.append("Imagen", formData.Imagen); 
        formDataWithNumbers.append("Estado", formData.Estado);
        formDataWithNumbers.append("IdCategoria", formData.Idcategoria);

  
        const response = await axios.put(
          `http://localhost:5000/api/insumos/editar/${formData.IdInsumos}`,
          formDataWithNumbers,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        handleCloseModalEditar();
        fetchInsumos(); 
        window.Swal.fire("¡Insumo actualizado!", "", "success");
      }
    } catch (error) {
      console.error("Error al editar insumo:", error);
      window.Swal.fire("Error", "Hubo un error al intentar actualizar el insumo", "error");
    }
  };
  
  const handleChange = (name, value) => {
    setInsumoSeleccionado((prevInsumo) => ({
      ...prevInsumo,
      [name]: value,
    }));
  };

  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
    setInsumoSeleccionado(null);
  };

  const handleSubmit = (formData) => {
    handleAddInsumo(formData, handleCloseModalAgregar, fetchInsumos);
};

  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setInsumoSeleccionado(null);
  };

  const handleEditClick = (insumo) => {
    setInsumoSeleccionado(insumo);
    setOpenModalEditar(true);
  };

  return (
    <div className="container mx-auto p-4 relative">

      <ModalAgregarInsumo
        open={openModalAgregar}
        handleClose={handleCloseModalAgregar}
        onSubmit={handleSubmit}
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
      <ModalEditarInsumo
        open={openModalEditar}
        handleClose={handleCloseModalEditar}
        onSubmit={handleEditInsumo}
        title="Editar Insumo"
        fields={[
          {
            name: "IdInsumos",
            label: "Identificador",
            type: "number",
            readOnly: true,
          },
          { name: "NombreInsumos", label: "Nombre insumo", type: "text" },
          {
            name: "Idcategoria",
            label: "Categoria",
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
        entityData={insumoSeleccionado}
      />

      <Table
        columns={[
          { field: "nombre_categoria", headerName: "CATEGORIA", width: "w-36" },
          {
            field: "Imagen",
            headerName: "IMAGEN",
            width: "w-32",
            renderCell: (params) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <img
                  src={`http://localhost:5000${params.row.imagen}`}  
                  alt="Imagen"
                  style={{ maxWidth: "100%", height: "auto", width: "3rem", height: "3rem", borderRadius: "50%" }}
                />
              </div>
            ),
          },
          {
            field: "NombreInsumos",
            headerName: "INSUMO",
            width: "w-36",
          },
          { field: "Cantidad", headerName: "CANTIDAD", width: "w-36" },
          {
            field: 'Precio_Servicio',
            headerName: 'PRECIO',
            width: 'w-36',
            renderCell: (params) => <div>{`${params.row.PrecioUnitario}`}</div>,
          },
          {
            field: "Estado",
            headerName: "ESTADO",
            width: "w-36",
            readOnly: true,
            renderCell: (params) => (
              <div>
                {params.row.Estado === "Agotado" && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                    Agotado
                  </span>
                )}
                {params.row.Estado === "Disponible" && (
                  <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                    Disponible
                  </span>
                )}
              </div>
            )
          },
          {
            field: "Acciones",
            headerName: "ACCIONES",
            width: "w-48",
            renderCell: (params) => (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleEditClick(params.row)}
                  className="text-yellow-500"
                >
                  <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
                </button>
              </div>
            ),
          },
        ]}
        data={filtrar}
        title={'Gestion de insumos'}

      />
      <Fab
        aria-label="add"
        style={{
          border: "0.5px solid grey",
          backgroundColor: "#94CEF2",
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 1000,
        }}
        onClick={() => setOpenModalAgregar(true)}
      >
        <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
      </Fab>
    </div>
  );
};

export default Insumos;
