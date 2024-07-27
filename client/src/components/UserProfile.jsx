import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { ethers } from 'ethers';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserProfile = ({ state, account }) => {
  const { contract } = state;
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = useState(null);
  const [balance, setBalance] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account) {
        try {
          // Fetch total shipment count
          const totalCount = await contract.getShipmentsCount(account);
          setCount(totalCount.toString());

          // Fetch user balance
          const userBalance = await contract.getBalance(account); // Ensure getBalance is available in your contract
          setBalance(ethers.formatEther(userBalance)); // Format balance from wei to ether
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [contract, account]); // Dependency array to re-fetch when contract or account changes

  return (
    <div>
      <div className="box p-4 text-center" onClick={handleClickOpen}>
        User<br />Profile
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>User Profile</DialogTitle>
        <DialogTitle>{account}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {/* Balance: {balance !== null ? `${balance} ETH` : 'Loading...'} */}
          </DialogContentText>
          <DialogContentText id="alert-dialog-slide-description">
            Total Shipments: {count !== null ? count : 'Loading...'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserProfile;
