import React from 'react';
import './App.css';
import Home from './pages/home/Home';
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Pricing from './pages/pricing/Pricing';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import AuthProvider from './hooks/useAuth';
import Room from './pages/room/Room';
import RouteWithNav from './utils/RouteWithNav';
import ValidateAccount from './pages/ValidateAccount';
import Account from './pages/account/Account';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AfterPaying from './pages/pricing/AfterPaying';
import PrivateRoute from './utils/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MessageWrapper from './pages/message/MessageWrapper';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<RouteWithNav/> }>
              <Route path='/' element={<Home/>}/>
              <Route path='/pricing' element={<PrivateRoute><Pricing/></PrivateRoute>}/>
              <Route path='/pricing/create-session' element={<AfterPaying/>}/>
              <Route path='/room/*' element={<PrivateRoute><Room/></PrivateRoute>}/>
              <Route path='/account/*' element={<PrivateRoute><Account/></PrivateRoute>}/>
              <Route path='/message/*' element={<PrivateRoute><MessageWrapper/></PrivateRoute>}/>
            </Route>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/validate-account' element={<ValidateAccount/>}/>
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/forgot-password/reset-password' element={<ResetPassword/>}/>
          </Routes>
        </AuthProvider>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          />
      </BrowserRouter>
    </div>
  );
}

export default App;
