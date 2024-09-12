import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  Button,
  ListItemText,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const StyledListItem = styled(ListItem)(({ theme, occupied, selected, inactive }) => ({
  borderRadius: "12px",
  margin: "10px 0",
  padding: "15px",
  border: `2px solid ${
    selected ? "#6950f3" : occupied ? "#6e6e6e" : inactive ? "#ff0000" : "#0D0D0D"
  }`,
  cursor: "pointer",
  backgroundColor: selected
    ? "transparent"
    : occupied
    ? "#d3d3d3"
    : inactive
    ? "#ffdddd" // Color rojo claro para horas inactivas
    : "transparent",
  color: selected
    ? "#6950f3"
    : occupied
    ? "#6D90A6" // Color rojo para texto de horas inactivas
    : inactive
    ? "#ff0000"
    : theme.palette.text.primary,
  pointerEvents: occupied || inactive ? "none" : "auto",
  fontSize: "20px",
  textAlign: "center",
  width: "150%",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: selected
      ? "transparent"
      : occupied
      ? "#d3d3d3"
      : inactive
      ? "#ffcccc" // Color rojo más claro al pasar el mouse sobre horas inactivas
      : theme.palette.action.hover,
    transform: "scale(1.06)",
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
}));

const StyledDayButton = styled(Button)(({ theme, selected, inactive }) => ({
  borderRadius: "50%",
  fontSize: "25px",
  fontFamily: "zantrokeregular",
  fontWeight: "bold",
  minWidth: "70px",
  minHeight: "70px",
  margin: "10px",
  padding: 0,
  backgroundColor: selected ? "#6950f3" : "transparent",
  color: selected ? theme.palette.common.white : theme.palette.text.primary,
  border: `2px solid ${selected ? "#f0eaff" : theme.palette.divider}`,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: selected ? "#5c4ace" : "#A6A6A6",
    transform: "scale(1.2)",
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
}));

const DayLabel = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#050000",
  fontFamily: "Circular, sans-serif",
  textAlign: "center",
  position: "absolute",
  bottom: "-30px",
  width: "100%",
  fontWeight: 549, // Puedes cambiar esto a 700, 800 o 900 si lo prefieres
}));


const IconWrapper = styled('div')({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: "#6950f3", // Color del ícono
});

const TimeSelect = ({
  hours = [],
  occupiedHours = [],
  inactiveHours = [],
  handleHourChange,
  loading,
  selectedDay,
}) => {
  const [selectedHour, setSelectedHour] = useState(null);
  const horaActual = dayjs().format('HH:mm');
  const esHoy = selectedDay === dayjs().format('YYYY-MM-DD');

  const handleClick = (hour) => {
    setSelectedHour(hour);
    handleHourChange(hour);
  };

  const filteredHours = hours.filter(hour => 
    (!inactiveHours.includes(hour) && 
    (!esHoy || hour >= horaActual) // Filtrar las horas anteriores a la hora actual si es hoy
  ));

  return (
    <>
      {loading ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <CircularProgress />
        </Grid>
      ) : (
        <List>
          {filteredHours.map((hour, index) => (
            <StyledListItem
              key={index}
              onClick={() => handleClick(hour)}
              selected={hour === selectedHour}
              occupied={occupiedHours.includes(hour)}
              inactive={inactiveHours.includes(hour)}
            >
              <ListItemText primary={hour} sx={{ textAlign: "center" }} />
            </StyledListItem>
          ))}
        </List>
      )}
    </>
  );
};


