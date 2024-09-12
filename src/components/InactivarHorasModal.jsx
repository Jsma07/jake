import React, { useState } from 'react';
import { Modal, Button, TextField, IconButton, Checkbox, Typography, Box } from '@mui/material';
import { ArrowLeft, ArrowRight, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

const generateTimeOptions = () => {
    const times = [];
    // Horario de trabajo 8 AM - 11 AM
    for (let hour = 8; hour <= 11; hour++) {
        times.push(dayjs().hour(hour).minute(0).format('HH:mm'));
    }
    // Horario de trabajo 1 PM - 4 PM
    for (let hour = 13; hour <= 16; hour++) {
        times.push(dayjs().hour(hour).minute(0).format('HH:mm'));
    }
    return times;
};

const InactivarHorasModal = ({ open, onClose, onHoursInactivated }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedHours, setSelectedHours] = useState([]);
    const [carouselIndex, setCarouselIndex] = useState(0);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleToggleHour = (hour) => {
        setSelectedHours(prevHours =>
            prevHours.includes(hour) ? prevHours.filter(h => h !== hour) : [...prevHours, hour]
        );
    };

    const handleSubmit = async () => {
        // Validar campos vacíos
        if (!selectedDate || selectedHours.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos vacíos',
                text: 'Por favor, selecciona una fecha y al menos una hora.',
            });
            return;
        }

        // Confirmación de inactivación
        const confirmation = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres inactivar las horas seleccionadas?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, inactivar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmation.isConfirmed) {
            return; // Salir si el usuario cancela
        }

        try {
            // Enviar solicitud al servidor
            await axios.post('http://localhost:5000/api/horarios/inactivarHoras', {
                fecha: selectedDate,
                horas: selectedHours
            });

            // Confirmar éxito y cerrar modal
            if (typeof onHoursInactivated === 'function') {
                onHoursInactivated(); 
            } else {
                console.warn('onHoursInactivated no es una función');
            }
            Swal.fire('¡Horas inactivadas!', 'Las horas han sido registradas como inactivas con éxito.', 'success');
            onClose();

        } catch (error) {
            console.error('Error al inactivar horas', error);

            if (error.response) {
                // Manejar errores específicos basados en la respuesta del backend
                switch (error.response.status) {
                    case 400:
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.response.data.error || 'Error al procesar la solicitud.',
                        });
                        break;
                    case 500:
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error en el servidor. Inténtalo de nuevo más tarde.',
                        });
                        break;
                    default:
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema con la solicitud. Por favor, inténtalo de nuevo.',
                        });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error en la conexión. Por favor, revisa tu conexión a Internet.',
                });
            }
        }
    };

    const handleCarouselChange = (direction) => {
        setCarouselIndex(prev => {
            if (direction === 'left') {
                return Math.max(prev - 5, 0);
            } else if (direction === 'right') {
                return Math.min(prev + 5, generateTimeOptions().length - 5);
            }
        });
    };

    const timeOptions = generateTimeOptions();

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <Box
                sx={{
                    width: '90%',
                    maxWidth: 600,
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        mb: 2
                    }}
                >
                    <Typography variant="h6" id="modal-title">
                        Inactivar Horas De Trabajo
                    </Typography>
                    <IconButton onClick={onClose} color="inherit">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <TextField
                    label="Fecha"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDate}
                    onChange={handleDateChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton onClick={() => handleCarouselChange('left')} disabled={carouselIndex === 0}>
                        <ArrowLeft />
                    </IconButton>
                    <Box sx={{ flex: 1, overflowX: 'auto' }}>
                        <motion.div
                            className="carousel-items"
                            initial={{ x: -100 }}
                            animate={{ x: 0 }}
                            exit={{ x: 100 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', flexDirection: 'row', paddingBottom: 16 }}
                        >
                            {timeOptions.slice(carouselIndex, carouselIndex + 5).map((hour, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        width: 80,
                                        height: 60,
                                        borderRadius: 1,
                                        backgroundColor: '#f0f0f0',
                                        mx: 1,
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: 1,
                                        '&:hover': {
                                            backgroundColor: '#e0e0e0'
                                        }
                                    }}
                                    onClick={() => handleToggleHour(hour)}
                                >
                                    <Typography variant="body2">{hour}</Typography>
                                    <Checkbox checked={selectedHours.includes(hour)} />
                                </Box>
                            ))}
                        </motion.div>
                    </Box>
                    <IconButton onClick={() => handleCarouselChange('right')} disabled={carouselIndex >= timeOptions.length - 5}>
                        <ArrowRight />
                    </IconButton>
                </Box>
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginRight: 2 }} >
                        Inactivar
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default InactivarHorasModal;
