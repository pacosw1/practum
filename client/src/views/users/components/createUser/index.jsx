import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { client } from '../../../../config/environment';

const InitialUser = {
  email: '',
  password: '',
};

const CreateUser = ({ visible, setVisible, refetch }) => {
  const [newUser, setNewUser] = useState(InitialUser);

  const resetStates = () => {
    setNewUser(InitialUser);
  };

  const closeDialog = () => {
    setVisible(false);
    resetStates();
  };

  const handleInputChange = e => {
    const { name, value } = e.target;

    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const onFinish = async () => {
    try {
      await client.post('users', newUser);
      refetch();
      closeDialog();
      toast.success('Credencial creada');
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
      toast.error('Error al crear');
    }
  };

  return (
    <Dialog open={visible} onClose={closeDialog}>
      <DialogTitle>Crear usuario</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="caption" display="block" gutterBottom>
              Correo a utilizar:
            </Typography>
            <TextField
              id="email"
              name="email"
              type="email"
              required
              value={newUser.email}
              onChange={handleInputChange}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>
          <Grid item xs>
            <Typography variant="caption" display="block" gutterBottom>
              Contraseña:
            </Typography>
            <TextField
              id="password"
              name="password"
              type="password"
              required
              value={newUser.password}
              onChange={handleInputChange}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="error" variant="contained" onClick={closeDialog}>
          Cancelar
        </Button>
        <Button color="success" variant="contained" onClick={onFinish}>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUser;
