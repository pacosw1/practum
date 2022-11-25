import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { client } from '../../../config/environment';

const InitialName = {
  name: '',
  description: '',
};

const AddOutput = ({ visible, setVisible, refetch }) => {
  const [output, setOutput] = useState(InitialName);

  const handleInputChange = e => {
    const { name, value } = e.target;

    setOutput({
      ...output,
      [name]: value,
    });
  };

  const closeDialog = () => {
    setVisible(false);
    setOutput(InitialName);
  };

  const createEntry = async () => {
    try {
      await client.post('outputs', output);
      refetch();
      closeDialog();
      toast.success('Salida creada');
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
      toast.error('Error al crear');
    }
  };

  return (
    <Dialog open={visible} onClose={closeDialog}>
      <DialogTitle>Agregar salida</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="caption" display="block" gutterBottom>
              Nombre:
            </Typography>
            <TextField
              id="name"
              name="name"
              type="text"
              required
              value={output.name}
              onChange={handleInputChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <Typography variant="caption" display="block" gutterBottom>
              Descripción:
            </Typography>
            <TextField
              id="description"
              name="description"
              type="text"
              required
              value={output.description}
              onChange={handleInputChange}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={closeDialog}>
          Cancelar
        </Button>
        <Button color="success" variant="contained" onClick={createEntry} disabled={!(output.name && output.description)}>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AddOutput;
