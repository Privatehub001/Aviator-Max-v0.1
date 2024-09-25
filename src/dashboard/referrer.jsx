import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, InputAdornment, TextField, Grid, Paper, Container,TableContainer,TableCell,TableRow,TableBody,TableHead,Table } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
function ReferralLinkButton({ refId, userId }) {
    const [copied, setCopied] = useState(false);
    const [refcopied, setRefCopied] = useState(false);
    const [referralData, setReferralData] = useState({
        totalBonus: 0,
        level1Bonus: 0,
        level2Bonus: 0,
        level3Bonus: 0,
        totalReferrals: 0,
        level1Referrals: 0,
        level2Referrals: 0,
        level3Referrals: 0,
        referrals: []
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const generateReferralLink = () => `https://skysprints.vercel.app/signup?refID=${refId}`;

    const handleCopyLink = () => {
        const link = generateReferralLink();
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
           
    };

    useEffect(() => {
        const fetchReferralData = async () => {
            try {
                const response = await axios.get('https://seal-app-ugskj.ondigitalocean.app/get-referral-data', {
                    params: { userId: userId, refId }
                });
                setReferralData(response.data);
            } catch (error) {
               
            }
        };

        fetchReferralData();
    }, [refId]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(timeString).toLocaleTimeString(undefined, options);
    };

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">
                    {/* Referral Link Section */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Share Your Referral Link
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Invite your friends by sharing the referral link below. Click "Copy" to copy the link to your clipboard.
                            </Typography>
                            <TextField
                                fullWidth
                                value={generateReferralLink()}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                onClick={handleCopyLink}
                                                startIcon={<ContentCopyIcon />}
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    textTransform: 'none',
                                                    bgcolor: copied ? 'green' : 'orange',
                                                    '&:hover': {
                                                        bgcolor: copied ? 'green' : 'darkorange',
                                                    },
                                                }}
                                            >
                                                {copied ? 'Copied!' : 'Copy'}
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mt: 2 }}
                            />
                        </Paper>
                    </Grid>

                    {/* Referral Code Section */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Share Your Referral Code
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                You can also invite friends by sharing the referral code below. Click "Copy" to copy the code to your clipboard.
                            </Typography>
                            <TextField
                                fullWidth
                                value={refId}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(refId)
                                                        .then(() => {
                                                            setRefCopied(true);
                                                            setTimeout(() => setRefCopied(false), 2000);
                                                        })
                                                        
                                                }}
                                                startIcon={<ContentCopyIcon />}
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    textTransform: 'none',
                                                    bgcolor: refcopied ? 'green' : 'orange',
                                                    '&:hover': {
                                                        bgcolor: refcopied ? 'green' : 'darkorange',
                                                    },
                                                }}
                                            >
                                                {refcopied ? 'Copied!' : 'Copy'}
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mt: 2 }}
                            />
                        </Paper>
                    </Grid>

                    {/* Referral Bonus Information */}
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={isMobile?6:12} sm={6} md={3}>
                                <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                                    <Typography variant="subtitle1">Total Bonus</Typography>
                                    <Typography variant="h6">{referralData.totalBonus}/-</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={isMobile?6:12} sm={6} md={3}>
                                <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                                    <Typography variant="subtitle1">1st Level Bonus</Typography>
                                    <Typography variant="h6">{referralData.level1Bonus}/-</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={isMobile?6:12} sm={6} md={3}>
                                <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                                    <Typography variant="subtitle1">2nd Level Bonus</Typography>
                                    <Typography variant="h6">{referralData.level2Bonus}/-</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={isMobile?6:12} sm={6} md={3}>
                                <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                                    <Typography variant="subtitle1">3rd Level Bonus</Typography>
                                    <Typography variant="h6">{referralData.level3Bonus}/-</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Referral Count Information */}
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={isMobile?6:12} sm={6} md={3}>
                                <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                                    <Typography variant="subtitle1">Total Referrals</Typography>
                                    <Typography variant="h6">{referralData.totalReferrals}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={isMobile?6:12} sm={6} md={3}>
                                <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                                    <Typography variant="subtitle1">1st Level Referrals</Typography>
                                    <Typography variant="h6">{referralData.level1Referrals}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={isMobile?6:12} sm={6} md={3}>
                                <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                                    <Typography variant="subtitle1">2nd Level Referrals</Typography>
                                    <Typography variant="h6">{referralData.level2Referrals}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={isMobile?6:12} sm={6} md={3}>
                                <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
                                    <Typography variant="subtitle1">3rd Level Referrals</Typography>
                                    <Typography variant="h6">{referralData.level3Referrals}</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                    {referralData.referrals && referralData.referrals.length > 0 && (
  <Grid item xs={12}>
    <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mt: 4 }}>
      1st Level Referrals
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'text.secondary' }}>Date</TableCell>
            <TableCell sx={{ color: 'text.secondary' }}>Time</TableCell>
            <TableCell sx={{ color: 'text.secondary' }}>User Name</TableCell>
            <TableCell sx={{ color: 'text.secondary' }}>Date of Birth</TableCell>
            <TableCell sx={{ color: 'text.secondary' }}>Gender</TableCell>
            <TableCell sx={{ color: 'text.secondary' }}>Bonus</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {referralData.referrals.map((referral, index) => {
            const formattedDate = formatDate(referral.timestamp);
            const formattedTime = formatTime(referral.timestamp);
            return (
              <TableRow key={index}>
                <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{formattedDate}</TableCell>
                <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{formattedTime}</TableCell>
                <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{referral.username}</TableCell>
                <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{formatDate(referral.dob)}</TableCell>
                <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{referral.gender === 0 ? 'Female' : 'Male'}</TableCell>
                <TableCell sx={{ color: 'text.primary', borderBottom: 'none' }}>{referral.bonus}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </Grid>
)}

                </Grid>
            </Container>
        </Box>
    );
}

export default ReferralLinkButton;
