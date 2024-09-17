import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import UserBets from './userBets';
import { useTheme } from '@mui/material/styles';

const Overview = ({ socket,balance ,loading}) => {
  const userId = useSelector((state) => state.aviatordata.userId);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
  
  }, [userId]);


  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={isMobile ? 2: 4}>
          <Grid item xs={isMobile?6:12} sm={6} md={3}>
            <Paper elevation={3} sx={{ backgroundColor: 'background.paper', padding: 2 }}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>Coins</Typography>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>{balance.balance || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={isMobile?6:12} sm={6} md={3}>
            <Paper elevation={3} sx={{ backgroundColor: 'background.paper', padding: 2 }}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>Wallet Balance</Typography>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>{balance.wallet_balance || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={isMobile?6:12} sm={6} md={3}>
            <Paper elevation={3} sx={{ backgroundColor: 'background.paper', padding: 2 }}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>Referral Balance</Typography>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>{balance.referral_balance || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={isMobile?6:12} sm={6} md={3}>
            <Paper elevation={3} sx={{ backgroundColor: 'background.paper', padding: 2 }}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>Withdrawal Balance</Typography>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>{balance.withdrawal_balance || 0}</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Box mt={4}>
            <UserBets />
        </Box>
      </Box>
    </Container>
  );
};

export default Overview;
