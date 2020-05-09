import React, { Component } from "react";
import { getAllActiveBookings } from "../services/backendCallService";
import moment from "moment";

class ActiveBookings extends Component {
  state = {};

  async componentDidMount() {
    const { data: bookings } = await getAllActiveBookings();
    console.log(bookings);
    this.setState({ bookings });
  }

  render() {
    return (
      <React.Fragment>
        <h2 className="mt-4">Active bookings</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Reg. Number</th>
              <th>Vehicle</th>
              <th>Checkout time</th>
              <th>Expected checkin</th>
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
                    {moment(b.expectedCheckin).format("ddd MMM DD HH:mm")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default ActiveBookings;
