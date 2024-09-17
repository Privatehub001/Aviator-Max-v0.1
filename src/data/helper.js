import { format, parse } from 'date-fns';

export function generateColumnsAllbets(actionsList, copyAddressHndlr) {
  return [
    {
      id: "user",
      Header: "User",
      accessor: "user",
      columnClassName: "w-300px",
      Cell: ({ row: { original } }) => {
        return <span>{original.user.slice(0,2)}...{original.user.slice(-2)}</span>;
      },
    },
    {
      id: "bet",
      Header: "Bet",
      accessor: "bet",
      Cell: ({ row: { original } }) => {
        return <span>{original.bet}</span>;
      },
    },
    {
      id: "multiplyer",
      Header: "Multiplier",
      accessor: "multiplier",
      Cell: ({ row: { original } }) => {
        return <span>{original.multi}</span>;
      },
    },
    {
      id: "win",
      Header: "Win",
      accessor: "win",
      Cell: ({ row: { original } }) => {
        const { contract } = original || {},
          { ticker, color_code } = contract || {};
        return <span>{original.win}</span>;
      },
    },
  ];
}
export function generateColumnsHistory(actionsList, copyAddressHndlr) {
  return [
    {
      id: "time",
      Header: "Time",
      accessor: "time",
      columnClassName: "w-300px",
      Cell: ({ row: { original } }) => {
        if(original.timestamp){
        const date = new Date(original.timestamp);
        const localTime = date.toLocaleTimeString();
        return <span>{localTime}</span>;}
      },
    },
    {
      id: "multi",
      Header: "Multiplier",
      accessor: "multi",
      Cell: ({ row: { original } }) => {
        return <span>{original.multiplier && original.multiplier.toFixed(2)}</span>;
      },
    },
    {
      id: "id",
      Header: "Round-Id",
      accessor: "time",
      columnClassName: "w-300px",
      Cell: ({ row: { original } }) => {
        return <span>{original.round_id && original.round_id.slice(0, 5)}..</span>;
      },
    },
  ];
}

export function generateColumnsTopMultiplier(actionsList, copyAddressHndlr) {
  return [
    {
      id: "time",
      Header: "Date",
      accessor: "time",
      columnClassName: "w-300px",
      Cell: ({ row: { original } }) => {
        if(original.timestamp){
        const date = new Date(original.timestamp);
        const localDate = date.toLocaleDateString(); 
        return <span>{localDate}</span>;}
      },
    },
    {
      id: "multi",
      Header: "Multiplier",
      accessor: "multi",
      Cell: ({ row: { original } }) => {
        return <span>{original.multiplier && original.multiplier.toFixed(2)}</span>;
      },
    },
    {
      id: "id",
      Header: "Round-Id",
      accessor: "time",
      columnClassName: "w-300px",
      Cell: ({ row: { original } }) => {
        return <span>{original.round_id && original.round_id.slice(0, 5)}...</span>;
      },
    },
  ];
}

export const data = [
  {
    time: "0...324",
    multi: "2.19",
    id: '2h2n3ndn'
  },
  {
    time: "0...324",
    multi: "2.19",
    id: '2h2n3ndn'
  },
  {
    time: "0...324",
    multi: "2.19",
    id: '2h2n3ndn'
  },
  {
    time: "0...324",
    multi: "2.19",
    id: '2h2n3ndn'
  },
  {
    time: "0...324",
    multi: "2.19",
    id: '2h2n3ndn'
  },
  {
    time: "0...324",
    multi: "2.19",
    id: '2h2n3ndn'
  },
  {
    time: "0...324",
    multi: "2.19",
    id: '2h2n3ndn'
  },
  {
    time: "0...324",
    multi: "2.19",
    id: '2h2n3ndn'
  },

];