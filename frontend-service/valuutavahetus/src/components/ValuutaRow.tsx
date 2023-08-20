import React from 'react';
import { Grid, Paper, Button, TextField } from '@mui/material';
import { Valuuta } from 'src/requests/ValuutaRequests';

const styles = {
  deleteButton: {
    color: 'white',
    cursor: 'poiner',
    backgroundColor: 'red',
    fontWeight: 600,
  },
  textfieldClass: {
    '& .MuiInput-input': {
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
      },
    },
  },
};

interface ValuutaRowProps {
  currency: Valuuta;
  onNimetusChange: (value: string) => void;
  onKurssChange: (value: number) => void;
  onDeleteClick: () => void;
}

const ValuutaRow: React.FC<ValuutaRowProps> = ({
  currency,
  onNimetusChange,
  onKurssChange,
  onDeleteClick,
}) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper style={{ padding: '16px' }}>
        <TextField
          label="Nimetus"
          value={currency.nimetus}
          onChange={(e) => onNimetusChange(e.target.value)}
          fullWidth
          variant="outlined"
          margin="dense"
        />
        <TextField
          sx={{
            //for not showing scroll elements
            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
              { display: 'none' },
            '& input[type=number]': { MozAppearance: 'textfield' },
          }}
          label="Kurss"
          value={currency.kurss}
          type="number"
          onChange={(e) => onKurssChange(parseFloat(e.target.value))}
          fullWidth
          variant="outlined"
          margin="dense"
        />

        <Button
          variant="contained"
          style={styles.deleteButton}
          onClick={onDeleteClick}
        >
          Eemalda
        </Button>
      </Paper>
    </Grid>
  );
};

export default ValuutaRow;
