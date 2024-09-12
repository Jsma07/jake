import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Grid, TextField, IconButton, Select, MenuItem, InputLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

const ModalEditar = ({ open, handleClose, title = '', fields, onSubmit, entityData, onChange }) => {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (entityData) {
      const initialData = {
        ...entityData,
        Precio_Servicio: parseFloat(entityData.Precio_Servicio) || '', // Asegúrate de que sea una cadena vacía si es NaN
      };
      setFormData(initialData);

      if (entityData.ImgServicio) {
        setImagePreview(`http://localhost:5000${entityData.ImgServicio}`);
      } else if (entityData.image_preview) {
        setImagePreview(entityData.image_preview);
      } else {
        setImagePreview(null);
      }

      if (entityData.imagen) {
        setImagePreview(`http://localhost:5000${entityData.imagen}`);
      }
    }
  }, [entityData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? parseFloat(newValue) || '' : newValue,
    }));
    
    if (onChange) {
      onChange(name, newValue);
    }
    
    const error = validateField(name, newValue, type);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleBlur = (e) => {
    const { name, value, type } = e.target;
    const error = validateField(name, value, type);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = () => {
    let hasErrors = false;
    const newErrors = {};
    fields.forEach((field) => {
      const error = validateField(field.name, formData[field.name], field.type);
      if (error) {
        hasErrors = true;
        newErrors[field.name] = error;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  const validateField = (name, value, type) => {
    let error = '';

    if (name === 'correo_proveedor') {
      if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
        error = 'El correo electrónico no es válido.';
      }
    }else if (name === 'telefono_proveedor') {
      if (!/^\+?\d+$/.test(value)) {
          error = 'El número de teléfono solo puede contener números.';
      }
  }else if (name === 'direccion_proveedor') {
    const regex = /^[a-zA-ZñÑ0-9\s#-]*$/;
    const containsThreeLetters = /[a-zA-ZñÑ].*[a-zA-ZñÑ].*[a-zA-ZñÑ]/;
    const containsSixNumbers = /[0-9].*[0-9].*[0-9].*[0-9].*[0-9].*[0-9]/;
    const containsOneHash = /^(?=(?:[^#]*#){0,1}[^#]*$)/;
    const containsOneDash = /^(?=(?:[^-]*-){0,1}[^-]*$)/;

    if (!regex.test(value)) {
        error = 'La dirección solo puede contener letras, números, espacios, # y -.';
    } else if (!containsThreeLetters.test(value)) {
        error = 'La dirección debe contener al menos 3 letras.';
    } else if (!containsSixNumbers.test(value)) {
        error = 'La dirección debe contener al menos 6 números.';
    } else if (!containsOneHash.test(value)) {
        error = 'La dirección solo puede contener un único carácter especial "#".';
    } else if (!containsOneDash.test(value)) {
        error = 'La dirección solo puede contener un único carácter especial "-".';
    }
}else if (name === 'NIT') {
        if (!/^[a-zA-ZñÑ0-9\s#-]*$/.test(value)) {
          error = 'El NIT de la empresa solo puede contener números.';
      }
    }else if (name === 'NombreInsumos') {
      if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9ñÑ\s]*$/.test(value)) {
          error = 'El nombre del insumo debe contener al menos una letra y no puede contener caracteres especiales.';
      }
    }else if (name === "nombre_categoria") {
      if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9ñÑ\s]*$/.test(value)) {
        error =
          "El nombre de la categoria debe contener al menos una letra y no puede contener caracteres especiales.";
      }
    }else if (name === 'empresa_proveedor') {
      if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9ñÑ\s]*$/.test(value)) {
          error = 'El nombre de la empresa debe contener al menos una letra y no puede contener caracteres especiales.';
      }
    } else if (name === 'Precio_Servicio') {
      if (isNaN(value) || Number(value) <= 20000) {
        error = 'El precio debe ser un número mínimo de $20.000.';
      }
    } else {
      switch (type) {
        case 'text':
          if (!/^[a-zA-ZñÑ\s]*$/.test(value)) {
            error = 'El campo solo puede contener letras y espacios.';
          }
          break;
        case 'number':
          if (isNaN(value) || Number(value) <= 0) {
            error = 'El campo debe ser un número positivo.';
          }
          break;
        default:
          break;
      }
    }
    return error;
  };

  const renderFields = () => {
    return fields.map((field, index) => (
      <Grid item xs={12} sm={6} key={index}>
        {renderFieldByType(field)}
      </Grid>
    ));
  };

  const renderFieldByType = (field) => {
    const { name, label, type, readOnly, options } = field;

    switch (type) {
      case 'text':
      case 'password':
        case 'number':
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
      value={formData[name] || ''}
      error={!!errors[name]}
      helperText={errors[name]}
      // Asegúrate de que el campo no esté deshabilitado si no es necesario
      disabled={readOnly && name !== 'Precio_Servicio'}
    />
  );
      case 'select':
        return (
          <div>
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
              labelId={`${name}-label`}
              id={name}
              name={name}
              variant="outlined"
              onChange={handleChange}
              fullWidth
              size="medium"
              value={formData[name] || ""}
              label={label}
              style={{ marginBottom: "0.5rem", textAlign: "center" }}
              error={!!errors[name]}
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
        case 'textarea':
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
            multiline
            rows={4}
            style={{ marginBottom: '0.5rem', textAlign: 'center' }}
            value={formData[name] || ''}
            error={!!errors[name]}
            helperText={errors[name]}
            disabled={readOnly}
          />
        );
      case 'file':
        return (
          <div className="flex flex-col items-center justify-center w-full">
            {imagePreview ? (
              <div style={{ position: 'relative', display: 'inline-block', textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    width: '100%',  
                    maxWidth: '500px', 
                    height: 'auto', 
                    maxHeight: '200px', 
                    objectFit: 'contain', 
                    borderRadius: '8px' 
                  }} 
                />
                <IconButton
                  size="small"
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  }}
                  onClick={() => handleImageRemoval(name)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            ) : (
              <label 
                htmlFor={`file-input-${name}`} 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                style={{ width: '100%', height: '150px', maxWidth: '500px', textAlign: 'center', marginBottom: '0.5rem' }}
              >
                <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  Click para seleccionar una imagen
                </Typography>
                <input 
                  id={`file-input-${name}`} 
                  type="file" 
                  name={name}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, name)}
                />
              </label>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleImageChange = (e, name) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          [name]: file,
          [`${name}_preview`]: reader.result,
        }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemoval = (name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: null,
      [`${name}_preview`]: null,
    }));
    setImagePreview(null);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
          <Typography variant="h6" gutterBottom style={{ textAlign: 'center' }}>
            {title}
          </Typography>
          <Grid container spacing={2}>
            {renderFields()}
          </Grid>
          <div style={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SendIcon />}
              onClick={handleSubmit}
              style={{ margin: '1rem 0.5rem' }}
            >
              Enviar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleCancel}
              style={{ margin: '1rem 0.5rem' }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditar;
