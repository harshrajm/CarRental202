import React, { Component } from "react";
import { Link } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
class VehicleForm extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Link className="btn btn-link float-right" to="/admin/vehicle/">
          <BsArrowLeftShort /> Back
        </Link>
        <h2>Add Vehicle</h2>
      </React.Fragment>
    );
  }
}

export default VehicleForm;
