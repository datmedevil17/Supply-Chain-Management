import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const ShipmentsCount = ({ state, account }) => {
  const { contract } = state;
  const [open, setOpen] = React.useState(false);
  const [address, setAddress] = useState('');
  const [count, setCount] = useState(null);
  const [showCount, setShowCount] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCount(null); // Clear the count when closing
    setAddress(''); // Clear the address field when closing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const shipmentCount = await contract.getShipmentsCount(address);
      setCount(shipmentCount.toString()); // Convert BigNumber to string if needed
      setShowCount(true); // Show the shipment count
    } catch (error) {
      console.error('Error fetching shipment count:', error);
      setCount('Error');
      setShowCount(true);
    }
  };

  return (
    <div>
      <div className="box p-4 text-center" onClick={handleClickOpen}>
        Shipments<br />Count
      </div>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Shipment Count</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="address"
              name="address"
              label="Address"
              type="text"
              fullWidth
              variant="standard"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {showCount && (
              <DialogContentText>
                {count !== null ? `Number of Shipments: ${count}` : 'No data available'}
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Get Shipment Count</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ShipmentsCount;
