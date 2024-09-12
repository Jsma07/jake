import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ModalDinamico from "../../components/consts/modaled";
import CustomSwitch from "../../components/consts/switch";
import TablePrueba from "../../components/consts/Tabla";
import Modal from "../../components/consts/modalContrasena";
import { toast } from "react-toastify";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleado, setEmpleado] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [roles, setRoles] = useState([]);

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChangeClick = (IdEmpleado) => {
    const empleadoSeleccionado = empleados.find(
      (empleado) => empleado.IdEmpleado === IdEmpleado
    );
    if (empleadoSeleccionado) {
      setSeleccionado(empleadoSeleccionado);
      setOpenPasswordModal(true);
    } else {
      console.error("Empleado no encontrado");
    }
  };

  const handlePasswordModalClose = () => {
    setOpenPasswordModal(false);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
    setSeleccionado(null); // Limpiar el empleado seleccionado al cerrar el modal
  };

  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/roles");
        console.log("Roles response:", response.data);

        // Filtrar para excluir roles de Administrador (ID 1) y Cliente (ID 4)
        const rolesFiltrados = response.data.filter(
          (role) => role.idRol !== 1 && role.idRol !== 4
        );

        setRoles(rolesFiltrados);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/jackenail/Listar_Empleados"
        );
        const empleadosConRol = response.data.map((empleado) => ({
          ...empleado,
          Rol: empleado.role?.nombre || "Sin rol", // Añade el nombre del rol directamente
        }));
        setEmpleados(empleadosConRol);
      } catch (error) {
        console.error("Error al obtener los datos de empleados:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (data) => {
    console.log("Datos del empleado al abrir el modal:", data);
    setModalData({
      ...data,
    });
  };

  const columns = [
    { field: "Tip_Documento", headerName: "Tipo de Documento" }, // Tipo de Documento primero
    { field: "Nombre", headerName: "Nombre" },
    { field: "Apellido", headerName: "Apellido" },
    { field: "Correo", headerName: "Correo" },
    { field: "Telefono", headerName: "Teléfono" },
    { field: "Documento", headerName: "Documento" },
    { field: "Direccion", headerName: "Dirección" },
    {
      field: "Rol",
      headerName: "Rol",
      valueGetter: (params) => params.row.role?.nombre || "Sin rol",
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      width: "w-48",
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          {params.row.Estado === 1 && (
            <button
              className="text-yellow-500 p-2"
              onClick={() =>
                handleOpenModal({
                  ...params.row,
                  modo: "actualizacion",
                  seleccionado: params.row,
                })
              }
            >
              <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>{" "}
            </button>
          )}

          {params.row.Estado === 1 && (
            <button
              onClick={() => handlePasswordChangeClick(params.row.IdEmpleado)}
              className="text-black-500"
            >
              <i className="bx bx-lock" style={{ fontSize: "24px" }}></i>{" "}
            </button>
          )}

          <CustomSwitch
            active={params.row.Estado === 1}
            onToggle={() => handleToggleSwitch(params.row.IdEmpleado)}
          />
        </div>
      ),
    },
  ];

  const handleSubmit = async (formData) => {
    try {
      // Verificar si el correo electrónico está duplicado
      const correoExistente = empleados.some(
        (empleado) => empleado.Correo === formData.Correo
      );

      const documentoExistente = empleados.some(
        (empleado) => empleado.Documento === formData.Documento
      );

      if (correoExistente) {
        toast.error(
          "El correo electrónico ingresado ya está registrado. Por favor, elija otro correo electrónico."
        );
      } else if (documentoExistente) {
        toast.error(
          "El documento ingresado ya está registrado. Por favor, elija otro documento."
        );
      } else {
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Quieres registrar este empleado?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          const formDataNumerico = {
            Nombre: formData.Nombre,
            Apellido: formData.Apellido,
            Correo: formData.Correo,
            Telefono: formData.Telefono,
            Estado: 1,
            IdRol: formData.Rol,
            Documento: formData.Documento,
            Direccion: formData.Direccion,
            Tip_Documento: formData.Tip_Documento,
            Contrasena: formData.Contrasena,
            Img: formData.Img,

          };

          console.log("Datos del formulario numéricos:", formDataNumerico);

          const response = await axios.post(
            "http://localhost:5000/Jackenail/RegistrarEmpleados",
            formDataNumerico
          );

          const nuevoEmpleado = response.data;

          // Busca el rol correspondiente para mostrar en la tabla
          const rolCorrespondiente = roles.find(
            (role) => role.idRol === formDataNumerico.IdRol
          );

          // Añadir el nuevo empleado a la lista con el rol asignado
          setEmpleados((prevEmpleados) => [
            ...prevEmpleados,
            {
              ...nuevoEmpleado,
              Rol: rolCorrespondiente ? rolCorrespondiente.nombre : "Sin rol",
            },
          ]);

          Swal.fire({
            icon: "success",
            title: "¡Registro exitoso!",
            text: "El empleado se ha registrado correctamente.",
          });

          setModalData(null);
        }
      }
    } catch (error) {
      console.error("Error al registrar el empleado:", error);
      console.error(
        "Detalles del error:",
        error.response ? error.response.data : error.message
      );

      toast.error(
        "Ocurrió un error al registrar el empleado. Inténtelo nuevamente."
      );
    }
  };

  const handleToggleSwitch = async (id) => {
    const updatedEmpleados = empleados.map((empleado) => {
      if (empleado.IdEmpleado === id) {
        const newEstado = empleado.Estado === 1 ? 0 : 1;
        return { ...empleado, Estado: newEstado };
      }
      return empleado;
    });

    try {
      const updatedEmpleado = updatedEmpleados.find(
        (empleado) => empleado.IdEmpleado === id
      );
      if (!updatedEmpleado) {
        console.error("No se encontró el empleado actualizado");
        return;
      }

      const result = await Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: "¿Quieres cambiar el estado del empleado?",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await axios.put(
          `http://localhost:5000/Jackenail/CambiarEstadoEmpleado/${id}`,
          {
            Estado: updatedEmpleado.Estado,
          }
        );
        setEmpleados(updatedEmpleados);

        toast.success(
          "El estado del empleado ha sido actualizado correctamente.",
          {
            position: "bottom-right",
            autoClose: 3000, // Cierra automáticamente después de 3 segundos
          }
        );
      }
    } catch (error) {
      console.error("Error al cambiar el estado del empleado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cambiar el estado del empleado. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const handleActualizacionSubmit = async (formData) => {
    try {
      // Verificar si el correo o documento ya están en uso por otro empleado
      const empleadoExistente = empleados.find(
        (empleado) =>
          (empleado.Correo === formData.Correo ||
            empleado.Documento === formData.Documento) &&
          empleado.IdEmpleado !== formData.IdEmpleado
      );

      if (empleadoExistente) {
        Swal.fire({
          icon: "error",
          title: "Error de actualización",
          text: "El correo electrónico o el documento ya están registrados para otro empleado. Por favor, elija otro correo electrónico o documento.",
        });
        return;
      }

      // Convertir el teléfono a número entero
      const formDataNumerico = {
        ...formData,
        Telefono: parseInt(formData.Telefono, 10),
        
      };

      // Construir la URL para la solicitud PUT
      const url = `http://localhost:5000/Jackenail/ActualizarEmpleados/${formDataNumerico.IdEmpleado}`;

      // Realizar la solicitud PUT
      await axios.put(url, formDataNumerico);

      // Actualizar la lista de empleados en el estado
      setEmpleados((prevEmpleados) =>
        prevEmpleados.map((empleado) =>
          empleado.IdEmpleado === formDataNumerico.IdEmpleado
            ? {
                ...empleado,
                ...formDataNumerico,
                Rol:
                  roles.find((role) => role.idRol === formDataNumerico.IdRol)
                    ?.nombre || "Sin rol",
              }
            : empleado
        )
      );

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "¡Actualización exitosa!",
        text: "El empleado se ha actualizado correctamente.",
      }).then((result) => {
        if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
          setModalData(null); // Cerrar el modal si se confirma o se cierra
        }
      });
    } catch (error) {
      console.error("Error al actualizar el empleado:", error);
      // Mostrar mensaje de error
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrió un error al actualizar el empleado.",
        footer: '<a href="#">Inténtelo nuevamente</a>',
      });
    }
  };

  const empleadosFiltrados = empleados.filter((empleado) => {
    // Convertir el filtro a minúsculas una vez
    const filtroLower = filtro.toLowerCase();

    // Verificar y convertir cada campo a minúsculas si está definido
    const nombreLower = empleado.Nombre ? empleado.Nombre.toLowerCase() : "";
    const apellidoLower = empleado.Apellido
      ? empleado.Apellido.toLowerCase()
      : "";
    const correoLower = empleado.Correo ? empleado.Correo.toLowerCase() : "";
    const documentoLower = empleado.Documento
      ? empleado.Documento.toLowerCase()
      : "";

    return (
      nombreLower.includes(filtroLower) ||
      apellidoLower.includes(filtroLower) ||
      correoLower.includes(filtroLower) ||
      documentoLower.includes(filtroLower) ||
      empleado.Telefono.toString().includes(filtro) ||
      (empleado.Estado === 1 ? "Activo" : "Inactivo")
        .toLowerCase()
        .includes(filtroLower)
    );
  });

  const handleSubmitPasswordChange = async (newPassword, confirmPassword) => {
    // Paso 1: Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      console.error(
        "Las contraseñas no coinciden:",
        newPassword,
        confirmPassword
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
      });
      return;
    }

    // Paso 2: Validar que la contraseña tenga al menos 8 caracteres
    if (newPassword.length < 8) {
      console.error("La contraseña es demasiado corta:", newPassword);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }

    try {
      // Paso 3: Realizar la solicitud PUT para actualizar la contraseña
      console.log("Datos a enviar al servidor:", {
        IdEmpleado: seleccionado.IdEmpleado,
        newPassword: newPassword,
      });

      const response = await axios.put(
        `http://localhost:5000/Jackenail/Empleado/${seleccionado.IdEmpleado}`,
        {
          Contrasena: newPassword,
        }
      );

      // Verificar la respuesta de la solicitud PUT
      console.log("Respuesta de la API:", response);

      if (response.status === 200) {
        // La solicitud PUT fue exitosa
        console.log("Contraseña actualizada correctamente");
        Swal.fire({
          icon: "success",
          title: "Contraseña actualizada",
          text: "La contraseña del empleado ha sido actualizada correctamente.",
        });

        // Cerrar el modal después de actualizar la contraseña
        handlePasswordModalClose();
      } else {
        // Manejar un caso donde la solicitud no tenga éxito
        console.error("Error en la solicitud PUT:", response);
        throw new Error("Error al actualizar la contraseña del empleado");
      }
    } catch (error) {
      // Manejar errores capturados durante la solicitud PUT
      console.error("Error al cambiar la contraseña del empleado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cambiar la contraseña del empleado. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  return (
    <div
      style={{
        paddingTop: "5px",
        margin: "0 auto",
        borderRadius: "40px",
        marginTop: "20px",
        boxShadow: "0 4px 12px rgba(128, 0, 128, 0.1)",
        position: "fixed",
        left: "90px",
        top: "80px",
        width: "calc(100% - 100px)",
        overflowY: "auto",
      }}
      className="w-full mx-auto max-w-full"
    >
      <TablePrueba
        title="Gestion de Empleados"
        columns={columns}
        data={empleados}
        roles={roles}
      />
      {modalData && !modalData.modo && (
        <ModalDinamico
          open={true}
          handleClose={() => setModalData(null)}
          title="Registrar empleados"
          fields={[
            {
              label: "Tip_Documento",
              name: "Tip_Documento",
              type: "select",
              required: true,
              options: [
                { value: "C.C", label: "Cédula de Ciudadanía (C.C)" },
                { value: "C.E", label: "Cédula de extranjería (C.E)" },
              ],
            },
            {
              label: "Documento",
              name: "Documento",
              type: "text",
              required: true,
              icon: "bx-id-card",
            },
            {
              label: "Nombre",
              name: "Nombre",
              type: "text",
              required: true,
              icon: "bx-user", // Icono para el nombre

            },
            {
              label: "Apellido",
              name: "Apellido",
              type: "text",
              required: true,
            },
            {
              label: "Correo",
              name: "Correo",
              type: "text",
              required: true,
            },
            {
              label: "Teléfono",
              name: "Telefono",
              type: "text",
              required: true,
              icon: "bx-phone", // Icono para el teléfono

            },
            {
              label: "Dirección",
              name: "Direccion",
              type: "text",
              required: true,
              icon: "bx-home", // Icono para la dirección

            },
            {
              label: "Contraseña",
              name: "Contrasena",
              type: "password",
              required: true,
            },
            {
              label: "Rol",
              name: "Rol",
              type: "select",
              required: true,
              options: roles.map((role) => ({
                value: role.idRol,
                label: role.nombre,
              })),
            },
          ]}
          onSubmit={handleSubmit}
          seleccionado={modalData.seleccionado} // Asegúrate de que `modalData.seleccionado` tiene el rol seleccionado
        />
      )}

      {modalData && modalData.modo === "actualizacion" && (
        <ModalDinamico
          open={true}
          handleClose={() => setModalData(null)}
          title="Actualizar Empleado"
          fields={[
            {
              label: "Tip_Documento",
              name: "Tip_Documento",
              type: "select",
              required: true,
              options: [
                { value: "C.C", label: "Cédula de Ciudadanía (C.C)" },
                { value: "C.E", label: "Cédula de extranjería (C.E)" },
              ],
            },
            {
              label: "Nombre",
              name: "Nombre",
              type: "text",
              required: true,
            },
            {
              label: "Apellido",
              name: "Apellido",
              type: "text",
              required: true,
            },
            {
              label: "Correo",
              name: "Correo",
              type: "text",
              required: true,
            },
            {
              label: "Teléfono",
              name: "Telefono",
              type: "text",
              required: true,
            },
            {
              label: "Documento",
              name: "Documento",
              type: "text",
              required: true,
            },
            {
              label: "Rol",
              name: "IdRol",
              type: "select",
              required: true,
              options: roles.map((role) => ({
                value: role.idRol, // ID del rol como valor
                label: role.nombre, // Nombre del rol como texto visible
              })),
              defaultValue: modalData.seleccionado.IdRol, // Usa el ID del rol como valor por defecto
            },
            {
              label: "Direccion",
              name: "Direccion",
              type: "text",
              required: true,
            },
          ]}
          onSubmit={handleActualizacionSubmit}
          seleccionado={modalData.seleccionado}
        />
      )}

      <Modal
        open={openPasswordModal}
        handleClose={handlePasswordModalClose}
        handleSubmit={handleSubmitPasswordChange}
      />
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-xl hover:shadow-2xl"
        style={{
          right: "4rem",
          bottom: "4rem",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
        }}
        onClick={() => handleOpenModal(empleado)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

export default Empleados;
