import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Protected = (props) => {
  return (
    <div>
        
        props.isAuthenticated ? 
        <Outlet /> : <Navigate to="/" />
        </div>
  )
}

export default Protected