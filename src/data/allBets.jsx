import React, { useMemo, useState } from 'react';
import Table from './table';
import { generateColumnsAllbets, data,generateColumnsTopMultiplier } from './helper'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import "./_allbets.scss";

function AllBets({ userCount, bets ,history}) {
    const [activeTab, setActiveTab] = useState('all-bets');
    const [visible, setVisible] = useState(window.innerWidth < 1000?false:true);
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };
    
    const columns = useMemo(
        () => generateColumnsAllbets(),
        []
    );
    const topcolumns = useMemo(
        () => generateColumnsTopMultiplier(),
        []
    );
    return (
        <>
        {window.innerWidth < 1000 &&
            <div className="chevron-container">
              {visible ? 
                <ChevronLeft className="chevron chevron-left" fontSize='large' onClick={() => setVisible(!visible)} /> : 
                <ChevronRight className="chevron chevron-right" fontSize='large' onClick={() => setVisible(!visible)} />
              }
            </div>
          }
       {visible&& <div className="col-12 col-lg-7 d-flex align-items-stretch allbets">
            <div className="list-container">
                <div className="d-flex align-items-center">
                    <div className="d-flex flex-column justify-content-center align-items-center me-2 px-2 allbetscontainer">
                        <div className='online'>
                            <div style={{ marginLeft: '1vw', marginRight: '0.5vw', display: "flex", alignItems: 'center', }}>
                                <GroupsRoundedIcon fontSize='small' /></div>
                            <div style={{ fontWeight: 'bold', fontSize: 'larger' }}>{userCount}</div>
                            <div style={{ borderRadius: '3vw', height: '0.3vw', width: '0.3vw', border: '1px solid green', marginLeft: '0.vw', backgroundColor: 'green' }}></div>
                        </div>
                        <div className='slider-container'>
                            <div className='slider'
                                style={{
                                    backgroundColor: activeTab === 'all-bets' ? 'black' : '',
                                    color: activeTab === 'all-bets' ? 'white' : ''
                                }}
                                onClick={() => handleTabClick('all-bets')}
                            >
                                All Bets
                            </div>
                            <div className='slider'
                                style={{
                                    backgroundColor: activeTab === 'my-bets' ? 'black' : '',
                                    color: activeTab === 'my-bets' ? 'white' : ''
                                }}
                                onClick={() => handleTabClick('my-bets')}
                            >
                                Top Multipliers
                            </div>
                            <div className='slider'
                                style={{
                                    backgroundColor: activeTab === 'all-wins' ? 'black' : '',
                                    color: activeTab === 'all-wins' ? 'white' : ''
                                }}
                                onClick={() => handleTabClick('all-wins')}
                            >
                                Top Wins
                            </div>
                        </div>
                        <div className='bets-data-container'>
                            {activeTab === 'all-bets' && <div><Table
                                tableClass="mb-0 font-14px"
                                columns={columns}
                                data={bets}
                            /></div>}
                            <div style={{ flexDirection: 'column' }}>
                                {activeTab === 'all-wins' && history.topwins&& history.topwins.map((bet, index) => (
                                <div key={index} className='items-container'>
                                    <div style={{ padding: '1vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ backgroundColor: 'black', borderRadius: '5vw', width: '1.5vw', height: '1.5vw', textAlign: 'center' }}>
                                            {bet.user_id&&bet.user_id.slice(0, 2)}</div>
                                        <div>{bet.user_id&&bet.user_id.slice(-2)}</div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        flexDirection: 'column'
                                    }}>
                                        <div className='items'>
                                            <div>Bet</div>
                                            <div>{bet.bet&&bet.bet}</div>
                                        </div>
                                        <div className='items'>
                                            <div>Win</div>
                                            <div>{bet.win&&bet.win}</div>
                                        </div>
                                        <div className='items'>
                                            <div>Multiplier</div>
                                            <div style={{color:'yellow'
                                                }}>{bet.multiplier&&bet.multiplier}</div>
                                        </div>
                                    </div>
                                </div>))}
                            </div>
                            <div style={{ flexDirection: 'column' }}>
                                {activeTab === 'my-bets' && 
                                <Table
                                tableClass="mb-0 font-14px"
                                columns={topcolumns}
                                data={history.topmulti?history.topmulti:data}
                            />
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>}
    </>
    );
};
export default AllBets;