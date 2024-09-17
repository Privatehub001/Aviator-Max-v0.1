import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {
    Button, Container, TextField, Typography, Grid, Box, Alert, TableCell, TableRow, TableHead, TableBody, Table, Paper, TableContainer, CircularProgress
} from '@mui/material';

const PaymentButton = ({ balance, userCountryCode, transactions, formatDateTime, loading, tableStyles }) => {
    const [amount, setAmount] = useState(userCountryCode === '+91' ? 1000 : "");
    const [error, setError] = useState(null);
    const userId = useSelector(state => state.aviatordata.userId).substring(0, 20);
    const userInfo = useSelector(state => state.aviatordata.userInfo);
    const navigate = useNavigate();

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.status === 'success') {
                if (window.innerWidth <= 1000) {
                    navigate('/dashboard', { state: { paymentSuccess: true } });
                }
                else {
                    navigate('/', { state: { paymentSuccess: true } })
                }
            } else if (event.data.status === 'failure') {
                setError('Payment failed. Please try again.');
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [navigate]);

    const handlePayment = async () => {
        if (userCountryCode === '+91' && (amount === "" || amount < 1000)) {
            setAmount(1000);
        }
        if (amount <= 0 || isNaN(amount)) {
            setError("Please enter a valid amount.");
            return;
        }

        try {
            const response = await fetch('https://seal-app-ugskj.ondigitalocean.app/create-payment-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, amount, email: userInfo.email, phone: userInfo.phone })
            });

            const paymentData = await response.json();
            const paymentWindow = window.open('', 'PaymentWindow');

            const form = document.createElement('form');
            form.method = 'POST';
            form.action = paymentData.apiEndpoint;
            form.target = 'PaymentWindow';

            ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'phone', 'surl', 'furl', 'hash'].forEach(name => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = paymentData[name];
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            setError('An error occurred while processing your payment. Please try again.');
        }
    };

    return (
        <Box my={4} mt={balance? 0:20}>
            {balance&&<Paper elevation={1} sx={{ backgroundColor: 'background.paper', padding: 2, display: 'inline-block' }}>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>Wallet Balance</Typography>
                <Typography variant="h6" sx={{ color: 'text.primary' }}>{balance.wallet_balance || 0}</Typography>
            </Paper>}

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '' }}>
                <Container
                    maxWidth="xs"
                    sx={{
                        padding: '2rem',
                    }}
                >
                    <Typography variant="h6" gutterBottom align="center" sx={{ color: 'white' }}>
                        Deposit Funds
                    </Typography>
                    <Typography variant="body2" gutterBottom align="center" sx={{ color: 'grey' }}>
                        Enter the amount you wish to deposit. Click 'Deposit' to proceed with the payment.
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => {
                            const enteredAmount = parseInt(e.target.value);
                            if (enteredAmount >= 1000) {
                                setAmount(enteredAmount);
                                setError(null);
                            } else {
                                setAmount(1000);
                            }
                        }}
                        fullWidth
                        margin="normal"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'orange',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'white',
                            },
                            '& .MuiInputBase-input': {
                                color: 'white',
                            },
                        }}
                    />
                    <Button
                        onClick={handlePayment}
                        variant="contained"
                        fullWidth
                        sx={{
                            marginTop: '1rem',
                            bgcolor: 'darkorange',
                            '&:hover': {
                                bgcolor: 'orange',
                            },
                            color: 'white',
                            padding: '10px 0',
                            fontSize: '1rem',
                        }}
                    >
                        Deposit
                    </Button>

                    <Typography variant="caption" display="block" align="center" sx={{ marginTop: '1rem', color: 'grey' }}>
                        You will be redirected to a secure payment gateway to complete your deposit.
                    </Typography>
                </Container>
            </Box>
           {transactions&& <Box mt={4}>
                <Typography variant="h5" sx={{ color: 'text.primary', textAlign: 'center' }} gutterBottom>Recent Transactions</Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : transactions.filter(transaction => transaction.deposit > 0).length > 0 ? (
                    <TableContainer component={Paper} sx={tableStyles}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: 'text.secondary' }}>Date</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>Time</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>Transaction Id</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>Deposit</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>Balance</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.filter(transaction => transaction.deposit > 0).map((transaction) => {
                                    const { date, time } = formatDateTime(transaction.timestamp);
                                    return (
                                        <TableRow key={transaction.id}>
                                            <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{date}</TableCell>
                                            <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{time}</TableCell>
                                            <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{transaction.transaction_id}</TableCell>
                                            <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{transaction.deposit}</TableCell>
                                            <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{transaction.balance}</TableCell>
                                            <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{transaction.status}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="h6" align="center" sx={{ color: 'text.secondary' }}>
                        No data available
                    </Typography>
                )}
            </Box>}
        </Box>
    );
};

export default PaymentButton;
