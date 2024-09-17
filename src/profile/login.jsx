import {
    Button, Container, FormControl, Link, TextField, CircularProgress, Alert, Radio,
    RadioGroup,
    FormControlLabel,
    IconButton,
    MenuItem,
    Select

} from '@mui/material';
import Papa from 'papaparse';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MyText from '../data/typography';
import { setUserInfoAct } from '../store/appdata/appdataslicer';
import PhoneInput from 'react-phone-number-input';
import countryCSV from '../country.csv'
const LoginForm = ({ socket }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [state, setState] = useState({
        phone: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loginType, setLoginType] = useState(0)
    const isSignedIn = useSelector((state) => state.aviatordata.isSignedIn);
    const [showPassword, setShowPassword] = useState(false);
    const [countrycode, setCountrycode] = useState('IN');
    const [countries, setCountries] = useState([]);

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
            .catch(error => {});
    }, []);


    const handleCountryChange = (event) => {
        setCountrycode(event.target.value);
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    useEffect(() => {
        if (isSignedIn) {
            navigate('/')
        };
    }, [isSignedIn, navigate]);
    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.success) {
                    dispatch(setUserInfoAct(data.user));
                    setLoading(false);
                    navigate('/');
                } else if (data.success === false) {
                    setLoading(false);
                    setError(data.message);
                    setTimeout(() => setError(''), 5000);
                }
            };
        }
    }, [socket, dispatch, navigate]);

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitForm = (evt) => {
        evt.preventDefault();
        setLoading(true);
        const requestData = {
            type: 'login',
            data: state,
        };
        socket.send(JSON.stringify(requestData));
    };

    return (
        <div style={{ display: 'flex', marginTop: window.innerWidth < 1000 ? '20vh':'6vw', justifyContent: 'center' }}>
            <Container
                className="centralized"
                maxWidth="xs"
                sx={{
                    bgcolor: '#fff',
                    padding: '1rem',
                    borderRadius: 3,
                    margin: 'auto',
                }}
            >
                <MyText text="Log In" type="h4" />
                <form onSubmit={submitForm}>
                    <RadioGroup
                        aria-label="login-type"
                        name="loginType"
                        value={loginType}
                        onChange={(e) => { setLoginType(e.target.value) }}
                        row
                        sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <FormControlLabel sx={{
                            '& .MuiSvgIcon-root': {
                                fontSize: 15,
                                color: 'black'
                            },
                        }} value={0} control={<Radio />} label="Email ID" />
                        <FormControlLabel
                            sx={{
                                '& .MuiSvgIcon-root': {
                                    fontSize: 15,
                                    color: 'black'
                                },
                            }}
                            value={1}
                            control={<Radio />}
                            label="Mobile Number"
                        />
                    </RadioGroup>

                    <FormControl sx={{ width: '100%' }}>
                        {loginType == 1 ?
                            <>
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
                                <div style={{ position: 'relative', width: '100%',marginTop: '5px' }}>
                                    {!state.phone && (
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
                                        value={state.phone}
                                        onCountryChange={(v) => setCountrycode(v)}
                                        onChange={(phone) => {
                                            const serializedState = JSON.stringify(phone);
                                            localStorage.setItem('phone', serializedState);
                                            setState({ ...state, phone: phone });
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
                            </> :
                            <TextField
                                name="phone"
                                margin="dense"
                                required
                                label="Email"
                                variant="standard"
                                type="email"
                                autoComplete="email"
                                onChange={handleChange}
                            />}
                        <TextField
                            required
                            margin="dense"
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            variant="standard"
                            onChange={handleChange}
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
                        <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 'small' }}>
                            <Link href="recoveraccount" underline="always" sx={{ fontWeight: 700 }}>
                            Forgot password?
                        </Link></div>
                        {loading ? (
                            <CircularProgress sx={{ display: 'block', margin: '1rem auto' }} />
                        ) : (
                            <Button type="submit" variant="contained" sx={{ margin: '1rem 0' }}>Sign In</Button>
                        )}
                    </FormControl>
                    {error && (
                        <Alert severity="error" sx={{ marginBottom: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <div className='have_account'>
                        (Or) Dont have an account {" "}
                        <Link href="/signup" underline="always" sx={{ fontWeight: 700 }}>
                            Create one
                        </Link>
                    </div>
                </form>
            </Container>
        </div>
    );
};

export default LoginForm;
