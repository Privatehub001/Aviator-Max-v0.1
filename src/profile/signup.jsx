import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Papa from 'papaparse';
import {
    Button, Container, FormControl, Link, TextField, CircularProgress, Alert, IconButton, MenuItem, Select, InputLabel
} from '@mui/material';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { setUserInfoAct } from '../store/appdata/appdataslicer';
import { v4 } from 'uuid';
import MyText from '../data/typography';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useLocation } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import countryCSV from '../country.csv'

const SignUpForm = ({ socket }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [info, setInfo] = useState();
    const [showotp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [verified, setVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showResendOtp, setShowResendOtp] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const [showPasswordconfirm, setShowPasswordconfirm] = useState(false);

    const handleClickShowPasswordconfirm = () => setShowPasswordconfirm(!showPasswordconfirm);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const refIDFromUrl = searchParams.get('refID'); // Get refID from URL
    const [countrycode, setCountrycode] = useState('IN');
    const [countries, setCountries] = useState([]);
    const [count, setCount] = useState();

    const [state, setState] = useState({
        name: '',
        email: '',
        Phone: '',
        gender: 1,
        dob: '',
        password: '',
        passwordConfirm: '',
        referrer: refIDFromUrl || '',
        userId: v4(),
        refid: generateUniqueID(),
    });

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
            .catch(error);
    }, []);

    const handleCountryChange = (event) => {
        setCountrycode(event.target.value);
    };

    const isEmailValid = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    const isPasswordValid = (password) => /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,}$/.test(password);

    const isSignedUp = useSelector(
        (state) => state.aviatordata.isSignedIn,
    );

    const setGender = (value) => {
        setState({
            ...state,
            gender: value,
        });
    }

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.success && data.userId) {
                    dispatch(setUserInfoAct({ email: state.email, phone: state.Phone, name: state.name, dob: state.dob, refferer: state.referrer, userId: state.userId, referral_id: state.refid }));
                    navigate('/');
                } else if (data.success && data.message === "Continue") {
                    sendOtp();
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
            setLoading(true);
            const data = {
                type: 'checkData',
                data: {
                    phone: state.Phone,
                    email: state.email
                }
            };
            const serializedState = JSON.stringify(state.Phone);
            localStorage.setItem('phone', serializedState);
            socket.send(JSON.stringify(data));
        }
        else {
            setError('Invalid format.');
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
    function generateUniqueID() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    const signed = () => {
        const data = {
            type: 'signup',
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
            const birthDate = new Date(state.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (
                monthDifference < 0 ||
                (monthDifference === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            if (age < 18) {
                setError("You must be at least 18 years old to continue.");
                setTimeout(() => setError(''), 5000);
                return;
            }
            if (!state.name || !state.email || !state.Phone || !state.password || !state.passwordConfirm) {
                setError('Please fill all fields correctly.');
                setTimeout(() => setError(''), 5000);
                return;
            }
            if (state.password !== state.passwordConfirm) {
                setError('Passwords do not match.');
                setTimeout(() => setError(''), 5000);
                return;
            }
            if (!isEmailValid(state.email)) {
                setError('Invalid email format.');
                setTimeout(() => setError(''), 5000);
                return;
            }
            if (!isPasswordValid(state.password)) {
                setError('Password must be at least 10 characters long and include at least one special character, a capital letter, and a number.');
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
                    setInfo("OTP sent.");
                    setShowResendOtp(false);
                    setTimeout(() => setInfo(''), 5000);
                    setShowOtp(true);
                    setLoading(false);
                    let countDownTime = 60;
                    const interval = setInterval(function () {
                        countDownTime--;
                        setCount(countDownTime);
                        if (countDownTime <= 0) {
                            clearInterval(interval);
                            setShowResendOtp(true);
                        }
                    }, 1000);
                }
                else {
                    setError(res.message);
                    setTimeout(() => setError(''), 5000);
                    setLoading(false);
                  
                }
            }

        } catch (error) {
            setError("Unexpected error occurred.");
            setTimeout(() => setError(''), 5000);
            setLoading(false);
        }
    }

    const verifyOtp = async () => {
        const serializedState = localStorage.getItem('phone');
        if (serializedState === null) {
            return undefined;
        }
        const phone = JSON.parse(serializedState);
        if (otp && showotp && phone) {
            setLoading(true);
            try {
                const response = await fetch('https://seal-app-ugskj.ondigitalocean.app/verifyotp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ phone: phone, otp })
                });
                const res = await response.json();
                if (res.success) {
                    setVerified(true);
                    setInfo("Number verified successfully.");
                    setLoading(false);
                    setTimeout(() => setInfo(''), 5000);
                    localStorage.setItem('phone', "");
                }
                else {
                    setError(res.message);
                    setTimeout(() => setError(''), 5000);
                    setLoading(false);
                }
            } catch (error) {
                setError('Unexpected error occurred.');
                setTimeout(() => setError(''), 5000);
                setLoading(false);
            }
        }
    };

    return (
        <div style={{ display: "flex", marginTop: window.innerWidth < 1000?"20vh":"6vw", justifyContent: "center" }}>
            <Container
                className="centralized"
                margin="dense"
                maxWidth="xs"
                sx={{
                    bgcolor: '#fff',
                    p: '1rem',
                    borderRadius: 2,
                    margin: 'auto',
                }}
            >
                <MyText text={"Sign Up"} type="h4" />
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
                                        color: "#3b3b3b",
                                        marginBottom: '25px',
                                        textAlign: 'center',
                                        border: 'none',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderTop: 'none',
                                            borderLeft: 'none',
                                            borderRight: 'none',
                                            borderBottom: '1px solid',
                                            borderBottomColor: '#4f4d4dbd',
                                        },
                                        '& .MuiSelect-select': {
                                            paddingBottom: '4px',
                                            paddingTop: '15px',
                                        },
                                    }}
                                >
                                    {countries.map((country, index) => (
                                        <MenuItem key={index} value={country.id}>
                                            {country.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <div style={{ position: 'relative', width: '100%', marginTop: '5px' }}>
                                    {!state.Phone && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '8em',
                                                transform: 'translateY(-50%)',
                                                color: '#605f5f',
                                                pointerEvents: 'none',
                                                fontSize: '16px',
                                            }}
                                        >
                                            Enter Phone Number
                                        </span>
                                    )}
                                    <PhoneInput
                                        placeholder="Enter phone number"
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
                                            width: '100%',
                                            borderBottom: '1px solid #4f4d4dbd',
                                            paddingBottom: '4px',
                                        }}

                                    />
                                </div>
                                <Button
                                    type="button"
                                    onClick={showResendOtp ? sendOtp : !showotp ? submitNumber : undefined}
                                    variant="contained"
                                    sx={{ mt: '1rem', width: '25rem' }}
                                    disabled={count > 0}
                                >
                                    {showResendOtp ? "Resend OTP" : loading ? <CircularProgress size={24} /> : "Get OTP"}
                                </Button>
                                {count > 0 && <span style={{ fontSize: '16px' }}>Resend OTP in {count} seconds.</span>}
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
                                    name="name"
                                    margin="dense"
                                    required
                                    label="Name"
                                    variant="standard"
                                    type="text"
                                    autoComplete="Name"
                                    onChange={handleChange}
                                />

                                <div className='radiogroup'>
                                    <div>Gender</div>
                                    <div className='gender'>
                                        <div>
                                            <input value={1} name='male' type='radio' margin="dense" variant="standard" checked={state.gender == 1} onChange={(e) => setGender(e.target.value)} />
                                            <label>Male</label></div>
                                        <div>
                                            <input value={0} name='female' type='radio' margin="dense" variant="standard" checked={state.gender == 0} onChange={(e) => setGender(e.target.value)} />
                                            <label>Female</label></div>
                                    </div>
                                </div>

                                <TextField
                                    type='date'
                                    value={state.dob}
                                    onChange={handleChange}
                                    name='dob'
                                    required
                                    label="Date of Birth"
                                    margin="dense"
                                    variant="standard"
                                />
                                <TextField
                                    name="email"
                                    margin="dense"
                                    required
                                    label="Email"
                                    variant="standard"
                                    type="email"
                                    autoComplete="email"
                                    onChange={handleChange}
                                />
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
                                <TextField
                                    name="referrer"
                                    margin="dense"
                                    label="Referral ID (Optional)"
                                    variant="standard"
                                    type="text"
                                    autoComplete="referrer"
                                    value={state.referrer}
                                    onChange={handleChange}
                                />
                            </>
                            <Button type="button" onClick={submitForm} variant="contained" sx={{ mt: '2rem', fontWeight: 'bold' }}>
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
                    <div className='have_account' style={{ marginTop: '20px' }}>
                        (Or) Already have an account {" "}
                        <Link href="/login" underline="always" sx={{ fontWeight: 700 }}>
                            Login
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

export default SignUpForm;
