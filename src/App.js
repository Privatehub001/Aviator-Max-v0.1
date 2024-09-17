import { useState, useEffect } from 'react';
import Game from './game/game';
import AllBets from './data/allBets';
import './App.css';
import { useDispatch } from 'react-redux';
import { getjumptexture, getruntexture, getlandtexture } from "./store/appdata/textureDataThunk";

function App({ socket, isSignedIn, userid, balance, setBalance, userCountryCode }) {
  const dispatch = useDispatch();
  const [state, setState] = useState(0);
  const [runArray, setRunArray] = useState([]);
  const [jumpArray, setJumpArray] = useState([]);
  const [landArray, setLandArray] = useState([]);
  const [bets, setBets] = useState([]);
  const [roundstarted, setroundstarted] = useState(false);
  const [win, setWin] = useState(0);
  const [bet, setBet] = useState(0);
  const [betEnded, setbetEnded] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const state = JSON.parse(event.data);
        if (state.type === 'newRoundstarted') {
          setroundstarted(true);
        }
        if (state.success && state.newBalance) {
          setBalance(state.newBalance);
        }
        else if (state.type === 'betsUpdate') {
          setBets(state.bets);
        }
        else if (state.type === 'historyandtopmulti') {
          setHistory(state)
        }
        else if (state.type === 'betEnded') {
          setbetEnded(true);
        }
        else if (state.userCount) {
          setState(state);
        }
      };
    }
  }, []);
  
  useEffect(() => {
    try {
      setJumpArray(getjumptexture());
      setLandArray(getlandtexture());
      setRunArray(getruntexture());
    } catch (error) {

    }
  }, [dispatch]);

  return (
    <div>
      <div className='app'>
        <AllBets userCount={state.userCount} bets={bets} history={history} />
        <div>
          {socket ?
            <Game socket={socket} state={state} runArray={runArray} userCountryCode={userCountryCode} landArray={landArray} history={history.history} jumpArray={jumpArray} userId={userid} win={win} isSignedIn={isSignedIn}
              betEnded={betEnded} setbetEnded={setbetEnded} roundstarted={roundstarted} setroundstarted={setroundstarted} setBalance={setBalance} setWin={setWin} setBet={setBet} balance={balance} />
            :
            <div>Connecting...</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
