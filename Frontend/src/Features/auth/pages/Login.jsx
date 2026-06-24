import React, { useState } from 'react'
import '../auth.style.scss';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/auth.hooks';
export default function Login() {
    
    const{loading, handleLogin} = useAuth()
    const[password, setPassword] = useState("");
    const[email, setEmail] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) =>{
        e.preventDefault();

   const res =  await  handleLogin({
        email,
        password
    });

    navigate("/")
     
    }

    if(loading){
        return (<main><h1>Getting things ready for you...</h1></main>)
    }

  return (
    <main>
        <div className='form-container'>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div className='input-group'>
                    <label htmlFor='email'>Email</label>
                    <input
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                     type='email' id='email' name='email' placeholder='Enter your email' required />
                </div>
            
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                     type="password" name="password" id="password" placeholder='Enter your Password'/>
                </div> 
                <button className='button primary-button'>Login</button>
            </form>      
            <p>Don't have an account ? <Link to={'/register'}>Register</Link></p> 

        </div>
    </main>
  )
}

