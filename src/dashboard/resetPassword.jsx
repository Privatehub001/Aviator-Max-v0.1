import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Button, Container, FormControl, TextField, CircularProgress, Alert, IconButton, Grid,
    Typography, useMediaQuery, useTheme
} from '@mui/material';
import 'react-phone-number-input/style.css';

import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ResetPassword = ({ socket }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPasswordconfirm, setShowPasswordconfirm] = useState(false);

    const currentPasswordRef = useRef('');
    const newPasswordRef = useRef('');
    const confirmPasswordRef = useRef('');

    const phone = useSelector(state => state.aviatordata.userInfo.phone);

    const handleClickShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowPasswordconfirm = () => setShowPasswordconfirm(!showPasswordconfirm);

    const isPasswordValid = (password) => /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,}$/.test(password);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.success && data.message === "Password Changed.") {
                    setInfo("Password changed successfully!");
                    currentPasswordRef.current = '';
                    newPasswordRef.current = '';
                    confirmPasswordRef.current = '';
                    setShowCurrentPassword(false);
                    setTimeout(() => setInfo(''), 5000);
                    setLoading(false);
                } else if (data.success) {
                    changePassword();
                } else if (data.success === false) {
                    setError(data.message);
                    setTimeout(() => setError(''), 5000);
                    setLoading(false);
                }
            };
        }
    }, [socket, navigate]);

    const changePassword = () => {
        const data = {
            type: 'changepassword',
            data: { Phone: phone, password: confirmPasswordRef.current },
        };
        if (confirmPasswordRef.current.length > 0) {
            socket.send(JSON.stringify(data));
        }
    }

    const handleChange = (evt) => {
        evt.preventDefault();
        const { name, value } = evt.target;
        if (name === 'currentPassword') {
            currentPasswordRef.current = value;
        } else if (name === 'password') {
            newPasswordRef.current = value;
        } else if (name === 'passwordConfirm') {
            confirmPasswordRef.current = value;
        }
    };

    const signed = () => {
        const requestData = {
            type: 'login',
            data: {
                phone: phone,
                password: currentPasswordRef.current
            },
        };
        socket.send(JSON.stringify(requestData));
    }

    const submitForm = (evt) => {
        if (!loading) {
            evt.preventDefault();
            if (!newPasswordRef.current || !confirmPasswordRef.current) {
                setError('Please fill all fields correctly.');
                setTimeout(() => setError(''), 5000);
                return;
            }
            if (newPasswordRef.current !== confirmPasswordRef.current) {
                setError('Passwords do not match.');
                setTimeout(() => setError(''), 5000);
                return;
            }
            if (newPasswordRef.current === currentPasswordRef.current) {
                setError('New password cannot be the same as the current password.');
                setTimeout(() => setError(''), 5000);
                return;
            }
            if (!isPasswordValid(newPasswordRef.current)) {
                setError('Password must be at least 10 characters long and include at least one special character, a capital letter, and a number.');
                setTimeout(() => setError(''), 5000);
                return;
            }
            setLoading(true);
            signed();
        }
    };

    return (
        <div>
            <Typography variant={isMobile ? 'h6' : 'h5'} align="center" sx={{ marginBottom: '1rem',marginTop:'2vh' }}>
                Reset Password
            </Typography>
            <Container maxWidth="sm">
                <form className='form'>
                    <FormControl fullWidth>
                        <Grid container spacing={isMobile ? 1 : 2} sx={{ marginTop: isMobile ? '1rem' : '2rem' }}>
                            <Grid item xs={12}>
                                <TextField
                                    name="currentPassword"
                                    required
                                    margin="dense"
                                    label="Current Password"
                                    variant="outlined"
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: 'white' },
                                            '&:hover fieldset': { borderColor: 'white' },
                                            '&.Mui-focused fieldset': { borderColor: 'orange' },
                                        },
                                    }}
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowCurrentPassword}
                                                    sx={{ color: 'orange' }}
                                                >
                                                    {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="password"
                                    required
                                    margin="dense"
                                    label="New Password"
                                    variant="outlined"
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: 'white' },
                                            '&:hover fieldset': { borderColor: 'white' },
                                            '&.Mui-focused fieldset': { borderColor: 'orange' },
                                        },
                                    }}
                                    type={showPassword ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    sx={{ color: 'orange' }}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="passwordConfirm"
                                    required
                                    margin="dense"
                                    label="Confirm New Password"
                                    variant="outlined"
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: 'white' },
                                            '&:hover fieldset': { borderColor: 'white' },
                                            '&.Mui-focused fieldset': { borderColor: 'orange' },
                                        },
                                    }}
                                    type={showPasswordconfirm ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPasswordconfirm}
                                                    sx={{ color: 'orange' }}
                                                >
                                                    {showPasswordconfirm ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="button" onClick={submitForm} variant="contained" fullWidth sx={{ mt: isMobile ? '1rem' : '2rem' }}>
                                    {loading ? <CircularProgress size={24} /> : "Confirm"}
                                </Button>
                            </Grid>
                        </Grid>
                    </FormControl>
                    {error && (
                        <Alert severity="error" sx={{ marginTop: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {info && (
                        <Alert severity="success" sx={{ marginTop: 2 }}>
                            {info}
                        </Alert>
                    )}
                </form>
            </Container>
        </div>
    );
};

export default ResetPassword;
