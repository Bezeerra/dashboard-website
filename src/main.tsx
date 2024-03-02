import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home/Home.tsx";
import {AuthProvider} from "./contexts/Auth/AuthProvider.tsx";
import {RequireAuth} from "./contexts/Auth/RequireAuth.tsx";
import FormCreateAccount from "./components/Login/CreateAccount.tsx";
import Login from "./components/Login/Login.tsx";
import MyAccount from "./components/MyAccount/MyAccount.tsx";
import Annotations from "./components/Annotations/Annotations.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AuthProvider>
          <BrowserRouter>
              <App>
                  <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/annotations" element={<RequireAuth><Annotations/></RequireAuth>}/>
                        <Route path="/create-account" element={<FormCreateAccount/>} />
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/my-account" element={<RequireAuth><MyAccount/></RequireAuth>}/>
                  </Routes>
              </App>
          </BrowserRouter>
      </AuthProvider>
  </React.StrictMode>,
)
