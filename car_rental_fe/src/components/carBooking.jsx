import React, { Component } from "react";
import CarCard from "./common/carCard";
import CarSearchForm from "./carSearchForm";

class CarBooking extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <CarSearchForm />
        <CarCard />
      </React.Fragment>
    );
  }
}

export default CarBooking;
