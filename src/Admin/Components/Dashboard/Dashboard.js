import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../Components/Context/AuthContext';
import Header from '../../../Admin/Components/Header/Header';
import '../../../Styles/AdminDashboard.css';
import Sidebar from '../../../Admin/Components/Sidebar/Sidebar';
import { db } from '../../../Components/Firebase/FirebaseConfig'; // Adjust the import path according to your project structure

const Dashboard = () => {
  const { user } = useAuth();
  const [userCount, setUserCount] = useState("");

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const userCounterDoc = await db.collection('counters').doc('userCounter').get();
        if (userCounterDoc.exists) {
          setUserCount(userCounterDoc.data().current);
        } else {
          console.error("userCounter document not found.");
        }
      } catch (error) {
        console.error("Error fetching user count: ", error);
      }
    };

    fetchUserCount();
  }, []);

  // console.log("User data:", user);

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="dashboard-container">
        <div className="main-content">
          <h1 className='admindashboard-heading'>Admin</h1>
          <h2 className='admin-welcome'>Dashboard</h2>
          <div className='dashboard-card card'>
            <p className='total-users'>Total Users: {userCount}</p> {/* Display user count here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