const DaySelect = ({
  days = [],
  handleDayChange,
  selectedDay = null,
  inactiveDays = [],
}) => {
  const [visibleDays, setVisibleDays] = useState(days.slice(0, 7));
  const [direction, setDirection] = useState(0);

  const handlePrev = () => {
    const firstVisibleDayIndex = days.indexOf(visibleDays[0]);
    if (firstVisibleDayIndex > 0) {
      setDirection(-1); // Cambia la dirección a la izquierda
      setVisibleDays(
        days.slice(firstVisibleDayIndex - 7, firstVisibleDayIndex)
      );
      handleDayChange(days[firstVisibleDayIndex - 7]);
    }
  };

  const handleNext = () => {
    const lastVisibleDayIndex = days.indexOf(
      visibleDays[visibleDays.length - 1]
    );
    if (lastVisibleDayIndex < days.length - 1) {
      setDirection(1); // Cambia la dirección a la derecha
      setVisibleDays(
        days.slice(lastVisibleDayIndex + 1, lastVisibleDayIndex + 8)
      );
      handleDayChange(days[lastVisibleDayIndex + 1]);
    }
  };
  const selectedDayDate = dayjs(selectedDay);

  return (
    <Paper
      elevation={3}
      className="p-4 mt-4"
      sx={{
        backgroundColor: "#f5f5f5",
        borderRadius: "25px",
        boxShadow:
          "rgba(0, 0, 0, 0.2) 0px 2px 4px, rgba(0, 0, 0, 0.1) 0px 7px 13px -3px",
        margin: "0 auto 14px",
        marginLeft: "69px",
        marginRight: "80px",
        width: "800px",
        height: "175px",
      }}
    >
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={2}>
          <IconButton
            aria-label="prev"
            onClick={handlePrev}
            disabled={visibleDays[0] === days[0]}
            sx={{
              visibility: visibleDays[0] === days[0] ? "hidden" : "visible",
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h5" component="h2" align="center">
            {selectedDayDate.format("MMMM YYYY")}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton
            aria-label="next"
            onClick={handleNext}
            disabled={
              visibleDays[visibleDays.length - 1] === days[days.length - 1]
            }
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container spacing={1} justifyContent="center">
        <AnimatePresence initial={false} custom={direction}>
          {visibleDays.map((day, index) => (
            <Grid key={index} item>
              <motion.div
                key={day}
                initial={{ opacity: 0, x: direction === 1 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 1 ? -100 : 100 }}
                transition={{ duration: 0.3 }}
              >
                <StyledDayButton
                  selected={selectedDay === day}
                  onClick={() => handleDayChange(day)}
                  sx={{
                    backgroundColor: inactiveDays.includes(day)
                      ? "#d3d3d3"
                      : undefined,
                    color: inactiveDays.includes(day) ? "#6e6e6e" : undefined,
                  }}
                  disabled={inactiveDays.includes(day)}
                >
                   {inactiveDays.includes(day) && (
                    <IconWrapper>
                      <RemoveIcon style={{ fontSize: "59px"}} />
                    </IconWrapper>
                  )}
                  <span>{dayjs(day).format("DD")}</span>
                  <DayLabel>{dayjs(day).format("ddd")}</DayLabel>
                </StyledDayButton>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Paper>
  );
};

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 8; hour <= 11; hour++) {
    times.push(dayjs().hour(hour).minute(0).format("HH:mm"));
  }
  for (let hour = 13; hour <= 16; hour++) {
    times.push(dayjs().hour(hour).minute(0).format("HH:mm"));
  }
  return times;
};

const generateDaysOfWeek = () => {
  const days = [];
  const startDate = dayjs();
  const endDate = startDate.add(1, "month").endOf("month");

  for (
    let date = startDate;
    date.isBefore(endDate) || date.isSame(endDate);
    date = date.add(1, "day")
  ) {
    days.push(date.format("YYYY-MM-DD"));
  }

  return days;
};

const ParentComponent = ({ onDateSelect, onHourSelect }) => {
  const [selectedDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedHour, setSelectedHour] = useState(null);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [inactiveDays, setInactiveDays] = useState([]);
  const [inactiveHours, setInactiveHours] = useState([]);
  const [occupiedHours, setOccupiedHours] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener días inactivos
        const horariosResponse = await axios.get(
          "http://localhost:5000/api/horarios"
        );
        let inactiveDays = horariosResponse.data
          .filter((horario) => horario.estado === "inactivo")
          .map((horario) => horario.fecha);
          
        // Añadir el día actual como inactivo si ya pasó la última hora disponible
        const horaActual = dayjs().format('HH:mm');
        const times = generateTimeOptions();
        const lastAvailableHour = times[times.length - 1];
        const today = dayjs().format('YYYY-MM-DD');
        
        if (today === selectedDay && horaActual > lastAvailableHour) {
          inactiveDays.push(today);
        }
  
        setInactiveDays(inactiveDays);
  
        // Obtener todos los días del mes
        const startDate = dayjs();
        const endDate = startDate.add(1, "month").endOf("month");
        const days = [];
  
        for (
          let date = startDate;
          date.isBefore(endDate) || date.isSame(endDate);
          date = date.add(1, "day")
        ) {
          days.push(date.format("YYYY-MM-DD"));
        }
  
        setDaysOfWeek(days);
      } catch (error) {
        console.error("Error al obtener los días inactivos:", error);
      }
    };
  
    fetchData();
  }, [selectedDay]);

  useEffect(() => {
    const fetchOccupiedHours = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/agendas/horasOcupadas",
          {
            params: { fecha: selectedDay },
          }
        );
        setOccupiedHours(response.data);
      } catch (error) {
        console.error("Error al obtener las horas ocupadas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOccupiedHours();
  }, [selectedDay]);

  useEffect(() => {
    const fetchInactiveHours = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/horarios/listarFechasConHorasInactivas",
          {
            params: { fecha: selectedDay },
          }
        );
        const data = response.data.find(info => dayjs(info.fecha).isSame(selectedDay, 'day'));
        if (data) {
          setInactiveHours(data.horas_inactivas);
        } else {
          setInactiveHours([]);
        }
      } catch (error) {
        console.error("Error al obtener las horas inactivas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInactiveHours();
  }, [selectedDay]);


  const handleDayChange = (day) => {
    setSelectedDay(day);
    setSelectedHour(null); // Reinicia la hora seleccionada cuando cambia el día
    onDateSelect(day); // Notifica al componente padre la fecha seleccionada
  };

  const handleHourChange = (hour) => {
    setSelectedHour(hour);
    onHourSelect(hour); // Notifica al componente padre la hora seleccionada
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <DaySelect
          days={daysOfWeek}
          handleDayChange={handleDayChange}
          selectedDay={selectedDay}
          inactiveDays={inactiveDays}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        style={{ marginTop: "-19px", marginLeft: "118px" }}
      >
        <TimeSelect
          hours={generateTimeOptions()}
          occupiedHours={occupiedHours}
          inactiveHours={inactiveHours}
          handleHourChange={handleHourChange}
          selectedDay={selectedDay} // Pasar selectedDay al TimeSelect
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default ParentComponent;
