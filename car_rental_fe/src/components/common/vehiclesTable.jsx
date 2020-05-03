import React, { Component } from "react";
import { Link } from "react-router-dom";
class VehiclesTable extends Component {
  render() {
    return (
      <React.Fragment>
        <Link to="/admin/vehicle/add" className="btn btn-primary float-right">
          Add Vehicle
        </Link>
        <h2>Manage Vehicles</h2>
        <table className="table text-center">
          <thead>
            <tr>
              <th scope="col">Reg. Number</th>
              <th scope="col">Name</th>
              <th scope="col">Manufacturer</th>
              <th scope="col">Location</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {this.props.vehicles.map(v => (
              <tr key={v._id}>
                <td>{v.registrationTag}</td>
                <td>{v.name}</td>
                <td>{v.manufacturer}</td>
                <td>{v.location}</td>
                <td>
                  <Link>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default VehiclesTable;
