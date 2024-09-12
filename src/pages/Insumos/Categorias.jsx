import React, { useState, useEffect } from "react";
import axios from 'axios';
import CustomSwitch from "../../components/consts/switch";
import ModalCategoria from "../../components/consts/modalCategorias";
import CamposObligatorios from "../../components/consts/camposVacios";
import {Container,Typography,Card,CardContent,Fab,Tooltip,Box,Avatar,Input,Pagination,CardActionArea,IconButton,} from "@mui/material";
import { motion } from "framer-motion";

const Categorias = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionado, setCategoriaSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categorias');
      const categoriasWithColors = response.data.map((categoria) => ({
        ...categoria,
        color: getRandomColor(),
      }));
      setCategorias(categoriasWithColors);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };
  
  const handleAddCategoria = async (formData) => {
    try {
      const { nombre_categoria } = formData;
  
      const camposObligatorios = ['nombre_categoria'];
      if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos de la categoría.')) {
        return;
      }
  
      formData.estado_categoria = 1;
      try {
        await axios.post('http://localhost:5000/api/categorias/guardarCategoria', formData);
        
        const confirmation = await window.Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Quieres agregar esta categoría?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, agregar',
          cancelButtonText: 'Cancelar'
        });
  
        if (confirmation.isConfirmed) {
          handleCloseModalAgregar();
          fetchCategorias();
          window.Swal.fire('¡Categoría agregada!', '', 'success');
        }
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.error === 'El nombre de la categoría ya está registrado.') {
          window.Swal.fire({
            icon: 'warning',
            title: 'Categoría ya registrada',
            text: 'La categoría ingresada ya está registrada.',
          });
        } else {
          console.error('Error al agregar categoría:', error);
        }
      }
    } catch (error) {
      console.error('Error al agregar categoría:', error);
    }
  };
  
  const handleEditCategoria = async (formData) => {
    try {
        const camposObligatorios = ['nombre_categoria'];

        if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos de la categoría.')) {
            return;
        }
  
        const formatNombreCategoria = (nombre) => {
            const nombreSinEspacios = nombre.trim();
            const nombreMinusculas = nombreSinEspacios.toLowerCase();
            const nombreFormateado = nombreMinusculas.charAt(0).toUpperCase() + nombreMinusculas.slice(1);
            return nombreFormateado;
        };

        formData.nombre_categoria = formatNombreCategoria(formData.nombre_categoria);

        const response = await axios.get('http://localhost:5000/api/categorias');
        const categorias = response.data;
        const categoriaExistente = categorias.find(categoria => categoria.nombre_categoria === formData.nombre_categoria && categoria.IdCategoria !== formData.IdCategoria);

        if (categoriaExistente) {
            window.Swal.fire({
                icon: 'warning',
                title: 'Categoría ya registrada',
                text: 'La categoría ingresada ya está registrada.',
            });
            return;
        }

        await axios.put(`http://localhost:5000/api/categorias/editar/${formData.IdCategoria}`, formData);
        handleCloseModalEditar();
        fetchCategorias();
        window.Swal.fire('¡Categoría actualizada!', '', 'success');
    } catch (error) {
        console.error('Error al editar categoría:', error);
        window.Swal.fire('Error', 'Hubo un error al intentar actualizar la categoría', 'error');
    }
};

  const handleChange = (name, value) => {
    setCategoriaSeleccionado((prevCategoria) => ({
      ...prevCategoria,
      [name]: value,
    }));
  };

