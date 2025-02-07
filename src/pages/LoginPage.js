import React, { useState } from 'react';
import Logo from '../imgs/logo.jpeg';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');


    const handleLogin = (e) => {
        e.preventDefault();
        if (loginData.username === 'Aradana' && loginData.password === 'Aradana123') {
            navigate('/payment');
            setError('');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-page" style={styles.loginContainer}>
            <div className="login-card" style={styles.loginCard}>
              <div style={styles.logoContainer}>
                 <img
                    src={Logo}
                    alt="Logo"
                    style={styles.logo}
                    />
                  </div>
                <h1 style={styles.loginTitle}>Login</h1>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            style={styles.input}
                            value={loginData.username}
                            onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.inputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                style={styles.input}
                                value={loginData.password}
                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                required
                            />
                            <button
                                type="button"
                                style={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}  />
                            </button>
                        </div>
                    </div>
                    <button type="submit" style={styles.loginButton}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    padding: '20px',
 
  },
    logoContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      },
    logo: {
        width: '100px',
        textAlign: 'center',
        height: 'auto',
        marginBottom: '16px',
        '@media (max-width: 768px)': {
            width: '80px',
            marginBottom: '12px',
        },
    },
    loginCard: {
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '60%',
         minWidth: '300px',
         maxWidth: '400px',
        '@media (max-width: 748px)': {
            padding: '24px'
        },

    },
    loginTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '24px',
        color: '#4C1D95',
        '@media (max-width: 768px)': {
            fontSize: '20px',
            marginBottom: '16px',
        },

    },
    inputGroup: {
        marginBottom: '20px',
        '@media (max-width: 768px)': {
            marginBottom: '16px',
        },

    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#374151',
        fontSize: '14px',
        fontWeight: '500',
        '@media (max-width: 768px)': {
            fontSize: '12px',
        },
    },
    inputWrapper: {
        position: 'relative'
    },
    input: {
        width: '90%',
        padding: '10px 12px',
        border: '1px solid #D1D5DB',
        borderRadius: '6px',
        fontSize: '16px',
        '@media (max-width: 768px)': {
            fontSize: '14px',
            padding: '8px 10px',
        },
    },
    passwordToggle: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        color: '#6B7280'
    },
    loginButton: {
        width: '98%',
        padding: '12px',
        backgroundColor: '#4C1D95',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        '@media (max-width: 768px)': {
            fontSize: '14px',
            padding: '10px',
        },
    },
    error: {
        color: '#DC2626',
        textAlign: 'center',
        marginBottom: '16px',
        fontSize: '14px',
        '@media (max-width: 768px)': {
            marginBottom: '12px',
            fontSize: '12px',
        },
    }
};
export default LoginPage;