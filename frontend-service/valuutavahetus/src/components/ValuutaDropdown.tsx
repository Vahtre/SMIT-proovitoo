import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { Valuuta } from 'src/requests/ValuutaRequests';

interface ValuutaDropdownProps {
  selectedCurrency: Valuuta | null;
  onChange: (currency: Valuuta | null) => void;
  currencies: Valuuta[];
}

const ValuutaDropdown: React.FC<ValuutaDropdownProps> = ({
  selectedCurrency,
  onChange,
  currencies,
}) => {
  return (
    <>
      <Autocomplete
        options={currencies}
        value={selectedCurrency}
        onChange={(_, newValue) => {
          if (newValue === null) {
            onChange(null);
          } else {
            onChange(newValue);
          }
        }}
        getOptionLabel={(option) => option.nimetus}
        renderInput={(params) => <TextField {...params} variant="outlined" />}
      />
    </>
  );
};
export default ValuutaDropdown;
