import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker, PickersDay } from '@mui/x-date-pickers';
import { Box, Paper } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import axios from 'axios';
import Swal from 'sweetalert2';

dayjs.locale('es');

const StyledStaticDatePicker = ({ date, onDateChange }) => {
  const [inactiveDates, setInactiveDates] = useState([]);
  const today = dayjs().startOf('day');
  const endOfNextMonth = dayjs().add(1, 'month').endOf('month');

  useEffect(() => {
    axios.get('http://localhost:5000/api/horarios')
      .then(response => {
        const inactiveDays = response.data
          .filter(horario => horario.estado === 'inactivo')
          .map(horario => dayjs(horario.fecha));
        setInactiveDates(inactiveDays);
        console.log('Fechas inactivas recibidas:', inactiveDays);
      })
      .catch(error => {
        console.error('Error al obtener los horarios:', error);
      });
  }, []);

  const renderDay = (date, selectedDate, pickersDayProps) => {
    const isInactive = inactiveDates.some(inactiveDate => inactiveDate.isSame(date, 'day'));
    return (
      <PickersDay
        {...pickersDayProps}
        sx={{
          ...(isInactive && {
            backgroundColor: 'red',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkred',
            },
          }),
        }}
        disabled={isInactive}
      />
    );
  };

  const handleDateChange = (newValue) => {
    onDateChange(newValue);
    const isInactive = inactiveDates.some(inactiveDate => inactiveDate.isSame(newValue, 'day'));
    console.log('Fecha seleccionada:', newValue.format('YYYY-MM-DD'), '¿Inactiva?', isInactive);

    if (isInactive) {
      Swal.fire({
        title: 'Día Inactivo',
        text: 'La fecha seleccionada está inactiva. Por favor, elige otra fecha.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2
        }}
      >
        <Paper 
          elevation={5}
          sx={{
            borderRadius: '20px',
            border: '1px solid #3f51b5',
            padding: 2,
            backgroundColor: '#fff'
          }}
        >
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            orientation="landscape"
            openTo="day"
            value={date}
            onChange={handleDateChange}
            minDate={today}
            maxDate={endOfNextMonth}
            renderDay={renderDay}
            componentsProps={{
              actionBar: {
                actions: [],
              },
            }}
            renderInput={(params) => <Box {...params} />}
          />
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default StyledStaticDatePicker;
