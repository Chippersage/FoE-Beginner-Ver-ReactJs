import { faEye, faEyeSlash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../Admin/Components/Img/FoELogo_105x57 (1).png'; // Corrected path
import { useAuth } from '../../../Components/Context/AuthContext';
import { auth, db } from '../../../Components/Firebase/FirebaseConfig';
import "../../../Styles/AdminLogin.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); // Reset error message

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch additional user data from Firestore
      const userDoc = await db.collection('admin').doc(user.uid).get();
      const userData = userDoc.data();

      // Ensure name is part of the user object
      if (userData && userData.email === 'admin@gmail.com') {
        login(userData); // Save userData in context and sessionStorage
        // window.alert('Login successfully');
        navigate('/admindashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="adminlogin-card-body">
          <div className="adminlogin-img-div">
            <img src={logo} alt="Logo" className="company-logo" />
          </div>
          <h2 className='admin-heading'>Admin Login</h2>
          <form className='admin-form' onSubmit={handleLogin}>
            <div className="mb-3 admin-position-relative">
              <input
                type="email"
                className="adminlogin-mail"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="info-icon" data-tooltip="The email that you used during the sign up process.">
                <FontAwesomeIcon icon={faInfoCircle} />
              </span>
            </div>
            <div className="mb-3 admin-position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="adminlogin-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="adminlogin-eye-toggle-password" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
              <span className="info-icon" data-tooltip="Your password must be at least 8 characters long.">
                <FontAwesomeIcon icon={faInfoCircle} />
              </span>
            </div>
            {error && <div className="text-danger text-center">{error}</div>}
            <div className="admin-login-div">
              <button
                type="submit"
                className="admin-login-button"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
