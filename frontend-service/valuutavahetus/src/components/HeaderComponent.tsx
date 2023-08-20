import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentToken, logOut } from 'src/features/auth/authSlice';

const HeaderComponent: React.FC = () => {
  const dispatch = useDispatch();
  const currentToken = useSelector(selectCurrentToken);
  const isLoggedIn = !!currentToken;

  const handleLogout = () => {
    dispatch(logOut(null));
  };
  return (
    <AppBar position="sticky" style={{ top: 0, zIndex: 100 }}>
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6">Valuutavahetus</Typography>
          </Grid>
          <Grid item>
            {isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/register">
                  Lisa kasutajaid
                </Button>
                <Button color="inherit" component={Link} to="/admin">
                  Halda valuutasid
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logi välja
                </Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Logi sisse
              </Button>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderComponent;
