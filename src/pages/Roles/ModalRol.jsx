import React, { useState, useEffect } from 'react';
import ModalDinamico from "./ModalBase";
import axios from "axios";
import { toast } from "react-toastify";

const AddRoleModal = ({ open, handleClose, setRoles }) => {
  const [rol, setRol] = useState("");
  const [permisos, setPermisos] = useState([]);
  const [rolesLocal, setRolesLocal] = useState([]);

  useEffect(() => {
    fetchRoles();
    fetchPermisos();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/roles');
      if (response.data && Array.isArray(response.data)) {
        const rolesWithPermissions = response.data.map(role => ({
          ...role,
          permisos: role.permisos || []
        }));
        setRolesLocal(rolesWithPermissions);
        setRoles(rolesWithPermissions);
      } else {
        console.error('Data received is empty or malformed:', response.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPermisos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/permisos");
      if (response.data) {
        const permisosFromApi = response.data.map(permiso => ({
          ...permiso,
          selected: false
        }));
        setPermisos(permisosFromApi);
      } else {
        console.error("Error: No se obtuvieron datos de permisos");
      }
    } catch (error) {
      console.error("Error al obtener permisos:", error);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setRol(value.trim());
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const updatedPermisos = permisos.map((permiso) =>
      permiso.idPermiso.toString() === name ? { ...permiso, selected: checked } : permiso
    );
    setPermisos(updatedPermisos);
  };

  const handleAddRole = async (formData) => {
    if (!formData.nombre.trim()) {
      toast.error("Nombre vacío, por favor ingresa un nombre para el rol.");
      return;
    }

    if (formData.nombre.trim() !== formData.nombre) {
      toast.error("El nombre del rol no puede contener espacios al inicio ni al final.");
      return;
    }

    const rolExiste = rolesLocal.some((rol) => rol.nombre === formData.nombre);

    if (rolExiste) {
      toast.error("El Rol ingresado ya está creado. Por favor, utiliza otro nombre.");
      return;
    }

    const permisosSeleccionados = Object.keys(formData)
      .filter((key) => key !== "nombre" && formData[key])
      .map(Number);

    if (permisosSeleccionados.length === 0) {
      toast.error("Por favor, selecciona al menos un permiso.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/roles/crearRol", {
        nombre: formData.nombre,
        permisos: permisosSeleccionados,
        EstadoRol: 1
      });

      if (response.data && response.data.mensaje === "Rol creado exitosamente") {
        toast.success("El rol ha sido creado correctamente");

        const nuevoRol = { idRol: response.data.id, nombre: formData.nombre, permisos: permisosSeleccionados, EstadoRol: 1 };
        setRolesLocal((prevRoles) => [...prevRoles, nuevoRol]);
        setRoles((prevRoles) => [...prevRoles, nuevoRol]);

        handleClose();
      } else {
        console.error('Error al crear el rol:', response.data);
      }
    } catch (error) {
      console.error("Error al crear el rol:", error);
    }
  };

  const fields = [
    { name: "nombre", label: "Nombre", type: "text", value: rol, onChange: handleChange },
    ...permisos.map(permiso => ({
      name: permiso.idPermiso.toString(),
      label: permiso.nombre,
      type: "checkbox",
      checked: permiso.selected || false,
      onChange: handleCheckboxChange,
    })),
  ];

  return (
    <ModalDinamico
      open={open}
      handleClose={handleClose}
      onSubmit={handleAddRole}
      title="Agregar Nuevo Rol"
      fields={fields}
    />
  );
};

export default AddRoleModal;
