import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomSwitch from "../../../components/consts/switch";
import ModalAgregarServicio from "../../../components/consts/modal";
import ModalEditarServicio from "../../../components/consts/modalEditar"; // Cambiado el nombre para mayor claridad
import CamposObligatorios from "../../../components/consts/camposVacios";
import TablePrueba from "../../../components/consts/Tabla";
import Fab from "@mui/material/Fab";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";

const Servicios = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [buscar, setBuscar] = useState("");
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/servicios");
      setServicios(response.data);
    } catch (error) {
      console.error("Error fetching servicios:", error);
    }
  };

  const filtrar = servicios.filter((servicio) => {
    const { Nombre_Servicio, IdServicio } = servicio;
    const terminoABuscar = buscar.toLowerCase();
    const IdServicioString = IdServicio.toString();
    return (
      Nombre_Servicio.toLowerCase().includes(terminoABuscar) ||
      IdServicioString.includes(terminoABuscar)
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/jackenail/Listar_Clientes"
        );
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de clientes:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddServicio = async (formData) => {
    try {
      const { Nombre_Servicio, Precio_Servicio, ImgServicio } = formData;

      if (ImgServicio && ImgServicio.size > 5 * 1024 * 1024) {
        window.alert(
          "El tamaño del archivo de imagen excede el límite permitido (5 MB)."
        );
        return;
      }

      const camposObligatorios = [
        "ImgServicio",
        "Nombre_Servicio",
        "Tiempo_Servicio",
        "Precio_Servicio",
      ];
      if (
        !CamposObligatorios(
          formData,
          camposObligatorios,
          "Por favor, complete todos los campos del servicio."
        )
      ) {
        return;
      }

      let precio = parseFloat(formData["Precio_Servicio"]);
      if (isNaN(precio)) {
        window.Swal.fire({
          icon: "error",
          title: "Precio inválido",
          text: "Por favor, ingresa solo números en el campo del precio.",
        });
        return;
      }

      if (precio <= 20000) {
        window.Swal.fire({
          icon: "error",
          title: "Precio inválido",
          text: "Por favor, ingresa un precio mínimo de $20.000.",
        });
        return;
      }

      const response = await axios.get("http://localhost:5000/api/servicios");
      const servicios = response.data;
      const servicioExistente = servicios.find(
        (servicio) =>
          servicio.Nombre_Servicio === Nombre_Servicio &&
          servicio.IdServicio !== formData.IdServicio
      );

      if (servicioExistente) {
        window.Swal.fire({
          icon: "warning",
          title: "Servicio ya registrado",
          text: "El servicio ingresado ya está registrado.",
        });
        return;
      }

      const confirmation = await window.Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres agregar este servicio?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, agregar",
        cancelButtonText: "Cancelar",
      });

      if (confirmation.isConfirmed) {
        const formDataObj = new FormData();
        for (const key in formData) {
          formDataObj.append(key, formData[key]);
        }
        formDataObj.append("EstadoServicio", 1);
        await axios.post(
          "http://localhost:5000/api/servicios/guardarServicio",
          formDataObj,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        handleCloseModalAgregar();
        fetchServicios();
        window.Swal.fire("¡Servicio agregado!", "", "success");
      }
    } catch (error) {
      console.error("Error al agregar el servicio:", error);
    }
  };

  const handleEditServicio = async (formData) => {
    try {
      const camposObligatorios = [
        "ImgServicio",
        "Nombre_Servicio",
        "Tiempo_Servicio",
        "Precio_Servicio",
      ];

      formData["Precio_Servicio"] = formData["Precio_Servicio"].toString();

      const todosCamposValidos = CamposObligatorios(
        formData,
        camposObligatorios,
        "Por favor, complete todos los campos del servicio."
      );
      if (!todosCamposValidos) {
        return;
      }

      let precio = parseFloat(formData["Precio_Servicio"]);
      if (isNaN(precio)) {
        window.Swal.fire({
          icon: "error",
          title: "Precio inválido",
          text: "Por favor, ingresa solo números en el campo del precio.",
        });
        return;
      }

      if (precio <= 20000) {
        window.Swal.fire({
          icon: "error",
          title: "Precio inválido",
          text: "Por favor, ingresa un precio mínimo de $20.000.",
        });
        return;
      }

      const response = await axios.get("http://localhost:5000/api/servicios");
      const servicios = response.data;
      const servicioExistente = servicios.find(
        (servicio) =>
          servicio.Nombre_Servicio === formData.Nombre_Servicio &&
          servicio.IdServicio !== formData.IdServicio
      );

      if (servicioExistente) {
        window.Swal.fire({
          icon: "warning",
          title: "Servicio ya registrado",
          text: "El servicio ingresado ya está registrado.",
        });
        return;
      }

      const confirmation = await window.Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres actualizar este servicio?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
      });

      if (confirmation.isConfirmed) {
        const formDataObj = new FormData();
        for (const key in formData) {
          formDataObj.append(key, formData[key]);
        }
        await axios.put(
          `http://localhost:5000/api/servicios/editar/${formData.IdServicio}`,
          formDataObj,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        handleCloseModalEditar();
        fetchServicios();
        window.Swal.fire("¡Servicio actualizado!", "", "success");
      }
    } catch (error) {
      console.error("Error al editar el servicio:", error);
    }
  };

  const handleToggleSwitch = async (id) => {
    const servicio = servicios.find((servicio) => servicio.IdServicio === id);
    if (!servicio) {
      console.error("Servicio no encontrado");
      return;
    }

    const newEstado = servicio.EstadoServicio === 1 ? 0 : 1;

    const result = await window.Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: "¿Quieres cambiar el estado del servicio?",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/api/servicios/editar/${id}`, {
          EstadoServicio: newEstado,
        });
        fetchServicios();
        window.Swal.fire({
          icon: "success",
          title: "Estado actualizado",
          text: "El estado del servicio ha sido actualizado correctamente.",
        });
      } catch (error) {
        console.error("Error al cambiar el estado del servicio:", error);
        window.Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al cambiar el estado del servicio. Por favor, inténtalo de nuevo más tarde.",
        });
      }
    }
  };

  const handleChange = (name, value) => {
    setServicioSeleccionado((prevServicio) => ({
      ...prevServicio,
      [name]: value,
    }));
  };

  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
    setServicioSeleccionado(null);
  };

  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setServicioSeleccionado(null);
  };

  const handleEditClick = (servicio) => {
    setServicioSeleccionado(servicio);
    setOpenModalEditar(true);
  };

  const opcionesTiempoServicio = [
    { value: "60", label: "1:00 hora(s)" },
    { value: "120", label: "2:00 horas" },
    { value: "180", label: "3:00 horas" },
    { value: "240", label: "4:00 horas" },
    { value: "300", label: "5:00 horas" },
    { value: "360", label: "6:00 horas" },
  ];
  

  return (
    <div>
      <div className="container mx-auto p-4 relative">
        <div className="md:flex md:justify-between md:items-center mb-4">
          <div>
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
        </div>
      </div>

      <ModalAgregarServicio
        open={openModalAgregar}
        handleClose={handleCloseModalAgregar}
        onSubmit={handleAddServicio}
        title="Crear Nuevo Servicio!"
        fields={[
          { name: "Nombre_Servicio", label: "Nombre", type: "text" },
          {
            name: "Tiempo_Servicio",
            label: "Tiempo",
            type: "select",
            options: opcionesTiempoServicio,
          },
          { name: "Descripcion_Servicio", label: "Descripcion", type: "text" },
          { name: "Precio_Servicio", label: "Precio", type: "number" }, 
          { name: "ImgServicio", label: "Imagen", type: "file" },
        ]}
        onChange={handleChange}
      />

      <ModalEditarServicio
        open={openModalEditar}
        handleClose={handleCloseModalEditar}
        onSubmit={handleEditServicio}
        title="Editar Servicio"
        fields={[
          {
            name: "IdServicio",
            label: "Identificador",
            type: "number",
            readOnly: true,
          },
          { name: "Nombre_Servicio", label: "Nombre", type: "text" },
          {
      name: "Tiempo_Servicio",
      label: "Tiempo",
      type: "select",
      options: opcionesTiempoServicio,
    },
          { name: "Descripcion_Servicio", label: "Descripcion", type: "textarea" }, 

          { name: "Precio_Servicio", label: "Precio", type: "number" }, // Asegúrate de que 'type' sea 'number'
          { name: "ImgServicio", label: "Imagen", type: "file" },
        ]}
        onChange={handleChange}
        entityData={servicioSeleccionado}
      />

      <TablePrueba
        columns={[
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
                <Tooltip title="Imagen del Servicio">
                  <img
                    src={`http://localhost:5000${params.row.ImgServicio}`}
                    alt="Imagen"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "50%",
                    }}
                  />
                </Tooltip>
              </div>
            ),
          },

          { field: "Nombre_Servicio", headerName: "NOMBRE", width: "w-36" },
          {
            field: "Tiempo_Servicio",
            headerName: "TIEMPO EN HORAS",
            width: "w-36",
          },
          {
            field: "Precio_Servicio",
            headerName: "PRECIO",
            width: "w-36",
            renderCell: (params) => (
              <div>
                {params.row.Precio_Servicio.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP'
                })}
              </div>
            ),
          },
          {
            field: "Descripcion_Servicio",
            headerName: "Descripción",
            width: 300,
            renderCell: (params) => (
              <Tooltip
                title={
                  <span style={{ fontSize: "16px" }}>
                    {params.row.Descripcion_Servicio}
                  </span>
                }
              >
                <span>
                  {params.row.Descripcion_Servicio.length > 20
                    ? params.row.Descripcion_Servicio.substring(0, 20) + "..."
                    : params.row.Descripcion_Servicio}
                </span>
              </Tooltip>
            ),
          },
          {
            field: "Acciones",
            headerName: "ACCIONES",
            width: "w-48",
            renderCell: (params) => (
              <div className="flex justify-center space-x-4">
                {params.row.EstadoServicio === 1 && (
                  <button
                    onClick={() => handleEditClick(params.row)}
                    className="text-yellow-500"
                  >
                    <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
                  </button>
                )}
                <CustomSwitch
                  active={params.row.EstadoServicio === 1}
                  onToggle={() => handleToggleSwitch(params.row.IdServicio)}
                />
              </div>
            ),
          },
        ]}
        data={filtrar}
        title={"Gestion de Servicios"}
      />
    </div>
  );
};

export default Servicios;
