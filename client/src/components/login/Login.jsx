import React, { useState, useEffect } from 'react';
import { Box, TextField, Stack, Button, Typography, Card, Alert, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      navigate('/home');
    }
  }, []);

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const send = async () => {
    try {
      const result = await axios.post('http://localhost:4000/login', {
        email: email,
        password: password,
      });
      if (result.data.status === false) {
        setErr('Invalid user.');
      } else {
        localStorage.setItem('userEmail', result.data.email);
        navigate('/home');
      }
    } catch (error) {
      setErr('An error occurred. Please try again.');
    }
  };

  return (
    <>
    <div id="container" style={{
        background: 'linear-gradient(135deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '10vh',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        '& .MuiStack-root': {
          backgroundColor: 'transparent',
        },
    
      }}
    >
      <Card sx={{ padding: '20px', width: '100%', maxWidth: '400px',  backgroundColor: 'rgba(255, 255, 255, 0.5)', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'  }}>
        <Typography variant='h3' sx={{ marginBottom: '30px', color: theme.palette.primary.main }}>
          Login
        </Typography>
        <Stack width={'100%'} spacing={2}>
          <TextField
            id='email'
            label='Email'
            type='text'
            onChange={handleEmail}
            fullWidth
            sx={{ '& .MuiInputBase-input': { color: theme.palette.text.primary } }}
          />
          <TextField
            id='password'
            label='Password'
            type='password'
            onChange={handlePassword}
            fullWidth
            sx={{ '& .MuiInputBase-input': { color: theme.palette.text.primary } }}
          />
          <Button onClick={send} variant='contained' fullWidth sx={{ backgroundColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.primary.dark } }}>
            Login
          </Button>
          {err && <Alert severity='error'>{err}</Alert>}
        </Stack>
      </Card>
    </Box>
    </div>
    </>
  );
};

export default Login;