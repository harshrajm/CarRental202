import React, { Component } from "react";
import { getVehicles } from "../services/backendCallService";
import CarCard from "./common/carCard";
import { Link } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";

class ViewAllVehicles extends Component {
  state = { vehicles: [] };
  async componentDidMount() {
    let { data: vehicles } = await getVehicles();
    vehicles = vehicles.filter(v => v.location !== "UNASSIGNED");
    this.setState({ vehicles });
  }

  render() {
    return (
      <React.Fragment>
        <Link className="btn btn-link ml-4 mt-2" to="/">
          <BsArrowLeftShort /> Back
        </Link>
        {this.state.vehicles.map(v => (
          <CarCard
            key={v._id}
            _id={v._id}
            manu={v.manufacturer}
            name={v.name}
            imgUrl={v.vehicleImageURL}
            type={v.type}
            location={v.location}
            rate={v.finalRate}
            isAvailable={v.isAvailable}
            baseRate={v.baseRate}
            hourlyRate={v.hourlyRate}
            registrationTag={v.registrationTag}
            allowSelectAction={false}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default ViewAllVehicles;
