import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../Components/Firebase/FirebaseConfig';
import Sidebar from '../../../Admin/Components/Sidebar/Sidebar';
import Header from '../../../Admin/Components/Header/Header';
import { useAuth } from '../../../Components/Context/AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDocs, query, collection, where, orderBy, limit } from 'firebase/firestore';
import './ManageUsers.css';

const ManageUsers = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [newStdId, setNewStdId] = useState('');

  useEffect(() => {
    const fetchLatestStdId = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, 'users'), orderBy('std', 'desc'), limit(1))
        );

        if (!querySnapshot.empty) {
          const latestUser = querySnapshot.docs[0].data();
          
          // Extract the numeric part of the ID and increment it
          const latestStdId = latestUser.std;
          const latestIdNumber = parseInt(latestStdId.replace('std', ''));

          if (!isNaN(latestIdNumber)) {
            setNewStdId(`std${latestIdNumber + 1}`);
          } else {
            setError("Invalid std ID format.");
            setNewStdId('std1');
          }
        } else {
          // No users in the collection, start with std1
          setNewStdId('std1');
        }
      } catch (err) {
        console.error("Error fetching latest std ID: ", err.message);
        setError('Error fetching latest std ID: ' + err.message);
      }
    };

    fetchLatestStdId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Check if the email already exists
      const usersQuery = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        setError('This email is already registered.');
        return;
      }

      // If email does not exist, proceed with registration
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        std: newStdId,
        name,
        email,
        mobile,
        password, // Storing password in Firestore is not recommended. Use hashing.
        createdAt: new Date(), // This will be stored as a Firestore timestamp
      });

      // Clear the form
      setName('');
      setEmail('');
      setPassword('');
      setMobile('');
      setError('');
      alert('Registered successfully!');
    } catch (err) {
      console.error("Error during registration: ", err.message);
      setError('Error during registration: ' + err.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="manage-users-container">
        <Sidebar />
        <div className="manage-users-form-container">
          <h2 className='manage-users-heading'>Registration</h2>
          <div className="manage-users-form-card">
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="manage-users-form-group">
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="manage-users-form-group">
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="manage-users-form-group">
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="manage-users-form-group">
                <label>Mobile:</label>
                <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button className="manage-users-register-button" type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
