import React, { createContext, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom';
import home from '../assets/images/homeicon.png'
import achievement from '../assets/images/achievementicon.png'
import career from '../assets/images/careericon.png'
import contact from '../assets/images/contacticon.png'
import logout from '../assets/images/logouticon.png'
import gallery from '../assets/images/galleryicon.png'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext(null);
const Layout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user,setUser] = useState('')
    const redirect = useNavigate()
    const checkAdmin=async()=>{
        try{
            const res=await fetch('https://dhanamschool.com/api/authentication/',{
                method:'GET',
                credentials:'include',
                headers:{'Content-type':'application/json', "Access-Control-Allow-Origin": "*"}
            })
            if (res.status === 400) {
                redirect('/admin/login');
              } else if (res.ok) {
                setUser(await res.json())
                setIsAuthenticated(true);
              }
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        checkAdmin()
    },[])
    
    const menuArr = [
        {
            name:"Home",
            icon:home,
            link:"",
        },
        {
            name:"Achievement",
            icon:achievement,
            link:"achievements",
        },
        {
            name:"Gallery",
            icon:gallery,
            link:"gallery",
        },
        {
            name:"Career",
            icon:career,
            link:"career",
        },
        {
            name:"Contact",
            icon:contact,
            link:"contact",
        },
    ]
    const [menu,setMenu] = useState(0)

    const logoutFun =async() =>{
        try{
        const res = await fetch('https://dhanamschool.com/api/authentication/logout/',{
            method:'POST',
          credentials:'include',
          headers:{'Content-type':'application/json', 'Access-Control-Allow-Origin': '*',}
      })
      if(res.status==200){
          redirect('/admin/login')
      }
  }catch(err){
      console.log(err)
  }
    }


  return (
<AuthContext.Provider value={isAuthenticated}>
<body class = "body bg-white  dark:bg-[#0F172A]">
    <div class = "fixed w-full z-30 flex bg-white dark:bg-[#0F172A] p-2 items-center justify-center h-16 px-10">
        <div class = "logo ml-48 dark:text-white font-bold  transform ease-in-out duration-500 flex-none h-full flex items-center justify-center">
            DHANAM PACHAIYAPPAN MATRICULATION HIGHER SECONDARY SCHOOL
        </div>
        <div class = "grow h-full flex items-center justify-center"></div>
        <div class = "flex-none h-full text-center flex items-center justify-center">
            
                <div class = "flex space-x-3 items-center px-3">
                    <div class = "flex-none flex justify-center">
                    <div class="w-8 h-8 flex ">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShta_GXR2xdnsxSzj_GTcJHcNykjVKrCBrZ9qouUl0usuJWG2Rpr_PbTDu3sA9auNUH64&usqp=CAU" alt="profile" class="shadow rounded-full object-cover" />
                    </div>
                    </div>

                    <div class = "hidden md:block text-sm md:text-md text-black dark:text-white">{user.username}</div>
                </div>
                
        </div>
    </div>
    <aside class="w-48 fixed transition transform ease-in-out duration-1000 z-50 flex h-screen bg-gray-900">


  <div onclick="openNav()" class="-right-6 transition transform ease-in-out duration-500 flex border-4 border-white dark:border-[#0F172A] bg-[#1E293B] dark:hover:bg-blue-500 hover:bg-purple-500 absolute top-2 p-3 rounded-full text-white hover:rotate-45">
   <div>DP</div>
  </div>

  <div class="mini mt-20 flex flex-col px-1 space-y-2 w-full h-[calc(100vh)]">
    {menuArr.map((m1,index)=>(
    <Link key={index} to={m1.link} class={`pr-5 text-white hover:text-purple-500 dark:hover:text-blue-500 w-full  ${index==menu?'bg-blue-800':'bg-gray-900'} p-3 rounded-lg  transform ease-in-out duration-300 flex group`} onClick={()=>setMenu(index)}>
        <img className='w-5' src={m1.icon}/>
      <div class="text-white mx-5">{m1.name}</div>
    </Link>
    ))}

<div  class={`pr-5 text-white cursor-pointer hover:text-purple-500 dark:hover:text-blue-500 w-full  bg-gray-900 p-3 rounded-lg  transform ease-in-out duration-300 flex group`} onClick={()=>logoutFun()}>
        <img className='w-5' src={logout}/>
      <div class="text-white mx-5">Logout</div>
    </div>

  </div>
</aside>



    <div className='absolute w-full mt-20 pl-48'>
    <Outlet/>
    </div>
    </body>
    </AuthContext.Provider>

    
  )
}

export default Layout