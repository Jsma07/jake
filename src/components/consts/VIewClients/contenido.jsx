import React, { useState, useEffect } from "react";
import NavbarClient from "./Navbarclient";
import Footer from "./Footer";
import { motion } from "framer-motion";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Contenidoitems() {
  const [servicios, setServicios] = useState([]);
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ nombre: "", precio: "", hora: "" });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/servicios")
      .then((response) => {
        setServicios(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los servicios:", error);
      });
  }, []);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredServicios = servicios.filter((servicio) => {
    return (
      (filter.nombre === "" ||
        servicio.Nombre_Servicio.toLowerCase().includes(
          filter.nombre.toLowerCase()
        )) &&
      (filter.precio === "" ||
        servicio.Precio_Servicio <= parseFloat(filter.precio)) &&
      (filter.hora === "" ||
        servicio.Tiempo_Servicio <= parseFloat(filter.hora))
    );
  });

  const handleRedirect = () => {
    navigate("/solicitarCita"); 
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <NavbarClient />

      <header id="header-hero" className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 300 }}
        >
          <div
            className="header-bg relative bg-gradient-to-r from-purple-400 to-indigo-400 p-8 rounded-xl"
            style={{
              boxShadow: "0px 1.5px 3px rgba(0, 0, 0, 0.5)", 
              paddingTop: "4rem", 
              paddingBottom: "4rem", 
            }}
          >
            <h2 className="text-3xl font-bold text-white">
              CATALOGO DE NUESTROS SERVICIOS
            </h2>

            <p className="text-lg text-white mt-4">
              Servicios de manicure con estilos únicos y modernos, diseñados
              para resaltar tu belleza y personalidad.
            </p>
          </div>
        </motion.div>
      </header>


      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          mt: -1,
          mb: 2,
          py: 3,
          backgroundColor: "#f3f3f3",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          style={{ textAlign: "center", color: "#8A2BE2", maxWidth: 200 }}
        >
          <i className="bx bxs-paint" style={{ fontSize: "55px" }}></i>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", fontFamily: "Franklin Gothic Medium", textTransform: "uppercase" }}>
            Colores Vibrantes
          </Typography>
          <Typography variant="body2" font-family= "Cambria" sx={{ mt: 1 , fontFamily: "Cambria", fontStyle: "italic"}}>
            Explora una amplia gama de colores que resaltarán tu estilo único y
            personal.
          </Typography>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          style={{ textAlign: "center", color: "#8A2BE2", maxWidth: 200 }}
        >
          <i className="bx bxs-brush" style={{ fontSize: "55px" }}></i>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", fontFamily: "Franklin Gothic Medium", textTransform: "uppercase" }}>
            Diseños Creativos
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 , fontFamily: "Cambria", fontStyle: "italic"}}>
            Lleva la creatividad a tus uñas con diseños exclusivos que te
            encantarán.
          </Typography>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          style={{ textAlign: "center", color: "#8A2BE2", maxWidth: 200 }}
        >
          <i className="bx bxs-heart" style={{ fontSize: "55px" }}></i>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", fontFamily: "Franklin Gothic Medium", textTransform: "uppercase" }}>
            Buen Cuidado
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 , fontFamily: "Cambria", fontStyle: "italic"}}>
            Ofrecemos un cuidado completo y profesional para la salud de tus
            uñas.
          </Typography>
        </motion.div>
      </Box>

      <Box sx={{ p: 2, backgroundColor: "#f3f3f3", mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            mt: 4,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <input
              type="text"
              name="nombre"
              placeholder="Buscar por nombre"
              value={filter.nombre}
              onChange={handleFilterChange}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "200px",
              }}
            />
            <input
              type="number"
              name="precio"
              placeholder="Máx. Precio"
              value={filter.precio}
              onChange={handleFilterChange}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "150px",
              }}
            />
            <input
              type="number"
              name="hora"
              placeholder="Máx. Hora"
              value={filter.hora}
              onChange={handleFilterChange}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "150px",
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {" "}
          {/* Aumenta el valor de spacing */}
          {filteredServicios.map((servicio) => (
            <Grid item xs={12} sm={6} md={3} key={servicio.IdServicio}>
              <motion.div
                initial={{ opacity: 0, y: 50 }} // Animación de entrada desde abajooo
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: `0px 4px 8px rgba(138, 43, 226, 0.5)`,
                    width: "90%",
                    mx: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 2, // Añade margin-bottom para espacio extra
                  }}
                >
                  <CardHeader
                    title={servicio.Nombre_Servicio}
                    subheader={`Tiempo: ${servicio.Tiempo_Servicio}`}
                  />
                  <Box
                    sx={{
                      height: 200,
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={`http://localhost:5000${servicio.ImgServicio}`}
                      alt={servicio.Nombre_Servicio}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Precio: {servicio.Precio_Servicio}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      py: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#8A2BE2",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#7A1EBE",
                        },
                        borderRadius: 4,
                      }}
                      onClick={handleRedirect}
                    >
                      <i
                        className="bx bx-calendar"
                        style={{ fontSize: "20px", marginRight: "8px" }}
                      ></i>
                      Agendar
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
      <br /><br />

      <Footer />
    </div>
  );
}

export default Contenidoitems;
