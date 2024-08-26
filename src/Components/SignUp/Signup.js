import { faEye, faEyeSlash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../Firebase/FirebaseConfig';
import logo from "../Img/main-logo.png";
import "./../../Styles/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Check if the email already exists
      const usersQuery = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        setError('This email is already registered.');
        setIsSubmitting(false);
        return;
      }

      // If email does not exist, proceed with registration
      const counterDoc = await db.collection('counters').doc('userCounter').get();
      const currentCounter = counterDoc.exists ? counterDoc.data().current : 0;
      const newCounter = currentCounter + 1;
      const newUserId = `std${newCounter}`;
      await db.collection('counters').doc('userCounter').set({ current: newCounter });

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        std: newUserId,
        name,
        email,
        password,
        mobile,
        createdAt: new Date(),
      });

      setName('');
      setEmail('');
      setPassword('');
      setMobile('');
      setError('');
      setIsSubmitting(false);

      alert('You have registered successfully!');
      navigate('/');
    } catch (err) {
      console.error("Error during registration: ", err);
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const canSubmit = email.trim() !== '' && password.trim() !== '' && mobile.trim() !== '';

  return (
    <div className="signup-main">
      <div className="signup-card">
        <div className="signup-card-body">
          <div className="signup-img-div">
            <img src={logo} alt="Logo" />
          </div>
          <form className='signup-form' onSubmit={handleSubmit}>
            <h2 className='signup-main-heading'>Sign Up</h2>
            <div className='signup_position_relative'>
              <input
                type="text"
                id="signup_name"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <span className="info-icon" data-tooltip="Your full name.">
                <FontAwesomeIcon icon={faInfoCircle} />
              </span>
            </div>
            <div className='signup_position_relative'>
              <input
                type="email"
                id="signup_email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="info-icon" data-tooltip="The email that you used during the sign up process.">
                <FontAwesomeIcon icon={faInfoCircle} />
              </span>
            </div>
            <div className='signup_position_relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id="signup_password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="info-icon" data-tooltip="Your password must be at least 8 characters long.">
                <FontAwesomeIcon icon={faInfoCircle} />
              </span>
              <span className="signup-eye-toggle-password" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            <div className='signup_position_relative'>
              <input
                type="text"
                id="signup_mobile"
                placeholder="Enter Your Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
              <span className="info-icon" data-tooltip="Your mobile number.">
                <FontAwesomeIcon icon={faInfoCircle} />
              </span>
            </div>
            {error && <div className="text-danger text-center">{error}</div>}
            <div className="button-main">
              <button
                type="submit"
                className="btn-sub"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Sign Up'}
              </button>
            </div>
            <div className="forgot-password">
              <a onClick={() => navigate('/forgot-password')}>
                Forgot Password?
              </a>
            </div>
            <div className="sign-up-text">
              <p>
                <a onClick={() => navigate('/')}>
                  &nbsp;Sign In
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
