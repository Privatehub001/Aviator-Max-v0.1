import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

const UserBets = () => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.aviatordata.userId);

  useEffect(() => {
    displayUserBets();
  }, [userId]);

  const displayUserBets = async () => {
    try {
      const response = await fetch(`https://seal-app-ugskj.ondigitalocean.app/get-user-bet-data?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setBets(data.bets);
      } else {
        setBets([]);
      }
    } catch (error) {
   
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6" align="center" color="textPrimary">
          Loading...
        </Typography>
      </Container>
    );
  }

  if (bets.length === 0) {
    return (
      <Container>
        <Typography variant="h6" align="center" color="textPrimary">
          No data available
        </Typography>
      </Container>
    );
  }

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

  return (
    <Container>
      <Typography variant="h5" sx={{ color: 'text.primary',textAlign:'center' }}>Game Results</Typography>
      <Box my={4}>
        <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary' }}>Date</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>Time</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>Game ID</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>Amount</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>Multiplier</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>Result</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>Won</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bets.map((bet) => {
                const { date, time } = formatDateTime(bet.timestamp);
                return (
                  <TableRow key={bet.id}>
                    <TableCell sx={{ color: 'text.primary',borderBottom:'none' }}>{date}</TableCell>
                    <TableCell sx={{ color: 'text.primary',borderBottom:'none'  }}>{time}</TableCell>
                    <TableCell sx={{ color: 'text.primary',borderBottom:'none'  }}>{bet.game_id?bet.game_id.slice(0,18):"732hbei3"}</TableCell>
                    <TableCell sx={{ color: 'text.primary' ,borderBottom:'none' }}>{bet.stake_amount}</TableCell>
                    <TableCell sx={{ color: 'text.primary',borderBottom:'none'  }}>{bet.multiplier}</TableCell>
                    <TableCell sx={{ color: 'text.primary',borderBottom:'none'  }}>{bet.result}</TableCell>
                    <TableCell sx={{ color: 'text.primary',borderBottom:'none'  }}>{bet.coin}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default UserBets;
