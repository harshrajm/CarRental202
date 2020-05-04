import React, { Component } from "react";
import CarCard from "./common/carCard";
import CarSearchForm from "./carSearchForm";
import moment from "moment";
import { IoIosCloseCircle } from "react-icons/io";
import { postNewBooking } from "../services/backendCallService";
import qs from "query-string";
import ShowAlternateVehicles from "./showAlternateVehicles";

class CarBooking extends Component {
  state = {};

  handleVehiclesUpdate = (vehicles, searchParam) => {
    this.setState({ vehicles, searchParam });
  };

  handleClearSearch = () => {
    this.setState({ vehicles: null, searchParam: null });
  };

  handleBookClick = async (id, registrationTag) => {
    //if not auth redirect
    if (!this.props.user) {
      //window.location = "/login";
      this.props.history.push("/login");
      //alert("Login to book");
    } else {
      //alert("registrationTag " + registrationTag + " clicked");
      const data = {};
      data["registrationTag"] = registrationTag;
      data["checkOut"] = this.state.searchParam.checkOut;
      data["expectedCheckin"] = this.state.searchParam.expectedCheckin;
      try {
        await postNewBooking(qs.stringify(data));
        console.log("booking placed");
        this.props.history.push("/myBookings");
      } catch (ex) {
        console.log("error in postNewBooking");
      }
    }
    //handle book click
  };

  handleShowAlternateClick = (type, location) => {
    //alert(type + " " + location);
    const alternate = {};
    alternate["type"] = type;
    alternate["location"] = location;
    alternate["checkOut"] = this.state.searchParam.checkOut;
    alternate["expectedCheckin"] = this.state.searchParam.expectedCheckin;
    this.setState({ alternate });
  };

  handleClearAlternate = () => {
    this.setState({ alternate: undefined });
  };

  render() {
    if (!this.state.vehicles) {
      return (
        <CarSearchForm
          onVehiclesUpdate={this.handleVehiclesUpdate}
          user={this.props.user}
        />
      );
    }
    if (this.state.alternate) {
      return (
        <ShowAlternateVehicles
          alternate={this.state.alternate}
          onClearAlternate={this.handleClearAlternate}
          onBookClick={this.handleBookClick}
        />
      );
    }
    return (
      <React.Fragment>
        <React.Fragment>
          <div className="row m-3 text-center">
            <div className="col-3 ">
              <span className="badge badge-light">Location</span>
              <br />
              {this.state.searchParam.location}
            </div>
            <div className="col-3">
              <span className="badge badge-light">Start Time</span>
              <br />
              {moment(this.state.searchParam["checkOut"]).format(
                "ddd MMM DD HH:mm"
              )}
            </div>
            <div className="col-3">
              <span className="badge badge-light">End Time</span>
              <br />
              {moment(this.state.searchParam["expectedCheckin"]).format(
                "ddd MMM DD HH:mm"
              )}
            </div>
            <div className="col-3">
              <button
                type="button"
                className="btn btn-light float-right"
                onClick={this.handleClearSearch}
              >
                Clear search <IoIosCloseCircle />
              </button>
            </div>
          </div>
          <hr />
        </React.Fragment>
        {this.state.vehicles.length === 0 && (
          <p className="text-center">Nothing to display</p>
        )}
        {this.state.vehicles.length > 0 && (
          <p className="ml-4">Showing {this.state.vehicles.length} option(s)</p>
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
            onBookClick={this.handleBookClick}
            registrationTag={v.registrationTag}
            allowSelectAction={true}
            onShowAlternateClick={this.handleShowAlternateClick}
          />
        ))}
        {/* <CarCard /> */}
      </React.Fragment>
    );
  }
}

export default CarBooking;
