import React, { Component } from "react";
import { getAlternateVehicles } from "../services/backendCallService";
import qs from "query-string";
import CarCard from "./common/carCard";
import { IoIosCloseCircle } from "react-icons/io";
import moment from "moment";

class ShowAlternateVehicles extends Component {
  state = { vehicles: [] };

  async componentDidMount() {
    console.log("before getAlternateVehicles");
    const { data: vehicles } = await getAlternateVehicles(
      qs.stringify(this.props.alternate)
    );
    this.setState({ vehicles });
  }

  render() {
    return (
      <React.Fragment>
        <React.Fragment>
          <div className="row m-3">
            <div className="col-3">
              <span className="badge badge-light">Location</span>
              <br />
              all <strong>except</strong> {this.props.alternate.location}
            </div>
            <div className="col-2">
              <span className="badge badge-light">Type</span>
              <br />
              {this.props.alternate.type}
            </div>
            <div className="col-2">
              <span className="badge badge-light">Start Time</span>
              <br />
              {moment(this.props.alternate.checkOut).format("ddd MMM DD HH:mm")}
            </div>
            <div className="col-2">
              <span className="badge badge-light">End Time</span>
              <br />
              {moment(this.props.alternate.expectedCheckin).format(
                "ddd MMM DD HH:mm"
              )}
            </div>
            <div className="col-3">
              <button
                type="button"
                className="btn btn-light float-right"
                onClick={this.props.onClearAlternate}
              >
                Clear suggestion <IoIosCloseCircle />
              </button>
            </div>
          </div>
          <hr />
        </React.Fragment>
        {this.state.vehicles.length === 0 && (
          <p className="text-center">Nothing to display</p>
        )}
        {this.state.vehicles.length > 0 && (
          <p className="ml-4">
            Showing {this.state.vehicles.length} alternate option(s)
          </p>
        )}

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
            onBookClick={this.props.onBookClick}
            // onShowAlternateClick={this.handleShowAlternateClick}
            registrationTag={v.registrationTag}
            allowSelectAction={true}
          />
        ))}
        {/* <CarCard /> */}
      </React.Fragment>
    );
  }
}

export default ShowAlternateVehicles;
