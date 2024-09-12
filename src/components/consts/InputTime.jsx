import React from 'react';
import { TimePicker } from '@hilla/react-components/TimePicker.js';
import { FormControl, InputLabel, Input } from '@mui/material';

const InputTime = ({ label, value, onChange, step }) => {
  return (
    <FormControl fullWidth style={{ marginBottom: '0.5rem' }}>
      <InputLabel>{label}</InputLabel>
      <TimePicker
        value={value}
        onChange={onChange}
        step={step}
        input={<Input />}
      />
    </FormControl>
  );
};

export default InputTime;
