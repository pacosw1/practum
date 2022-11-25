import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { client } from '../../../config/environment';

const InitialName = {
  name: '',
  description: '',
};

const EditEntry = ({ visible, setVisible, refetch, editing, setEditing }) => {
  const [entry, setEntry] = useState(InitialName);

  const handleInputChange = e => {
    const { name, value } = e.target;

    setEntry({
      ...entry,
      [name]: value,
    });
  };

  const closeDialog = () => {
    setVisible(false);
    setEntry(InitialName);
    setEditing();
  };

  const editEntry = async () => {
    try {
      await client.put(`entries/${editing.id}`, entry);
      refetch();
      closeDialog();
      toast.success('Entrada renombrada');
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
      toast.error('Error al renombrar');
    }
  };

  const onDelete = async () => {
    try {
      await client.delete(`entries/${editing.id}`);
      refetch();
      closeDialog();
      toast.success('Entrada eliminada');
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
      toast.error('Error al eliminar, esta siendo usada.');
    }
  };

  useEffect(() => {
    if (visible === true) {
      setEntry({ ...entry, name: editing?.name, description: editing?.description });
    }
  }, [visible, editing]);

  return (
    <Dialog open={visible} onClose={closeDialog}>
      <DialogTitle>Editar entrada</DialogTitle>
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
              value={entry.name}
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
              value={entry.description}
              onChange={handleInputChange}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="error" variant="contained" onClick={onDelete}>
          Eliminar
        </Button>
        <Button variant="contained" onClick={closeDialog}>
          Cancelar
        </Button>
        <Button color="success" variant="contained" onClick={editEntry} disabled={!(entry.name && entry.description)}>
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default EditEntry;
