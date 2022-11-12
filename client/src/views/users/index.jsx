import { Add, DeleteForever, Edit } from "@mui/icons-material";
import { Box, Button, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { client } from "../../config/environment";
import CreateUser from "./components/createUser";
import DeleteUser from "./components/deleteUser";

const Users = () => {
  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});

  const columns = [
    {
      field: "email",
      headerName: "Correo",
      flex: 0.75,
    },
    {
      field: "edit",
      headerName: "Opciones",
      flex: 0.25,
      renderCell: (params) => {
        return (
          <Box>
            <Button startIcon={<Edit />} />
            <Button
              startIcon={<DeleteForever />}
              onClick={() => {
                openDeleteUserDialog(params.row);
              }}
            />
          </Box>
        );
      },
    },
  ];
  const openCreateUserDialog = () => {
    setCreateUserDialog(true);
  };

  const openDeleteUserDialog = (user) => {
    setDeleteUserDialog(true);
    setSelectedUser(user);
  };

  const findUsers = async () => {
    try {
      await client.get("users").then((res) => {
        let list = res?.data?.data;
        setUsers(list);
      });
    } catch (error) {
      console.log("🚀 ~ file: index.jsx ~ line 55 ~ findUsers ~ error", error);
    }
  };

  useEffect(() => {
    findUsers();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant='contained'
          endIcon={<Add />}
          onClick={openCreateUserDialog}
        >
          Nuevo
        </Button>
      </Box>
      <Paper sx={{ mt: 2 }}>
        <DataGrid autoHeight columns={columns} rows={users} hideFooter />
      </Paper>

      <CreateUser
        visible={createUserDialog}
        setVisible={setCreateUserDialog}
        refetch={findUsers}
      />
      <DeleteUser
        visible={deleteUserDialog}
        setVisible={setDeleteUserDialog}
        user={selectedUser}
        refetch={findUsers}
      />
    </>
  );
};

export default Users;
