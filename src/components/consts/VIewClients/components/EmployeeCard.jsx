import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Definir un tema personalizado para tipografía y colores
const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      'sans-serif',
    ].join(','),
    h6: {
      fontSize: '14px',
      fontWeight: 400,
      color: '#0D0D0D',
    },
    body2: {
      fontSize: '18px',
      fontWeight: 500,
      color: '#0D0D0D',
    },
  },
});

// Colores de fondo para los Avatares
const avatarColors = ['#FAD4D4', '#E5D9FF', '#F5F5DC'];

// Estilo del Avatar
const StyledAvatar = styled(Avatar)(({ color }) => ({
  width: 70,
  height: 70,
  marginBottom: '8px',
  backgroundColor: color,
  color: '#02050D',
  fontSize: '50px'
}));

// Estilo del CardContent
const StyledCardContent = styled(CardContent)({
  textAlign: 'center',
  padding: '0px',
});

// Estilo del Card
const StyledCard = styled(Card)(({ isSelected }) => ({
  border: isSelected ? '2px solid #8e24aa' : '1px solid #0D0D0D',
  backgroundColor: isSelected ? '#f0eaff' : '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
  padding: '16px',
  cursor: 'pointer',
  borderRadius: '30px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  width: '215px',
  height: '179px',
  marginLeft: '30px',
  marginRight: '80px',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    transform: 'scale(1.08)',
  },
}));

const EmployeeCard = ({ employee, isSelected, onSelect }) => {
  const initial = employee.Nombre.charAt(0).toUpperCase();
  const avatarColor = avatarColors[employee.IdEmpleado % avatarColors.length];

  return (
    <ThemeProvider theme={theme}>
      <StyledCard isSelected={isSelected} onClick={() => onSelect(employee)}>
        <StyledAvatar color={avatarColor}>
          {initial}
        </StyledAvatar>
        <StyledCardContent>
          <Typography variant="h6" component="div">
            {employee.Nombre} {employee.Apellido}
          </Typography>
        </StyledCardContent>
      </StyledCard>
    </ThemeProvider>
  );
};

const EmployeeSelection = ({ employees, onEmployeeSelect }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    if (employees.length > 0 && selectedEmployeeId === null) {
      const firstEmployeeId = employees[0].IdEmpleado;
      setSelectedEmployeeId(firstEmployeeId);
      onEmployeeSelect(firstEmployeeId);
    }
  }, [employees, selectedEmployeeId, onEmployeeSelect]);

  const handleSelect = (employee) => {
    setSelectedEmployeeId(employee.IdEmpleado);
    onEmployeeSelect(employee.IdEmpleado);
  };

  return (
    <>
      {employees.map(employee => (
        <EmployeeCard
          key={employee.IdEmpleado}
          employee={employee}
          isSelected={selectedEmployeeId === employee.IdEmpleado}
          onSelect={() => handleSelect(employee)}
        />
      ))}
    </>
  );
};

export { EmployeeCard, EmployeeSelection };
