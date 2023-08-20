import { Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import ValuutaRow from 'src/components/ValuutaRow';
import { Valuuta } from 'src/requests/ValuutaRequests';
import {
  useGetAllValuutasQuery,
  useLoadValuutaDataQuery,
  useUpdateValuutaMutation,
} from 'src/requests/adminSlice';
import { IoIosAddCircleOutline } from 'react-icons/io';
import HeaderComponent from 'src/components/HeaderComponent';
import SubHeaderComponent from 'src/components/SubHeaderComponent';

const styles = {
  saveButton: {
    color: 'white',
    cursor: 'pointer',
    backgroundColor: 'green',
    fontWeight: 500,
  },
  addButton: {
    color: 'white',
    cursor: 'pointer',
    backgroundColor: 'green',
    fontWeight: 500,
    marginRight: '16px',
    paddingRight: '16px',
  },
  buttonGridSx: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '16px',
  },
  laeAndmedBtn: {
    color: 'white',
    cursor: 'pointer',
    backgroundColor: 'green',
    fontWeight: 500,
    margin: '16px',
  },
  h2Style: {
    display: 'grid !important',
  },
  errorMsg: {
    color: 'red',
    fontSize: '20',
    fontWeight: 700,
    marginRight: '5px',
  },
  icon: {
    height: '24px',
    width: '24px',
    marginRight: '10px',
  },
};

