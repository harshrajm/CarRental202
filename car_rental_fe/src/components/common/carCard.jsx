import React, { Component } from "react";
import { MdLocationOn } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";
class CarCard extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div className="card m-2">
          <div className="row ">
            <div className="col-md-4">
              <img
                src="https://media.ed.edmunds-media.com/tesla/model-s/2018/oem/2018_tesla_model-s_sedan_p100d_rq_oem_4_815.jpg"
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
                <h4 className="card-title float-right">
                  <FaDollarSign />
                  120<small>/hr</small>
                </h4>
                <small className="float-right mt-2 font-weight-light">
                  Starting from :
                </small>
                <h3 className="card-title">Tesla model S</h3>
                <hr />
                <span class="badge badge-light">Sedan</span>
                <p className="card-text float-right">
                  <MdLocationOn />
                  San Jose
                </p>
                <br />
                <br />
                <span className="badge badge-pill badge-success">
                  Available
                </span>
                <button type="button" className="btn btn-primary  float-right">
                  Book
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card m-2">
          <div className="row ">
            <div className="col-md-4">
              <img
                src="https://www.tesla.com/ns_videos/p-social-card.jpg"
                className="card-img"
                alt="car"
                max-width="100%"
                height="180px"
              />
            </div>
            <div className="col-md-8 ">
              <div className="card-block p-3">
                {/* <small className="float-right font-weight-light">
                  Starting from
                </small>
                <br /> */}
                <h4 className="card-title float-right">
                  <FaDollarSign />
                  150<small>/hr</small>
                </h4>
                <small className="float-right mt-2 font-weight-light">
                  Starting from :
                </small>
                <h3 className="card-title">Tesla Cybertruck</h3>
                <hr />
                <span class="badge badge-light">SUV</span>
                <p className="card-text float-right">
                  <MdLocationOn />
                  San Jose
                </p>
                <br />
                <br />
                <span className="badge badge-pill badge-danger">
                  Not Available
                </span>
                <button type="button" className="btn btn-link  float-right">
                  Find SUV at other locations
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CarCard;
