import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material';
import UserBets from './userBets';
import { useTheme } from '@mui/material/styles';

const Overview = ({ socket, balance, loading }) => {
  const userId = useSelector((state) => state.aviatordata.userId);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery('(max-width:1000px)');

  useEffect(() => {}, [userId]);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
      <Grid container spacing={isMobile ? 2 : 4}>
          {/* Coins Available */}
          <Grid item xs={isMobile ? 6 : 12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                backgroundColor: 'background.paper',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Center content horizontally
                justifyContent: 'center', // Center content vertically
                height: '100%',
              }}
            >
              <Typography variant="subtitle1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Coins Available
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.primary', textAlign: 'center' }}>
                {balance.balance || 0}
              </Typography>
            </Paper>
          </Grid>

          {/* Wallet Balance */}
          <Grid item xs={isMobile ? 6 : 12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                backgroundColor: 'background.paper',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography variant="subtitle1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Wallet Balance
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.primary', textAlign: 'center' }}>
                {balance.wallet_balance || 0}
              </Typography>
            </Paper>
          </Grid>

          {/* Referral Balance */}
          <Grid item xs={isMobile ? 6 : 12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                backgroundColor: 'background.paper',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography variant="subtitle1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Referral Balance
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.primary', textAlign: 'center' }}>
                {balance.referral_balance || 0}
              </Typography>
            </Paper>
          </Grid>

          {/* Withdrawal Balance */}
          <Grid item xs={isMobile ? 6 : 12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                backgroundColor: 'background.paper',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography variant="subtitle1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Withdrawal Balance
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.primary', textAlign: 'center' }}>
                {balance.withdrawal_balance || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box 
        mt={4}
        sx={{marginLeft: isSmallScreen ? '0px' : 'auto', marginRight: isSmallScreen ? '0px' : 'auto'
        }} >
            <UserBets />
        </Box>
      </Box>
    </Container>
  );
};

export default Overview;
