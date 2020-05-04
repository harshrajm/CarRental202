import React, { Component } from "react";
import qs from "query-string";
import { Redirect } from "react-router-dom";

import { getLocationOne, updateLocation } from "../services/backendCallService";
import { Link } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
export default class EditLocation extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      name: "",
      address: "",
      vehicleCapacity: "",
      redirect: false
    };
  }

  async componentDidMount() {
    var q = { name: this.props.match.params.name };
    const data = await getLocationOne(qs.stringify(q));
    console.log(data);
    this.setState({ name: data.data.name });
    this.setState({
      address: data.data.address === undefined ? "" : data.data.address
    });
    this.setState({ vehicleCapacity: data.data.vehicleCapacity });
    this.setState({ _id: data.data._id });
    console.log(this.state);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  onSubmit = async e => {
    console.log(this.state);
    e.preventDefault();
    var data = await updateLocation(this.state);
    alert(data.data);
    this.setState({ redirect: true });
  };

  render() {
    return (
      <div>
        <Link className="btn btn-link float-right" to="/admin/location/">
          <BsArrowLeftShort /> Back
        </Link>
        {this.state.redirect ? <Redirect to="/admin/location" /> : ""}
        <h2>Edit Location</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name: </label>
            <input
              type="text"
              required
              className="form-control"
              defaultValue={this.state.name}
              onKeyUp={this.handleInputChange}
              name="name"
            />
          </div>
          <div className="form-group">
            <label>Address: </label>
            <input
              type="text"
              required
              className="form-control"
              defaultValue={this.state.address}
              onKeyUp={this.handleInputChange}
              name="address"
            />
          </div>
          <div className="form-group">
            <label>Vehicle Capacity: </label>
            <input
              type="text"
              className="form-control"
              defaultValue={this.state.vehicleCapacity}
              onKeyUp={this.handleInputChange}
              name="vehicleCapacity"
            />
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Edit Location"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
