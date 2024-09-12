import React, { useState, useEffect } from "react";
import CustomSwitch from "../../components/consts/switch";
import AddRoleModal from "./ModalRol";
import ModalEditar from "./ModalEditar";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Pagination,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { Fab } from "@mui/material";
import ModalPermisos from "./modalPermisos";
import { toast } from "react-toastify";

const Roles = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [openPermisosModal, setOpenPermisosModal] = useState(false);
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [page, setPage] = useState(1);
  const cardsPerPage = 10;

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roles");
      if (response.data && Array.isArray(response.data)) {
        const rolesWithPermissions = response.data.map((role) => ({
          ...role,
          permisos: role.permisos || [],
        }));
        setRoles(rolesWithPermissions);
      } else {
        console.error("Data received is empty or malformed:", response.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleToggleSwitch = async (id) => {
    if (id === 1 || id === 2 || id === 4) {
      toast.error("No se puede desactivar este rol.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    const updatedRoles = roles.map((rol) =>
      rol.idRol === id
        ? { ...rol, EstadoRol: rol.EstadoRol === 1 ? 0 : 1 }
        : rol
    );

    try {
      const updatedRole = updatedRoles.find((rol) => rol.idRol === id);
      if (!updatedRole) {
        console.error("No se encontró el rol actualizado");
        return;
      }

      const result = await window.Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: "¿Quieres cambiar el estado del rol?",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await axios.put(
          `http://localhost:5000/api/editarRol/${id}`,
          {
            EstadoRol: updatedRole.EstadoRol,
            nombre: updatedRole.nombre,
            permisos: updatedRole.permisos.map((permiso) => permiso.idPermiso),
          }
        );

        if (response.status === 200) {
          setRoles(updatedRoles);
          toast.success("El estado del rol ha sido actualizado.", {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error al cambiar el estado del rol:", error);
      toast.error(
        "Hubo un error al cambiar el estado del rol. Por favor, inténtalo de nuevo más tarde.",
        {
          position: "bottom-right",
          autoClose: 3000,
        }
      );
    }
  };

  const filtrar = roles.filter((rol) => {
    const { nombre = "", permisos = [] } = rol;

    const nombreRol = nombre.toLowerCase().includes(buscar.toLowerCase());

    const permisosAsociados =
      permisos &&
      permisos.some(
        (p) => p.nombre && p.nombre.toLowerCase().includes(buscar.toLowerCase())
      );

    return nombreRol || permisosAsociados;
  });

  const handleEditClick = (id) => {
    if (id === 1 || id === 2 || id=== 4 ) {
      toast.error("No se puede editar este rol.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    setSelectedRoleId(id);
  };

  const handleCardClick = (rol) => {
    setSelectedPermisos(rol.permisos); // Asume que permisos están en el rol
    setOpenPermisosModal(true);
  };

  const handleClosePermisosModal = () => {
    setOpenPermisosModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setSelectedRoleId(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRoleId(null);
  };

  const handleAddRole = (newRole) => {
    const newRoleWithDefaults = {
      ...newRole,
      idRol: roles.length + 1,
      EstadoRol: 1,
    };
    setRoles([...roles, newRoleWithDefaults]);
    setOpenModal(false);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const currentRoles = filtrar.slice(
    (page - 1) * cardsPerPage,
    page * cardsPerPage
  );

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
      }}
    >
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-4">
          <h4
            style={{ textAlign: "left", fontSize: "23px", fontWeight: "bold" }}
            className="text-3xl"
          >
            Gestión de Roles
          </h4>
          <div className="relative w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>

            <input
              type="search"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar rol"
              aria-label="Buscar"
            />
          </div>
        </div>

        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} mb={2}>
          {currentRoles.map((rol) => (
            <motion.div
              key={rol.idRol}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              whileTap={{ scale: 1.0 }}
            >
<Card sx={{ backgroundColor: "rgba(252, 255, 217, 0.1)", borderRadius: 2,   boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.5)' 
 }}>
<CardActionArea onClick={() => handleCardClick(rol)}>
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Avatar
                        sx={{ backgroundColor: "#007bff", marginRight: 2 }}
                      >
                        {rol.nombre.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box textAlign="center" flexGrow={1}>
                        <Typography variant="h6" component="div">
                          {rol.nombre}
                        </Typography>
                        <Typography variant="body2">
                          Estado:{" "}
                          <span
                            style={{
                              backgroundColor:
                                rol.EstadoRol === 1
                                  ? "rgba(87, 255, 112, 0.3)"
                                  : "rgba(230, 3, 30, 0.2)",
                              color: "black",
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            {rol.EstadoRol === 1 ? "Activo" : "Inactivo"}
                          </span>
                        </Typography>
                      </Box>
                      {rol.EstadoRol === 1 &&
                        ![1, 2, 4].includes(rol.idRol) && (
                          <Fab
                            style={{
                              fontSize: "16px",
                              width: "40px",
                              height: "40px",
                              backgroundColor: "white",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(rol.idRol);
                            }}
                          >
                            <i
                              className="bx bx-edit"
                              style={{ fontSize: "24px", color: "#ff9800" }}
                            ></i>
                          </Fab>
                        )}
                      {![1, 2, 4].includes(rol.idRol) && (
                        <CustomSwitch
                          active={rol.EstadoRol === 1}
                          onToggle={() => handleToggleSwitch(rol.idRol)}
                        />
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          ))}
        </Box>

        <Box display="flex" justifyContent="center" mb={2}>
          <Pagination
            count={Math.ceil(filtrar.length / cardsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>

        <Fab
          color="primary"
          aria-label="add"
          style={{ position: "fixed", bottom: "20px", right: "20px" }}
          onClick={handleOpenModal}
        >
          <i className="bx bx-plus"></i>
        </Fab>
      </div>

      <AddRoleModal
        open={openModal}
        handleClose={handleCloseModal}
        onAddRole={handleAddRole}
        roleId={selectedRoleId}
              setRoles={setRoles} // Pasa setRoles aquí

      />
      {selectedRoleId && (
        <ModalEditar
          open={!!selectedRoleId}
          handleClose={handleCloseModal}
          roleId={selectedRoleId}
        />
      )}
      {openPermisosModal && (
        <ModalPermisos
          open={openPermisosModal}
          handleClose={handleClosePermisosModal}
          permisos={selectedPermisos}
        />
      )}
    </div>
  );
};

export default Roles;
