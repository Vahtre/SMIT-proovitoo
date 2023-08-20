import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from 'src/features/auth/authSlice';
import { useLoginMutation } from 'src/features/auth/authApiSlice';
import { VscAccount, VscLock } from 'react-icons/vsc';

const styles = {
  icon: {
    height: '24px',
    width: '24px',
    paddingRight: '10px',
  },
};

const LoginView: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const [login, { isError: loginError }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePwInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (_e: any) => {
    _e.preventDefault();
    try {
      const userData = await login({ username, password }).unwrap();
      dispatch(setCredentials({ ...userData, username }));
      setUsername('');
      setPassword('');
      navigate('/welcome');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="xs" style={{ paddingTop: '32px' }}>
      <Paper elevation={5} style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Logi sisse</h2>
        <TextField
          fullWidth
          label="Kasutajanimi"
          variant="outlined"
          margin="normal"
          placeholder="Kasutajanimi"
          value={username}
          onChange={handleUserInput}
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
          onChange={handlePwInput}
          InputProps={{
            startAdornment: <VscLock style={styles.icon} />,
          }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          style={{
            marginTop: '20px',
            height: '36px',
            flexDirection: 'row',
            fontWeight: 600,
            backgroundColor: 'green',
          }}
          onClick={(_e) => {
            handleLogin(_e);
          }}
        >
          Logi Sisse
        </Button>
      </Paper>
      {loginError && (
        <Typography
          variant="body1"
          color="error"
          style={{ marginTop: '20px', textAlign: 'center' }}
        >
          Sisselogimine ebaõnnestus. Palun kontrollige kasutajanime ja parooli.
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        style={{
          marginTop: '20px',
          marginBottom: '20px',
          textAlign: 'center',
          width: '100%',
        }}
        onClick={() => navigate('/')}
      >
        Pea lehele
      </Button>
    </Container>
  );
};

export default LoginView;
