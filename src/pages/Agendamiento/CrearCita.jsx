import React, { useState, useEffect } from "react";
import axios from "axios";
import Fab from "@mui/material/Fab";
import dayjs from 'dayjs';
import { Container, Typography, Stepper, Step, StepLabel, Button, Box, Paper, Select, MenuItem, FormControl, InputLabel, Grid, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import StaticDatePickerLandscape from "../../components/consts/StaticDatePickerLandscape";
import CustomTimeSelect from "../../components/consts/CustomTimeSelect";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';

import { useNavigate } from 'react-router-dom';

const steps = ["Seleccione Fecha y Hora", "Servicio", "Terminar"];

const CrearCitas = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTime, setSelectedTime] = useState(dayjs().hour(15).minute(30).format('HH:mm'));
  const [date, setDate] = useState(dayjs());
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedServicio, setSelectedServicio] = useState('');
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('');
  const [precioServicio, setPrecioServicio] = useState(null);
  const [tiempoServicio, setTiempoServicio] = useState(null);
  const [imagenServicio, setImagenServicio] = useState(null);
  const [occupiedTimes, setOccupiedTimes] = useState([]);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/servicios");
        const activeServices = response.data.filter(servicios => servicios.EstadoServicio ===1)
        setServicios(activeServices);
      } catch (error) {
        console.error("Error fetching servicios:", error);
      }
    };

    const fetchEmpleados = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jackenail/Listar_Empleados");
        const activeManicuristas = response.data.filter(empleados => empleados.Estado === 1 && empleados.IdRol === 2)
        setEmpleados(activeManicuristas);
      } catch (error) {
        console.error("Error fetching empleados:", error);
      }
    };

    const fetchClientes = async () => {
      try {
        
        const response = await axios.get("http://localhost:5000/jackenail/Listar_Clientes");
        const activeClient = response.data.filter(clientes => clientes.Estado ===1 )
        setClientes(activeClient);
      } catch (error) {
        console.error("Error fetching clientes:", error);
      }
    };

    fetchServicios();
    fetchEmpleados();
    fetchClientes();
  }, []);
  const fetchOccupiedTimes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/agendas/horasOcupadas?fecha=${dayjs(date).format('YYYY-MM-DD')}`);
      setOccupiedTimes(response.data);
    } catch (error) {
      console.error("Error fetching occupied times:", error);
    }
  };

  useEffect(() => {
    if (date) {
      fetchOccupiedTimes();
    }
  }, [date]);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      const newAppointment = {
        IdCliente: selectedCliente,
        IdServicio: selectedServicio,
        Fecha: dayjs(date).format('YYYY-MM-DD'),
        Hora: selectedTime,
        IdEmpleado: selectedEmpleado,
        EstadoAgenda: 1
      };

      try {
        const response = await axios.post("http://localhost:5000/api/agendas/crearAgenda", newAppointment);
        console.log("Agendamiento creado exitosamente:", response.data);
        navigate("/Agendamiento");
      } catch (error) {
        console.error("Error creando agendamiento:", error);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleServicioChange = (e) => {
    const servicioId = e.target.value;
    setSelectedServicio(servicioId);

    const servicioSeleccionado = servicios.find((servicio) => servicio.IdServicio === servicioId);
    if(servicioSeleccionado) {
      setPrecioServicio(servicioSeleccionado.Precio_Servicio);
      setTiempoServicio(servicioSeleccionado.Tiempo_Servicio);
      setImagenServicio(servicioSeleccionado.ImgServicio);
    }
  };

  const handleImageClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };
  

  const servicioSeleccionado = servicios.find((servicio) => servicio.IdServicio === selectedServicio);
  const empleadoSeleccionado = empleados.find((empleado) => empleado.IdEmpleado === selectedEmpleado);
  const clienteSeleccionado = clientes.find((cliente) => cliente.IdCliente === selectedCliente);

  const paperStyle = {
    padding: 16,
    marginTop: 13,
    minHeight: '400px',
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ marginTop: -3 }}>
        Registrar citas!
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ marginTop: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
      {activeStep === 0 && (
            <Paper elevation={3} style={paperStyle}>
              <Box display="flex" justifyContent="space-between">
                <Box width="50%">
                <StaticDatePickerLandscape date={date} onDateChange={handleDateChange}  />                </Box>
                <Box width="50%" display="flex" flexDirection="column" justifyContent="center" ml={2}>
                <CustomTimeSelect
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              selectedDate={date}
              occupiedTimes={occupiedTimes}  // Pasamos las horas ocupadas aquí
            />
                </Box>
              </Box>
            </Paper>
          )}
        {activeStep === 1 && (
          <Paper elevation={3} style={paperStyle}>
            <Typography variant="h6" component="h2" align="center" gutterBottom>
              Seleccionar Servicio
            </Typography>
            <Box>
              <FormControl fullWidth margin="normal">
                <InputLabel id="select-servicio-label">Servicio</InputLabel>
                <Select
                  labelId="select-servicio-label"
                  value={selectedServicio}
                  onChange={handleServicioChange}
                >
                  {servicios.map((servicio) => (
                    <MenuItem key={servicio.IdServicio} value={servicio.IdServicio}>
                      {servicio.Nombre_Servicio}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="select-empleado-label">Empleado</InputLabel>
                <Select
                  labelId="select-empleado-label"
                  value={selectedEmpleado}
                  onChange={(e) => setSelectedEmpleado(e.target.value)}
                >
                  {empleados.map((empleado) => (
                    <MenuItem key={empleado.IdEmpleado} value={empleado.IdEmpleado}>
                      {empleado.Nombre} {empleado.Apellido}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="select-cliente-label">Cliente</InputLabel>
                <Select
                  labelId="select-cliente-label"
                  value={selectedCliente}
                  onChange={(e) => setSelectedCliente(e.target.value)}
                >
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.IdCliente} value={cliente.IdCliente}>
                      {cliente.Nombre} {cliente.Apellido}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>
        )}
        {activeStep === 2 && (
  <Paper elevation={3} style={paperStyle}>
    <Grid container spacing={2}>
      {/* Imagen del servicio */}
      <Grid
        item
        xs={12}
        md={4}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRight: '2px solid #ddd',
          padding: '16px'
        }}
      >
        {imagenServicio && (
          <img
            src={`http://localhost:5000${imagenServicio}`}
            alt="Servicio"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer'
            }}
            onClick={handleImageClick}
          />
        )}
      </Grid>

      {/* Información de la cita */}
      <Grid item xs={12} md={8} style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
  <Typography variant="h6" component="h2" align="center" gutterBottom style={{ fontFamily: 'Poppins, sans-serif', color: '#6b4e80' }}>
    Confirmar Cita
  </Typography>
  <Grid container spacing={2}>
  {[
    { label: 'Cliente', value: clienteSeleccionado ? `${clienteSeleccionado.Nombre} ${clienteSeleccionado.Apellido}` : '' },
    { label: 'Empleado', value: empleadoSeleccionado ? `${empleadoSeleccionado.Nombre} ${empleadoSeleccionado.Apellido}` : '' },
    { label: 'Servicio', value: servicioSeleccionado ? servicioSeleccionado.Nombre_Servicio : '' },
    { label: 'Fecha', value: dayjs(date).format('D MMMM YYYY') },
    { label: 'Hora Inicio', value: selectedTime },
    { label: 'Precio del Servicio', value: precioServicio ? `$${precioServicio}` : '' },
    { label: 'Tiempo del Servicio', value: tiempoServicio ? `${tiempoServicio} minutos` : '' }
  ].map((item, index) => (
    <Grid item xs={12} sm={6} key={index}>
      <Paper elevation={1} style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" style={{ fontFamily: 'Poppins, sans-serif', color: '#333' }}>
          <strong>{item.label}:</strong> {item.value}
        </Typography>
      </Paper>
    </Grid>
  ))}
</Grid>
      </Grid>
    </Grid>

    {/* Diálogo de imagen */}
    {imagenServicio && (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <img
          src={`http://localhost:5000${imagenServicio}`}
          alt="Servicio"
          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
        />
      </DialogContent>
    </Dialog>
  )}
  </Paper>
)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIosIcon />}
          >
            Atrás
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIosIcon />}
          >
            {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
          </Button>
        </Box>

        <Fab
          aria-label="add"
          style={{
            border: "0.9px solid grey",
            backgroundColor: "#94CEF2",
            position: "fixed",
            bottom: "50px",
            right: "50px",
            zIndex: 1000
          }}
          onClick={() => navigate('/agendamiento')}
        >
          <ReplyIcon style={{ fontSize: "2.5rem" }} />
        </Fab>
      </div>
    </Container>
  );
};

export default CrearCitas;
