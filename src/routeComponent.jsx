import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import App from './App';
import SignUpForm from './profile/signup';
import LoginForm from './profile/login';
import Header from './header';
import ForgetPassword from './profile/forgetPassword';
import Dashboard from './dashboard/dashboard';
import PaymentButton from './dashboard/payment/deposit';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@mui/material'; // Material UI icon component
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';

function RoutesComponent({ id, socket }) {
  const isSignedIn = useSelector((state) => state.aviatordata.isSignedIn);
  const userid = useSelector((state) => state.aviatordata.userId);
  const userInfo = useSelector((state) => state.aviatordata.userInfo);

  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [balance, setBalance] = useState(isSignedIn ? 0 : 1000);
  const [downloading, setDownloading] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(true);
  const [isAviatorInstalled, setIsAviatorInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); 
};

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);

    setIsIOS(isIosDevice);
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);

    if (isStandalone) {
      setIsInstalled(true);
    } else {
      checkInstalledApps();
    }

    if (isSignedIn) fetchBalance();

    if (!isIosDevice) {
      const handleBeforeInstallPrompt = (event) => {
        event.preventDefault();
        setDeferredPrompt(event);
        setShowInstallButton(true);
      };

      const handleAppInstalled = () => {
        console.log('App installed');
        setDownloading(false);
        setIsInstalled(true);
        setShowInstallButton(false);
        setIsAviatorInstalled(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, [isStandalone, isSignedIn]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement&&location.pathname==='/'&&location.pathname!=='/dashboard') {
        setIsFullScreen(false);
      }
    };

    if (!isFullScreen && isStandalone) {
      handleFullScreenAndOrientation();
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const requestFullScreen = async () => {
    let element = document.documentElement;
    let requestMethod =
      element.requestFullscreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullScreen;

    if (requestMethod) {
      await requestMethod.call(element);
      return true;
    }

    console.log("Fullscreen API not supported");
    return false;
  };

  const lockOrientation = async (orientation = 'landscape') => {
    const myScreenOrientation = window.screen.orientation;
    if (myScreenOrientation && myScreenOrientation.lock) {
      try {
        await myScreenOrientation.lock(orientation);
        console.log(`Orientation locked to ${orientation}`);
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  const handleFullScreenAndOrientation = async () => {
    try {
      const fullscreen = await requestFullScreen();
      if (fullscreen) {
        setIsFullScreen(true);
        if (location.pathname === '/') {
          await lockOrientation('landscape');
        } else {
          await lockOrientation('portrait');
        }
      }
    } catch (error) {
    }
  };

  const handleClick = () => {
    handleFullScreenAndOrientation();
  };

  useEffect(() => {
    if (!document.fullscreenElement&&location.pathname==='/'&&location.pathname!=='/dashboard') {
      setIsFullScreen(false);
    }
    if (isFullScreen && isStandalone) {
      if (location.pathname === '/') {
        lockOrientation('landscape');
      } else {
        lockOrientation('portrait');
      }
    }
    if(isSignedIn)
    fetchBalance();
  }, [location.pathname]);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`https://seal-app-ugskj.ondigitalocean.app/get-balance?userId=${userid}`);
      const data = await response.json();
      if (data.success) {
        setBalance(data.user.balance);
      } else {
        setBalance(0);
      }
    } catch (error) {
    }
  };

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setDownloading(true);
        }
        setDeferredPrompt(null);
      });
    } 
  };

  const handleOpenApp = () => {
    const pwaUrl = window.location.origin;
    window.location.href = pwaUrl;
  };

  const getCountryCode = (phoneNumber) => {
    if (phoneNumber && phoneNumber.startsWith('+')) {
      const match = phoneNumber.match(/^\+(\d+)/);
      return match ? `+${match[1].slice(0, 2)}` : '';
    }
    return '';
  };

  const checkInstalledApps = async () => {
    if ('getInstalledRelatedApps' in window.navigator) {
      const relatedApps = await navigator.getInstalledRelatedApps();
      relatedApps.forEach((app) => {
        if (app.url.includes('game-seven-taupe.vercel.app')) {
          setDownloading(false);
          setIsAviatorInstalled(true);
          setIsInstalled(true);
        }
      });
    }

    setTimeout(async () => {
      const relatedApps = await navigator.getInstalledRelatedApps();
      relatedApps.forEach((app) => {
        if (app.url.includes('game-seven-taupe.vercel.app')) {
          setDownloading(false);
          setIsAviatorInstalled(true);
          setIsInstalled(true);
        }
      });
    }, 3000);
  };

  const userCountryCode = isSignedIn ? getCountryCode(userInfo.phone) : '+91';

  if (isAviatorInstalled && !isStandalone && isSignedIn) {
    return (
      <div className='add-button' style={{ padding: '10px', backgroundColor: '#333', color: '#fff', textAlign: 'center' }}>
        <p>You have the Sky Sprint app installed! Please open it to access.</p>
      </div>
    );
  }
  if (isAviatorInstalled && !isStandalone && !isSignedIn && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/recoveraccount') {
    const handleNavigation = (path) => {
      if (location.pathname !== path) {
        navigate(path);
      }
    };
    return (
      <div className='add-button' style={{ color: '#fff', textAlign: 'center' }}>
        <p>Sky Sprint icon added on your homescreen ! Please open it to access gameplay.</p>

        <div style={{ display: 'flex', height: 'min-content', justifyContent: 'center' }}>
          <button onClick={() => handleNavigation('/login')} className="login-button">Login</button>
          <button onClick={() => handleNavigation('/signup')} className="signup-button">Sign Up</button>
        </div>
      </div>
    );
  }
  if (downloading) {
    return (
      <div style={{ padding: '10px', backgroundColor: '#333', color: '#fff', textAlign: 'center' }}>
        <p>Downloading...</p>
      </div>
    );
  }

  if (isStandalone && !isFullScreen && location.pathname === '/') {
    return (
      <div className='add-button'>
        <p>Please enter full screen mode to continue.</p>
        <button className='add-to-home-screen-btn' onClick={handleClick}>Enter Full Screen</button>
      </div>
    );
  }

  if (isIOS && !isStandalone) {
    return (
      <div className='add-button' style={{ color: '#fff', textAlign: 'center' }}>
        <p>
          To install the Sky Sprint app, tap the share icon <span>🔗</span> in Safari and select "Add to Home Screen."
        </p>
      </div>
    );
  }

  if (window.innerWidth < 1000 && !isInstalled && !isStandalone && showInstallButton) {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '30px',
      padding: '10px 16px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }}>
        {/* Left Side: Logo and Text */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="Google_play_icon.png" alt="Google Play Logo" style={{ width: '30px', marginRight: '8px' }} />
        <p style={{ margin: 0, fontSize: '20px', color: '#333', fontWeight: 'bold' }}>Google Play</p>
      </div>

      {/* Right Side: Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="https://google.com" target="_blank" rel="noopener noreferrer">
          <SearchIcon style={{ color: '#333',fontSize: '24px' }} />
        </a>
        <a href="https://google.com" target="_blank" rel="noopener noreferrer">
          <HelpOutlineIcon style={{ color: '#333',fontSize: '24px' }} />
        </a>
        <a href="https://google.com" target="_blank" rel="noopener noreferrer">
          <AccountCircleIcon style={{ color: '#333',fontSize: '40px' }} />
        </a>
      </div>
    </div>

      {/* Page Content */}
      <div style={{ padding: '20px' }}>
        {/* App Info */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginTop: '70px' }}>
          <img src="logo512.png" alt="App Icon" style={{ width: '70px', height: '70px', marginRight: '10px' }} />
          <div>
            <h2 style={{ margin: '10px', fontSize: '20px',fontWeight: '600' }}>Sky Sprint - Live Casino, Crash, Aviator</h2>
            <p style={{ margin: '10px',fontSize: '16px', color: '#01875f', fontWeight: '500' }}>PariMatch</p>
            <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#666' }}>
            </div>
          </div>
        </div>

        <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 0',
        marginBottom: '10px',
        marginTop: '10px',
        marginLeft: '0px',
      }}
    >
      {/* Reviews */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 15px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          4.7
          <StarIcon style={{ fontSize: '16px', color: '#fbc02d', marginLeft: '4px' }} />
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>1K reviews</div>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', backgroundColor: '#e0e0e0' }}></div>

      {/* Downloads */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 15px',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>100K+</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Downloads</div>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', backgroundColor: '#e0e0e0' }}></div>

      {/* Rating */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 15px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            display: 'inline-block',
            padding: '2px 4px',
            border: '0.5px solid #333',
            borderRadius: '4px',
          }}
        >
          12+
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            marginTop: '5px',
          }}
        >
          Rated for 12+
          <InfoIcon style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }} />
        </div>
      </div>
    </div>

        

        {/* Install Button */}
        <button style={{ 
          backgroundColor: '#01875f', 
          color: '#fff', 
          padding: '9px', 
          borderRadius: '4px', 
          border: 'none', 
          fontSize: '13px', 
          fontWeight: '500',
          width: '100%', 
          marginBottom: '20px',
          marginTop: '10px', 
        }}>Install</button>

        {/* Share and Wishlist */}
        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '14px', color: '#555', marginBottom: '10px', alignItems: 'center' }}>
        <InfoIcon style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }} />
        <span>Share</span>
          <span>Add to wishlist</span>
        </div>

        {/* Images */}
        <div style={{ marginTop: '10px' }}>
          <img src="app_screenshot1.jpg" alt="App Screenshot" style={{ width: '100%', borderRadius: '4px' }} />
          <img src="app_screenshot2.jpg" alt="App Screenshot" style={{ width: '100%', borderRadius: '4px', marginTop: '10px' }} />
        </div>

        {/* About Section */}
        <div style={{ marginTop: '20px' }}>
          <h3>About this app</h3>
          <p>🎉 Welcome to 909U — Your Gaming Paradise! 🎉</p>
          <p>909U is a unique and exciting gaming app, allowing you to enjoy the fun of the casino without spending one cent.</p>
          <h4>🌟 Game Features 🌟</h4>
          <ul>
            <li>Unlimited Roulette Fun</li>
            <li>Competition and Challenges</li>
          </ul>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '20px' }}>
          <span style={{ backgroundColor: '#e0e0e0', padding: '5px', borderRadius: '4px' }}>Casino</span>
          <span style={{ backgroundColor: '#e0e0e0', padding: '5px', borderRadius: '4px' }}>Slot Machine</span>
          <span style={{ backgroundColor: '#e0e0e0', padding: '5px', borderRadius: '4px' }}>Game</span>
        </div>

        {/* Data Safety */}
        <div style={{ marginTop: '20px' }}>
          <h3>Data safety</h3>
          <p>Safety starts with understanding how developers collect and share your data.</p>
        </div>
      </div>

      {/* Fixed Bottom Menu */}
      <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: '#ffffff',
      boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 10,
      fontSize: '12px',
      color: '#555'
    }}>
      {/* Games */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#555' }}>
        <Icon>sports_esports</Icon>
        <span>Games</span>
      </div>

      {/* Apps */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#4caf50' }}>
        <Icon>apps</Icon>
        <span>Apps</span>
      </div>

      {/* Movies */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#555' }}>
        <Icon>movie</Icon>
        <span>Movies</span>
      </div>

      {/* Books */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#555' }}>
        <Icon>menu_book</Icon>
        <span>Books</span>
      </div>

      {/* Kids */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#555' }}>
        <Icon>star_border</Icon>
        <span>Kids</span>
      </div>
    </div>
    </div>
    );
  }

  return (
    <div>
      <Header socket={socket} balance={balance} setBalance={setBalance} isStandalone={isStandalone} isInstalled={isInstalled} toggleMenu={toggleMenu} />
      <Routes>
        {!isSignedIn && (
          <>
            <Route path="login" element={<LoginForm socket={socket} />} />
            <Route path="recoveraccount" element={<ForgetPassword socket={socket} />} />
            <Route path="signup" element={<SignUpForm socket={socket} />} />
            <Route path="ref/:refID" element={<SignUpForm socket={socket} />} />
            <Route path="/" element={<App socket={socket} isSignedIn={isSignedIn} userCountryCode={userCountryCode} balance={balance} setBalance={setBalance} userid={isSignedIn ? userid : id} />} />
          </>
        )}
        {isSignedIn && (
          <Route path="/" element={<App socket={socket} userCountryCode={userCountryCode} isSignedIn={isSignedIn} balance={balance} setBalance={setBalance} userid={userid} />} />
        )}
        <Route path="/dashboard" element={<Dashboard socket={socket} toggleMenu={toggleMenu} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />} />
        <Route path="deposit" element={<PaymentButton socket={socket} userCountryCode={userCountryCode} />} />
      </Routes>
    </div>
  );
}

export default RoutesComponent;
