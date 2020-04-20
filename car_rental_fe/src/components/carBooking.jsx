import React, { Component } from "react";
import CarCard from "./common/carCard";
import CarSearchForm from "./carSearchForm";
import moment from "moment";
import { IoIosCloseCircle } from "react-icons/io";

class CarBooking extends Component {
  state = {};

  handleVehiclesUpdate = (vehicles, searchParam) => {
    this.setState({ vehicles, searchParam });
  };

  handleClearSearch = () => {
    this.setState({ vehicles: null, searchParam: null });
  };

  handleBookClick = id => {
    //if not auth redirect
    if (!this.props.user) {
      alert("Login to book");
    } else {
      alert("id " + id + " clicked");
    }
    //handle book click
  };

  render() {
    if (!this.state.vehicles) {
      return <CarSearchForm onVehiclesUpdate={this.handleVehiclesUpdate} />;
    }

    return (
      <React.Fragment>
        <React.Fragment>
          <div className="row m-3">
            <div className="col-3">
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
                class="btn btn-light float-right"
                onClick={this.handleClearSearch}
              >
                Clear search <IoIosCloseCircle />
              </button>
            </div>
          </div>
          <hr />
        </React.Fragment>
        {this.state.vehicles.map(v => (
          <CarCard
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
          />
        ))}
        {/* <CarCard /> */}
      </React.Fragment>
    );
  }
}

export default CarBooking;
