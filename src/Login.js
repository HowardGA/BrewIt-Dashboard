import React, { useRef, useState, useEffect, useContext } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';

const LOGIN_URL = 'https://brewiy-back.vercel.app/api/login';
const PHONE_URL = 'https://brewiy-back.vercel.app/api/phone/';


const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const { setUsername } = useContext(UserContext);

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, { name: user, password: pwd });
      const accessToken = response.data.accessToken;  // Assuming the token is returned in the response
      const username = response.data.username;
      const response2 = await axios.get(PHONE_URL+username);
      const phone = response2.data._id;

      // Set username in context
      setUsername(response.data.username);

      // Store access token in localStorage
      localStorage.setItem("accessToken", phone);

      // Set the logged-in state
      setIsLoggedIn(true);

      // Navigate to the dashboard
      navigate(`/dashboard/${phone}`);
    } catch (err) {
      console.error('Error response:', err.response);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <section>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <button>Sign In</button>
      </form>
      <p>
        Need an Account?<br />
        <span className="line">
          <a href="./register">Sign Up</a>
        </span>
      </p>
    </section>
  );
};

export default Login;
