import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ethers } from "ethers";

const GetShipment = ({ state, account }) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [shipment, setShipment] = useState(null); // Changed to null
  const [toggle, setToggle] = useState(false); // Changed initial state to false

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShipment(null); // Reset shipment data
    setToggle(false); // Reset toggle state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state.contract && typeof state.contract.getShipment === 'function') {
        const shipment = await state.contract.getShipment(account, id);
        setShipment(shipment);
        setToggle(true);
      } else {
        console.error("getShipment function not found on contract.");
      }
    } catch (error) {
      console.error("Error fetching shipment:", error);
    }
  };

  return (
    <div>
      <div className="box p-4 text-center" onClick={handleClickOpen}>
        Get
        <br />
        Shipment
      </div>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Product Tracking Details</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
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
            <Button type="submit">Get Details</Button>
          </DialogActions>
        </form>
        {toggle && shipment && (
          <div className="p-5">
            <h1>Shipment Details</h1>
            <p>Sender: {shipment[0]}</p>
            <p>Receiver: {shipment[1]}</p>
            <p>Paid: {shipment[7] ? 'Yes' : 'No'}</p>
            <p>Price: {ethers.formatEther(shipment[5]) + " Eth"}</p>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default GetShipment;
