import CustomSwitch from "../../components/consts/switch"; // se importa el componente del switch
import React, { useEffect, useState } from "react";
import ModalDinamico from "../../components/consts/modalJ"; // se importa el componente del modal
import Table from "../../components/consts/Tabla"; // se importa el componente de la tabla
import axios from "axios";
import Fab from "@mui/material/Fab";
import Modal from "../../components/consts/modalContrasena";  // se importa el componente del modal para la contraseña
import { toast} from "react-toastify";


const Usuarios = () => {
  const [openModal, setOpenModal] = useState(false); // Estado para controlar el modal para crear y editar un usuario administrador
  const [users, setUsers] = useState([]); // hook donde se guardan los usuarios traidos de la api
  const [roles, setRoles] = useState([]);// hook donde se guardan los roles traidos de la api
  const [seleccionado, setSeleccionado] = useState(null); // hook para verificar si se esta editando un usuario y posteriormente traer su informacion
  const [buscar, setBuscar] = useState(""); // hook para controlar lo que ingresa el usuario para se buscado por ciertos criterios
  const [rolesActivos, setRolesActivos] = useState([]); // hook para guardar unicamente los roles activos 
  const [openPasswordModal, setOpenPasswordModal] = useState(false); // Nuevo estado para controlar el modal de cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    Documento: "",
  });

  useEffect(() => {
    // Filtrar roles activos
    const rolesFiltrados = roles.filter((rol) => rol.EstadoRol === 1);
    setRolesActivos(rolesFiltrados);
  }, [roles]);

  useEffect(() => {
    //Traer los roles desde la api
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/roles");
        console.log("Roles response:", response.data);
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      }
    };
    // trear los usuarios desde la api
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data.usuarios);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchRoles();
    fetchUsers();
  }, []);

  const filtrar = users.filter((user) => {
    const {
      nombre = "",
      apellido = "",
      Documento = "",
      tipoDocumento = "",
      correo = "",
      telefono = "",
      rolId,
    } = user;

    // Solo mostrar usuarios con el rol de idRol 1
    if (rolId !== 1) {
      return false;
    }

    const terminoABuscar = buscar.toLowerCase(); //variable donde se almacena el termino ingresado por el usuario para posteriormente ser buscado
    const rol = roles.find((role) => role.idRol === rolId);
    const nombreRol = rol ? rol.nombre : "";

    return (
      nombre.toLowerCase().includes(terminoABuscar) ||
      apellido.toLowerCase().includes(terminoABuscar) ||
      correo.toLowerCase().includes(terminoABuscar) ||
      telefono.includes(terminoABuscar) ||
      Documento.includes(terminoABuscar) ||
      tipoDocumento.toLowerCase().includes(terminoABuscar) || // Filtrar por tipoDocumento

      nombreRol.toLowerCase().includes(terminoABuscar)
    );
  });

  //maneja el switch para cambiar el estado del usuario ya sea activo(1) o inactivo(0)
  const handleToggleSwitch = async (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, estado: user.estado === 1 ? 0 : 1 } : user
    );

    try {
      const updatedUser = updatedUsers.find((user) => user.id === id);
      if (!updatedUser) {
        console.error("No se encontró el usuario actualizado");
        return;
      }

      const result = await window.Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: "¿Quieres cambiar el estado del usuario?",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });
      // si se confirma se procede a enviar la peticion a la api para cambiar el estado del usuario
      if (result.isConfirmed) {
        await axios.put(`http://localhost:5000/api/editarUsuario/${id}`, {
          estado: updatedUser.estado,
        });
        setUsers(updatedUsers);
        toast.success("El estado del usuario fue cambiado exitosamente.", {
          position: "top-right",
          autoClose: 3000, // Cierra automáticamente después de 3 segundos
        });
      }
    } catch (error) {
      console.error("Error al cambiar el estado del usuario:", error);
      toast.error("Hubo un error al cambiar el estado del usuario. Por favor, inténtalo de nuevo más tarde.", {
        position: "bottom-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
    }
  };

  const handleEditClick = (id) => {
    if (users.length === 0) {
      return;
    }

    // se verifica que el usuario este en el hook users donde se cargan todos los usuarios
    const usuarioEditar = users.find((user) => user.id === id);
    if (!usuarioEditar) {
      console.log("Usuario no encontrado");
      return;
    }

    setSeleccionado(usuarioEditar);
    setOpenModal(true);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  //procedimiento para cerrar el modal y restablecer los valores de los errores
  const handleCloseModal = () => {
    setOpenModal(false);
    setSeleccionado(null);
    setErrors({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      Documento: "",
    });
  };

  const handleCrearUsuarioClick = () => {
    handleOpenModal();
  };
  //procedimiento para cerrar el modal de restablecimiento de contraseña
  const handlePasswordModalClose = () => {
    setOpenPasswordModal(false);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
  };

  //metodo para enviar la nueva contraseña a la api
  const handleSubmitPasswordChange = async (newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.", {
        position: "bottom-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
      return;
    }

    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres", {
        position: "bottom-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
      return;
    }

    try {
      //peticion put para actualizar la contraseña del usuario seleccionado
      await axios.put(
        `http://localhost:5000/api/actualizarContrasena/${seleccionado.id}`,
        {
          newPassword: newPassword,
        }
      );
      toast.success("La contraseña del usuario ha sido actualizada correctamente.", {
        position: "bottom-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
      handlePasswordModalClose(); // Cerrar el modal después de actualizar la contraseña
    } catch (error) {
      console.error("Error al cambiar la contraseña del usuario:", error);
      toast.error("Hubo un error al cambiar la contraseña del usuario. Por favor, inténtalo de nuevo más tarde.", {
        position: "bottom-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
    }
  };

  //Trae el id del usuario seleccionado para editar su contrasela y abrir el modal
  const handlePasswordChangeClick = (id) => {
    const usuarioSeleccionado = users.find((user) => user.id === id);
    if (usuarioSeleccionado) {
      setSeleccionado(usuarioSeleccionado);
      setOpenPasswordModal(true);
    } else {
      console.error("Usuario no encontrado");
    }
  };

  //metodo para enviar los datos del usuario ya sea editarlo o crearlo
  const handleSubmit = async (formData) => {
    const mandatoryFields = [
      "nombre",
      "correo",
      "apellido",
      "telefono",
      "rolId",
      "contrasena",
      "Documento",
    ];

    const emptyFields = mandatoryFields.filter((field) => {
      const value = formData[field];
      if (field === "rolId") {
        return value === undefined || value.toString().trim() === "";
      }
      return typeof value !== "string" || value.trim() === "";
    });

    if (emptyFields.length > 0) {
      window.Swal.fire({
        icon: "error",
        title: "Campos obligatorios vacíos",
        text: "Por favor, completa todos los campos obligatorios antes de continuar.",
      });
      return;
    }

    const validacionCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!validacionCorreo.test(formData.correo)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        correo: "El correo ingresado tiene un formato inválido.",
      }));
      return;
    }

    const validacionNombreApellido = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;

    if (!validacionNombreApellido.test(formData.nombre)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        nombre: "El nombre ingresado tiene caracteres no válidos.",
      }));
      return;
    }

    if (!validacionNombreApellido.test(formData.apellido)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apellido: "El apellido ingresado tiene caracteres no válidos.",
      }));
      return;
    }

    const validacionDocumento = /^[0-9]{1,10}$/;

    if (!validacionDocumento.test(formData.Documento)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Documento: "El documento ingresado debe contener solo números.",
      }));
      return;
    }

    const validacionTelefono = /^[0-9]{7,15}$/;

    if (!validacionTelefono.test(formData.telefono)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        telefono: "El teléfono ingresado debe contener solo números.",
      }));
      return;
    }
    
    const rolSeleccionado = rolesActivos.find(
      (rol) => rol.idRol === formData.rolId
    );
    if (!rolSeleccionado) {
      toast.error("El rol seleccionado está inactivo. Por favor selecciona un rol activo.", {
        position: "bottom-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
      return;
    }

    try {
      const result = await window.Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: `¿Quieres ${seleccionado ? "editar" : "crear"} el usuario?`,
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        return;
      }

      // Verificar si el Documento ya existe
      const DocumentoExiste = users.some(
        (user) =>
          user.Documento === formData.Documento && user.id !== seleccionado?.id
      );

      if (DocumentoExiste) {
        toast.error("El Documento ingresado ya está en uso. Por favor, utiliza otro Documento.", {
          position: "bottom-right",
          autoClose: 3000, // Cierra automáticamente después de 3 segundos
        });
        return;
      }

      let response;
      if (seleccionado) {
        response = await axios.put(
          `http://localhost:5000/api/editarUsuario/${seleccionado.id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const updatedUsers = users.map((user) =>
          user.id === seleccionado.id ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers);
        toast.success("El usuario ha sido editado correctamente.", {
          position: "bottom-right",
          autoClose: 3000, // Cierra automáticamente después de 3 segundos
        });
      } else {
        formData.estado = 1;
        response = await axios.post(
          "http://localhost:5000/api/crearUsuario",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("El usuario ha sido creado correctamente.", {
          position: "bottom-right",
          autoClose: 3000, // Cierra automáticamente después de 3 segundos
        });
        setUsers([...users, formData]);
      }

      console.log("Respuesta del servidor:", response.data);
      handleCloseModal();
    } catch (error) {
      console.error("Error al crear/editar usuario:", error);
      toast.error("Hubo un error al crear/editar el usuario. Por favor, inténtalo de nuevo más tarde.", {
        position: "bottom-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
    } 
  };

  // columnas para ser pasadas como props al componente de la tabla
  const columns = [
    { field: "tipoDocumento", headerName: "Tipo de documento", width: "w-60" },

    { field: "Documento", headerName: "Documento", width: "w-50" },

    { field: "nombre", headerName: "Nombre", width: "w-50" },
    { field: "apellido", headerName: "Apellido", width: "w-50" },
    { field: "correo", headerName: "Correo", width: "w-50" },
    { field: "telefono", headerName: "Teléfono", width: "w-50" },
    // {
    //   field: "rolId",
    //   headerName: "Rol",
    //   width: "w-36",
    //   renderCell: (params) => {
    //     const rol = roles.find((role) => role.id === params.value);
    //     return rol.nombre;
    //   },
    // },
    {
      field: "Acciones",
      headerName: "Acciones",
      width: "w-48",
      renderCell: (params) => (
         
        <div className="flex justify-center space-x-4">
          {params.row.estado === 1 && (
          <Fab
          style={{
            fontSize: '16px', 
            width: '40px',  
            height: '40px',   
            backgroundColor: '#F0F0F0'  
          }}
            onClick={() => handleEditClick(params.row.id)}
            className="text-yellow-500"
          >
            <i className="bx bx-edit" style={{ fontSize: "23px", color: "#F0AC00" }}></i>
          </Fab>
          )}
          {params.row.estado === 1  && (
          <Fab
          style={{
            fontSize: '16px', 
            width: '40px',  
            height: '40px',   
            backgroundColor: '#F0F0F0',
          }}
            onClick={() => {
              handlePasswordChangeClick(params.row.id); // Abrir el modal de contraseña al hacer clic
            }}
            className="text-black-500"
          >
            <i className="bx bx-lock" style={{ fontSize: "24px" }}></i>{" "}
          </Fab>
          )}
          
          <CustomSwitch
            active={params.row.estado === 1}
            onToggle={() => handleToggleSwitch(params.row.id)}
          />
        </div>
      ),
    },
  ];
  // console.log("Roles en Usuarios:", roles); // Verifica los roles aquí antes de pasarlos a la tabla



  return (
    <div className="container mx-auto p-4 relative">
      
        <div>
          <Modal
            open={openPasswordModal}
            handleClose={handlePasswordModalClose}
            handleSubmit={handleSubmitPasswordChange}
          />
          <ModalDinamico
            seleccionado={seleccionado}
            open={openModal}
            handleClose={handleCloseModal}
            onSubmit={handleSubmit}
            
            title={
              seleccionado
                ? "Editar Administrador"
                : "Crear nuevo Administrador"
            }
            fields={[
              {
                name: "tipoDocumento",
                type: "select",
                options: [
                  { value: "C.C", label: "Cédula de Ciudadanía (C.C)" },
                  { value: "C.E", label: "Cédula de extranjería (C.E)" },
                ],
                value: seleccionado ? seleccionado.tipoDocumento : "C.C", 
                disabled: false, 
              },
              {
                name: "Documento",
                label: "Tipo de Documento",
                type: "text",
                value: seleccionado ? seleccionado.Documento : "",
              },
              {
                name: "nombre",
                label: "Nombre",
                type: "text",
                value: seleccionado ? seleccionado.nombre : "",
              },
              {
                name: "apellido",
                label: "Apellido",
                type: "text",
                value: seleccionado ? seleccionado.apellido : "",
              },
              {
                name: "correo",
                label: "Correo",
                type: "text",
                value: seleccionado ? seleccionado.correo : "",
              },
              {
                name: "telefono",
                label: "Teléfono",
                type: "text",
                value: seleccionado ? seleccionado.telefono : "",
                maxLength: 15,
                minlength: 7,
              },
              
              {
                name: "rolId",
                // label: "Rol",
                type: "select",
                options: roles
                  .filter((role) => role.idRol === 1) // Filtrar para mostrar solo el rol con idRol 1
                  .map((role) => ({
                    value: role.idRol,
                    label: role.nombre,
                  })),
                value: 1, // Siempre seleccionar el rol con idRol 1
                disabled: true, // Deshabilitar el select
              },
              {
                name: "contrasena",
                label: "Contraseña",
                type: "password",
                value: seleccionado ? seleccionado.contrasena : "",

                hidden: seleccionado,
              },
            ]}
          />
        
      </div>
      <Table title="Gestión de administradores" columns={columns} data={filtrar}  />
      <Fab
        aria-label="add"
        style={{
          border: "0.5px solid grey",
          backgroundColor: "#389EFF",
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 1000,
        }}
        onClick={handleCrearUsuarioClick}
      >
        <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
      </Fab>
    </div>
  );
};
export default Usuarios;