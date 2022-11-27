import { Add, Edit } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { client } from '../../config/environment';
import AddEntry from './addEntry';
import AddOutput from './addOutput';
import AddTool from './addTool';
import EditEntry from './editEntry';
import EditOutput from './editOutput';
import EditTool from './editTool';

const ListS = () => {
  const [addEntryShow, setAddEntryShow] = useState(false);
  const [editEntryShow, setEditEntryShow] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState();

  // Controls dialogs visibility
  const [addOutputShow, setAddOutputShow] = useState(false);
  const [editOutputShow, setEditOutputShow] = useState(false);
  const [outputToEdit, setOutputToEdit] = useState();

  const [addToolShow, setAddToolShow] = useState(false);

  const [editToolShow, setEditToolShow] = useState(false);
  const [toolToEdit, setToolToEdit] = useState();

  const [allEntries, setAllEntries] = useState([]);
  const [allOutputs, setAllOutputs] = useState([]);
  const [allTools, setAllTools] = useState([]);

  const [loading, setLoading] = useState(false);

  const openEntryDialog = e => {
    setEntryToEdit(e);
    setEditEntryShow(true);
  };

  const openOutputDialog = e => {
    setOutputToEdit(e);
    setEditOutputShow(true);
  };

  const openToolDialog = e => {
    setToolToEdit(e);
    setEditToolShow(true);
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
      await client.get('outputs').then(res => {
        let e = res?.data?.data;
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

  const refetch = async () => {
    setLoading(true);
    await loadEntries();
    await loadOutputs();
    await loadTools();
    setLoading(false);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await loadEntries();
      await loadOutputs();
      await loadTools();
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <Box>
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
              <Box sx={{ p: 2, display: 'flex', flexDirection: ' row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography fontWeight={600}>Entradas / Salidas</Typography>

                <IconButton
                  onClick={() => {
                    setAddEntryShow(true);
                  }}
                >
                  <Add />
                </IconButton>
              </Box>

              <List sx={{ maxHeight: '80vh', overflow: 'auto' }}>
                {allEntries.map(entry => (
                  <>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => {
                            openEntryDialog(entry);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={entry.name} />
                    </ListItem>
                    <Divider />
                  </>
                ))}
              </List>
            </Box>
          </Grid>

          <Grid item xs={12} sm={5}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
              <Box sx={{ p: 2, display: 'flex', flexDirection: ' row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography fontWeight={600}>Herramientas</Typography>

                <IconButton
                  onClick={() => {
                    setAddToolShow(true);
                  }}
                >
                  <Add />
                </IconButton>
              </Box>

              <List sx={{ maxHeight: '80vh', overflow: 'auto' }}>
                {allTools.map(tool => (
                  <>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => {
                            openToolDialog(tool);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={tool.name} />
                    </ListItem>
                    <Divider />
                  </>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Mount create and edit dialogs
            only appearing when showing state is true
        */}

      <AddEntry visible={addEntryShow} setVisible={setAddEntryShow} refetch={refetch} />

      <AddOutput visible={addOutputShow} setVisible={setAddOutputShow} refetch={refetch} />

      <AddTool visible={addToolShow} setVisible={setAddToolShow} refetch={refetch} />

      <EditEntry visible={editEntryShow} setVisible={setEditEntryShow} refetch={refetch} editing={entryToEdit} setEditing={setEntryToEdit} />

      <EditOutput visible={editOutputShow} setVisible={setEditOutputShow} refetch={refetch} editing={outputToEdit} setEditing={setOutputToEdit} />

      <EditTool visible={editToolShow} setVisible={setEditToolShow} refetch={refetch} editing={toolToEdit} setEditing={setToolToEdit} />
    </>
  );
};
export default ListS;
