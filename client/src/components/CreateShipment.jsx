import React from 'react'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { ethers } from 'ethers';


const CreateShipment = ({state,account}) => {
    const [open, setOpen] = React.useState(false);
    const {contract}=state;
    const [receiver,setReceiver]=useState('')
    const [date,setDate]=useState('')
    const [distance,setDistance]=useState('')
    const [price,setPrice]=useState('')

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const timestamp = Math.floor(new Date(date).getTime() / 1000);
        const priceInWei = ethers.parseEther(price); // Convert price to wei
        const distanceInt = parseInt(distance, 10);


        // Convert date to Unix timestamp

        const tx = await contract.createShipment(receiver,timestamp,distanceInt,priceInWei,{value:priceInWei})
        await tx.wait()
        console.log(tx)

    }
  return (
    <div>
    <div className="content mt-5 ">
        <h1>Create Tracking</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere doloribus laborum et incidunt at magni architecto rem deserunt ea dignissimos similique rerum praesentium alias ipsam, velit quas saepe exercitationem illum!</p>
      </div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create New Shipment
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}>
            <form onSubmit={handleSubmit}>
        <DialogTitle>Track Product, Create Shipment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam ipsa, laborum rem dolor voluptatem delectus vel explicabo tempora necessitatibus doloribus!
          </DialogContentText>
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
            onChange={(e)=>setReceiver(e.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="date"
            name="date"
            type="date"
            fullWidth
            variant="standard"
            onChange={(e)=>setDate(e.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="distance"
            name="distance"
            label="Distance"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e)=>setDistance(e.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="price"
            name="price"
            label="Price"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e)=>setPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
        </form>
      </Dialog>
      </div>
  )
}

export default CreateShipment
