import { Add } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../../config/environment';
import AddAreaDialog from './addAreaDialog';
import AddGroupDialog from './addGroupDialog';
import AddProcessDialog from './addProcessDialog';
import EditAreaDialog from './editAreaDialog';
import EditGroupDialog from './editGroupDialog';
import EditProcessDialog from './editProcessDialog';

const Dashboard = () => {
  // Material UI default menu states
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anchorEls, setAnchorEls] = useState(null);

  const [groups, setGroups] = useState([]);
  const [areas, setAreas] = useState([]);
  const [process, setProcess] = useState([]);
  const [global, setGlobal] = useState([]);
  const [actualCoor, setActualCoor] = useState();

  // States to pass which data to edit
  const [editGroup, setEditGroup] = useState();
  const [editArea, setEditArea] = useState();
  const [editProcess, setEditProcess] = useState();

  // States to control dialogs visibility
  const [addGroupDialogShow, setAddGroupDialogShow] = useState(false);
  const [addAreaDialogShow, setAddAreaDialogShow] = useState(false);
  const [addProcessDialogShow, setAddProcessDialogShow] = useState(false);
  const [editGroupDialogShow, setEditGroupDialogShow] = useState(false);
  const [editAreaDialogShow, setEditAreaDialogShow] = useState(false);
  const [editProcessDialogShow, setEditProcessDialogShow] = useState(false);

  const [loading, setLoading] = useState(false);

  const openEditGroupDialog = g => {
    setEditGroup(g);
    setEditGroupDialogShow(true);
  };

  const openEditAreaDialog = a => {
    setEditArea(a);
    setEditAreaDialogShow(true);
  };

  const openEditProcessDialog = p => {
    setEditProcess(p);
    setEditProcessDialogShow(true);
  };

  const refetch = async () => {
    setLoading(true);
    await loadGroups();
    await loadAreas();
    await loadProcesses();
    setLoading(false);
  };

  const loadGroups = async () => {
    try {
      await client.get('groups').then(res => {
        let gro = res?.data?.data;
        setGroups(gro);
      });
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 73 ~ onFinish ~ error', error);
    }
  };

  const loadAreas = async () => {
    try {
      await client.get('areas').then(res => {
        let are = res?.data?.data;
        setAreas(are);
      });
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 84 ~ onFinish ~ error', error);
    }
  };

  const loadProcesses = async () => {
    try {
      await client.get('process').then(res => {
        let pro = res?.data?.data;
        setProcess(pro);
      });
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 95 ~ loadProcesses ~ error', error);
    }
  };

  // function for table as matrix creation
  const createTable = () => {
    let globalArray = [];

    areas.forEach(a => {
      let aux = [];

      groups.forEach(c => {
        let curr = process.filter(pro => pro.areaId === a.id && pro.groupId === c.id);

        aux.push([...curr]);
      });

      globalArray.push(aux);
    });

    setGlobal(globalArray);
  };

  // each time view is mounted, load all data and call function to create table
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await loadGroups();
      await loadAreas();
      await loadProcesses();
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    createTable();
  }, [process]);

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button
          variant="contained"
          onClick={event => {
            setAnchorEl(event.currentTarget);
          }}
        >
          Agregar
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => {
            setAnchorEl(null);
          }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem
            key={1}
            onClick={() => {
              setAnchorEl(null);
              setAddAreaDialogShow(true);
            }}
          >
            Area
          </MenuItem>
          <MenuItem
            key={2}
            onClick={() => {
              setAnchorEl(null);
              setAddGroupDialogShow(true);
            }}
          >
            Grupo
          </MenuItem>
          <MenuItem
            key={3}
            onClick={() => {
              setAnchorEl(null);
              setAddProcessDialogShow(true);
            }}
          >
            Proceso
          </MenuItem>
        </Menu>
      </Box>

      <TableContainer>
        <Table
          sx={{
            minWidth: 650,
            '& .MuiTableCell-root:hover': {
              bgcolor: 'secondary.main',
            },
          }}
        >
          <TableHead>
            <TableRow sx={{ '& td': { border: 0 } }}>
              <TableCell
                sx={{
                  '&:hover': {
                    bgcolor: 'transparent !important',
                  },
                }}
              ></TableCell>
              {groups.map(g => (
                <Tooltip key={g.id} title="Editar" placement="top">
                  <TableCell
                    onClick={() => {
                      openEditGroupDialog(g);
                    }}
                    align="center"
                    sx={{
                      background: '#D0D3D4',
                      borderRadius: 1,
                    }}
                  >
                    <b>
                      {g?.order} {g?.name}
                    </b>
                  </TableCell>
                </Tooltip>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {areas.map((a, index) => (
              <TableRow key={a.name} sx={{ '& td': { border: 0 } }}>
                <Tooltip key={a.id} title="Editar" placement="top">
                  <TableCell
                    sx={{
                      position: 'sticky',
                      left: 0,
                      background: '#D0D3D4',
                      borderRadius: 1,
                    }}
                    onClick={() => {
                      openEditAreaDialog(a);
                    }}
                    component="th"
                    scope="row"
                    align="center"
                  >
                    <b>
                      {a?.order} {a.name}
                    </b>
                  </TableCell>
                </Tooltip>

                {global[index]?.map((ga, count) => (
                  <TableCell
                    key={count}
                    align="center"
                    sx={{
                      background: '#F8F9F9',
                      borderRadius: 1,
                    }}
                    onClick={() => {
                      if (ga.length === 0) {
                        setAddProcessDialogShow(true);
                        setActualCoor({ area: a.id, group: groups[count].id });
                      }
                    }}
                  >
                    {ga.length !== 0 ? (
                      ga?.map(proc => (
                        <div
                          key={proc.id}
                          onClick={() => {
                            openEditProcessDialog(proc);
                          }}
                        >
                          <Typography>{proc?.name}</Typography>
                        </div>
                      ))
                    ) : (
                      <Add sx={{ fill: '#F8F9F9' }} />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mount create and edit dialogs
            only appearing when showing state is true
        */}

      <AddGroupDialog visible={addGroupDialogShow} setVisible={setAddGroupDialogShow} refetch={refetch} />

      <AddAreaDialog visible={addAreaDialogShow} setVisible={setAddAreaDialogShow} refetch={refetch} />

      <AddProcessDialog
        visible={addProcessDialogShow}
        setVisible={setAddProcessDialogShow}
        refetch={refetch}
        groups={groups}
        areas={areas}
        actual={actualCoor}
        setActual={setActualCoor}
      />

      <EditGroupDialog
        visible={editGroupDialogShow}
        setVisible={setEditGroupDialogShow}
        refetch={refetch}
        groupToEdit={editGroup}
        setGroupToEdit={setEditGroup}
      />

      <EditAreaDialog
        visible={editAreaDialogShow}
        setVisible={setEditAreaDialogShow}
        refetch={refetch}
        areaToEdit={editArea}
        setAreaToEdit={setEditArea}
      />

      <EditProcessDialog
        visible={editProcessDialogShow}
        setVisible={setEditProcessDialogShow}
        refetch={refetch}
        actualProcess={editProcess}
        setActualProcess={setEditProcess}
      />
    </>
  );
};

export default Dashboard;
