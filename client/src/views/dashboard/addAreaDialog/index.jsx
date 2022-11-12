import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { client } from "../../../config/environment";

const InitialName = {
  name: "",
};

const AddAreaDialog = ({ visible, setVisible, refetch }) => {
  const [area, setArea] = useState(InitialName);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setArea({
      ...area,
      [name]: value,
    });
  };

  const closeDialog = () => {
    setVisible(false);
    refetch();
    setArea(InitialName);
  };

  const createArea = async () => {
    try {
      await client.post("areas", area);
      refetch();
      closeDialog();
    } catch (error) {
      console.log("🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error", error);
    }
  };

  return (
    <Dialog open={visible} onClose={closeDialog}>
      <DialogTitle>Crear Area</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='caption' display='block' gutterBottom>
              Nombre de Area:
            </Typography>
            <TextField
              id='name'
              name='name'
              type='text'
              required
              value={area.name}
              onChange={handleInputChange}
              fullWidth
              size='small'
              margin='dense'
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color='error' variant='contained' onClick={closeDialog}>
          Cancelar
        </Button>
        <Button
          color='success'
          variant='contained'
          onClick={createArea}
          disabled={area.name === "" ? true : false}
        >
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAreaDialog;
