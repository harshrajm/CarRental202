import React, { Component } from "react";
import moment from "moment";
import { getAllCompletedBookings } from "../services/backendCallService";

class CompletedBookings extends Component {
  state = {};

  async componentDidMount() {
    const { data: bookings } = await getAllCompletedBookings();
    console.log(bookings);
    this.setState({ bookings });
  }

  render() {
    return (
      <React.Fragment>
        <h2 className="mt-4">Completed bookings</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Reg. Number</th>
              <th>Vehicle</th>
              <th>Checkout time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.bookings &&
              this.state.bookings.map(b => (
                <tr>
                  <th>{b._id}</th>
                  <td>{b.registrationTag}</td>
                  <td>
                    {b.vehicleObject.manufacturer + " " + b.vehicleObject.name}
                  </td>
                  <td>{moment(b.checkOut).format("ddd MMM DD HH:mm")}</td>
                  <td>
                    {b.paid ? (
                      <span className="badge badge-success">returned</span>
                    ) : (
                      <span className="badge badge-danger">cancelled</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default CompletedBookings;
