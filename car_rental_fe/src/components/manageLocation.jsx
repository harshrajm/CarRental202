import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getLocation, deleteLocation } from "../services/backendCallService";
import { toast } from "react-toastify";

const Location = props => (
  <tr>
    <td>{props.location.name}</td>
    <td>{props.location.address}</td>
    <td>{props.location.vehicleCapacity}</td>
    <td>
      {props.location.name !== "UNASSIGNED" && (
        <React.Fragment>
          <Link
            className="btn btn-link"
            to={"/admin/location/edit/" + props.location.name}
          >
            <FaEdit />
          </Link>
          <button
            href="#"
            className="btn btn-link"
            onClick={() => {
              props.deleteLocation(props.location.name);
            }}
          >
            <RiDeleteBin6Line />
          </button>
        </React.Fragment>
      )}
    </td>
  </tr>
);

export default class ManageLocation extends Component {
  constructor(props) {
    super(props);

    this.deleteLocation = this.deleteLocation.bind(this);

    this.state = { location: [] };
  }

  async componentDidMount() {
    //added by harshraj
    const { data: location } = await getLocation();
    this.setState({ location });
    // axios
    //   .get("http://localhost:8080/locations/")
    //   .then(response => {
    //     this.setState({ location: response.data });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }

  async deleteLocation(id) {
    // axios
    //   .delete("http://localhost:8080/location/?name=" + id)
    //   .then(response => {
    //     console.log(response.data);
    //   });
    try {
      await deleteLocation(id);
      const { data: location } = await getLocation();
      this.setState({ location });
      toast.success("Location deleted");
    } catch (ex) {
      toast.error("Unable to delete location");
    }
  }

  locationList() {
    return this.state.location.map(item => {
      return (
        <Location
          location={item}
          deleteLocation={this.deleteLocation}
          key={item.name}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <Link
          to="/admin/location/createlocation"
          className="btn btn-primary float-right"
        >
          <BsPlus /> Add Location
        </Link>
        <h2>Manage Locations</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Vehicle Capacity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{this.locationList()}</tbody>
        </table>
      </div>
    );
  }
}
