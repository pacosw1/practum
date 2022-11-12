import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { client } from "../../../../config/environment";

const InitialUser = {
  email: "",
  password: "",
};

const CreateUser = ({ visible, setVisible, refetch }) => {
  const [newUser, setNewUser] = useState(InitialUser);

  const [alert, setAlert] = useState(false);

  const handleClick = () => {
    setAlert(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert(false);
  };

  const resetStates = () => {
    setNewUser(InitialUser);
  };

  const closeDialog = () => {
    setVisible(false);
    refetch();
    resetStates();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const onFinish = async () => {
    try {
      await client.post("users", newUser);
      closeDialog();
    } catch (error) {
      console.log("🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error", error);
      handleClick();
    }
  };

  return (
    <>
      <Snackbar open={alert} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: "100%" }}>
          Error al crear!
        </Alert>
      </Snackbar>
      <Dialog open={visible} onClose={closeDialog}>
        <DialogTitle>Crear usuario</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='caption' display='block' gutterBottom>
                Correo a utilizar:
              </Typography>
              <TextField
                id='email'
                name='email'
                type='email'
                required
                value={newUser.email}
                onChange={handleInputChange}
                fullWidth
                size='small'
                margin='dense'
              />
            </Grid>
            <Grid item xs>
              <Typography variant='caption' display='block' gutterBottom>
                Contraseña:
              </Typography>
              <TextField
                id='password'
                name='password'
                type='password'
                required
                value={newUser.password}
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
          <Button color='success' variant='contained' onClick={onFinish}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateUser;
