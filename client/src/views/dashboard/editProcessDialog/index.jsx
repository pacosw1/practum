import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
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
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { client } from "../../../config/environment";

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
    fontWeight: existent.find((item) => item.id === id) ? 600 : 500,
  };
}

const InitialProcess = {
  name: "",
  areaId: "",
  groupId: "",
  newEntries: [],
  existingEntries: [],
  newOutputs: [],
  existingOutputs: [],
  newTools: [],
  existingTools: [],
};

const InitialName = {
  name: "",
  description: "",
};

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProcess({
      ...process,
      [name]: value,
    });
  };

  const handleChangeEntry = (event) => {
    const aux = event.target.value;

    let results = aux.map((item) => {
      return allEntries[item - 1];
    });

    let newProcess = { ...process, existingEntries: [...results] };

    console.log(process.existingEntries);
    console.log("aux", aux);
    setProcess(newProcess);
  };

  const handleChangeOutput = (event) => {
    const aux = event.target.value;
    setProcess({ ...process, existingOutputs: aux });
  };

  const handleChangeTool = (event) => {
    const aux = event.target.value;
    setProcess({ ...process, existingTools: aux });
  };

  const handleInputChangeEntry = (e) => {
    const { name, value } = e.target;

    setNewEntry({
      ...newEntry,
      [name]: value,
    });
  };

  const handleInputChangeOutput = (e) => {
    const { name, value } = e.target;

    setNewOutput({
      ...newOutput,
      [name]: value,
    });
  };

  const handleInputChangeTool = (e) => {
    const { name, value } = e.target;

    setNewTool({
      ...newTool,
      [name]: value,
    });
  };

  const saveNewEntry = () => {
    setNewEntriesArray([...newEntriesArray, newEntry]);
    setNewEntry(InitialName);
  };

  const saveNewOutput = () => {
    setNewOutputsArray([...newOutputsArray, newOutput]);
    setNewOutput(InitialName);
  };

  const saveNewTool = () => {
    setNewToolsArray([...newToolsArray, newTool]);
    setNewTool(InitialName);
  };

  const closeDialog = () => {
    setVisible(false);
    refetch();
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
  };

  const updateProcess = async () => {
    let auxProcess = process;
    auxProcess.existingEntries = process.existingEntries.map((ent) => {
      return ent.id;
    });

    auxProcess.existingOutputs = process.existingOutputs.map((ent) => {
      return ent.id;
    });

    auxProcess.existingTools = process.existingTools.map((ent) => {
      return ent.id;
    });

    auxProcess.newEntries = newEntriesArray;
    auxProcess.newOutputs = newOutputsArray;
    auxProcess.newTools = newToolsArray;

    try {
      await client.put(`process/${actualProcess.id}`, auxProcess);
      refetch();
      closeDialog();
    } catch (error) {
      console.log("🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error", error);
    }
  };

  const loadEntries = async () => {
    try {
      await client.get("entries").then((res) => {
        let e = res?.data?.data;
        setAllEntries(e);
      });
    } catch (error) {
      console.log("🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error", error);
    }
  };

  const loadOutputs = async () => {
    try {
      await client.get("outputs").then((res) => {
        let e = res?.data?.data;
        setAllOutputs(e);
      });
    } catch (error) {
      console.log("🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error", error);
    }
  };

  const loadTools = async () => {
    try {
      await client.get("tools").then((res) => {
        let e = res?.data?.data;
        setAllTools(e);
      });
    } catch (error) {
      console.log("🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error", error);
    }
  };

  const loadProcess = async () => {
    try {
      await client.get(`process/${actualProcess?.id}`).then((res) => {
        let p = res?.data?.data;

        p.entries = p.entries.map((entry) => {
          return {
            id: entry.entry.id,
            name: entry.entry.name,
            description: entry.entry.description,
          };
        });

        p.outputs = p.outputs.map((output) => {
          return {
            id: output.output.id,
            name: output.output.name,
            description: output.output.description,
          };
        });

        p.tools = p.tools.map((tool) => {
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
      console.log("🚀 ~ file: index.jsx ~ line 45 ~ onFinish ~ error", error);
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

  useEffect(() => {
    // console.log("en", allEntries);
    // console.log("ex", process.existingEntries);
  }, [process]);

  return (
    <Dialog
      open={visible}
      onClose={closeDialog}
      maxWidth="xl"
      PaperProps={{
        style: {
          backgroundColor: "#F5F5F5",
        },
      }}
    >
      <DialogTitle>Editar Proceso</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 1,
                p: 2,
                bgcolor: "white",
              }}
            >
              <Typography variant="caption" display="block" gutterBottom>
                Nombre de Proceso:
              </Typography>
              <TextField id="name" name="name" type="text" required value={process.name} onChange={handleInputChange} size="small" margin="dense" fullWidth />
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                p: 2,
                bgcolor: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={600}>Entradas</Typography>
                <IconButton disabled={!(newEntry.name && newEntry.description)} onClick={saveNewEntry}>
                  <Add />
                </IconButton>
              </Box>

              <Typography variant="caption" display="block" gutterBottom>
                Nombre:
              </Typography>
              <TextField id="name" name="name" type="text" required value={newEntry.name} onChange={handleInputChangeEntry} size="small" margin="dense" fullWidth />

              <Typography variant="caption" display="block" gutterBottom>
                Descripcion:
              </Typography>
              <TextField id="description" name="description" type="text" required value={newEntry.description} onChange={handleInputChangeEntry} size="small" margin="dense" fullWidth />

              <Typography variant="caption" fontWeight={600} color={grey[400]} align="right">
                Entradas agregadas manualmente
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, p: 2 }}>
                {newEntriesArray.map((value, index) => (
                  <Chip key={index} label={value.name} sx={{ fontWeight: 600 }} />
                ))}
              </Box>

              <Typography variant="caption" display="block" gutterBottom>
                Entradas existentes:
              </Typography>
              <FormControl>
                <Select
                  multiple
                  value={process.existingEntries.map((entry) => entry.id)}
                  onChange={handleChangeEntry}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((id) => {
                        let entry = process.existingEntries.find((entry) => entry.id === id);
                        return <Chip key={id} label={entry.name} />;
                      })}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {allEntries.map((e) => (
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
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                p: 2,
                bgcolor: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={600}>Salidas</Typography>
                <IconButton disabled={!(newOutput.name && newOutput.description)} onClick={saveNewOutput}>
                  <Add />
                </IconButton>
              </Box>

              <Typography variant="caption" display="block" gutterBottom>
                Nombre:
              </Typography>
              <TextField id="name" name="name" type="text" required value={newOutput.name} onChange={handleInputChangeOutput} size="small" margin="dense" fullWidth />

              <Typography variant="caption" display="block" gutterBottom>
                Descripcion:
              </Typography>
              <TextField id="description" name="description" type="text" required value={newOutput.description} onChange={handleInputChangeOutput} size="small" margin="dense" fullWidth />

              <Typography variant="caption" fontWeight={600} color={grey[400]} align="right">
                Salidas agregadas manualmente
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, p: 2 }}>
                {newOutputsArray.map((value, index) => (
                  <Chip key={index} label={value.name} sx={{ fontWeight: 600 }} />
                ))}
              </Box>

              <Typography variant="caption" display="block" gutterBottom>
                Salidas existentes:
              </Typography>

              <FormControl>
                <Select
                  multiple
                  value={process.existingOutputs}
                  onChange={handleChangeOutput}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value.id} label={value.name} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {allOutputs.map((e) => (
                    <MenuItem key={e.id} value={e} style={getStyles(e.id, process.existingOutputs)}>
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
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                p: 2,
                bgcolor: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={600}>Herramientas</Typography>
                <IconButton disabled={!(newTool.name && newTool.description)} onClick={saveNewTool}>
                  <Add />
                </IconButton>
              </Box>

              <Typography variant="caption" display="block" gutterBottom>
                Nombre:
              </Typography>
              <TextField id="name" name="name" type="text" required value={newTool.name} onChange={handleInputChangeTool} size="small" margin="dense" fullWidth />

              <Typography variant="caption" display="block" gutterBottom>
                Descripcion:
              </Typography>
              <TextField id="description" name="description" type="text" required value={newTool.description} onChange={handleInputChangeTool} size="small" margin="dense" />

              <Typography variant="caption" fontWeight={600} color={grey[400]} align="right">
                Herramientas agregadas manualmente
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, p: 2 }}>
                {newToolsArray.map((value, index) => (
                  <Chip key={index} label={value.name} sx={{ fontWeight: 600 }} />
                ))}
              </Box>

              <Typography variant="caption" display="block" gutterBottom>
                Herramientas existentes:
              </Typography>
              <FormControl>
                <Select
                  multiple
                  value={process.existingTools}
                  onChange={handleChangeTool}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value.id} label={value.name} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {allTools.map((e) => (
                    <MenuItem key={e.id} value={e} style={getStyles(e.id, process.existingTools)}>
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
        <Button color="error" variant="contained" onClick={closeDialog}>
          Cancelar
        </Button>
        <Button color="success" variant="contained" onClick={updateProcess} disabled={process.name === "" ? true : false}>
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProcessDialog;
