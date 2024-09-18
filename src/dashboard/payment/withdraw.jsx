import React, { useState } from 'react';
import { useSelector } from "react-redux";
import {
    Button, Container, TextField, Typography,useMediaQuery, Box, Alert,TableCell, TableRow, TableHead, TableBody, Table, Paper, TableContainer, CircularProgress
} from '@mui/material';

const Withdraw = ({ balance, transactions, formatDateTime, loading, tableStyles }) => {
    const [amount, setAmount] = useState("");
    const [ifsc_code, setIfsc_code] = useState("");
    const [accountno, setAccountno] = useState("");
    const [loadin, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const userId = useSelector(state => state.aviatordata.userId);
    const userInfo = useSelector(state => state.aviatordata.userInfo);
    const isMobileScreen = useMediaQuery('(max-width:1000px)');

    const handlePayment = async () => {
        setLoading(true);
        if (!accountno || !ifsc_code || !amount) {
            setError("All fields are required.");
            setTimeout(() => setError(''), 5000);
            setLoading(false);
            return;
        }
        else if (balance<1500) {
            setError("Not enough balance.Balance must be greater than 1500 to withdraw");
            setTimeout(() => setError(''), 5000);
            setLoading(false);
            return;
        }
        else if (amount<1500) {
            setError("The minimum withdrawal amount is 1500");
            setTimeout(() => setError(''), 5000);
            setLoading(false);
            return;
        } 
        try {
            const response = await fetch('https://seal-app-ugskj.ondigitalocean.app/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    acc_no: accountno,
                    ifsc_code: ifsc_code,
                    name: userInfo.name,
                    email: userInfo.email,
                    phone: userInfo.phone,
                    amount: amount,
                    userId: userId
                })
            });

            const result = await response.json();
            if (result.success) {
                setLoading(false);
                setInfo(`Success: ${result.message}`);
                setTimeout(() => setInfo(''), 5000);
            } else {
                setLoading(false);
                setError(`Error: ${result.message}`);
                setTimeout(() => setError(''), 5000);
            }
        } catch (error) {
            setLoading(false);
            setError(`Error: ${error.message}`);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <Box my={4}>
            <Paper elevation={1} sx={{
                backgroundColor: 'background.paper',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>Withdrawal Balance</Typography>
                <Typography variant="h6" sx={{ color: 'text.primary' }}>{parseFloat(balance.withdrawal_balance).toFixed(2)  || 0}</Typography>
            </Paper>
        <Box sx={{ display: 'flex', marginTop: '3vw', justifyContent: 'center' }}>
            <Container
                maxWidth="xs"
                sx={{
                    padding: '2rem',
                }}
            >
                <Typography variant="h6" gutterBottom align="center" sx={{ color: 'white' }}>
                    Withdraw Funds
                </Typography>
                <Typography variant="body2" gutterBottom align="center" sx={{ color: 'grey' }}>
                    Enter the amount you wish to withdraw and your account details.
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {info && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        {info}
                    </Alert>
                )}
                <TextField
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => {
                        setAmount(e.target.value);
                        setError(null);
                    }}
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': { borderColor: 'white' },
                            '&:hover fieldset': { borderColor: 'orange' },
                            '&.Mui-focused fieldset': { borderColor: 'orange' },
                        },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiInputBase-input': { color: 'white' },
                    }}
                />

                <TextField
                    label="Account Number"
                    type="number"
                    value={accountno}
                    onChange={(e) => {
                        setAccountno(e.target.value);
                        setError(null);
                    }}
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': { borderColor: 'white' },
                            '&:hover fieldset': { borderColor: 'orange' },
                            '&.Mui-focused fieldset': { borderColor: 'orange' },
                        },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiInputBase-input': { color: 'white' },
                    }}
                />

                <TextField
                    label="IFSC Code"
                    type="text"
                    value={ifsc_code}
                    onChange={(e) => {
                        setIfsc_code(e.target.value);
                        setError(null);
                    }}
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': { borderColor: 'white' },
                            '&:hover fieldset': { borderColor: 'orange' },
                            '&.Mui-focused fieldset': { borderColor: 'orange' },
                        },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiInputBase-input': { color: 'white' },
                    }}
                />

                <Button
                    onClick={handlePayment}
                    variant="contained"
                    fullWidth
                    sx={{
                        marginTop: '1rem',
                        bgcolor: 'darkorange',
                        '&:hover': { bgcolor: 'orange' },
                        color: 'white',
                        padding: '10px 0',
                    }}
                >
                    {loadin ? <CircularProgress size={24} color="inherit" /> : "Withdraw"}
                </Button>

                <Typography variant="caption" display="block" align="center" sx={{ marginTop: '1rem', color: 'grey' }}>
                    After verification, the amount will be transferred to your account.
                </Typography>
            </Container>
        </Box>
        <Box mt={4}>
                <Typography variant="h5" sx={{ color: 'text.primary', textAlign: 'center' }} gutterBottom>Recent Transactions</Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : transactions .filter(transaction => transaction.withdraw > 0).length > 0 ? (
                    <TableContainer component={Paper}  sx={{...tableStyles, margin: isMobileScreen ? '1px' : '16px'}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: 'text.secondary' }}>Date</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>Time</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>Transaction Id</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>Withdraw</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>Balance</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions .filter(transaction => transaction.withdraw > 0).map((transaction) => {
                                    const { date, time } = formatDateTime(transaction.timestamp);
                                    return (
                                        <TableRow key={transaction.id}>
                                            <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{date}</TableCell>
                                            <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{time}</TableCell>
                                            <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{transaction.transaction_id}</TableCell>
                                            <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{transaction.withdraw}</TableCell>
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
            </Box>
        </Box>
    );
};

export default Withdraw;
