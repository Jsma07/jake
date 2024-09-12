import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Grid, TextField, FormControlLabel, Switch, Select, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const ModalBaseRol = ({ open, handleClose, title = '', fields, onSubmit, onChange }) => {
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
    const trimmedValue = value.trim();
    const formattedValue = trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
    const words = formattedValue.split(' ');
    if (words.length > 2) {
      return words.slice(0, 2).join(' ');
    }
    return formattedValue;
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
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
    validateField(name, trimmedValue);
  };

  const validateField = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'nombre':
        const validacionNombreApellido = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
        const palabras = value.trim().split(' ');
        if (palabras.length > 2) {
          errorMessage = 'El campo debe contener solo dos palabras.';
        } else if (!validacionNombreApellido.test(value)) {
          errorMessage = 'El campo debe contener solo letras y espacios.';
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
    const validationErrors = {};
    let formIsValid = true;

    fields.forEach((field) => {
      const { name, value } = formValues[field.name];
      validateField(name, value);
      validationErrors[name] = errores[name];
      if (errores[name]) {
        formIsValid = false;
      }
    });

    if (!formIsValid) {
      console.log('Formulario contiene errores. No se puede enviar.');
      return;
    }

    if (typeof onSubmit === 'function') {
      console.log("Form data before submit:", formValues);
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
    const textFields = [];
    const checkboxFields = [];
  
    fields.forEach((field, index) => {
      if (field.type === 'text') {
        textFields.push(
          <Grid item xs={12} key={index}>
            <div style={{ marginLeft: '0' }}>
              {renderFieldByType(field)}
              {errores[field.name] && (
                <Typography variant="body2" color="error">
                  {errores[field.name]}
                </Typography>
              )}
            </div>
          </Grid>
        );
      } else if (field.type === 'checkbox') {
        checkboxFields.push(
          <Grid item xs={6} key={index}>
            <div style={{ marginLeft: '40px' }}>
              {renderFieldByType(field)}
              {errores[field.name] && (
                <Typography variant="body2" color="error">
                  {errores[field.name]}
                </Typography>
              )}
            </div>
          </Grid>
        );
      }
    });
  
    return (
      <Grid container spacing={2}>
        {textFields}
        {checkboxFields.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '17px' }}>
              Permisos
            </Typography>
          </Grid>
        )}
        {checkboxFields}
      </Grid>
    );
  };
  
  const renderFieldByType = (field) => {
    const { name, label, type, options, hidden } = field;

    if (hidden) return null;

    switch (type) {
      case 'text':
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
            style={{ marginBottom: '16px',  width:'60%', marginLeft: '125px', marginTop:'15px' }}
            value={formValues[name] || ''}
          />
        );
      
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Switch
                id={name}
                name={name}
                checked={formValues[name] || false}
                onChange={handleChange}
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
          top: position.y,
          left: position.x,
          width: '600px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          zIndex: 1300,
          cursor: dragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Typography variant="h6" style={{ display: 'flex', alignItems: 'center' }}>
          {title}
          <DragIndicatorIcon style={{ marginLeft: '8px', cursor: 'grab' }} />
        </Typography>
        <Grid container spacing={2} style={{ marginTop: '16px' }}>
          {renderFields()}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              endIcon={<SendIcon />}
              style={{ marginRight: '8px' }}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};

export default ModalBaseRol;