const ValuutaView: React.FC = () => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    refetch: refetchCurrecies,
  } = useGetAllValuutasQuery();
  const {
    data: loadedData,
    isError: loadError,
    refetch,
  } = useLoadValuutaDataQuery();
  const [updateValuutas] = useUpdateValuutaMutation();
  const [editedCurrencies, setEditedCurrencies] = useState<Valuuta[]>(
    data || [],
  );
  const [changes, setChanges] = useState<Valuuta[]>([]);
  const [newRowIndex, setNewRowIndex] = useState(-1);
  const [duplicateErrorMessage, setDuplicateErrorMessage] =
    useState<string>('');

  useEffect(() => {
    if (isSuccess) {
      setEditedCurrencies(data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    refetchCurrecies(); // This will fetch the latest data
  }, [refetchCurrecies]);

  const handleNimetusChange = (index: number, value: string) => {
    if (duplicateErrorMessage.length > 0) setDuplicateErrorMessage('');
    const updatedCurrencies = [...editedCurrencies];
    updatedCurrencies[index] = {
      ...updatedCurrencies[index],
      nimetus: value,
    };
    setEditedCurrencies(updatedCurrencies);
  };

  const handleKurssChange = (index: number, value: number) => {
    if (duplicateErrorMessage.length > 0) setDuplicateErrorMessage('');
    const updatedCurrencies = [...editedCurrencies];
    updatedCurrencies[index] = {
      ...updatedCurrencies[index],
      kurss: value,
    };
    setEditedCurrencies(updatedCurrencies);
  };

  const handleLoadDataClick = async () => {
    if (duplicateErrorMessage.length > 0) setDuplicateErrorMessage('');
    // Trigger the query when the button is clicked
    await refetch();
    if (loadedData) {
      const newCurrencies = loadedData.map((currency: Valuuta, index) => ({
        ...currency,
        id: newRowIndex, // Set ids for new rows
      }));
      setEditedCurrencies([...editedCurrencies, ...newCurrencies]);
      setNewRowIndex((prevIndex) => prevIndex - 1);
      setChanges((prevChanges) => [...prevChanges, ...newCurrencies]);
    }
    if (loadError) {
      setDuplicateErrorMessage('Andmete laadimine Eesti Pangast ebaõnnestus');
    }
  };

  const handleDeleteClick = (index: number) => {
    if (duplicateErrorMessage.length > 0) setDuplicateErrorMessage('');
    // Add your delete logic here
    const confirmDelete = window.confirm(
      `Kas olete kindel, et soovite kustutada valuuta "${editedCurrencies[index]?.nimetus}"?`,
    );
    if (confirmDelete) {
      const updatedCurrencies = [...editedCurrencies];
      const deletedCurrency = updatedCurrencies.splice(index, 1)[0];
      setEditedCurrencies(updatedCurrencies);
      setChanges((prevChanges) => [...prevChanges, deletedCurrency]);
    }
  };

  const handleAddClick = () => {
    if (duplicateErrorMessage.length > 0) setDuplicateErrorMessage('');
    const newCurrency: Valuuta = { id: newRowIndex, nimetus: '', kurss: 0 };
    const updatedCurrencies = [...editedCurrencies, newCurrency];
    setNewRowIndex((prevIndex) => prevIndex - 1);
    setEditedCurrencies(updatedCurrencies);
    setChanges((prevChanges) => [...prevChanges, newCurrency]);
  };

  const handleSaveAllChanges = async (): Promise<void> => {
    // Checking for no duplicates and valid exchange rate
    const uniqueCurrencyNames = new Set<string>();
    let hasDuplicateNames = false;
    let noRate = false;

    editedCurrencies.forEach((currency) => {
      if (uniqueCurrencyNames.has(currency.nimetus)) {
        hasDuplicateNames = true;
        return;
      } else {
        uniqueCurrencyNames.add(currency.nimetus);
      }
      if (currency.kurss <= 0 || currency.nimetus.length <= 0) {
        noRate = true;
        return;
      }
    });

    if (hasDuplicateNames) {
      setDuplicateErrorMessage(
        ' Andmeid ei saa salvestada kuna kõik nimetused pole unikaalsed!',
      );
      return;
    }

    if (noRate) {
      setDuplicateErrorMessage(
        ' Ühel või rohkemal valuutal pole määratud kurssi või see on negatiivne',
      );
      return;
    }

    try {
      const response = await updateValuutas(editedCurrencies);

      if ('data' in response) {
        // Assuming the response contains the updated currencies
        const updatedCurrencies: Valuuta[] = response.data; // Adjust this according to your API response structure
        setEditedCurrencies(updatedCurrencies);
        // Clear the changes array as they have been successfully saved
        setChanges([]);
        refetchCurrecies();
      } else {
        // Handle error response here
        setDuplicateErrorMessage('Viga andmete pärimisel');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const hasChanges = changes.length > 0;
  return (
    <>
      <HeaderComponent />
      <SubHeaderComponent currentView={'Valuuta haldus'} />
      <Grid>
        {!isLoading && !isError && (
          <>
            <Grid container spacing={2}>
              {editedCurrencies &&
                editedCurrencies?.map((currency, index) => (
                  <ValuutaRow
                    key={index}
                    currency={currency}
                    onNimetusChange={(value) =>
                      handleNimetusChange(index, value)
                    }
                    onKurssChange={(value) => handleKurssChange(index, value)}
                    onDeleteClick={() => handleDeleteClick(index)}
                  />
                ))}
            </Grid>
            <Grid container spacing={2} sx={styles.buttonGridSx}>
              <Button style={styles.addButton} onClick={handleAddClick}>
                <IoIosAddCircleOutline style={styles.icon} />
                Lisa
              </Button>
              {hasChanges && (
                <Button
                  variant="contained"
                  style={styles.saveButton}
                  onClick={handleSaveAllChanges}
                  disabled={!hasChanges} // Disable the button if there are no unsaved changes
                >
                  Salvesta muudatused
                </Button>
              )}
            </Grid>

            <Grid container spacing={2} sx={styles.buttonGridSx}>
              <Button style={styles.laeAndmedBtn} onClick={handleLoadDataClick}>
                Lae andmed
              </Button>
            </Grid>

            {duplicateErrorMessage && (
              <Grid item xs={12} sx={styles.buttonGridSx}>
                <p style={styles.errorMsg}>Viga!</p>
                <p style={styles.errorMsg}>{duplicateErrorMessage}</p>
              </Grid>
            )}
          </>
        )}
        {isLoading && (
          <Grid item xs={12} sx={styles.buttonGridSx}>
            <h1>Laen anmeid</h1>
          </Grid>
        )}
        {isError && (
          <Grid item xs={12} sx={styles.buttonGridSx}>
            <h1>Viga andmete laadimisel</h1>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default ValuutaView;
