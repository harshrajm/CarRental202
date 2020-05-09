import React, { Component } from "react";

import { MdLocationOn, MdInfo } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";
import ReactTooltip from "react-tooltip";

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
      registrationTag,
      allowSelectAction,
      onShowAlternateClick,
      condition
    } = this.props;
    return (
      <React.Fragment>
        <div className="card m-4 shadow p-1">
          <div className="row ">
            <div className="col-md-4 thumbnail text-center">
              <img
                src={imgUrl} //"https://media.ed.edmunds-media.com/tesla/model-s/2018/oem/2018_tesla_model-s_sedan_p100d_rq_oem_4_815.jpg"
                className="card-img"
                max-width="100%"
                height="180px"
                alt="car"
              />
              <div className="imgBadge">
                <span className="badge badge-secondary">{condition}</span>
              </div>
            </div>
            <div className="col-md-8 ">
              <div className="card-block p-3">
                <ReactTooltip id={_id} aria-haspopup="true" role="example">
                  <table>
                    <tr>
                      <th>{"< hrs"}</th>
                      {hourlyRate.map((rate, i) => (
                        <th>{(i + 1) * 5}</th>
                      ))}
                    </tr>
                    <tr>
                      <td>$</td>
                      {hourlyRate.map(rate => (
                        <td>{rate}</td>
                      ))}
                    </tr>
                  </table>
                </ReactTooltip>
                {allowSelectAction && rate && (
                  <React.Fragment>
                    <h4 className="card-title float-right">
                      <FaDollarSign />
                      {rate}
                    </h4>

                    <small className="float-right mt-2 font-weight-light">
                      Estimate (Base rate ${baseRate} + Hourly rate{" "}
                      <span
                        data-tip
                        data-for={_id}
                        data-background-color="gray"
                      >
                        <MdInfo />
                      </span>
                      ) :
                    </small>
                  </React.Fragment>
                )}
                <h3 className="card-title">{manu + " " + name}</h3>
                <hr />
                <span className="badge badge-info m-1">{type}</span> |
                <span className="text-muted">
                  <span className="badge badge-light m-1">Condition</span>{" "}
                  {condition}
                </span>
                <p className="card-text float-right">
                  <MdLocationOn />
                  {location}
                </p>
                <br />
                <br />
                {allowSelectAction && isAvailable && (
                  <h3 className="badge badge-pill badge-success">AVAILABLE</h3>
                )}
                {allowSelectAction && !isAvailable && (
                  <h3 className="badge badge-pill badge-danger">
                    NOT AVAILABLE
                  </h3>
                )}
                {allowSelectAction && isAvailable && (
                  <button
                    type="button"
                    className="btn btn-primary  float-right"
                    onClick={() => onBookClick(_id, registrationTag)}
                  >
                    Book
                  </button>
                )}
                {allowSelectAction && !isAvailable && (
                  <button
                    type="button"
                    className="btn btn-link  float-right"
                    onClick={() => onShowAlternateClick(type, location)}
                  >
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
