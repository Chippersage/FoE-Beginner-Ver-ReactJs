// Components/ForgotPassword/VerifyOTP.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/FirebaseConfig';
import logo from '../Img/main-logo.png';
import '../../Styles/VerifyOTP.css';



const VerifyOTP = ({ phoneNumber }) => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const confirmationResult = window.confirmationResult;
      await confirmationResult.confirm(verificationCode);
      setMessage('Phone number verified successfully.');
      setError('');
      navigate('/');
    } catch (err) {
      setError('Invalid verification code. Please try again.');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-verify">
      <div className=".verify-card" style={{ width: '36rem' }}>
        <div className="verify-card-body">
          <div className="verify-img-div">
            <img src={logo} alt="Logo" />
          </div>
          <form className='verifyotp-form' onSubmit={handleVerifyCode}>
            <div>
              <input
                type="text"
                id="verificationCode"
                placeholder="Enter the verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-danger text-center">{error}</div>}
            {message && <div className="text-success text-center">{message}</div>}
            <div className="div-verify-button">
              <button
                type="submit"
                className="verify-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
