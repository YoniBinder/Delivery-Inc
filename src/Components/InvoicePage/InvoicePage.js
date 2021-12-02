import React from "react";
import "./InvoicePage.css";
import { useLocation } from "react-router";

export default function InvoicePage({ packages }) {
  const { query } = useLocation();
  let weightSum = 0;
  let totalPrice = 0;
  let invoiceList = [];

  function invoiceListFunc() {
    if (packages && query !== "")
      for (let i = 0; i < packages.length; i++)
        if (packages[i].customerid === query.id) {
          invoiceList.push(packages[i]);
          weightSum += Number(
            packages[i].weight.slice(0, packages[i].weight.length - 2)
          );
          totalPrice += packages[i].price;
        }
  }
  invoiceListFunc();

  return (
    <div className="invoice-container">
      <div className="header-container">
        <div className="grid-item invoice-date">
          <div className="date">{new Date().toLocaleDateString()}</div>
          <div>{query && query.name}</div>
        </div>
        <div className="grid-item"></div>
        <div className="grid-item">
          <div className="invoice-title">Invoice</div>
          <div className="invoice-number">
            No. {Math.floor(Math.random() * 100) + 1}
          </div>
        </div>
      </div>
      <div className="body-container ">
        <table className="invoices-list" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th width="40%">ID</th>
              <th width="40%">Weight</th>
              <th width="20%" className="price-list">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceList.map((row) => {
              return (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.weight}</td>
                  <td className="price-list">{row.price}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td>{weightSum} kg</td>
              <td className="price-list total-price">Total: {totalPrice}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="footer">
        <div>You received {invoiceList.length} packages</div>
        <div>Thank you for using our services</div>
      </div>
    </div>
  );
}
