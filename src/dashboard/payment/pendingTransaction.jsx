import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const PendingTransactions = ({transactions,setTransactions}) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false); 

  const theme = useTheme();
  const handleMarkTransaction = async (transactionId, status, amount) => {
    setActionLoading(true); 
    try {
      const response = await axios.post('https://bush-aquamarine-border.glitch.me/update-pending', {
        userId: selectedTransaction.user_id,
        transactionId,
        status,
        amount,
      });

      if (response.data.success) {
        setTransactions(transactions.filter(t => t.transaction_id !== transactionId));
        alert(response.data.message);
        setSelectedTransaction(null); 
      } else {
        alert(response.data.message);
      }
    } catch (error) {
     
      alert('Failed to update transaction.');
    } finally {
      setActionLoading(false); 
    }
  };

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const renderActions = (transaction) => (
    <Box display="flex" justifyContent="center" gap={2} mt={2}>
      {actionLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleMarkTransaction(transaction.transaction_id, 'success', transaction.withdraw)}
          >
            Mark as Success
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleMarkTransaction(transaction.transaction_id, 'failed', transaction.withdraw)}
          >
            Mark as Failed
          </Button>
        </>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h5" sx={{ color: 'text.primary', textAlign: 'center' }} gutterBottom>
          Pending Transactions
        </Typography>

        <Box mt={4}>
          {transactions.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary' }}>Transaction ID</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>User ID</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>Amount</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>Account No</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>IFSC Code</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map(transaction => (
                    <TableRow
                      key={transaction.transaction_Id}
                      onClick={() => handleRowClick(transaction)}
                      hover
                      selected={selectedTransaction?.transaction_id === transaction.transaction_id}
                      sx={{
                        backgroundColor:
                        selectedTransaction && selectedTransaction.transaction_id === transaction.transaction_id
                            ? theme.palette.action.selected
                            : 'black', 
                        cursor: 'pointer',
                        '& .MuiTableCell-root': {
                          color: selectedTransaction?.transaction_id === transaction.transaction_id
                            ? theme.palette.text.primary
                            : 'white', 
                        },
                      }}
                    >
                      <TableCell>{transaction.transaction_id}</TableCell>
                      <TableCell>{transaction.user_id}</TableCell>
                      <TableCell>{transaction.withdraw}</TableCell>
                      <TableCell>{transaction.account}</TableCell>
                      <TableCell>{transaction.ifsc_code}</TableCell>
                      <TableCell>{transaction.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h6" align="center" sx={{ color: 'text.secondary' }}>
              No pending transactions available
            </Typography>
          )}
        </Box>

        {selectedTransaction && (
          <Box mt={4} textAlign="center">
            <Typography variant="h6" sx={{ color: 'text.primary' }}>Transaction Actions</Typography>
            {renderActions(selectedTransaction)}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default PendingTransactions;
