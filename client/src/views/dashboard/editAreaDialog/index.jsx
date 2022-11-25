import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { client } from '../../../config/environment';
import toast from 'react-hot-toast';

const InitialName = {
  name: '',
  order: 4,
};

const EditAreaDialog = ({ visible, setVisible, refetch, areaToEdit, setAreaToEdit }) => {
  const [area, setArea] = useState(InitialName);

  const handleInputChange = e => {
    const { name, value } = e.target;

    if (e.target.type === 'number') {
      setArea({
        ...area,
        [name]: Number(value),
      });
    } else {
      setArea({
        ...area,
        [name]: value,
      });
    }
  };

  const closeDialog = () => {
    setVisible(false);
    setArea(InitialName);
    setAreaToEdit();
  };

  const editArea = async () => {
    try {
      await client.put(`areas/${areaToEdit.id}`, area);
      refetch();
      closeDialog();
      toast.success('Area renombrada');
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
      toast.error('Error al renombrar');
    }
  };

  useEffect(() => {
    if (visible === true) {
      setArea({ ...area, name: areaToEdit.name, order: areaToEdit?.order });
    }
  }, [visible, areaToEdit]);

  return (
    <Dialog open={visible} onClose={closeDialog}>
      <DialogTitle>Editar area</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="caption" display="block" gutterBottom>
              Nombre de Area:
            </Typography>
            <TextField
              id="name"
              name="name"
              type="text"
              required
              value={area.name}
              onChange={handleInputChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <Typography variant="caption" display="block" gutterBottom>
              Orden:
            </Typography>
            <TextField
              id="order"
              name="order"
              type="number"
              required
              value={area.order}
              onChange={handleInputChange}
              fullWidth
              size="small"
              margin="dense"
              InputProps={{
                inputProps: { min: 4 },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="error" variant="contained" onClick={closeDialog}>
          Cancelar
        </Button>
        <Button color="success" variant="contained" onClick={editArea} disabled={area.name === '' ? true : false}>
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAreaDialog;
