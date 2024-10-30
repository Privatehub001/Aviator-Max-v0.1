import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import App from './App';
import SignUpForm from './profile/signup';
import LoginForm from './profile/login';
import Header from './header';
import ForgetPassword from './profile/forgetPassword';
import { FaShareAlt, FaCloud, FaLock, FaTrash, FaBuilding } from 'react-icons/fa';
import Dashboard from './dashboard/dashboard';
import PaymentButton from './dashboard/payment/deposit';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarIcon from '@mui/icons-material/Star';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
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
          marginBottom: '15px',
          marginTop: '10px', 
        }}>Install</button>

<div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 0',
        color: '#0b8043',
        fontSize: '14px',
      }}
    >
      {/* Share */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '0 15px',
        }}
      >
        <ShareIcon style={{ fontSize: '20px', color: '#0b8043', marginRight: '5px' }} />
        <span>Share</span>
      </div>

      {/* Add to Wishlist */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '0 15px',
        }}
      >
        <BookmarkAddIcon style={{ fontSize: '20px', color: '#0b8043', marginRight: '5px' }} />
        <span>Add to wishlist</span>
      </div>
    </div>

    <div style={{ overflowX: 'auto', display: 'flex', padding: '20px 0' }}>
      <img
        src="/Feature1.png"
        alt="Feature 1"
        style={{
          width: '300px',
          height: '200px',
          borderRadius: '15px',
          marginRight: '15px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          objectFit: 'cover',
        }}
      />
      <img
        src="/Feature2.png"
        alt="Feature 2"
        style={{
          width: '300px',
          height: '200px',
          borderRadius: '15px',
          marginRight: '15px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          objectFit: 'cover',
        }}
      />
      <img
        src="/Feature3.png"
        alt="Feature 3"
        style={{
          width: '400px',
          height: '200px',
          borderRadius: '15px',
          marginRight: '15px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          objectFit: 'cover',
        }}
      />
      <img
        src="/Feature4.png"
        alt="Feature 4"
        style={{
          width: '400px',
          height: '200px',
          borderRadius: '15px',
          marginRight: '15px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          objectFit: 'cover',
        }}
      />
      <img
        src="/Feature5.png"
        alt="Feature 5"
        style={{
          width: '400px',
          height: '200px',
          borderRadius: '15px',
          marginRight: '15px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          objectFit: 'cover',
        }}
      />
    </div>

    <div style={{ padding: '10px', marginTop: '10px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      {/* About this app Section */}
      <div style={{ paddingBottom: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>About this app</h2>
          <span style={{ fontSize: '30px', cursor: 'pointer', display: 'flex', alignItems: 'top' }}>→</span>
        </div>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
        🎉 Welcome to Sky Sprint — Your Gaming Paradise! 🎉</p>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
Sky Sprint is a unique and exciting gaming app, allowing you to enjoy the fun of the casino without spending one cent.
</p>
<p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
🌟 Game Features 🌟
</p>
<p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
🎰 Unlimited Roulette Fun: Experience the classic roulette game and enjoy winning points!
🏆 Competition and Challenges: Engage in diverse gaming challenges and compete with players...
        </p>
        
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
          <strong>Updated on</strong><br />
          Oct 25, 2024
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{
            display: 'inline-block',
            padding: '5px 10px',
            fontSize: '14px',
            color: '#333',
            backgroundColor: '#f1f1f1',
            borderRadius: '30px',
          }}>
            #3 Topfree Casino apps
          </span>
          <span style={{
            display: 'inline-block',
            padding: '5px 10px',
            fontSize: '14px',
            color: '#333',
            backgroundColor: '#f1f1f1',
            borderRadius: '15px'
          }}>
            Aviator
          </span>
        </div>
      </div>

      {/* Data safety Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>Data safety</h2>
        <span style={{ fontSize: '30px', cursor: 'pointer' }}>→</span>
      </div>
      <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginTop: '10px' }}>
        Safety starts with understanding how developers collect and share your data. Data privacy and security practices
        may vary based on your use, region, and age. The developer provided this information and may update it over time.
      </p>
    </div>

    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#333', padding: '20px' }}>
      {/* Data Safety Box */}
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <FaShareAlt style={{ fontSize: '18px', marginRight: '10px', color: '#555' }} />
          <span>No data shared with third parties</span>
          <a href="#" style={{ marginLeft: '10px', fontSize: '12px', color: '#4285F4', textDecoration: 'none' }}>
            Learn more
          </a>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <FaCloud style={{ fontSize: '18px', marginRight: '10px', color: '#555' }} />
          <span>This app may collect these data types</span>
          <span style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>Location, Personal info and 7 others</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <FaLock style={{ fontSize: '18px', marginRight: '10px', color: '#555' }} />
          <span>Data is encrypted in transit</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <FaTrash style={{ fontSize: '18px', marginRight: '10px', color: '#555' }} />
          <span>You can request that data be deleted</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <FaBuilding style={{ fontSize: '18px', marginRight: '10px', color: '#555' }} />
          <span>UPI payments verified</span>
        </div>
        
        <a href="#" style={{ color: '#4285F4', textDecoration: 'none', fontWeight: 'bold' }}>See details</a>
      </div>

      {/* Ratings and Reviews Section */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Ratings and reviews</h2>
        <span style={{ fontSize: '14px', color: '#4285F4', cursor: 'pointer' }}>→</span>
      </div>
      <p style={{ fontSize: '12px', color: '#666' }}>Ratings and reviews are verified <span style={{ fontSize: '12px', color: '#999' }}>ⓘ</span></p>

      {/* Device Options */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button style={{ padding: '5px 10px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: '#E6F4EA', color: '#000' }}>
          📱 Phone
        </button>
        <button style={{ padding: '5px 10px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#000' }}>
          📺 TV
        </button>
        <button style={{ padding: '5px 10px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#000' }}>
          📚 Tablet
        </button>
      </div>
    </div>

    <div style={{ padding: '10px', fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#666' }}>
      {/* Main Footer Links */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '20px' }}>
        {/* Column 1 */}
        <div style={{ minWidth: '150px', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Google Play</h3>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>Play Pass</li>
            <li style={{ marginBottom: '8px' }}>Play Points</li>
            <li style={{ marginBottom: '8px' }}>Gift cards</li>
            <li style={{ marginBottom: '8px' }}>Redeem</li>
            <li style={{ marginBottom: '8px' }}>Refund policy</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div style={{ minWidth: '150px', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Kids & family</h3>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>Parent Guide</li>
            <li style={{ marginBottom: '8px' }}>Family sharing</li>
          </ul>
        </div>
      </div>

      {/* Bottom Links */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
        {/* Terms and Links */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <span>Terms of Service</span>
          <span>Privacy</span>
          <span>About Google Play</span>
          <span>Developers</span>
          <span>Google Store</span>
        </div>
        
        {/* Country and Language */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
          <span>All prices include GST.</span>
          <span role="img" aria-label="India Flag" style={{ fontSize: '20px' }}>🇮🇳</span>
          <span>India (English)</span>
        </div>
      </div>
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
