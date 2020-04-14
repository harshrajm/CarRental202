import React, { Component } from "react";
import CarCard from "./common/carCard";

class CarBooking extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <h2>Car Booking Component</h2>
        <CarCard />
      </React.Fragment>
    );
  }
}

export default CarBooking;
