import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [anchorEls, setAnchorEls] = useState(null);
  const opens = Boolean(anchorEls);

  const [groups, setGroups] = useState([]);
  const [areas, setAreas] = useState([]);
  const [process, setProcess] = useState([]);
  const [global, setGlobal] = useState([]);
  const [actualCoor, setActualCoor] = useState();

  const [editGroup, setEditGroup] = useState();
  const [editArea, setEditArea] = useState();
  const [editProcess, setEditProcess] = useState();

  const [addGroupDialogShow, setAddGroupDialogShow] = useState(false);
  const [addAreaDialogShow, setAddAreaDialogShow] = useState(false);
  const [addProcessDialogShow, setAddProcessDialogShow] = useState(false);

  const [editGroupDialogShow, setEditGroupDialogShow] = useState(false);
  const [editAreaDialogShow, setEditAreaDialogShow] = useState(false);
  const [editProcessDialogShow, setEditProcessDialogShow] = useState(false);

  const refetch = () => {
    loadGroups();
    loadAreas();
    loadProcesses();
  };

  const loadGroups = async () => {
    try {
      await client.get('groups').then(res => {
        let gro = res?.data?.data;
        setGroups(gro);
      });
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
    }
  };

  const loadAreas = async () => {
    try {
      await client.get('areas').then(res => {
        let are = res?.data?.data;
        setAreas(are);
      });
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
    }
  };

  const loadProcesses = async () => {
    try {
      await client.get('process').then(res => {
        let pro = res?.data?.data;
        setProcess(pro);
      });
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
    }
  };

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

  useEffect(() => {
    async function fetchData() {
      await loadGroups();
      await loadAreas();
      await loadProcesses();
    }
    fetchData();
  }, []);

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

  useEffect(() => {
    createTable();
  }, [process]);

  return (
    <>
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
                    <b>{g?.name}</b>
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
                    <b> {a.name}</b>
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
