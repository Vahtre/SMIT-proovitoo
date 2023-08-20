import React from 'react';
import { Typography, Paper, Grid } from '@mui/material';

interface SubHeaderComponentProps {
  currentView: string;
}

const SubHeaderComponent: React.FC<SubHeaderComponentProps> = ({
  currentView,
}) => {
  return (
    <Paper
      elevation={3}
      style={{ padding: '10px', position: 'sticky', top: 56, zIndex: 99 }}
    >
      <Grid container justifyContent="center">
        <Typography variant="h5">{currentView}</Typography>
      </Grid>
    </Paper>
  );
};

export default SubHeaderComponent;
