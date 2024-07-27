import React, { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const StartShipment = ({state,account}) => {
  const {contract} = state
    const [open, setOpen] = React.useState(false);
    const [sender,setSender] = useState('')
    const [receiver,setReceiver] = useState('')
    const [id,setId] = useState('')

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit=async(e)=>{
    e.preventDefault()
    const tx = await contract.startShipment(sender,receiver,id)
    await tx.wait()
    console.log(tx)
    
  }
  return (
    <div>
                <div className="box p-4 text-center" onClick={handleClickOpen}>Start<br />Shipment</div>
               
                <Dialog
        open={open}
        onClose={handleClose}>
            <form onSubmit={handleSubmit}>
        <DialogTitle>Start the Shipment</DialogTitle>
        <DialogContent>
          
          <TextField
            autoFocus
            required
            margin="dense"
            id="sender"
            name="sender"
            label="sender"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e)=>{setSender(e.target.value)}}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="receiver"
            name="receiver"
            label="receiver"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e)=>{setReceiver(e.target.value)}}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="id"
            name="id"
            label="id"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e)=>{setId(e.target.value)}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Start Shipment</Button>
        </DialogActions>
        </form>
      </Dialog>

    </div>
  )
}

export default StartShipment
