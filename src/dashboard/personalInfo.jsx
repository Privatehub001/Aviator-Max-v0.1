import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Box, Grid, Typography } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import ResetPassword from './resetPassword';
const UserInfo = () => {
    const userInfo = useSelector(state => state.aviatordata.userInfo);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container maxWidth="md" sx={{ marginTop: isMobile ? '0rem' : '2rem', padding: isMobile ? '0rem' : '2rem' }}>
             <Typography variant={isMobile ? 'h6' : 'h5'} align="center" sx={{ marginBottom: '1rem',marginTop:'2vh' }}>
                User Details
            </Typography>
            <Grid container spacing={isMobile ? 2 : 4} alignItems="center" sx={{marginLeft:isMobile?'0px':'60px'}}>
                <Grid item xs={isMobile?6:12} sm={6}>
                    <Box display="flex" alignItems="center" sx={{ flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
                        <PhoneIcon fontSize={isMobile ? 'large' : 'medium'} sx={{ color: 'orange' }} />
                        <Box sx={{ marginLeft: isMobile ? 0 : '1rem', marginTop: isMobile ? '0.5rem' : 0 }}>
                            <Typography variant="body1">Phone Number</Typography>
                            <Typography variant="subtitle2">{userInfo.phone}</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={isMobile?6:12} sm={6}>
                    <Box display="flex" alignItems="center" sx={{ flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
                        <EmailIcon fontSize={isMobile ? 'large' : 'medium'} sx={{ color: 'orange' }} />
                        <Box sx={{ marginLeft: isMobile ? 0 : '1rem', marginTop: isMobile ? '0.5rem' : 0 }}>
                            <Typography variant="body1">Email Address</Typography>
                            <Typography variant="subtitle2">{userInfo.email}</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={isMobile?6:12} sm={6}>
                    <Box display="flex" alignItems="center" sx={{ flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
                        <CakeIcon fontSize={isMobile ? 'large' : 'medium'} sx={{ color: 'orange' }} />
                        <Box sx={{ marginLeft: isMobile ? 0 : '1rem', marginTop: isMobile ? '0.5rem' : 0 }}>
                            <Typography variant="body1">Date of Birth</Typography>
                            <Typography variant="subtitle2">{userInfo.dob}</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={isMobile?6:12} sm={6}>
                    <Box display="flex" alignItems="center" sx={{ flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
                        <PersonIcon fontSize={isMobile ? 'large' : 'medium'} sx={{ color: 'orange' }} />
                        <Box sx={{ marginLeft: isMobile ? 0 : '1rem', marginTop: isMobile ? '0.5rem' : 0 }}>
                            <Typography variant="body1">Full Name</Typography>
                            <Typography variant="subtitle2">{userInfo.name}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <ResetPassword/>
        </Container>
    );
};

export default UserInfo;
