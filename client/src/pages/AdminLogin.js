import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {

    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const redirect=useNavigate()

    const login =async()=>{
        try{
            const res = await fetch('https://dhanamschool.com/api/authentication/login',{
                method:'POST',
                headers:{'Content-type':'application/json', "Access-Control-Allow-Origin": "*"},
                body:JSON.stringify({username,password}),
                credentials:'include',
            })
            if(res.ok){
                redirect('/admin')
            }else{
                alert("Enter correct username and password")
            }
        }catch(err){
            console.log(err)
        }
        console.log(document.cookie)
        
    }

  return (
    <div>
        
<div class="bg-sky-100 flex justify-center items-center h-screen">
    
<div class="w-1/2 h-screen hidden lg:block">
  <img src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" alt="Placeholder Image" class="object-cover w-full h-full"/>
</div>

<div class= "lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
  <h1 class="text-2xl font-semibold mb-4">Login</h1>
  <div >
    
    <div class="mb-4 bg-sky-100">
      <label for="username" class="block text-gray-600">Username</label>
      <input type="text" id="username" name="username" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" onChange={(e)=>setUsername(e.target.value)} autocomplete="off"/>
    </div>
    <div class="mb-4">
      <label for="password" class="block text-gray-800">Password</label>
      <input type="password" id="password" name="password" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" onChange={(e)=>setPassword(e.target.value)} autocomplete="off"/>
    </div>
    <div class="mb-4 flex items-center">
      <input type="checkbox" id="remember" name="remember" class="text-red-500"/>
      <label for="remember" class="text-green-900 ml-2">Remember Me</label>
    </div>
    {/* <div class="mb-6 text-blue-500">
      <a href="#" class="hover:underline">Forgot Password?</a>
    </div> */}
    <button class="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full" onClick={()=>login()}>Login</button>
  </div>
  {/* <div class="mt-6 text-green-500 text-center">
    <a href="#" class="hover:underline">Sign up Here</a>
  </div> */}
</div>
</div>
    </div>
  )
}

export default AdminLogin