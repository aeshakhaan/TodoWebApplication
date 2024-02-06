import React from 'react'
import { Box, Card, CardContent, Typography, Button, Input, InputLabel, List } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

var taskId=1

const Home=()=>{
    const [email, setEmail]=useState('')
    const [currentTaskId, setCurrentTaskId]=useState('0')
    const [title, setTitle]=useState('')
    const [description, setDescription]=useState('')
    const [todos, setTodos]=useState([]);
    const [taskMode, setTaskMode]=useState('add')
    const [isDone, setIsDone]=useState(false)
    const navigate=useNavigate()

    useEffect(()=>{
        const userEmail=localStorage.getItem('userEmail')
        if(!userEmail){
            navigate('/login')
        }else{
            setEmail(userEmail)
        }
        loadDisplayAPI()
    }, [{title}, {description}])

    const loadDisplayAPI=async()=>{
        const result=await axios.post("http://localhost:4000/display",{user_id:localStorage.getItem('userEmail')})
        setTodos(result.data);
    }

    const logout=()=>{
        localStorage.removeItem('userEmail')
        navigate('/login')
    }
    
    const handleTitle=(event)=>{
        setTitle(event.target.value)
    }

    const handleDescription=(event)=>{
        setDescription(event.target.value)
    }

    const submitToDo=async()=>{
        const Todo=await axios.post('http://localhost:4000/newtodo',{taskId:todos.length+1, user_id:localStorage.getItem('userEmail'), title:title, description:description, isDone:isDone})
        if(Todo.data.flag===1){
            alert("Please enter a title and description for the todo")
        }else if(Todo.data.flag===2){
            alert("Please enter a description for the todo")
        }else if(Todo.data.flag===3){
            alert("Please enter a title for the todo")
        }else if(Todo.data.flag===4){
            alert("Todo successfully added to do list!")
        }else{
            alert("Some error occured!:/")
        }
    }

    function editTask(id){
        const edit=async()=>{
           const todo=await axios.put(`http://localhost:4000/idTodo/${id}`)
           setTaskMode(todo.data.mode)
           taskId=todo.data.id
           setCurrentTaskId(todo.data.id)
           setTitle(todo.data.title)
           setDescription(todo.data.description)
        }

        return()=>{
            edit()
        }
    }

    const editTodo=async()=>{
        const currentTodo=await axios.put(`http://localhost:4000/edit/${currentTaskId}`, {taskId:currentTaskId, title:title, description:description})
        if(currentTodo.data.completed=='true'){
            alert("Todo successfully edited!")
            setTaskMode('add')
            setTitle('')
            setDescription('')
        }else{
            console.log('edit failed')
        }
    }

    function markTask(taskId){
        const markAsCompleted=async()=>{
           await axios.put(`http://localhost:4000/completed/${taskId}`, {isDone:true})
        }
        return()=>{
            markAsCompleted()
        }
    }
    
    function deleteTask(id){
        const deleteTodo=async()=>{
            const todo=await axios.delete(`http://localhost:4000/delete/${id}`, {deleted:true})
            if(todo.data.deleted=='true'){
                taskId=todos.length
            }else{

            }
        }
        return()=>{
            deleteTodo()
        }
    }

    return(
        <>
       <div id="container" style={{
        background: 'linear-gradient(135deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>

          <Box sx={{ position:'fixed', top:0, left:0, width:'100vw', height:'10vh', backgroundColor:'indigo', display:'flex', alignItems:'center', justifyContent:'start'}}>
    <Button onClick={logout} variant='contained' sx={{backgroundColor:'ButtonFace', color:'black', marginRight:'30px'}}>Logout</Button>
</Box>

<Box sx={{display:'flex', justifyContent:'center', backgroundColor:'ButtonFace', alignItems:'center', minHeight:'10vh', marginTop:'-15vh',marginBottom:'-15vh'}}>
    <Card sx={{width:'95vw', height:'75vh', backgroundColor:'contained', border:'3px solid ButtonShadow'}}>
        <CardContent sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <Box sx={{display:'flex', justifyContent:'center', marginTop:'10vh'}}>
                <Typography variant='h2' sx={{display:'flex', justifyContent:'center'}}>Welcome Home</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent:'center'}}>
                <Typography variant='h3' component='div' sx={{display:'flex', justifyContent:'center'}}>{email}</Typography>
            </Box><br></br>
            <Typography variant='h2' sx={{display:'flex', justifyContent:'center'}}>To-Do List</Typography>
            {taskMode=='add'?
                <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', width:'80vw', marginTop:'5vh'}}>
                    <Input onChange={handleTitle} id='todo_title' type='text' placeholder=' Enter the to do title here:' sx={{height:'5vh', marginBottom:'1vh', border:'1px solid lightgrey', borderRadius:'8px', paddingLeft:'10px'}}/>
                    <Input onChange={handleDescription} id='todo_task' type='text' placeholder=' Enter the to do here:' sx={{height:'5vh', marginBottom:'2vh', border:'1px solid lightgrey', borderRadius:'8px', paddingLeft:'10px'}}/>
                </Box>
            :
                <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', width:'80vw', marginTop:'5vh'}}>
                    <Input onChange={handleTitle} id='todo_title' value={title} type='text' placeholder=' Enter the to do title here:' sx={{height:'5vh', marginBottom:'1vh', border:'1px solid lightgrey', borderRadius:'8px', paddingLeft:'10px'}}/>
                    <Input onChange={handleDescription} id='todo_task' value={description} type='text' placeholder=' Enter the to do here:' sx={{height:'5vh', marginBottom:'2vh', border:'1px solid lightgrey', borderRadius:'8px', paddingLeft:'10px'}}/>
                </Box>
            }
            {taskMode=='add'?
                <Button onClick={submitToDo} sx={{border: '1px solid blue', borderRadius: '5px', width: '100px', marginBottom: '2vh', backgroundColor: '#1E90FF', color: 'white', padding: '10px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)','&:hover': { backgroundColor: '#6495ED', boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.4)',}, transition: 'all 0.3s ease'}}>Add Todo</Button>
            :
                <Button onClick={editTodo} sx={{border:'1px solid blue', borderRadius:'5px', width:'100px', marginBottom:'2vh'}}>Edit To Do</Button>
            }
        </CardContent>
    </Card>
</Box>
</div>
<div id="container" style={{
        background: 'linear-gradient(135deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
<Box sx={{
  display: 'flex',
  backgroundColor: 'ButtonFace',
  minHeight: '10vh',
  alignItems: 'center',
  justifyContent: 'center'
}}>
  <Card sx={{ width: '100%' }}>
    <CardContent>
      <List sx={{ listStyleType: 'none' }}>
        {todos.map((todo) => (
          <li key={todo.title}>
            <h2 style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
              {todo.title}
            </h2>
            <p style={{ textDecoration: todo.isDone ? 'line-through' : 'none' }}>
              {todo.description}
            </p>
            <Button
              variant="contained"
              click={editTask(todo.taskId)}
              disabled={todo.isDone}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={markTask(todo.taskId)}
              disabled={todo.isDone}
            >
              Mark as Completed
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={deleteTask(todo.taskId)}
              disabled={!todo.isDone}
            >
              Delete
            </Button>
          </li>
        ))}
      </List>
    </CardContent>
  </Card>
</Box>
</div>
          
        </>
    )
}

export default Home