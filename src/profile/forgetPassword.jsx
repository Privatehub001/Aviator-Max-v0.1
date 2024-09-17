import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import {
    Button, Container, FormControl, Link, TextField, CircularProgress, Alert, IconButton, MenuItem, Select, InputLabel
} from '@mui/material';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import MyText from '../data/typography';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useLocation } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import countryCSV from '../country.csv'
const ForgetPassword = ({ socket }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [info, setInfo] = useState();
    const [showotp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verified, setVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const [showPasswordconfirm, setShowPasswordconfirm] = useState(false);

    const handleClickShowPasswordconfirm = () => setShowPasswordconfirm(!showPasswordconfirm);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const refID = searchParams.get('refID');
    const [countrycode, setCountrycode] = useState('IN');
    const [countries, setCountries] = useState([]);
    const [showResendOtp, setShowResendOtp] = useState(false);

    useEffect(() => {
        fetch(countryCSV)
            .then(response => response.text())
            .then(data => {
                Papa.parse(data, {
                    header: true,
                    complete: (result) => {
                        setCountries(result.data);
                    },
                    error: (error) => {
                     
                    },
                });
            })
            .catch();
    }, []);

    useEffect(() => {
        let timer;
        if (showotp) {
            timer = setTimeout(() => {
                setShowResendOtp(true);
            }, 60000);
        }
        return () => clearTimeout(timer);
    }, [showotp]);

    const handleCountryChange = (event) => {
        setCountrycode(event.target.value);
    };

    const isPasswordValid = (password) => /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,}$/.test(password);

    const [state, setState] = useState({
        Phone: '',
        password: '',
        passwordConfirm: '',
    });

    const isSignedUp = useSelector(
        (state) => state.aviatordata.isSignedIn,
    );

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.success && data.userId) {
                    navigate('/login');
                } else if (data.success === false && data.message === "Phone or Email already registered.") {
                    sendOtp();
                }
                else if (data.success && data.message === "Continue") {
                    setError("Acount not Found. PLease create account");
                    setTimeout(() => {
                        setError('');
                        setLoading(false);
                    }, 5000);
                } else if (data.success === false) {
                    setError(data.message || "An unexpected error occurred.");
                    setTimeout(() => {
                        setError('');
                        setLoading(false);
                    }, 5000);
                }
            };
        }
    }, [socket, dispatch, navigate]);

    const submitNumber = () => {
        if (state.Phone && isValidPhoneNumber(state.Phone)) {
            setLoading(true)
            const data = {
                type: 'checkData',
                data: {
                    phone: state.Phone,
                    email: ""
                }
            }
            const serializedState = JSON.stringify(state.Phone);
            localStorage.setItem('phone', serializedState);
            socket.send(JSON.stringify(data));
        }
        else {
            setError('Invalif format.')
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }

    useEffect(() => {
        if (isSignedUp) navigate('/login');
    }, [isSignedUp, navigate]);

    const handleChange = (evt) => {
        evt.preventDefault();
        const { value } = evt.target;
        setState({
            ...state,
            [evt.target.name]: value,
        });
    };
    const signed = () => {
        const data = {
            type: 'changepassword',
            data: state,
        };
        socket.send(JSON.stringify(data));
    }
    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    const submitForm = (evt) => {
        if (!loading) {
            evt.preventDefault();
            if (!state.password || !state.passwordConfirm) {
                setError('Please fill all fields correctly.');
                setTimeout(() => setError(''), 5000);
                return;
            }
            if (state.password !== state.passwordConfirm) {
                setError('Password does not match.');
                setTimeout(() => setError(''), 5000);
                return;
            }
            if (!isPasswordValid(state.password)) {
                setError('Password must be at least 10 characters long and include at least one special character , a capital letter and number.');
                setTimeout(() => setError(''), 5000);
                return;
            }
            setLoading(true);
            signed();
        }
    };
    const sendOtp = async () => {
        const serializedState = localStorage.getItem('phone');
        if (serializedState === null) {
            return undefined;
        }
        const phone = JSON.parse(serializedState);
        try {
            if (phone) {
                const response = await fetch('https://seal-app-ugskj.ondigitalocean.app/getotp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ phoneNumber: phone })
                });
                const res = await response.json();
                if (res.success) {
                    setInfo("OTP sent.")
                    setTimeout(() => setInfo(''), 5000);
                    setShowOtp(true);
                    setLoading(false)
                }
                else {
                    setError(res.message);
                    setTimeout(() => setError(''), 5000);
                    setLoading(false)
                   
                }
            }
        } catch (error) {
            setError("Unexpected error ocured.");
            setTimeout(() => setError(''), 5000);
            setLoading(false)
        }
    }
    const verifyOtp = async () => {
        if (otp && showotp) {
            setLoading(true);
            try {
                const response = await fetch('https://seal-app-ugskj.ondigitalocean.app/verifyotp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ phone: state.Phone, otp })
                });
                const res = await response.json();
                if (res.success) {
                    setVerified(true)
                    setInfo("Number verified successfully.")
                    setLoading(false)
                    setTimeout(() => setInfo(''), 5000);
                }
                else {
                    setError('Incorrect OTP. Please try again.');
                    setTimeout(() => setError(''), 5000);
                    setLoading(false)
                }
            } catch (error) {
                setError('Unexpected error occured.');
                setTimeout(() => setError(''), 5000);
                setLoading(false)
            }
        }
    };

    return (
        <div style={{ display: "flex", marginTop: window.innerWidth < 1000?"20vh":"8vw", justifyContent: "center" }}>
            <Container
                className="centralized"
                margin="dense"
                maxWidth="xs"
                sx={{
                    bgcolor: '#fff',
                    p: '2rem',
                    borderRadius: 2,
                    margin: 'auto',
                }}
            >
                <MyText text={"Forget Password ?"} type="h4" />
                <form className='form'>
                    {!verified ?
                        <>
                            <FormControl>
                                <Select
                                    labelId="country-select-label"
                                    placeholder='Select a country'
                                    id="country-select"
                                    value={countrycode}
                                    onChange={handleCountryChange}
                                    sx={{
                                        color: "#b9b9b9",
                                        marginBottom: '16px',
                                        textAlign: 'center',
                                        border: 'none',
                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                                    }}
                                >
                                    {countries.map((country, index) => (
                                        <MenuItem key={index} value={country.id}>
                                            {country.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <div style={{ position: 'relative', width: '100%' }}>
                                    {!state.Phone && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '5em',
                                                transform: 'translateY(-50%)',
                                                color: '#b9b9b9',
                                                pointerEvents: 'none',
                                                fontSize: '16px',
                                            }}
                                        >
                                            Enter Phone Number
                                        </span>
                                    )}
                                    <PhoneInput
                                        international
                                        countryCallingCodeEditable={false}
                                        defaultCountry={countrycode}
                                        value={state.Phone}
                                        onCountryChange={(v) => setCountrycode(v)}
                                        onChange={(phone) => {
                                            const serializedState = JSON.stringify(phone);
                                            localStorage.setItem('phone', serializedState);
                                            setState({ ...state, Phone: phone });
                                        }}
                                        style={{
                                            color: 'black',
                                            fontSize: '20px',
                                            paddingLeft: state.Phone ? '10px' : '0px',
                                        }}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={showResendOtp ? sendOtp : !showotp ? submitNumber : undefined}
                                    variant="contained"
                                    sx={{ mt: '2rem', width: '25rem' }}
                                >
                                    {showResendOtp ? "Resend OTP" : loading ? <CircularProgress size={24} /> : "Get OTP"}
                                </Button>
                            </FormControl>
                            <FormControl>
                                <TextField
                                    margin="dense"
                                    required
                                    label="OTP"
                                    variant="standard"
                                    type="text"
                                    onChange={handleOtpChange}
                                />
                                <Button type="button" onClick={showotp ? verifyOtp : undefined} variant="contained" sx={{ mt: '2rem', width: '25rem' }} disabled={!showotp}>
                                    {showotp ? loading ? <CircularProgress size={24} /> : "Verify OTP" : "Verify OTP"}
                                </Button>
                            </FormControl></> :
                        <FormControl sx={{ width: '100%' }}>
                            <>
                                <TextField
                                    name="password"
                                    required
                                    margin="dense"
                                    label="Password"
                                    autoComplete="new-password"
                                    variant="standard"
                                    onChange={handleChange}
                                    type={showPasswordconfirm ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"

                                                    onClick={handleClickShowPasswordconfirm}
                                                >
                                                    {showPasswordconfirm ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>

                                        ),
                                    }}
                                />
                                <TextField
                                    name="passwordConfirm"
                                    required
                                    margin="dense"
                                    label="Confirm Password"
                                    autoComplete="new-password"
                                    variant="standard"
                                    onChange={handleChange}
                                    type={showPassword ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"

                                                    onClick={handleClickShowPassword}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>

                                        ),
                                    }}
                                />
                            </>
                            <Button type="button" onClick={submitForm} variant="contained" sx={{ mt: '2rem' }}>
                                {loading ? <CircularProgress size={24} /> : "Confirm"}
                            </Button>
                        </FormControl>}
                    {error && (
                        <Alert severity="error" sx={{ marginBottom: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {info && (
                        <Alert severity="success" sx={{ marginBottom: 2 }}>
                            {info}
                        </Alert>
                    )}
                    <div className='have_account'>
                        (Or) Get back to  {" "}
                        <Link href="/login" underline="always" sx={{ fontWeight: 500 }}>
                            Login {" "}
                        </Link>
                        or {" "}
                        <Link href="/signup" underline="always" sx={{ fontWeight: 500 }}>
                            Sign up
                        </Link>
                    </div>
                </form>
                <div
                    id="recaptcha-container"
                    class="justify-center flex"
                ></div>
            </Container>
        </div>
    );
};

export default ForgetPassword;
