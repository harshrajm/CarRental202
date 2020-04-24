import React, { Component } from "react";
import { MdLocationOn } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";
class CarCard extends Component {
  state = {};
  render() {
    const {
      _id,
      manu,
      name,
      imgUrl,
      type,
      location,
      rate,
      isAvailable,
      baseRate,
      hourlyRate,
      onBookClick,
      registrationTag
    } = this.props;
    return (
      <React.Fragment>
        <div className="card m-4">
          <div className="row ">
            <div className="col-md-4">
              <img
                src={imgUrl} //"https://media.ed.edmunds-media.com/tesla/model-s/2018/oem/2018_tesla_model-s_sedan_p100d_rq_oem_4_815.jpg"
                className="card-img"
                max-width="100%"
                height="180px"
                alt="car"
              />
            </div>
            <div className="col-md-8 ">
              <div className="card-block p-3">
                {/* <small className="float-right font-weight-light">Starting from</small>
                <br /> */}

                {rate && (
                  <React.Fragment>
                    <h4 className="card-title float-right">
                      <FaDollarSign />
                      {rate}
                    </h4>

                    <small className="float-right mt-2 font-weight-light">
                      Estimate :
                    </small>
                  </React.Fragment>
                )}

                <h3 className="card-title">{manu + " " + name}</h3>

                <hr />
                <span className="badge badge-light">{type}</span>
                <p className="card-text float-right">
                  <MdLocationOn />
                  {location}
                </p>
                <br />
                <br />
                {isAvailable && (
                  <span className="badge badge-pill badge-success">
                    Available
                  </span>
                )}
                {!isAvailable && (
                  <span className="badge badge-pill badge-danger">
                    Not Available
                  </span>
                )}

                {isAvailable && (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CarCard;
