import React, { useState,useEffect } from 'react';
import { Box, TextField, Stack, Button, Typography, Card, Alert } from '@mui/material'
import { useNavigate} from 'react-router-dom'
import axios from 'axios'

const Signup=()=>{
    const [username,setUsername]=useState('')
    const [email,setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [err,setErr]=useState('')
    const navigate=useNavigate()
     
    useEffect(()=>{
        const userEmail=localStorage.getItem('userEmail')
        if(userEmail){
            navigate('/home')
        }
    }, []);

    const handleUser=(event)=>{
        setUsername(event.target.value)
    }

    const handleEmail=(event)=>{
        setEmail(event.target.value)
    }
    
    const handlePassword=(event)=>{
        setPassword(event.target.value)
    }

    const send=async()=>{
        const result=await axios.post('http://localhost:4000/signup', {username:username, email:email, password:password})
        if(result.data.status===false){
            setErr('Invalid user/User already exists.')
        }else{
            localStorage.setItem('userEmail', result.data[0].email)
            navigate('/home')
        }
    }

    return (
        <div id="container" style={{
        background: 'linear-gradient(135deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Card sx={{width: "30vw"}}>
          <Box p={3}>
            <Typography variant="h5" textAlign="center" mb={3}>Signup</Typography>
            <Stack spacing={2}>
              <TextField id="username" label="Username" type="text" onChange={handleUser} fullWidth />
              <TextField id="email" label="Email" type="text" onChange={handleEmail} fullWidth />
              <TextField id="password" label="Password" type="password" onChange={handlePassword} fullWidth />
              {err && <Alert severity="error">{err}</Alert>}
              <Button onClick={send} variant="contained" fullWidth>Signup</Button>
              <Typography variant="body2" textAlign="center">Already have an account? <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigate("/login")}>Login</span></Typography>
            </Stack>
          </Box>
        </Card>
      </div>
    )
}

export default Signup;