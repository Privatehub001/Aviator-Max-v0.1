import React, { useState, useEffect } from "react";
import PaymentButton from "./payment/deposit";
import { useSelector } from "react-redux";
import ReferralLinkButton from "./referrer";
import UserInfo from "./personalInfo";
import Withdraw from "./payment/withdraw";
import UserBets from "./userBets";
import Overview from "./overview";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import './Dashboard.css';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PendingTransactions from './payment/pendingTransaction';
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff9800',
        },
        secondary: {
            main: '#ffffff',
        },
        background: {
            default: '#121212',
            paper: '#1c1c1c',
        },
        text: {
            primary: '#c6c6c6',
            secondary: '#ff9800',
        },
    },
    typography: {
        h4: {
            fontWeight: 700,
            color: '#ff9800',
        },
        h5: {
            fontWeight: 500,
            color: '#c6c6c6',
        },
        body1: {
            color: '#c6c6c6',
        },
        subtitle1: {
            fontWeight: 700,
            color: '#ff9800',
        },
        subtitle2: {
            fontWeight: 500,
            color: '#c6c6c6',
        },
    },
});

const Dashboard = ({ socket, setMenuOpen, menuOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const refId = useSelector(state => state.aviatordata.userInfo.referral_id);
    const userId = useSelector(state => state.aviatordata.userId);
    const [selectedMenu, setSelectedMenu] = useState("Overview");
    const [isAdmin, setIsAdmin] = useState(false);
    const [userTransactions, setUserTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [open, setOpen] = useState(false);
    const isMobile = window.innerWidth <= 1000;


    useEffect(() => {
      if (location.state && location.state.paymentSuccess) {
        setSelectedMenu("Overview");
        setOpen(true);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }, [location.state]);

    const menuItems = [
        { name: "Overview", icon: <HomeIcon />, short: "Home" },
        { name: "Deposit", icon: <AccountBalanceWalletIcon />, short: "Deposit" },
        { name: "Withdrawal", icon: <LocalAtmIcon />, short: "Withdraw" },
        { name: "Game History", icon: <HistoryIcon />, short: "History" },
        { name: "Personal Information", icon: <PersonIcon />, short: "Profile" },
        { name: "Referral", icon: <GroupAddIcon />, short: "Referral" },
        { name: "Contact Us", icon: <ContactMailIcon />, short: "Contact Us" },
        isAdmin && { name: "Pending Transactions", icon: <ContactMailIcon />, short: "Pending Tx" },
    ];

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await axios.post('https://seal-app-ugskj.ondigitalocean.app/get-pending', { userId });

                if (response.data.success) {
                    setIsAdmin(true);
                    setTransactions(response.data.transactions);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                setIsAdmin(false);
            }
        };
        const fetchBalance = async () => {
            try {
              const response = await fetch(`https://seal-app-ugskj.ondigitalocean.app/get-balance?userId=${userId}`);
              const data = await response.json();
              if (data.success) {
                setBalance(data.user);
              } else {
                setBalance(0);
              }
            } catch (error) {
            
            }
          };
          const fetchTransactions = async () => {
            try {
              const response = await fetch(`https://seal-app-ugskj.ondigitalocean.app/get-transaction?userId=${userId}`);
              const data = await response.json();
              if (data.success) {
                setUserTransactions(data.transactions);
              } else {
                setUserTransactions([]);
              }
            } catch (error) {
            
            } finally {
              setLoading(false);
            }
          };
        fetchBalance();
        fetchTransactions();
        checkAdminStatus();
    }, [userId]);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return {
          date: date.toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          time: date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          }),
        };
      };

      
    useEffect(() => {
        if (isMobile) {
            const preventBackNavigation = () => {
                window.history.pushState(null, null, window.location.href);
            };
            window.history.pushState(null, null, window.location.href);
            window.addEventListener('popstate', preventBackNavigation);
            return () => {
                window.removeEventListener('popstate', preventBackNavigation);
            };
        }
    }, [isMobile]);

    const tableStyles = {
        width: '100%',
        backgroundColor: 'background.paper',
      };
    const renderContent = () => {
        switch (selectedMenu) {
            case "Overview":
                return <Overview socket={socket} balance={balance} loading={loading}/>;
            case "Deposit":
                return <PaymentButton balance={balance} transactions={userTransactions} tableStyles={tableStyles} loading={loading} formatDateTime={formatDateTime}/>;
            case "Withdrawal":
                return <Withdraw balance={balance} transactions={userTransactions} tableStyles={tableStyles} loading={loading} formatDateTime={formatDateTime}/>;
            case "Game History":
                return <UserBets />;
            case "Personal Information":
                return <UserInfo />;
            case "Referral":
                return <ReferralLinkButton refId={refId} userId={userId} />;
            case "Contact Us":
                return <div>Contact Us Section</div>;
            case "Pending Transactions":
                return <PendingTransactions transactions={transactions} setTransactions={setTransactions} />;
            default:
                return <Overview socket={socket} />;
        }
    };

    return (
        <div className="menu-container">
            <div className={`bottom-menu ${menuOpen ? "open" : ""}`}>
                {menuItems.map((item) => (
                    <div
                        key={item.name}
                        className={selectedMenu === item.name ? "active" : ""}
                        onClick={() => {
                            setSelectedMenu(item.name);
                            setMenuOpen(false);
                        }}
                    >
                        {isMobile ? (
                            <>
                                {item.icon} &nbsp; {item.short}
                            </>
                        ) : (
                            item.name
                        )}
                    </div>
                ))}
            </div>
            <div className="menu-options">
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {renderContent()}
                </ThemeProvider>
            </div>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#fff',
                        backgroundColor: '#4caf50',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    Deposit Successful!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Dashboard;
