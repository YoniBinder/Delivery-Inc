import React, { useState, useEffect } from "react";
import { Switch, Route, Link, useHistory} from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CustomerList from "./Components/Customer-List/CustomerList";
import Invoices from "./Components/Invoices/InvoicesList";
import PackageList from "./Components/Package-List/PackageList";
import "./App.css";

function App() {
  const [appData, setAppData] = useState({ customers: [], packages: [] });
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const history = useHistory();

  useEffect(() => {
    function sortPackages(data) {
      let sortedList = data.packages.sort(function (a, b) {
        return a.shippingOrder - b.shippingOrder;
      });
      setAppData((prev) => ({
        packages: sortedList,
        customers: prev.customers,
      }));
    }

    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        setAppData(data);
        sortPackages(data);
      });
  }, []);

  const goToInvoicePage = () => history.push("/invoices");

  function createInvoice(id, name) {
    let invoiceList = [...invoices];
    for (let i = 0; i < appData.packages.length; i++)
      if (id === appData.packages[i].customerid) {
        let index = invoiceList.findIndex((invoice) => invoice.name === name);
        if (index === -1) {
          invoiceList.push({
            name,
            totalWeight: appData.packages[i].weight,
            totalPrice: appData.packages[i].price,
          });
        } else {
          let newWeight =
            Number(invoiceList[index].totalWeight[0]) +
            Number(appData.packages[i].weight[0]);
          invoiceList[index].totalWeight = newWeight + "kg";
          invoiceList[index].totalPrice += appData.packages[i].price;
        }
      }
    setInvoices(invoiceList);
    goToInvoicePage();
  }

  function newCustomerList(list) {
    setAppData((prev) => ({ packages: prev.packages, customers: list }));
  }
  function newPackageList(list) {
    setAppData((prev) => ({ packages: list, customers: prev.customers }));
  }

  const toggleDrawer = (open) => {
    setOpen(open);
  };

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => {
                toggleDrawer(true);
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Mail Delivery Service
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor={"left"}
          open={open}
          onClose={() => {
            toggleDrawer(false);
          }}
        >
          <List style={{ width: "300px" }}>
            <ListItem
              button
              component={Link}
              to={"/PackagesList"}
              onClick={() => {
                toggleDrawer(false);
              }}
            >
              <ListItemText primary={"Packages"} />
            </ListItem>
            <ListItem
              button
              component={Link}
              to={"/"}
              onClick={() => {
                toggleDrawer(false);
              }}
            >
              <ListItemText primary={"Customers"} />
            </ListItem>
            <ListItem
              button
              component={Link}
              to={"/Invoices"}
              onClick={() => {
                toggleDrawer(false);
              }}
            >
              <ListItemText primary={"Invoices"} />
            </ListItem>
          </List>
        </Drawer>
      </Box>

      <Switch>
        <Route
          exact
          path="/"
          component={() => (
            <CustomerList
              customers={appData.customers}
              newCustomerList={newCustomerList}
              createInvoice={createInvoice}
            />
          )}
        />
        <Route
          exact
          path="/packagesList"
          component={() => (
            <PackageList
              customers={appData.customers}
              packages={appData.packages}
              newPackageList={newPackageList}
            />
          )}
        />
        <Route
          exact
          path="/invoices"
          component={() => <Invoices invoices={invoices} />}
        />
      </Switch>
    </div>
  );
}

export default App;
