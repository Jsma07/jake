// CamposObligatorios.js
import React from 'react';

const CamposObligatorios = (formData, campos, mensaje) => {
  const emptyFields = campos.filter(field => {
    const value = formData[field];
    console.log(`Verificando campo ${field}: valor = "${value}", tipo = ${typeof value}`);

    // Check if the value is empty, considering both strings and numbers
    if (typeof value === 'string') {
      return value.trim() === '';
    } else if (typeof value === 'number') {
      return isNaN(value);
    } else {
      return !value; // for other types like boolean, object, etc.
    }
  });

  if (emptyFields.length > 0) {
    window.Swal.fire({
      icon: 'error',
      title: 'Campos obligatorios vacíos',
      text: mensaje || 'Por favor, completa todos los campos obligatorios antes de continuar.',
    });
    return false;
  }
  return true;
};

export default CamposObligatorios;
