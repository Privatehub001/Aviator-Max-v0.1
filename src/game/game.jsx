import { Stage, AppConsumer } from '@pixi/react';
import React, { useState, useEffect } from 'react';
import { Icon, Switch, Snackbar, Alert } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Background from './background';
import { useSelector } from 'react-redux';
import Character from './character';
import Count from './count';
import Loader from './loader';
import { useLocation, useNavigate } from 'react-router-dom';
import Multipliers from './historymulti';
import { ChevronLeft } from '@mui/icons-material';
import { ChevronRight } from '@mui/icons-material';
import './Game.css'; 

function Game({ socket, setbetEnded, state, betEnded, history, jumpArray, win, runArray, landArray, userId, userCountryCode, roundstarted, setroundstarted, balance, isSignedIn, setBalance, setWin, setBet }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [cashoutAmount, setCashoutAmount] = useState(1.20);
  const [autoBet, setAutoBet] = useState(false);
  const [autoCashout, setAutoCashout] = useState(false);
  const [betPlaced, setBetPlaced] = useState(false);
  const [betPlacedNext, setBetPlacedNext] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: Math.min(700, window.innerWidth),
    height: Math.min(450, window.innerHeight),
  });
  const [betAmount, setBetAmount] = useState(userCountryCode == '+91' ? 1 : 1);
  const [cashoutVisible, setCashoutVisible] = useState(true); 
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (location.state && location.state.paymentSuccess) {
      setOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  useEffect(() => {
    const handleResize = () => {
      const targetWidth = window.innerWidth;
      const targetHeight = window.innerHeight;
      const aspectRatio = 7 / 4;

      if (targetWidth < targetHeight * aspectRatio) {
        setWindowSize({
          width: targetWidth,
          height: targetWidth / aspectRatio,
        });
      } else {
        setWindowSize({
          width: targetHeight * aspectRatio,
          height: targetHeight,
        });
      }
      if(window.innerWidth > 1000) {
        setCashoutVisible(true)
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (roundstarted) {
      setbetEnded(false);
      setBetPlaced(false);
      if (betPlacedNext) {
        // placeBet();
        setBetPlaced(true);
        setBetPlacedNext(false);
      }
      else if (autoBet && !betPlacedNext) {
        placeBet();
      }
      setroundstarted(false);
    }

    if (betEnded && !betPlacedNext) {
      finalizeBets();
    }

  }, [roundstarted, betEnded, betPlacedNext, betPlaced]);

  useEffect(() => {
    if (autoCashout && parseFloat(cashoutAmount) > 0 && state.count.toFixed(2) == parseFloat(cashoutAmount).toFixed(2) && betPlaced && !state.wait && !betEnded) {
      cashout(state.count.toFixed(2) * betAmount);
    }
  }, [state.count, autoCashout, betPlaced]);

  const placeBet = () => {
    if (betAmount > 0 && betAmount <= balance) {
      setBet(betAmount);
      if (isSignedIn) {
        updateBalance(betAmount, false);
      } else {
        setBalance(balance - parseFloat(betAmount));
      }

      const betData = {
        type: 'bet',
        user: userId,
        bet: betAmount,
        multi: '..',
        win: 0,
        isSignedIn,
      };

      setBetPlaced(true);
      storeBet('..', 0, true);
      socket.send(JSON.stringify(betData));
    }
  };

  const cashout = (amount) => {
    if (amount > 0) {
      setBet(betAmount);
      if (isSignedIn) {
        const cashoutData = {
          type: 'cashout',
          data: {
            userId: userId,
            amount: parseFloat(amount).toFixed(2),
            isSignedIn,
          },
        };
        socket.send(JSON.stringify(cashoutData));
      } else {
        setBalance(balance + parseFloat(amount));
      }
      const betData = {
        type: 'bet',
        user: userId,
        bet: betAmount,
        multi: state.count.toFixed(2),
        win: parseFloat(amount).toFixed(2),
        isSignedIn,
      };
      setWin(win + parseFloat(amount).toFixed(2));
      setBetPlaced(false);
      if (isSignedIn)
        update_user_bets(state.roundId, betAmount, state.count, parseFloat(amount).toFixed(2));
      storeBet(state.count.toFixed(2), amount, false);
      socket.send(JSON.stringify(betData));
    }
  };

  const update_user_bets = async (gameid, amount, multi, win) => {
    await fetch('https://seal-app-ugskj.ondigitalocean.app/store-user-bet-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, gameId: gameid, stakeAmount: amount, multiplier: multi, result: win > 0 ? 'Won' : 'Lost', coin: win })
    });
  }

  const cancelBet = () => {
    setBet(0);
    if (isSignedIn) {
      updateBalance(betAmount, true);
    } else {
      setBalance(balance + parseFloat(betAmount));
    }
    const cancelBetData = { type: 'cancelBet', user: userId, isSignedIn };
    socket.send(JSON.stringify(cancelBetData));
    removeBet();
    setBetPlaced(false);
  };

  const cancelNextBet = () => {
    setBet(0);
    if (isSignedIn) {
      updateBalance(betAmount, true);
    } else {
      setBalance(balance + parseFloat(betAmount));
    }
    const cancelBetNextData = { type: 'cancelBetNext', user: userId, isSignedIn };
    socket.send(JSON.stringify(cancelBetNextData));
    removeBet();
    setBetPlacedNext(false);
  };

  const updateBalance = (amount, add) => {
    const data = {
      type: 'handleBalance',
      data: { userId, amount, add, isSignedIn },
    };
    socket.send(JSON.stringify(data));
  };
  
  const finalizeBets = () => {
    const lastBet = getBets();

    if (lastBet && lastBet.active && isSignedIn) {
      update_user_bets(state.roundId, betAmount, state.count, 0);
      lastBet.active = false;
      localStorage.setItem('bets', JSON.stringify(lastBet));
    }
  };

  const getBets = () => {if(localStorage.getItem('bets'))JSON.parse(localStorage.getItem('bets') || '')};

  const storeBet = (multi, win, active) => {
    let lastBet = getBets();

    if (lastBet && lastBet.active) {
      lastBet.bet = betAmount;
      lastBet.multi = multi;
      lastBet.win = win;
      lastBet.active = active;
    } else {
      lastBet = { user: userId, bet: betAmount, multi, win, active };
    }

    localStorage.setItem('bets', JSON.stringify(lastBet));
  };

  const removeBet = () => {
    localStorage.setItem('bets', JSON.stringify(''));
  };

  const handleBetChange = (event) => {
    const newBetAmount = Math.floor(parseFloat(event.target.value));
    if (newBetAmount < 1) {
      newBetAmount = 1;
    } else if (newBetAmount > 500) {
      newBetAmount = 500;
    }
  
    setBetAmount(newBetAmount);
  };

  const adjustBetAmount = (increment) => {
    setBetAmount((prev) => {
      let newValue = Math.floor(parseFloat(prev)) + increment; // Ensure whole number increment/decrement
  
      // Enforce the min and max limits (1 - 500)
      if (newValue < 1) {
        newValue = 1;
      } else if (newValue > 500) {
        newValue = 500;
      }
  
      return newValue; // Return the adjusted bet amount
    });
  };

  const handleCashoutChange = (event) => {
    setCashoutAmount(Math.floor(parseFloat(event.target.value))); // Cashout amount as whole number
  };

  const toggleAutoBet = () => {
    if (!autoBet && !betPlaced && !betPlacedNext && state.wait) {
      placeBet();
    } else if (!autoBet && !betPlaced && !betPlacedNext && !state.wait) {
      placeBetNext();
    }
    setAutoBet(!autoBet);
  };

  const toggleAutoCashout = () => setAutoCashout(!autoCashout);

  const adjustCashoutAmount = (increment) => {
    setCashoutAmount((prev) => {
      const newValue = parseFloat(prev) + increment;
      return newValue > 100 ? prev : newValue.toFixed(2);
    });
  };

  const toggleInteraction = betPlaced || betPlacedNext;

  const placeBetNext = () => {
    if (betAmount && betAmount > 0 && betAmount <= balance) {
      setBet(betAmount);
      if (isSignedIn) {
        updateBalance(parseFloat(betAmount), false);
      } else {
        setBalance(balance - parseFloat(betAmount));
      }
      const betData = {
        type: 'betNextRound',
        user: userId,
        bet: betAmount,
        multi: '..',
        win: 0,
        isSignedIn,
      };
      setBetPlacedNext(true);
      socket.send(JSON.stringify(betData));
    }
  };

  return (
    <div className="stage game-container">
      <Stage id="c" height={window.innerWidth < 1000 ? windowSize.height : windowSize.height * 0.7} width={window.innerWidth < 1000 ?window.innerWidth>600 ? windowSize.width*1.237: windowSize.width : windowSize.width * 0.9}>
        <AppConsumer>
          {app => (
            <>
              <Background app={app} state={state} />
              {!state.wait && <Count app={app} state={state} />}
              {runArray.length > 0 && landArray.length > 0 && jumpArray.length > 0 && (
                <Character app={app} state={state} runArray={runArray} landArray={landArray} jumpArray={jumpArray} />
              )}
              <Loader width={app.screen.width} height={app.screen.height} state={state} />
              <Multipliers history={history} app={app}/>
            </>
          )}
        </AppConsumer>
      </Stage>
      <div className="bet-cashout-container">
        <div className="bet-cashout-container-inside">
          <div className="bet-cashout-section"
            style={{ opacity: toggleInteraction ? 0.5 : 1 }}>
            <div>Minimum : 1 & Maximum :500</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', backgroundColor: 'black', borderRadius: '3vw', border: '1px solid black', alignItems: 'center' }}>
                <RemoveCircleIcon className="points" onClick={!toggleInteraction ? () => adjustBetAmount(-0.25) : undefined} />
                <input type="number" max={100} style={{ textAlign: 'center' }} value={betAmount} disabled={toggleInteraction} onChange={handleBetChange} />
                <Icon className="points" onClick={!toggleInteraction ? () => adjustBetAmount(0.25) : undefined}>add_circle</Icon>
              </div>
              <div className="button-group">
                <div className="multiplier" onClick={() => !toggleInteraction ? setBetAmount(Math.min(betAmount * 2 > 500 ? betAmount : betAmount * 2, balance)) : undefined}>2x</div>
                <div className="multiplier" onClick={() => !toggleInteraction ? setBetAmount(Math.min(betAmount * 4 > 500 ? betAmount : betAmount * 4, balance)) : undefined}>4x</div>
              </div>
              <div >
                <label className="switch-label">
                  Auto Bet
                  <Switch
                    checked={autoBet}
                    onChange={toggleAutoBet}
                    color="default"
                    size="small"
                    style={{ color: autoBet ? '#ccc' : '#242020' }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </label>
              </div>
            </div>
          </div>
          {window.innerWidth < 1000 && (
  <div className="toggle-cashout-icon" onClick={() => setCashoutVisible(!cashoutVisible)}>
    {cashoutVisible ? <ChevronLeft fontSize='small' /> : <ChevronRight fontSize='small' />}
  </div>
)}

{cashoutVisible && (
  <div className="bet-cashout-section"
  style={{ opacity: !state.wait ? 0.5 : 1 }}>
    <div>CASHOUT</div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'black', borderRadius: '3vw', border: '1px solid black' }}>
        <RemoveCircleIcon className="points" onClick={state.wait ? () => adjustCashoutAmount(-0.25) : undefined} />
        <input type="number" max={100} style={{ textAlign: 'center' }} disabled={!state.wait} value={cashoutAmount} onChange={handleCashoutChange} />
        <Icon className="points" onClick={state.wait ? () => adjustCashoutAmount(0.25) : undefined}>add_circle</Icon>
      </div>
      <div className="button-group">
        <div className="multiplier" onClick={() => state.wait ? setCashoutAmount(cashoutAmount * 2) : undefined}>2x</div>
        <div className="multiplier" onClick={() => state.wait ? setCashoutAmount(cashoutAmount * 4) : undefined}>4x</div>
      </div>
      <div>
        <label className="switch-label">
          Auto Cashout
          <Switch
            checked={autoCashout}
            onChange={toggleAutoCashout}
            color="default"
            size="small"
            style={{ color: autoCashout ? '#ccc' : '#242020' }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </label>
      </div>
    </div>
  </div>
)}
        </div>
        {state.wait ? <div className='placebet' style={{ textAlign: 'center', backgroundColor: betPlaced ? 'red' : '#fa7200' }} onClick={betPlaced ? cancelBet : placeBet}>
          {betPlaced ? 'Cancel' : 'Bet'}
        </div> :
          <div className='placebet' style={{ textAlign: 'center', backgroundColor: betPlacedNext ? 'red' : betPlaced && !betEnded ? 'green' : '#fa7200' }} onClick={() => { betPlacedNext ? cancelNextBet() : betPlaced && !betEnded ? cashout((state.count * betAmount).toFixed(2)) : placeBetNext() }}>
            {betPlacedNext ? 'Cancel' : betPlaced && !betEnded ? `Cashout ${(state.count * betAmount).toFixed(2)}` : 'Place Bet For Next Round'}</div>}
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
}

export default Game;
