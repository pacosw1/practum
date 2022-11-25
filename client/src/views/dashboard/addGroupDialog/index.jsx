import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { client } from '../../../config/environment';

const InitialName = {
  name: '',
};

const AddGroupDialog = ({ visible, setVisible, refetch }) => {
  const [group, setGroup] = useState(InitialName);

  const handleInputChange = e => {
    const { name, value } = e.target;

    setGroup({
      ...group,
      [name]: value,
    });
  };

  const closeDialog = () => {
    setVisible(false);
    setGroup(InitialName);
  };

  const createGroup = async () => {
    try {
      await client.post('groups', group);
      refetch();
      closeDialog();
      toast.success('Grupo creado');
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
      toast.error('Error al crear');
    }
  };

  return (
    <Dialog open={visible} onClose={closeDialog}>
      <DialogTitle>Crear grupo</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="caption" display="block" gutterBottom>
              Nombre de Grupo:
            </Typography>
            <TextField
              id="name"
              name="name"
              type="text"
              required
              value={group.name}
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
        <Button color="success" variant="contained" onClick={createGroup} disabled={group.name === '' ? true : false}>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGroupDialog;
