import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Grid, TextField, Select, MenuItem, InputLabel, FormControlLabel, Checkbox } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const ModalDinamico = ({ open, handleClose, title = '', fields, onSubmit, onChange }) => {
  const [formValues, setFormValues] = useState({});
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 350, y: 150 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [modalSize, setModalSize] = useState({ width: 0, height: 0 });
  const [errores, setErrores] = useState({});


  useEffect(() => {
    if (fields && fields.length > 0) {
      const initialFormData = {};
      const initialErrors = {};
      fields.forEach((field) => {
        initialFormData[field.name] = field.type === 'checkbox' ? field.checked || false : field.value || '';
        initialErrors[field.name] = '';
      });
      setFormValues(initialFormData);
      setErrores(initialErrors);
    }

    if (open) {
      const modalContainer = document.getElementById('modal-container');
      if (modalContainer) {
        setModalSize({
          width: modalContainer.offsetWidth,
          height: modalContainer.offsetHeight
        });

        // Center modal initially
        const initialX = (window.innerWidth - modalContainer.offsetWidth) / 2;
        const initialY = (window.innerHeight - modalContainer.offsetHeight) / 2;
        setPosition({ x: initialX, y: initialY });
      }
    }
  }, [fields, open]);
  const formatNombreApellido = (value) => {
    // Elimina espacios adicionales al principio y al final
    const trimmedValue = value.trim();
  
    // Reemplaza múltiples espacios consecutivos por un solo espacio
    const formattedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();

    const words = formattedValue.split(' ');
  if (words.length > 2) {
    // Si hay más de dos palabras, solo toma las dos primeras
    return words.slice(0, 2).join(' ');
  }

    return formattedValue;
  };
  
  
  
  const formatCorreo = (value) => {
    const trimmedValue = value.trim().toLowerCase();
    return trimmedValue;
  };
  
  const formatTelefono = (value) => {
    const trimmedValue = value.trim();
    return trimmedValue;
  };
  
  const formatDocumento = (value) => {
    const trimmedValue = value.trim();
    return trimmedValue;
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPosition({ 
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const maxX = window.innerWidth - modalSize.width;
      const maxY = window.innerHeight - modalSize.height;
      const newX = Math.max(0, Math.min(position.x + e.clientX - startPosition.x, maxX));
      const newY = Math.max(0, Math.min(position.y + e.clientY - startPosition.y, maxY));
      setPosition({ x: newX, y: newY });
      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
  
    switch (name) {
     
      case 'correo':
        newValue = formatCorreo(newValue);
        break;
      case 'telefono':
        newValue = formatTelefono(newValue);
        break;
      case 'Documento':
        newValue = formatDocumento(newValue);
        break;
      default:
        break;
    }
  
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: newValue,
    }));
    setErrores((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
    onChange && onChange(name, newValue);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const trimmedValue = typeof value === 'string' ? value.trim() : value;
    if (name === 'nombre' || name === 'apellido') {
      const formattedValue = formatNombreApellido(trimmedValue);
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [name]: formattedValue,
      }));
    }
     // Verificar si es una cadena de texto antes de llamar a trim()
    validateField(name, trimmedValue); // Llamar a validateField con el valor limpio
  };
  
  

  const validateField = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'nombre':
      case 'apellido':
        const validacionNombreApellido = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
      // Verifica que solo haya dos palabras
      const palabras = value.trim().split(' ');
      if (palabras.length > 2) {
        errorMessage = 'El campo debe contener solo dos palabras.';
      } else if (!validacionNombreApellido.test(value)) {
        errorMessage = 'El campo debe contener solo letras y espacios.';
      }
        break;
      case 'Documento':
        const validacionDocumento = /^[0-9]{10,17}$/; // Rango de 10 a 17 caracteres numéricos
        if (!validacionDocumento.test(value)) {
          errorMessage = 'El campo debe contener entre 10 y 17 números.';
        }
        break;
      case 'telefono':
        const validacionTelefono = /^[0-9]{7,15}$/;
        if (!validacionTelefono.test(value)) {
          errorMessage = 'El campo debe contener entre 7 y 15 números.';
        }
        break;
      case 'correo':
        const validacionCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!validacionCorreo.test(value)) {
          errorMessage = 'El correo ingresado tiene un formato inválido.';
        }
        break;
      case 'contrasena':
        // Validar contraseña: mínimo 8 caracteres, una mayúscula y un número
        const validacionContrasena = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!validacionContrasena.test(value)) {
          errorMessage = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.';
        }
        break;
      default:
        break;
    }
  
    setErrores((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = () => {
    // Validar todos los campos antes de enviar
    const validationErrors = {};
    let formIsValid = true; // Bandera para verificar si el formulario es válido

    fields.forEach((field) => {
      const { name, value } = formValues[field.name];
      validateField(name, value);
      validationErrors[name] = errores[name]; // Recoger errores después de la validación
      if (errores[name]) {
        formIsValid = false; // Si hay algún error, el formulario no es válido
      }
    });

    // Si hay errores, no enviar el formulario
    if (!formIsValid) {
      console.log('Formulario contiene errores. No se puede enviar.');
      return;
    }

    // Lógica para enviar el formulario si es válido
    if (typeof onSubmit === 'function') {
      console.log("Form data before submit:", formValues); // Depuración
      onSubmit(formValues);
      handleClose();
    } else {
      console.error("onSubmit is not a function");
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  const renderFields = () => {
    return fields.map((field, index) => (
      <Grid item xs={12} sm={6} key={index}>
        {renderFieldByType(field)}
        {errores[field.name] && (
          <Typography variant="body2" color="error">
            {errores[field.name]}
          </Typography>
        )}
      </Grid>
    ));
  };

  const renderFieldByType = (field) => {
    const { name, label, type, options, hidden } = field;

    if (hidden) return null; // Si el campo está oculto, no renderizar

    switch (type) {
      case "text":
      case "password":
      case "number":
        return (
          <TextField
            id={name}
            name={name}
            label={label}
            variant="outlined"
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            size="medium"
            type={type}
            style={{ marginBottom: '0.5rem', textAlign: 'center' }}
            value={formValues[name] || ''}
          />
        );
      case "select":
        return (
          <div>
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
              labelId={`${name}-label`}
              id={name}
              name={name}
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={field.disabled}
              fullWidth
              size="medium"
              value={formValues[name] || ''}
              label={label}
              style={{ marginBottom: "0.5rem", textAlign: "center" }}
            >
              {options &&
                options.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
          </div>
        );
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!formValues[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                name={name}
              />
            }
            label={label}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div 
        id="modal-container"
        style={{ 
          position: 'absolute', 
          top: `${position.y}px`, 
          left: `${position.x}px`, 
          backgroundColor: 'white', 
          borderRadius: '0.375rem', 
          width: '80%', 
          maxWidth: '50rem', 
          maxHeight: '80%', 
          overflow: 'auto', 
          padding: '1.5rem', 
          cursor: dragging ? 'grabbing' : 'grab',
          zIndex: 9999
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
          <DragIndicatorIcon style={{ 
            position: 'absolute', 
            top: '-0.5rem', 
            left: '0', 
            fontSize: '2rem' 
          }} /> 
          {title}
        </Typography>
        <Grid container spacing={2}>
          {renderFields()}
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            marginTop: "1.5rem",
          }}
        >
           <Button
            onClick={handleCancel}
            color="secondary"
            variant="contained"
            style={{ marginRight: '1rem' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            endIcon={<SendIcon />}
          >
            Enviar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDinamico;