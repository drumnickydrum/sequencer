import React from 'react';
import googleImg from '../img/google.png';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const googleLogin = () => {
    window.open('http://localhost:4000/auth/google', '_self');
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginMethods}>
        <h1>Login</h1>
        <button
          className={styles.methodBtn}
          id='login-google'
          onClick={googleLogin}
        >
          <img src={googleImg} alt='Google Logo' />
          <p>Login with Google</p>
        </button>
      </div>
    </div>
  );
};
