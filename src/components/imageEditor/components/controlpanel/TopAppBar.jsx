import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'

const TopAppBar = ({ undo, redo, handleSaveAsJPG, historyStep, historyLength }) => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={undo}
              disabled={historyStep <= 0}
            >
              Undo
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={redo}
              disabled={historyStep >= historyLength - 1}
            >
              Redo
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="textSecondary">
              History: {historyStep + 1}/{historyLength}
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="success" onClick={handleSaveAsJPG}>
              Save as JPG
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
