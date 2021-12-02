import React, { useState, useEffect } from "react";
import "./PackageList.css";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

export default function PackageList({ packages, newPackageList, customers }) {
  const [openModal, setOpenModal] = useState(false);
  const [isBlank, setIsBlank] = useState(true);
  const [newPackage, setNewPackage] = useState({
    customerId: "",
    weight: "",
    price: "",
  });
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    if (
      newPackage.customerId !== "" &&
      newPackage.weight !== "" &&
      newPackage.price !== "" &&
      errorMessage === false
    )
      setIsBlank(false);
    else setIsBlank(true);
  }, [newPackage, errorMessage]);

  const toggleModal = (open) => {
    setOpenModal(open);
  };

  function deletePackage(id) {
    let newList = packages.filter((item) => {
      return item.id !== id;
    });
    
    newPackageList(newList);
  }

  function changeHandler(event) {
    const { name, value } = event.target;
    if (name === "customerId" && value !== "") {
      if (!customers.some((customer) => customer.id === Number(value))) {
        setErrorMessage(true);
        return;
      } else setErrorMessage(false);
    }
    setNewPackage((prev) => ({ ...prev, [name]: value }));
  }

  function clearAll() {
    setOpenModal(false);
    setIsBlank(true);
    setErrorMessage(false);
    setNewPackage({ customerId: "", weight: "", price: "" });
  }

  function addPackage() {
    if (
      newPackage.customerId !== "" &&
      newPackage.weight !== "" &&
      newPackage.price !== ""
    ) {
      let newList = [...packages];
      let latestShippment= newList.reduce(function(prev, current) {
        return (prev.shippingOrder > current.shippingOrder) ? prev : current
    })
    let maxIndPackage= newList.reduce(function(prev, current) {
      return (Number(prev.id[3]) > Number(current.id[3])) ? prev : current
  })
      newList.push({
        id: "pak" + (Number(maxIndPackage.id[3]) + 1),
        weight: Number(newPackage.weight) + "kg",
        customerid: Number(newPackage.customerId),
        price: Number(newPackage.price),
        shippingOrder: latestShippment.shippingOrder + 1,
      });
      clearAll();
      newPackageList(newList);
    }
  }

  function moveItem(direction, id) {
    let packageIdx = packages.findIndex((item) => item.id === id);
    if (
      (direction === "up" && packageIdx === 0) ||
      (direction === "down" && packageIdx === packages.length - 1)
    )
      return;
    let newList = [...packages];
    if (direction === "up") {
      
      newList[packageIdx].shippingOrder--;
      newList[packageIdx - 1].shippingOrder++;
      [newList[packageIdx], newList[packageIdx - 1]] = [
        newList[packageIdx - 1],
        newList[packageIdx],
      ];
    } else {
      newList[packageIdx].shippingOrder++;
      newList[packageIdx + 1].shippingOrder--;
      [newList[packageIdx], newList[packageIdx + 1]] = [
        newList[packageIdx + 1],
        newList[packageIdx],
      ];
    }

    newPackageList(newList);
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Shipping Date</TableCell>
              <TableCell>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => toggleModal(true)}
                >
                  <AddIcon />
                </IconButton>
                <Modal
                  open={openModal}
                  onClose={() => toggleModal(false)}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className="modal">
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Add a new package
                    </Typography>
                      <TextField
                        required
                        error={errorMessage}
                        type="number"
                        id="outlined-required"
                        name="customerId"
                        label="Customer ID:"
                        helperText={errorMessage ? "exist users only." : ""}
                        sx={{ m: 1, width: "20ch" }}
                        onChange={(event) => changeHandler(event)}
                      />
                      <TextField
                        required
                        name="weight"
                        type="number"
                        id="outlined-required"
                        label="Weight:"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">kg</InputAdornment>
                          ),
                        }}
                        onChange={(event) => changeHandler(event)}
                        sx={{ m: 1, width: "20ch" }}
                      />
                      <TextField
                        required
                        id="outlined-required"
                        label="Price:"
                        type="number"
                        name="price"
                        sx={{ m: 1, width: "20ch" }}
                        onChange={(event) => changeHandler(event)}
                      />
                    <Box
                      sx={{ justifyContent: "center", display: "flex" }}
                    >
                      <Button
                        disabled={isBlank}
                        variant="contained"
                        onClick={() => addPackage()}
                      >
                        Add Package
                      </Button>
                    </Box>
                  </Box>
                </Modal>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packages.map((row) => {
              return (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  key={row.id}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.customerid}</TableCell>
                  <TableCell>{row.weight}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.shippingOrder}</TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => deletePackage(row.id)}
                    >
                      Delete
                    </Button>
                    <Button onClick={() => moveItem("up", row.id)}>
                      &#8593;
                    </Button>
                    <Button onClick={() => moveItem("down", row.id)}>
                      &#8595;
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
