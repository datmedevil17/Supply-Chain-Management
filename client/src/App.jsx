import './App.css';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from "./contract/Tracking.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Navbar, Nav, Container } from 'react-bootstrap';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CompleteShipment from './components/CompleteShipment';
import GetShipment from './components/GetShipment';
import SendShipment from './components/SendShipment';
import ShipmentsCount from './components/ShipmentsCount';
import StartShipment from './components/StartShipment';
import UserProfile from './components/UserProfile';
import CreateShipment from './components/CreateShipment';

const columns = [
  { id: 'sender', label: 'Sender', minWidth: 100 },
  { id: 'receiver', label: 'Receiver', minWidth: 100 },
  { id: 'pickUpTime', label: 'Pick-Up Time', minWidth: 100 },
  { id: 'deliveryTime', label: 'Delivery Time', minWidth: 100 },
  { id: 'price', label: 'Price', minWidth: 100 },
  { id: 'distance', label: 'Distance', minWidth: 100 },
  { id: 'paid', label: 'Paid', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
];

function App() {
  const [rows, setRows] = useState([]);
  const [account, setAccount] = useState(null);
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
    address: null,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const connectWallet = async () => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      const contractAddress = "0x452Fd85F4eB75D6399c5102F414f1ddFf095A814";
      const contractABI = abi.abi;

      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const address = await signer.getAddress();

        setAccount(address);
        setState({ provider, signer, contract, address });
        setLoading(false);
      } catch (error) {
        console.error("Error connecting to Metamask:", error);
      }
    } else {
      console.log("Metamask is not installed");
    }
  };

  const loadBlockchainData = async () => {
    if (state.contract && account) {
      try {
        const count = await state.contract.getShipmentsCount(account);
        const loadedRows = [];
        for (let i = 0; i < count; i++) {
          try {
            const shipment = await state.contract.getShipment(account, i);
            console.log(shipment)
            const pickUpTime = new Date(Number(shipment[2]) * 1000); // assuming pickUpTime is in seconds
            const deliveryTime = new Date(Number(shipment[3]) * 1000); // assuming pickUpTime is in seconds
          
            
            loadedRows.push({
              sender: shipment[0],
              receiver: shipment[1],
              pickUpTime: pickUpTime.toLocaleString(),
              price: ethers.formatEther(shipment[5]),
              distance: shipment[4]+" km", // Display computed delivery date/time
              deliveryTime: deliveryTime.toLocaleString(),
              paid:shipment[7]?"Yes":"No",
              status: ShipmentStatus[shipment[6]] ,
            });
          } catch (innerError) {
            console.error(`Error fetching shipment with index ${i}:`, innerError);
          }
        }
        setRows(loadedRows);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    }
  };
  

  useEffect(() => {
    loadBlockchainData();
  }, [state.contract, account]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const ShipmentStatus = {
    0: "Pending",
    1: "In Transit",
    2: "Completed",
  };

  return (
    <div className="App">
      <Navbar expand="lg" bg="secondary" variant="dark">
        <Container>
          <Navbar.Brand>Shipment Tracking</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              {account ? (
                <Nav.Link
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button nav-button btn-sm mx-4">
                  <Button variant="outline-light">
                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                  </Button>
                </Nav.Link>
              ) : (
                <Button onClick={connectWallet} variant="outline-light">Connect Wallet</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Spinner animation="border" style={{ display: 'flex' }} />
            <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
          </div>
        ) : (
          <div>
            <div className="container">
              <div className="row mb-3">
                <div className="col-md-4">
                  <CompleteShipment state={state} account={account} />
                </div>
                <div className="col-md-4">
                  <SendShipment state={state} account={account} />
                </div>
                <div className="col-md-4">
                  <StartShipment state={state} account={account} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <UserProfile state={state} account={account} />
                </div>
                <div className="col-md-4">
                  <GetShipment state={state} account={account} />
                </div>
                <div className="col-md-4">
                  <ShipmentsCount state={state} account={account} />
                </div>
              </div>
            </div>
            <div className="container">
              <CreateShipment state={state} account={account} />
            </div>
            <div className="mt-5">
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align="left"
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align="left">
                                  {value !== undefined && value !== null ? value.toString() : 'N/A'}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
