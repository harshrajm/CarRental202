import React, { Component } from "react";
import { MdLocationOn } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";
import { AiOutlineArrowRight } from "react-icons/ai";
import moment from "moment";

class BookingCard extends Component {
  render() {
    //console.log("props", this.props.bookingsDtls);
    const {
      _id,
      checkOut,
      expectedCheckin,
      cost,
      isActive,
      paid,
      registrationTag,
      vehicleObject,
      lateFees
    } = this.props.bookingsDtls;

    return (
      <div className="card m-4">
        <div className="row ">
          <div className="col-md-4 thumbnail text-center">
            <img
              src={vehicleObject.vehicleImageURL}
              className="card-img"
              max-width="100%"
              height="180px"
              alt="car"
            />
            <div className="imgBadge">
              <span className="badge badge-secondary">
                {vehicleObject.type}
              </span>
            </div>
            <div className="caption">
              <h2>
                <strong>{vehicleObject.registrationTag}</strong>
              </h2>
            </div>
          </div>
          <div className="col-md-8 ">
            <div className="card-block p-3">
              {!isActive && (
                <h4 className="card-title float-right">
                  <FaDollarSign />
                  {lateFees && lateFees > 0
                    ? `${cost} + ${lateFees} (late fee)`
                    : `${cost}`}
                </h4>
              )}
              {isActive && (
                <h4 className="card-title float-right">
                  <FaDollarSign />
                  {cost}
                </h4>
              )}
              {isActive && (
                <small className="float-right mt-2 font-weight-light">
                  Base Rate :
                </small>
              )}
              {!isActive && (
                <small className="float-right mt-2 font-weight-light">
                  Final Rate :
                </small>
              )}
              <h3 className="card-title">
                {vehicleObject.manufacturer + " " + vehicleObject.name}
              </h3>
              <hr />
              <p className="card-text float-right">
                <MdLocationOn />
                {vehicleObject.location}
              </p>
              <span className="badge badge-light">
                Checkout : {moment(checkOut).format("ddd MMM DD HH:mm")}
              </span>
              <AiOutlineArrowRight />
              <span className="badge badge-light">
                Expected return :{" "}
                {moment(expectedCheckin).format("ddd MMM DD HH:mm")}
              </span>
              <br />
              <br />

              {isActive && moment(new Date()) < moment(checkOut) && (
                <h3 className="badge badge-primary"> UPCOMING</h3>
              )}
              {!isActive && <h3 className="badge badge-danger">FINISHED</h3>}

              {isActive &&
                moment(new Date()) > moment(checkOut) &&
                isActive && <h3 className="badge badge-success">ONGOING</h3>}
              {isActive && moment(new Date()) < moment(checkOut) && (
                <button
                  type="button"
                  className="btn btn-warning float-right"
                  onClick={() => this.props.onCancelBookingClicked(_id)}
                >
                  {moment(new Date()).add(1, "hours") < moment(checkOut)
                    ? "Cancel booking for free"
                    : "Cancel booking with penalty"}
                </button>
              )}
              {isActive && moment(new Date()) > moment(checkOut) && (
                <button
                  type="button"
                  className="btn btn-danger float-right"
                  onClick={() => this.props.onEndTripClicked(_id)}
                >
                  End trip
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BookingCard;
