import React, { Component } from "react";
import { MdLocationOn } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";
import { AiOutlineArrowRight } from "react-icons/ai";

class BookingCard extends Component {
  render() {
    console.log("props", this.props.bookingsDtls);
    const {
      _id,
      checkOut,
      expectedCheckin,
      cost,
      isActive,
      paid,
      registrationTag,
      vehicleObject
    } = this.props.bookingsDtls;
    return (
      <div className="card m-4">
        <div className="row ">
          <div className="col-md-4 thumbnail text-center">
            <img
              src={vehicleObject.vehicleImageURL} //"https://media.ed.edmunds-media.com/tesla/model-s/2018/oem/2018_tesla_model-s_sedan_p100d_rq_oem_4_815.jpg"
              className="card-img"
              max-width="100%"
              height="180px"
              alt="car"
            />
            <div className="imgBadge">
              <span className="badge badge-light">{vehicleObject.type}</span>
            </div>
            <div className="caption">
              <h2>
                <strong>{vehicleObject.registrationTag}</strong>
              </h2>
            </div>
          </div>
          <div className="col-md-8 ">
            <div className="card-block p-3">
              <h4 className="card-title float-right">
                <FaDollarSign />
                {cost}
              </h4>
              <small className="float-right mt-2 font-weight-light">
                Rate :
              </small>
              <h3 className="card-title">
                {vehicleObject.manufacturer + " " + vehicleObject.name}
              </h3>
              <hr />
              <p className="card-text float-right">
                <MdLocationOn />
                {"location"}
              </p>
              <span className="badge badge-light">Checkout : {checkOut}</span>
              <AiOutlineArrowRight />
              <span className="badge badge-light">
                Expected return : {expectedCheckin}
              </span>
              <br />
              <br />
              <span className="badge badge-primary"> upcoming</span>
              <span class="badge badge-danger">finished</span>
              <span class="badge badge-success">ongoing</span>
              <button type="button" className="btn btn-danger float-right">
                End trip
              </button>
              {/* {isAvailable && (
                <span className="badge badge-pill badge-success">
                  Available
                </span>
              )}
              {!isAvailable && (
                <span className="badge badge-pill badge-danger">
                  Not Available
                </span>
              )} */}
              {/* {isAvailable && (
                <button
                  type="button"
                  className="btn btn-primary  float-right"
                  onClick={() => onBookClick(_id, registrationTag)}
                >
                  Book
                </button>
              )}

              {!isAvailable && (
                <button type="button" className="btn btn-link  float-right">
                  Find {type} at other locations
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BookingCard;
