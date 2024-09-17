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
        <p>You have the Aviator app installed! Please open it to access.</p>
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
        <p>You have the Aviator app installed! Please open it to access gameplay.</p>

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
          To install the Aviator app, tap the share icon <span>🔗</span> in Safari and select "Add to Home Screen."
        </p>
      </div>
    );
  }

  if (window.innerWidth < 1000 && !isInstalled && !isStandalone && showInstallButton) {
    return (
      <div className='add-button'>
        <p>Please add this app to your home screen to continue.</p>
        <button className='add-to-home-screen-btn' onClick={handleInstall}>Add to Home Screen</button>
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
