import { Add } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import { client } from '../../../config/environment';
import toast from 'react-hot-toast';
import { filter } from 'compression';

// Material UI default variables for selected items on list
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(id, existent) {
  return {
    fontWeight: existent.find(item => item.id === id) ? 600 : 500,
  };
}

// follows process structure from backend
const InitialProcess = {
  name: '',
  areaId: '',
  groupId: '',
  newEntries: [],
  existingEntries: [],
  newOutputs: [],
  existingOutputs: [],
  newTools: [],
  existingTools: [],
};

const InitialName = {
  name: '',
  description: '',
};

let idEntry = 0;
let idOutput = 0;
let idTool = 0;

const EditProcessDialog = ({ visible, setVisible, refetch, actualProcess, setActualProcess }) => {
  const [process, setProcess] = useState(InitialProcess);

  const [allEntries, setAllEntries] = useState([]);
  const [allOutputs, setAllOutputs] = useState([]);
  const [allTools, setAllTools] = useState([]);

  const [newEntry, setNewEntry] = useState(InitialName);
  const [newOutput, setNewOutput] = useState(InitialName);
  const [newTool, setNewTool] = useState(InitialName);

  const [newEntriesArray, setNewEntriesArray] = useState([]);
  const [newOutputsArray, setNewOutputsArray] = useState([]);
  const [newToolsArray, setNewToolsArray] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;

    setProcess({
      ...process,
      [name]: value,
    });
  };

  // function that change existing entries in process
  const handleChangeEntry = event => {
    const aux = event.target.value;

    let results = aux.map(id => {
      return allEntries.find(item => item.id === id);
    });

    let newProcess = { ...process, existingEntries: [...results] };

    setProcess(newProcess);
  };

  // function that change existing outputs in process
  const handleChangeOutput = event => {
    const aux = event.target.value;

    let results = aux.map(id => {
      return allOutputs.find(item => item.id === id);
    });

    let newProcess = { ...process, existingOutputs: [...results] };

    setProcess(newProcess);
  };

  // function that change existing tools in process
  const handleChangeTool = event => {
    const aux = event.target.value;

    let results = aux.map(id => {
      return allTools.find(item => item.id === id);
    });

    let newProcess = { ...process, existingTools: [...results] };

    setProcess(newProcess);
  };

  const handleInputChangeEntry = e => {
    const { name, value } = e.target;

    setNewEntry({
      ...newEntry,
      [name]: value,
    });
  };

  const handleInputChangeOutput = e => {
    const { name, value } = e.target;

    setNewOutput({
      ...newOutput,
      [name]: value,
    });
  };

  const handleInputChangeTool = e => {
    const { name, value } = e.target;

    setNewTool({
      ...newTool,
      [name]: value,
    });
  };

  // Next 3 functions to save new data
  const saveNewEntry = () => {
    const aux = newEntry;
    aux.id = idEntry;
    setNewEntriesArray([...newEntriesArray, aux]);
    setNewEntry(InitialName);
    idEntry += 1;
  };

  const saveNewOutput = () => {
    const aux = newOutput;
    aux.id = idOutput;
    setNewOutputsArray([...newOutputsArray, aux]);
    setNewOutput(InitialName);
    idOutput += 1;
  };

  const saveNewTool = () => {
    const aux = newTool;
    aux.id = idTool;
    setNewToolsArray([...newToolsArray, aux]);
    setNewTool(InitialName);
    idTool += 1;
  };

  // functions to delete chips when creating a new entry/output or tool
  const onDeleteEntry = id => {
    const aux = newEntriesArray.filter(entry => entry.id !== id);
    setNewEntriesArray([...aux]);
  };

  const onDeleteOutput = id => {
    const aux = newOutputsArray.filter(output => output.id !== id);
    setNewOutputsArray([...aux]);
  };

  const onDeleteTool = id => {
    const aux = newToolsArray.filter(tool => tool.id !== id);
    setNewToolsArray([...aux]);
  };

  const closeDialog = () => {
    setVisible(false);
    resetStates();
  };

  const resetStates = () => {
    setActualProcess();
    setProcess(InitialProcess);
    setAllEntries([]);
    setAllOutputs([]);
    setAllTools([]);
    setNewEntry(InitialName);
    setNewOutput(InitialName);
    setNewTool(InitialName);
    setNewEntriesArray([]);
    setNewOutputsArray([]);
    setNewToolsArray([]);
    idEntry = 0;
    idOutput = 0;
    idTool = 0;
  };

  // Update process function
  const updateProcess = async () => {
    setLoading(true);
    let auxProcess = process;

    // Modifies existing objects in array for just an id
    auxProcess.existingEntries = process.existingEntries.map(ent => {
      return ent.id;
    });

    auxProcess.existingOutputs = process.existingOutputs.map(ent => {
      return ent.id;
    });

    auxProcess.existingTools = process.existingTools.map(ent => {
      return ent.id;
    });

    // delete id property on each object
    auxProcess.newEntries = newEntriesArray.map(({ id, ...item }) => item);
    auxProcess.newOutputs = newOutputsArray.map(({ id, ...item }) => item);
    auxProcess.newTools = newToolsArray.map(({ id, ...item }) => item);

    try {
      await client.put(`process/${actualProcess.id}`, auxProcess);
      refetch();
      setLoading(false);
      closeDialog();
      toast.success('Proceso modificado');
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
      setLoading(false);
      toast.error('Error editar');
    }
  };

  const deleteProcess = async () => {
    setLoading(true);

    try {
      await client.delete(`process/${actualProcess.id}`);
      refetch();
      setLoading(false);
      closeDialog();
      toast.success('Proceso eliminado');
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
      setLoading(false);
      toast.error('Error al eliminar');
    }
  };

  const loadEntries = async () => {
    try {
      await client.get('entries').then(res => {
        let e = res?.data?.data;
        setAllEntries(e);
      });
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
    }
  };

  const loadOutputs = async () => {
    try {
      await client.get('entries').then(res => {
        let e = res?.data?.data;

        console.log(e);
        setAllOutputs(e);
      });
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
    }
  };

  const loadTools = async () => {
    try {
      await client.get('tools').then(res => {
        let e = res?.data?.data;
        setAllTools(e);
      });
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
    }
  };

  const loadProcess = async () => {
    try {
      await client.get(`process/${actualProcess?.id}`).then(res => {
        let p = res?.data?.data;

        p.entries = p.entries.map(entry => {
          return {
            isExit: entry.isExit,
            id: entry.entry.id,
            name: entry.entry.name,
            description: entry.entry.description,
          };
        });

        // separate entries that belongs to outputs
        p.outputs = p.entries.filter(entry => entry.isExit === true);
        p.entries = p.entries.filter(entry => entry.isExit === false);

        p.tools = p.tools.map(tool => {
          return {
            id: tool.tool.id,
            name: tool.tool.name,
            description: tool.tool.description,
          };
        });

        setProcess({
          ...process,
          name: p.name,
          groupId: String(p.groupId),
          areaId: String(p.areaId),
          existingEntries: p.entries,
          existingOutputs: p.outputs,
          existingTools: p.tools,
        });
      });
    } catch (error) {
      console.log('🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error', error);
    }
  };

  useEffect(() => {
    if (actualProcess !== undefined && visible) {
      loadProcess();
      loadEntries();
      loadOutputs();
      loadTools();
    }
  }, [visible, actualProcess]);

  return (
    <Dialog
      open={visible}
      onClose={closeDialog}
      maxWidth="xl"
      PaperProps={{
        style: {
          backgroundColor: '#F5F5F5',
        },
      }}
    >
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DialogTitle>Editar Proceso</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 1,
                p: 2,
                bgcolor: 'white',
              }}
            >
              <Typography variant="caption" display="block" gutterBottom>
                Nombre de Proceso:
              </Typography>
              <TextField
                id="name"
                name="name"
                type="text"
                required
                value={process.name}
                onChange={handleInputChange}
                size="small"
                margin="dense"
                fullWidth
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                p: 2,
                bgcolor: 'white',
              }}
            >
              <Typography fontWeight={600} align="center">
                Entradas
              </Typography>

              <Typography variant="caption" display="block" gutterBottom>
                Nombre:
              </Typography>
              <TextField
                id="name"
                name="name"
                type="text"
                required
                value={newEntry.name}
                onChange={handleInputChangeEntry}
                size="small"
                margin="dense"
                fullWidth
              />

              <Typography variant="caption" display="block" gutterBottom>
                Descripción:
              </Typography>
              <TextField
                id="description"
                name="description"
                type="text"
                required
                value={newEntry.description}
                onChange={handleInputChangeEntry}
                size="small"
                margin="dense"
                fullWidth
              />

              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                sx={{ ml: 'auto', mt: 1 }}
                disabled={!(newEntry.name && newEntry.description)}
                onClick={saveNewEntry}
              >
                Agregar
              </Button>

              <Typography variant="caption" fontWeight={600} color={grey[400]}>
                Entradas agregadas manualmente
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 2 }}>
                {newEntriesArray.map((value, index) => (
                  <Chip
                    key={index}
                    label={value.name}
                    sx={{ fontWeight: 600 }}
                    onDelete={() => {
                      onDeleteEntry(value.id);
                    }}
                  />
                ))}
              </Box>

              <Typography variant="caption" display="block" gutterBottom>
                Entradas existentes:
              </Typography>
              <FormControl>
                <Select
                  multiple
                  value={process.existingEntries.map(entry => entry.id)}
                  onChange={handleChangeEntry}
                  renderValue={selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map(id => {
                        let entry = process.existingEntries.find(entry => entry.id === id);
                        return <Chip key={id} label={entry.name} />;
                      })}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {allEntries.map(e => (
                    <MenuItem key={e.id} value={e.id} style={getStyles(e.id, process.existingEntries)}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                p: 2,
                bgcolor: 'white',
              }}
            >
              <Typography fontWeight={600} align="center">
                Salidas
              </Typography>

              <Typography variant="caption" display="block" gutterBottom>
                Nombre:
              </Typography>
              <TextField
                id="name"
                name="name"
                type="text"
                required
                value={newOutput.name}
                onChange={handleInputChangeOutput}
                size="small"
                margin="dense"
                fullWidth
              />

              <Typography variant="caption" display="block" gutterBottom>
                Descripcion:
              </Typography>
              <TextField
                id="description"
                name="description"
                type="text"
                required
                value={newOutput.description}
                onChange={handleInputChangeOutput}
                size="small"
                margin="dense"
                fullWidth
              />

              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                sx={{ ml: 'auto', mt: 1 }}
                disabled={!(newOutput.name && newOutput.description)}
                onClick={saveNewOutput}
              >
                Agregar
              </Button>

              <Typography variant="caption" fontWeight={600} color={grey[400]} align="left">
                Salidas agregadas manualmente
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 2 }}>
                {newOutputsArray.map((value, index) => (
                  <Chip
                    key={index}
                    label={value.name}
                    sx={{ fontWeight: 600 }}
                    onDelete={() => {
                      onDeleteOutput(value.id);
                    }}
                  />
                ))}
              </Box>

              <Typography variant="caption" display="block" gutterBottom>
                Salidas existentes:
              </Typography>

              <FormControl>
                <Select
                  multiple
                  value={process.existingOutputs.map(entry => entry.id)}
                  onChange={handleChangeOutput}
                  renderValue={selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map(id => {
                        let entry = process.existingOutputs.find(entry => entry.id === id);
                        return <Chip key={id} label={entry.name} />;
                      })}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {allOutputs.map(e => (
                    <MenuItem key={e.id} value={e.id} style={getStyles(e.id, process.existingOutputs)}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                p: 2,
                bgcolor: 'white',
              }}
            >
              <Typography fontWeight={600} align="center">
                Herramientas
              </Typography>

              <Typography variant="caption" display="block" gutterBottom>
                Nombre:
              </Typography>
              <TextField
                id="name"
                name="name"
                type="text"
                required
                value={newTool.name}
                onChange={handleInputChangeTool}
                size="small"
                margin="dense"
                fullWidth
              />

              <Typography variant="caption" display="block" gutterBottom>
                Descripcion:
              </Typography>
              <TextField
                id="description"
                name="description"
                type="text"
                required
                value={newTool.description}
                onChange={handleInputChangeTool}
                size="small"
                margin="dense"
              />

              <Button
                variant="outlined"
                size="small"
                startIcon={<Add />}
                sx={{ ml: 'auto', mt: 1 }}
                disabled={!(newTool.name && newTool.description)}
                onClick={saveNewTool}
              >
                Agregar
              </Button>

              <Typography variant="caption" fontWeight={600} color={grey[400]} align="left">
                Herramientas agregadas manualmente
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 2 }}>
                {newToolsArray.map((value, index) => (
                  <Chip
                    key={index}
                    label={value.name}
                    sx={{ fontWeight: 600 }}
                    onDelete={() => {
                      onDeleteTool(value.id);
                    }}
                  />
                ))}
              </Box>

              <Typography variant="caption" display="block" gutterBottom>
                Herramientas existentes:
              </Typography>

              <FormControl>
                <Select
                  multiple
                  value={process.existingTools.map(entry => entry.id)}
                  onChange={handleChangeTool}
                  renderValue={selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map(id => {
                        let entry = process.existingTools.find(entry => entry.id === id);
                        return <Chip key={id} label={entry.name} />;
                      })}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {allTools.map(e => (
                    <MenuItem key={e.id} value={e.id} style={getStyles(e.id, process.existingTools)}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="error" variant="contained" onClick={deleteProcess}>
          Eliminar
        </Button>
        <Button variant="contained" onClick={closeDialog}>
          Cancelar
        </Button>
        <Button color="success" variant="contained" onClick={updateProcess} disabled={process.name === '' ? true : false}>
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProcessDialog;
