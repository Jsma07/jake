import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, List, ListItem, ListItemButton, ListItemText, Paper, Typography, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import Tooltip from '@mui/material/Tooltip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


export default function CustomTimeSelect({ selectedTime, setSelectedTime, selectedDate }) {
  const [occupiedTimes, setOccupiedTimes] = useState([]);
  const [inactiveTimes, setInactiveTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInactiveDay, setIsInactiveDay] = useState(false);
  
  const horaActual = dayjs().format('HH:mm');
  const esHoy = selectedDate && selectedDate.isSame(dayjs(), 'day');

  useEffect(() => {
    const fetchTimes = async () => {
      if (selectedDate) {
        setLoading(true);
        setOccupiedTimes([]);
        setInactiveTimes([]);
        setIsInactiveDay(false);

        try {
          const occupiedResponse = await axios.get('http://localhost:5000/api/agendas/horasOcupadas', {
            params: { fecha: selectedDate.format('YYYY-MM-DD') },
          });
          setOccupiedTimes(occupiedResponse.data);

          const inactiveDayResponse = await axios.get('http://localhost:5000/api/horarios');
          const inactiveDays = inactiveDayResponse.data
            .filter(horario => horario.estado === 'inactivo')
            .map(horario => dayjs(horario.fecha));
          const isDayInactive = inactiveDays.some(inactiveDate => inactiveDate.isSame(selectedDate, 'day'));
          setIsInactiveDay(isDayInactive);

          if (isDayInactive) {
            Swal.fire({
              title: 'Día Inactivo',
              text: 'La fecha seleccionada está inactiva. Por favor, elige otra fecha.',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          }

          const inactiveTimesResponse = await axios.get('http://localhost:5000/api/horarios/listarFechasConHorasInactivas');
          const inactiveDateInfo = inactiveTimesResponse.data.find(info => dayjs(info.fecha).isSame(selectedDate, 'day'));

          if (inactiveDateInfo) {
            setInactiveTimes(inactiveDateInfo.horas_inactivas);
          }

        } catch (error) {
          console.error("Error fetching data", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTimes();
  }, [selectedDate]);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 11; hour++) {
      times.push(dayjs().hour(hour).minute(0).format('HH:mm'));
    }
    for (let hour = 13; hour <= 16; hour++) {
      times.push(dayjs().hour(hour).minute(0).format('HH:mm'));
    }

    // Filtrar horas pasadas si es el día actual
    return times.filter(time => !esHoy || time >= horaActual);
  };

  const handleChange = (time) => {
    if (!occupiedTimes.includes(time) && !inactiveTimes.includes(time)) {
      setSelectedTime(time);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        sx={{
          maxHeight: 380,
          overflow: 'auto',
          padding: 1,
          borderRadius: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom sx={{ color: '#331bb1' }}>
          Hora del Servicio
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : isInactiveDay ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
            <Typography variant="h6" sx={{ color: '#FF69B4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ErrorOutlineIcon sx={{ mr: 1 }} />
              Opps, no puedes crear citas en este día.
            </Typography>
          </Box>
        ) : generateTimeOptions().length === 0 && esHoy ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
            <Typography variant="h6" sx={{ color: '#FF69B4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ErrorOutlineIcon sx={{ mr: 1 }} />
              Ya no puedes registrar una cita el día de hoy. Por favor, elige otra fecha o el día siguiente.
            </Typography>
          </Box>
        ) : (
          <List>
            {generateTimeOptions().map((time, index) => (
              <Tooltip
                key={index}
                TransitionProps={{ timeout: 650 }}
                disableInteractive
                followCursor
                title={
                  occupiedTimes.includes(time)
                    ? "Hora ocupada"
                    : inactiveTimes.includes(time)
                    ? "Hora inactiva"
                    : ""
                }
                arrow
              >
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleChange(time)}
                    disabled={occupiedTimes.includes(time) || inactiveTimes.includes(time)}
                    sx={{
                      borderRadius: '18px',
                      margin: '1px 0',
                      backgroundColor: occupiedTimes.includes(time) ? 'transparent' : 'transparent',
                      color: occupiedTimes.includes(time) ? '#000000' : '#3f51b5',
                      cursor: occupiedTimes.includes(time) ? 'no-drop' : 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        width: '98%',
                        padding: '7px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: occupiedTimes.includes(time)
                          ? '#ffcdd2'
                          : inactiveTimes.includes(time)
                          ? '#e0e0e0'
                          : time === selectedTime
                          ? '#bbdefb'
                          : 'transparent',
                        border: time === selectedTime ? '1px solid #3f51b5' : '1px solid #ccc',
                        borderRadius: '20px',
                        boxShadow: occupiedTimes.includes(time)
                          ? '0px 5px 12px rgba(255, 0, 0, 0.5)'
                          : time === selectedTime
                          ? '0px 5px 12px rgba(0, 0, 0, 0.2)'
                          : 'none',
                      }}
                    >
                      <ListItemText
                        primary={time}
                        sx={{
                          textAlign: 'center',
                          color: occupiedTimes.includes(time) ? '#000000' : 'inherit',
                        }}
                      />
                    </Box>
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>
        )}
      </Paper>
    </LocalizationProvider>
  );
}
