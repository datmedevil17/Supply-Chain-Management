import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const CompleteShipment = ({ state, account }) => {
  const { contract } = state;
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [receiver, setReceiver] = useState('');
  const [sender, setSender] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.completeShipment(sender,receiver, id);
      await tx.wait(); 
      console.log('Transaction successful:', tx);
    } catch (error) {
      console.error('Error completing shipment:', error);
    }
  };

  return (
    <div>
      <div className="box p-4 text-center" onClick={handleClickOpen}>Complete<br />Shipment</div>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Complete Shipment</DialogTitle>
          <DialogContent>
          <TextField
              autoFocus
              required
              margin="dense"
              id="sender"
              name="sender"
              label="Sender"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setSender(e.target.value)}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="receiver"
              name="receiver"
              label="Receiver"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setReceiver(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="id"
              name="id"
              label="ID"
              type="number"
              fullWidth
              variant="standard"
              onChange={(e) => setId(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Complete</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CompleteShipment;
