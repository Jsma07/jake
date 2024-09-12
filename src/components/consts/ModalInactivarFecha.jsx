import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Paper } from '@mui/material';
import StyledStaticDatePicker from './StaticDatePickerLandscape';
import axios from 'axios';
import Swal from 'sweetalert2';

const ModalInactivarFecha = ({ open, handleClose, onFechaInactivada }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleInactivarFecha = () => {
    if (!selectedDate) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, selecciona una fecha para inactivar.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    axios.post('http://localhost:5000/api/horarios/crear', {
      fecha: selectedDate.format('YYYY-MM-DD'),
      estado: 'inactivo'
    })
    .then(response => {
      Swal.fire({
        title: 'Fecha Inactivada',
        text: 'La fecha ha sido marcada como inactiva exitosamente.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      handleClose();
      onFechaInactivada();  // Llamar a la función para actualizar la lista de fechas
    })
    .catch(error => {
      console.error('Error al inactivar la fecha:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al inactivar la fecha. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Inactivar Fecha
        </Typography>
        <Paper elevation={3}>
          <StyledStaticDatePicker date={selectedDate} onDateChange={handleDateChange} />
        </Paper>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleInactivarFecha}>
            Inactivar
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalInactivarFecha;
