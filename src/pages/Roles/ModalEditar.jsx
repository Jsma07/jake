import React, { useState, useEffect } from "react";
import ModalDinamico from "./ModalBase";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


const ModalEditar = ({ open, handleClose, roleId, setRoles }) => {
  const [rol, setRol] = useState("");
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [rolesLocal, setRolesLocal] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (open && roleId) {
      fetchRoleData();
      fetchPermisos();
    }
  }, [open, roleId]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roles");
      if (response.data && Array.isArray(response.data)) {
        const rolesWithPermissions = response.data.map((role) => ({
          ...role,
          permisos: role.permisos || [], // Asegurar que permisos siempre sea un array
        }));
        setRoles(rolesWithPermissions);
        setRolesLocal(rolesWithPermissions); // Actualizar rolesLocal con los roles obtenidos
      } else {
        console.error("Data received is empty or malformed:", response.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchRoleData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rol/${roleId}`);
      if (response.data && response.data.rol) {
        const { nombre, permisos: permisosRol } = response.data.rol;
        setRol(nombre);
        setPermisosSeleccionados(permisosRol.map((permiso) => permiso.idPermiso));
        setFormValues((prevValues) => ({
          ...prevValues,
          nombre: nombre,
          ...Object.fromEntries(permisosRol.map((permiso) => [permiso.idPermiso, true])),
        }));
      } else {
        console.error("Error: No se obtuvieron datos válidos del rol");
      }
    } catch (error) {
      console.error("Error al obtener datos del rol:", error);
    }
  };

  const fetchPermisos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/permisos");
      if (response.data) {
        setPermisos(response.data);
      } else {
        console.error("Error: No se obtuvieron datos de permisos");
      }
    } catch (error) {
      console.error("Error al obtener permisos:", error);
    }
  };

  const handleChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (name === "nombre") {
      setRol(value);
    } else {
      const idPermiso = Number(name);
      setPermisosSeleccionados((prevPermisos) =>
        value
          ? [...prevPermisos, idPermiso]
          : prevPermisos.filter((id) => id !== idPermiso)
      );
    }
  };

  const handleEditRole = async (formData) => {
    if (!formData.nombre.trim()) {
      window.Swal.fire({
        icon: "error",
        title: "Nombre del rol vacío",
        text: "Por favor, ingresa el nombre del rol.",
      });
      return;
    }

    // Verificar si el nuevo nombre del rol ya existe en la lista actual de roles
    const rolExistente = rolesLocal.some((rol) => rol.nombre === formData.nombre && rol.idRol !== roleId);

    if (rolExistente) {
      toast.error("El Rol ingresado ya está creado. Por favor, utiliza otro nombre.", {
        position: "bottom-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/editarRol/${roleId}`,
        {
          nombre: formData.nombre,
          permisos: permisosSeleccionados,
        }
      );

      if (response.data && response.data.mensaje === "Rol actualizado correctamente") {
        toast.success("El rol se ha actualizado correctamente.", {
          position: "bottom-right",
          autoClose: 3000, // Cierra automáticamente después de 3 segundos
        });
        setRoles((prevRoles) =>
          prevRoles.map((rol) =>
            rol.idRol === roleId ? { ...rol, nombre: formData.nombre } : rol
          )
        );
        handleClose();
      } else {
        console.error("Error al editar el rol:", response.data);
      }
    } catch (error) {
      console.error("Error al editar el rol:", error);
    }
  };

  const fields = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      value: formValues.nombre || "",
      onChange: handleChange,
    },
    ...(permisos || []).map((permiso) => ({
      name: permiso.idPermiso.toString(),
      label: permiso.nombre,
      type: "checkbox",
      checked: !!formValues[permiso.idPermiso],
      onChange: handleChange,
    })),
  ];

  return (
    <ModalDinamico
      open={open}
      handleClose={handleClose}
      onSubmit={handleEditRole}
      title="Editar Rol"
      fields={fields}
      onChange={handleChange}
    />
  );
};

export default ModalEditar;
