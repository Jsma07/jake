import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, FormHelperText } from '@mui/material';

const ModalCategoria = ({ open, handleClose, onSubmit, title, fields, entityData, onChange }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    onChange(name, value);
    
    // Validación en tiempo real
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';

    if (name === 'nombre_categoria') {
      if (value.trim().length < 4) {
        error = 'El nombre de la categoría debe tener al menos 4 letras.';
      } else if (!/^[a-zA-Z0-9ñÑ\s]+$/.test(value)) {
        error = 'El nombre de la categoría no puede contener caracteres especiales.';
      } else if (value.trim() === '') {
        error = 'El nombre de la categoría es obligatorio.';
      }
    } else if (name === 'descripcion_categoria') {
      if (value.trim().length > 255) {
        error = 'La descripción debe tener hasta 255 caracteres.';
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = () => {
    const validationErrors = {};

    fields.forEach((field) => {
      const value = entityData[field.name] || '';
      validateField(field.name, value);
      if (errors[field.name]) {
        validationErrors[field.name] = errors[field.name];
      }
    });

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(entityData);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: 450, p: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 24, mx: 'auto' }}>
        <Typography variant="h6" mb={3} sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {title}
        </Typography>
        {fields.map((field) => (
          <Box key={field.name} sx={{ mb: 2 }}>
            <TextField
              label={field.label}
              name={field.name}
              type={field.type}
              value={entityData[field.name] || ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline={field.type === 'textarea'}  // Hacer el campo multiline si el tipo es textarea
              rows={field.rows || 1}  // Establecer el número de filas si es un textarea
              InputProps={{
                readOnly: field.readOnly || false,
              }}
              error={!!errors[field.name]}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                '& .MuiFormLabel-root': {
                  color: 'text.primary',
                },
                '& .MuiFormHelperText-root': {
                  color: 'error.main',
                }
              }}
            />
            {errors[field.name] && (
              <FormHelperText error>{errors[field.name]}</FormHelperText>
            )}
          </Box>
        ))}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button onClick={handleClose} color="secondary" variant="outlined" sx={{ mr: 1, borderRadius: '8px' }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ borderRadius: '8px' }}>
            {title.includes('Crear') ? 'Agregar' : 'Actualizar'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCategoria;
