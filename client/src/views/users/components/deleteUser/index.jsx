import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import React from "react";
import { client } from "../../../../config/environment";

const DeleteUser = ({ visible, setVisible, user, refetch }) => {
  const closeDialog = () => {
    setVisible(false);
    refetch();
  };

  const onDelete = async () => {
    try {
      await client.delete(`users/${user?.id}`);
      closeDialog();
    } catch (error) {
      console.log("🚀 ~ file: index.jsx ~ line 22 ~ onDelete ~ error", error);
    }
  };

  return (
    <Dialog open={visible}>
      <DialogContent>
        <DialogContentText gutterBottom variant='h6' fontWeight={600}>
          ¿Seguro que deseas borrar {user?.email}?
        </DialogContentText>
        <Typography variant='body1'>
          Al borrar este usuario no podrás volver a recuperarlo.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancelar</Button>
        <Button variant='contained' color='error' onClick={onDelete}>
          Borrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUser;
