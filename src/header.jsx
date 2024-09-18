import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setClearAppDataAct } from "./store/appdata/appdataslicer";
import { useNavigate, useLocation } from 'react-router-dom';
import "./_header.scss";
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuIcon from '@mui/icons-material/Menu'; 

export default function Header({ socket, balance, setBalance, isStandalone, isInstalled, toggleMenu}) {
    const hideBalanceOnPaths = ['/login', '/signup', '/recoveraccount'];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isSignedIn = useSelector(state => state.aviatordata.isSignedIn);

    const handleLogout = () => {
        setBalance(1000);
        dispatch(setClearAppDataAct());
        localStorage.removeItem('aviatorState');
        if (!isStandalone || !isInstalled) {
            navigate('/login');
        }else {
            navigate('/');
        }
    };

    const shouldHideBalance = hideBalanceOnPaths.includes(location.pathname);
    const handleNavigation = (path) => {
        if (location.pathname !== path) {
            navigate(path);
        }
    };
    
    const isSmallScreen = window.innerWidth <= 1000; // Check for small screen
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/recoveraccount'; // Check for auth pages

    return (
        <div className="header-container-desktop">
            <div style={{display:'flex'}}>
            {isSmallScreen && location.pathname !== "/" && (
                <div className="menu-icon" onClick={toggleMenu}>
                    <MenuIcon />
                </div>
            )}
             <div onClick={() => {
                if (window.innerWidth > 1000) {
                    handleNavigation('/');
                }
            }} className="aviator">Aviator <span className="max">Max</span></div>
            </div>

            {(location.pathname !== '/' && location.pathname !== '/deposit' && isSmallScreen) && (
                <button onClick={() => handleNavigation('/')}
                style={{
                    backgroundColor: 'rgb(2, 156, 218)',
                    color: 'white',   
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    marginLeft: '4px',
                    width: 'auto',
                    fontSize: '12',
                    fontweight: 'bold',
                    padding: '5px 6px'
                  }}>Play Game</button>
            )}
            {isSignedIn ? (
                <div className="link">
                    <span className="balanceView">Coins : <span style={{ color: 'orange' }}>{parseFloat(balance).toFixed(2)}</span></span>
                    {((location.pathname !== '/dashboard' && location.pathname !== '/deposit') || window.innerWidth >= 1000) && (
                        <>
                            <button onClick={() => handleNavigation('/deposit')} className="login-button">Deposit</button>
                    <button onClick={() => handleNavigation('/dashboard')} className="dbutton">Dashboard</button>
                    
                    <button onClick={handleLogout} className="signup-button">Logout</button>
                    </>
                    )}
                </div>
            ) :  (
                <div style={{ display: 'flex', height: 'min-content' }}>
                    {/* Hide buttons on small screens when on login or signup pages */}
                    {!isSmallScreen || !isAuthPage ? (
                        <>
                            {!shouldHideBalance && (
                        <span className="balanceView" style={{ display: 'flex', alignItems: 'center' }}>
                        Coins :<span style={{ color: 'orange', marginLeft: '8px' }}>{parseFloat(balance).toFixed(2)}</span>
                        <span className="refresh" style={{ marginRight: '8px' }}>
                        <RefreshIcon onClick={() => setBalance(1000)} sx={{ cursor: 'pointer' }} />
                            </span>
                        </span>
                )}
                    <button onClick={() => handleNavigation('/login')} className="login-button">Login</button>
                    <button onClick={() => handleNavigation('/signup')} className="signup-button">Sign Up</button>
                    </>
                    ) : null}
                </div>
            )}
        </div>
    );
};
