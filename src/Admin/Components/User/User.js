import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Admin/Components/Sidebar/Sidebar'; 
import Header from '../../../Admin/Components/Header/Header';
import { useAuth } from '../../../Components/Context/AuthContext';
import { db, auth } from '../../../Components/Firebase/FirebaseConfig'; 
import { getDocs, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../../Styles/AdminUser.css'; 

const User = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const usersCollection = await getDocs(collection(db, 'users'));
        const usersData = usersCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleDelete = async (userId) => {
    const confirmation = window.confirm("Are you sure you want to delete this user?");
    if (!confirmation) {
      return; // User cancelled the deletion
    }
  
    try {
      await deleteDoc(doc(db, 'users', userId));
  
      const user = auth.currentUser;
      if (user && user.uid === userId) {
        await deleteUser(user);
      }
  
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = (userId) => {
    const userToEdit = users.find(user => user.id === userId);
    setEditingUser(userToEdit);
    setUpdatedUser({
      name: userToEdit.name,
      email: userToEdit.email,
      mobile: userToEdit.mobile,
      password: '' // Password will be updated separately
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const userDocRef = doc(db, 'users', editingUser.id);

      // Update Firestore
      await updateDoc(userDocRef, {
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile
      });

      // Update Firebase Auth email
      if (auth.currentUser.email !== updatedUser.email) {
        await updateEmail(auth.currentUser, updatedUser.email);
      }

      // Update Firebase Auth password if provided
      if (updatedUser.password) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, updatedUser.password);
      }

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === editingUser.id
            ? { ...user, name: updatedUser.name, email: updatedUser.email, mobile: updatedUser.mobile }
            : user
        )
      );

      setSuccessMsg('User updated successfully.');
      setIsEditing(false);
      setCurrentPassword('');
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMsg('Failed to update the user. Please try again.');
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="user-table-container">
        <h1 className='user-table-heading'>User Details</h1>
        
        <div className='table-main'>
          <table className='user_table_main'>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.std}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>
                    <i 
                      className="fa-solid fa-edit"
                      onClick={() => handleUpdate(user.id)}
                      style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }}
                    ></i>
                    <i 
                      className="fa-solid fa-trash-alt"
                      onClick={() => handleDelete(user.id)}
                      style={{ cursor: 'pointer', color: 'red' }}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal show={isEditing} onHide={() => setIsEditing(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={updatedUser.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={updatedUser.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formMobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile"
                  value={updatedUser.mobile}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCurrentPassword">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNewPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={updatedUser.password}
                  onChange={handleChange}
                />
              </Form.Group>
              {errorMsg && <div className="text-danger">{errorMsg}</div>}
              {successMsg && <div className="text-success">{successMsg}</div>}
              <Button variant="primary" type="submit">
                Update
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default User;
