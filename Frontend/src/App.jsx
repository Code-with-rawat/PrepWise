import React from 'react'
import { RouterProvider } from 'react-router';
import { router } from './Routes/app.routes.jsx';
import {  AuthProvider } from './Features/auth/auth.context.jsx';
import { InterviewProvider } from './Features/interview/interview.context.jsx';
function App() {

  return (
    <>
    <AuthProvider>
    <InterviewProvider>
   <RouterProvider router={router} />
    </InterviewProvider>
    </AuthProvider>
    </>
  )
}

export default App
