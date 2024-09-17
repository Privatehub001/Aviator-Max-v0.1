import React, { useMemo, useState } from 'react';
import Table from './table';
import { generateColumnsHistory,generateColumnsTopMultiplier, data } from './helper'
import "./_allbets.scss";

function History({ bet, win, balance,history }) {
    const [activeTab, setActiveTab] = useState('history');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };
    const columns = useMemo(
        () => generateColumnsHistory(),
        []
    );
    const topcolumns = useMemo(
        () => generateColumnsTopMultiplier(),
        []
    );
    return (
        <div className="col-12 col-lg-7 d-flex align-items-stretch history">
            <div className="list-container">
                <div className="d-flex align-items-center">
                    <div className="d-flex flex-column justify-content-center align-items-center me-2 px-2 allbetscontainer">
                        <div style={{ display: 'flex', marginTop: '0.5vw' }}>
                            <div className='balance-container'>
                                <div>BALANCE</div>
                                <div className='balance'>{balance?balance:0}</div>
                            </div>
                            <div className='balance-container'>
                                <div>BET</div>
                                <div className='balance'>{bet}</div>
                            </div>
                            <div className='balance-container'>
                                <div>WIN</div>
                                <div className='balance'>{win}</div>
                            </div>
                        </div>
                        <div className='slider-container'>
                            <div className='slider'
                                style={{
                                    width: '8vw',
                                    backgroundColor: activeTab === 'history' ? 'black' : '',
                                    color: activeTab === 'history' ? 'white' : ''
                                }}
                                onClick={() => handleTabClick('history')}
                            >
                                History
                            </div>
                            <div className='slider'
                                style={{
                                    width: '8vw',
                                    backgroundColor: activeTab === 'top-multi' ? 'black' : '',
                                    color: activeTab === 'top-multi' ? 'white' : ''
                                }}
                                onClick={() => handleTabClick('top-multi')}
                            >
                                Top Multiplier
                            </div>
                        </div>
                        <div className='bets-data-container'>
                            {activeTab === 'history' ? <Table
                                tableClass="mb-0 font-14px"
                                columns={columns}
                                data={history.history ?history.history:data}
                            /> :
                                <Table
                                    tableClass="mb-0 font-14px"
                                    columns={topcolumns}
                                    data={history.topmulti?history.topmulti:data}
                                />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default History;
