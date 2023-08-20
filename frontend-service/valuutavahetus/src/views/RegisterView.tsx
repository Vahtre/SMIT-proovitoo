import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Grid } from '@mui/material';
import { VscAccount, VscLock } from 'react-icons/vsc';
import { useAddUserMutation } from 'src/requests/adminSlice';
import HeaderComponent from 'src/components/HeaderComponent';

const styles = {
  icon: {
    height: '24px',
    width: '24px',
    paddingRight: '10px',
  },
};

const RegisterView: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [inputErrors, setInputErrors] = useState('');
  const [addUser, { isError: addUserError, isSuccess }] = useAddUserMutation();

  const handleUsernameChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordMatchError.length > 0) setPasswordMatchError('');
    if (inputErrors.length > 0) setInputErrors('');
    setUsername(_e.target.value);
  };

  const handlePasswordChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordMatchError.length > 0) setPasswordMatchError('');
    if (inputErrors.length > 0) setInputErrors('');
    setPassword(_e.target.value);
  };

  const handleRegister = async () => {
    if (!username) {
      setInputErrors('Kasutajanimi on kohustuslik väli');
      return;
    }
    if (!password) {
      setInputErrors('Parool on kohustuslik väli');
      return;
    }
    if (passwordMatchError.length > 0) setPasswordMatchError('');
    if (password !== confirmPassword) {
      setPasswordMatchError('Paroolid ei kattu');
      return;
    } else {
      setPasswordMatchError('');

      try {
        await addUser({ username, password });
      } catch (error) {
        // Handle error here
        console.error(error);
      }
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <>
      <HeaderComponent />
      <Container maxWidth="xs" style={{ paddingTop: '20px' }}>
        <Paper elevation={5} style={{ padding: '20px' }}>
          <h2>Lisa kasutaja</h2>
          <TextField
            fullWidth
            label="Kasutajanimi"
            variant="outlined"
            margin="normal"
            placeholder="Kasutajanimi"
            value={username}
            onChange={handleUsernameChange}
            InputProps={{
              startAdornment: <VscAccount style={styles.icon} />,
            }}
          />
          <TextField
            fullWidth
            label="Parool"
            type="password"
            variant="outlined"
            margin="normal"
            placeholder="Parool"
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              startAdornment: <VscLock style={styles.icon} />,
            }}
          />
          <TextField
            fullWidth
            label="Kinnita parool"
            type="password"
            variant="outlined"
            margin="normal"
            placeholder="Kinnita parool"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={!!passwordMatchError}
            helperText={passwordMatchError}
            InputProps={{
              startAdornment: <VscLock style={styles.icon} />,
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '20px', height: '36px', maxWidth: '76px' }}
            onClick={handleRegister}
          >
            Lisa
          </Button>

          {addUserError && (
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '16px',
              }}
            >
              <h1 style={{ color: 'red' }}>Viga kasutaja lisamisel</h1>
            </Grid>
          )}
          {inputErrors && (
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '16px',
              }}
            >
              <h1 style={{ color: 'red' }}>{inputErrors}</h1>
            </Grid>
          )}
          {isSuccess && (
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '16px',
              }}
            >
              <h1 style={{ color: 'green' }}>Kasutaja edukalt lisatud</h1>
            </Grid>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default RegisterView;