const handleToggleSwitch = async (id) => {
    const categoria = categorias.find(categoria => categoria.IdCategoria === id);
    if (!categoria) {
        console.error('Categoría no encontrada');
        return;
    }

    const newEstado = categoria.estado_categoria === 1 ? 0 : 1;

    const result = await window.Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: '¿Quieres cambiar el estado de la categoría?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        try {
            await axios.put(`http://localhost:5000/api/categorias/editar/${id}`, { estado_categoria: newEstado });
            fetchCategorias(); // Actualiza la lista de categorías después de la actualización
            window.Swal.fire({
                icon: 'success',
                title: 'Estado actualizado',
                text: 'El estado de la categoría ha sido actualizado correctamente.',
            });
        } catch (error) {
            console.error('Error al cambiar el estado de la categoría:', error);
            window.Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al cambiar el estado de la categoría. Por favor, inténtalo de nuevo más tarde.',
            });
        }
    }
};

  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
    setCategoriaSeleccionado(null);
  };

  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setCategoriaSeleccionado(null);
  };

  const handleEditClick = (categoria) => {
    setCategoriaSeleccionado(categoria);
    setOpenModalEditar(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  // Filtrar categorías según el término de búsqueda
  const filteredCategorias = categorias.filter((categoria) =>
    categoria.nombre_categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calcular categorías de la página actual
  const indexOfLastCard = page * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCategorias = filteredCategorias.slice(indexOfFirstCard, indexOfLastCard);

  // Cambiar de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
return (
  <div>
    <Container>
      <ModalCategoria
        open={openModalAgregar}
        handleClose={handleCloseModalAgregar}
        onSubmit={handleAddCategoria}
        title="Crear Categoría"
        fields={[
          { name: 'nombre_categoria', label: 'Nombre Categoría', type: 'text' },
          { name: 'descripcion_categoria', label: 'Descripción Categoría', type: 'textarea', rows: 4 }, // Ajusta el número de filas según sea necesario
        ]}
        entityData={categoriaSeleccionado || {}}
        onChange={handleChange}
      />

      <ModalCategoria
        open={openModalEditar}
        handleClose={handleCloseModalEditar}
        onSubmit={handleEditCategoria}
        title="Editar Categoría"
        fields={[
          { name: 'nombre_categoria', label: 'Nombre Categoría', type: 'text' },
          { name: 'descripcion_categoria', label: 'Descripción Categoría', type: 'textarea', rows: 4 }, // Ajusta el número de filas según sea necesario
        ]}
        entityData={categoriaSeleccionado || {}}
        onChange={handleChange}
      />

    </Container>

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
            Gestión de Categorías
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
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar categoría"
              aria-label="Buscar"
            />
          </div>

        </div>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} mb={2}>
      {currentCategorias.map((categoria) => (
        <motion.div
          key={categoria.IdCategoria}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          whileTap={{ scale: 1.0 }}
        >
          <Card sx={{ backgroundColor: "#eff5f9", borderRadius: 2 }}>
            <CardActionArea>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Avatar
                    sx={{ backgroundColor: categoria.color, marginRight: 2 }}
                  >
                    {categoria.nombre_categoria.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box textAlign="center" flexGrow={1}>
                    <Typography variant="h6" component="div">
                      {categoria.nombre_categoria}
                    </Typography>
                    <Typography variant="body2">
                      <span 
                        className={`text-sm font-medium me-2 px-2.5 py-0.5 rounded 
                          ${categoria.estado_categoria === 1 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}
                      >
                        {categoria.estado_categoria === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" ml={2}>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEditClick(categoria)}
                      sx={{
                        backgroundColor: "#ffffff",
                        "&:hover": {
                          backgroundColor: "#f3ecde",
                        },
                        borderRadius: "50%",
                        padding: 1,
                      }}
                    >
                      <i className="bx bx-edit" style={{ fontSize: "24px", color: "#ff9800" }}></i>
                    </IconButton>
                    <CustomSwitch
                      active={categoria.estado_categoria === 1}
                      onToggle={() => handleToggleSwitch(categoria.IdCategoria)}
                    />
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </motion.div>
      ))}
    </Box>

        <Box display="flex" justifyContent="center" mb={2}>
          <Pagination
            count={Math.ceil(filteredCategorias.length / cardsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
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
          zIndex: 1000, // Asegura que el botón flotante esté por encima de otros elementos
        }}
        onClick={() => setOpenModalAgregar(true)}
      >
        <i className='bx bx-plus' style={{ fontSize: '1.3rem' }}></i>
     </Fab>
    </div>
  );
};

export default Categorias;
