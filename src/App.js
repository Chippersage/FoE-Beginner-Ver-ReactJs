import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Replace Redirect with Navigate
import { AuthProvider } from "./Components/Context/AuthContext";
import Dashboard from "./Components/Dashboard/Dashboard";
import Login from "./Components/SignIn/Login";
import SignUp from "./Components/SignUp/Signup";

import AdminDashboard from "./Admin/Components/Dashboard/Dashboard";
import AdminLogin from "./Admin/Components/Login/Login";
import Sidebar from "./Admin/Components/Sidebar/Sidebar";

import ForgotPassword from "./Components/SignIn/ForgotPassword";
// import VerifyOTP from './Components/SignIn/VerifyOTP';
import ManageUsers from "./Admin/Components/ManageUsers/ManageUsers";
import Score from "./Admin/Components/Scores/Scores";
import User from "./Admin/Components/User/User";
import LeaderBoard from "./Components/Cohort/LeaderBoard";

import Activities from "./Components/Activities/Activities";
import MeeToo8 from "./Components/Mee too/MeeToo8";
import MeeTooActivity8 from "./Components/Mee too/MeeTooActivity8";
import TalkMeeNow6 from "./Components/TalkMeNow6/TalkMeeNow6";
import TalkMeNowActivity6 from "./Components/TalkMeNow6/TalkMeNowActivity6";
import TalkMeNowActivity5 from "./Components/TellMeNow5/TalkMeNowActivity5";
import TellMeNow5 from "./Components/TellMeNow5/TellMeNow5";
import TheBoat7 from "./Components/TheBoat7/TheBoat7";
import TheBoatActivity7 from "./Components/TheBoat7/TheBoatActivity7";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>

<AuthProvider>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/user" element={<User />} />
        <Route path="/manageUsers" element={<ManageUsers />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/scores" element={<Score />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />


        <Route path="/TellMeNow5" element={<TellMeNow5 />} />
        <Route path="/TalkMeNowActivity5" element={<TalkMeNowActivity5 />} />
        <Route path="/TalkMeeNow6" element={<TalkMeeNow6 />} />
        <Route path="/TalkMeNowActivity6" element={<TalkMeNowActivity6 />} />
        <Route path="/TheBoat7" element={<TheBoat7 />} />
        <Route path="/TheBoatActivity7" element={<TheBoatActivity7 />} />
        <Route path="/MeeToo8" element={<MeeToo8 />} />
        <Route path="/MeeTooActivity8" element={<MeeTooActivity8/>}/>

        <Route path="/Activities" element={<Activities />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;