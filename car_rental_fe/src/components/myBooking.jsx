import React, { Component } from "react";
import { getBookings } from "../services/backendCallService";
import BookingCard from "./common/bookingCard";
class MyBooking extends Component {
  state = {};

  async componentDidMount() {
    const { data: bookings } = await getBookings();
    this.setState({ bookings });
    console.log(bookings);
  }

  render() {
    return (
      <React.Fragment>
        <h1>My Bookings!</h1>

        <BookingCard />
      </React.Fragment>
    );
  }
}

export default MyBooking;
