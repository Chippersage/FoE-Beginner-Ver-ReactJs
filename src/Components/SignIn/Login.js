
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEye, faEyeSlash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { auth, db } from '../Firebase/FirebaseConfig';
import { useAuth } from '../Context/AuthContext';
import logo from '../Img/main-logo.png';
import '../../Styles/Login.css';

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

    // Add condition to prevent login for specific email
    if (email === 'admin@gmail.com') {
      setError('This email is not allowed to log in.');
      setIsSubmitting(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch additional user data from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data();

      // Ensure name is part of the user object
      login({
        uid: user.uid,
        email: user.email,
        name: userData?.name || 'Guest', // Default to 'Guest' if name is not available
        // Add any other user data you need
      });

      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="main_login ">
      <div className="login_card" >
        <div className="login-card-body">
          <div className="login-img-div">
            <img src={logo} alt="Logo"/>
          </div>
          <form  className='login-form' onSubmit={handleLogin}>
          <h2 className='login-main_heading'> LogIn</h2>
            <div className="login-position-relative">
              <input
                type="email"
                id="login_email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
             <span className="info-icon" data-tooltip="The email that you used during the sign up process.">
                <FontAwesomeIcon icon={faInfoCircle} />
              </span> 
            </div>
            <div className="login-position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login_password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="info-icon" data-tooltip="Your password must be at least 8 characters long.">
                <FontAwesomeIcon icon={faInfoCircle} />
              </span>
              <span className="login-eye-toggle-password" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            {error && <div className="text-danger text-center">{error}</div>}
            <div className="login-button-main">
              <button
                type="submit"
                className="login-btn-sub"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
            <div className="login-forgot-password">
              <a
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </a>
            </div>
            <div className="login-sign-up-text">
              <p>
                <a
                  onClick={() => navigate('/signUp')}
                >
                  &nbsp;SignUp
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
