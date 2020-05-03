import React, { Component } from "react";
import { getVehicles } from "../services/backendCallService";
import { Link } from "react-router-dom";

class ManageVehicle extends Component {
  state = { vehicles: [] };
  async componentDidMount() {
    const { data: vehicles } = await getVehicles();
    this.setState({ vehicles });
  }
  render() {
    return (
      <React.Fragment>
        <button type="button" className="btn btn-primary float-right">
          Add Vehicle
        </button>
        <h2>Manage Vehicles</h2>
        <table className="table text-center">
          <thead>
            <tr>
              <th scope="col">Reg. Number</th>
              <th scope="col">Name</th>
              <th scope="col">Manufacturer</th>
              <th scope="col">Location</th>
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody>
            {this.state.vehicles.map(v => (
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

export default ManageVehicle;
