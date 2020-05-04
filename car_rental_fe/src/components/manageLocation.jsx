import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";

const Location = props => (
  <tr>
    <td>{props.location.name}</td>
    <td>{props.location.address}</td>
    <td>{props.location.vehicleCapacity}</td>
    <td>
      <Link to={"/edit/" + props.location.name}><FaEdit /></Link> | <a href="#" onClick={() => { props.deleteLocation(props.location.name) }}>delete</a>
    </td>
  </tr>
)

export default class ManageLocation extends Component {
  constructor(props) {
    super(props);

    this.deleteLocation = this.deleteLocation.bind(this)

    this.state = {location: []};
  }

  componentDidMount() {
    axios.get('http://localhost:8080/locations/')
      .then(response => {
        this.setState({ location: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  deleteLocation(id) {
    axios.delete('http://localhost:8080/location/?name='+id)
      .then(response => { console.log(response.data)});

    this.setState({
      location: this.state.location.filter(el => el.name !== id)
    })
  }

  locationList() {
    return this.state.location.map(item => {
      return <Location location={item} deleteLocation={this.deleteLocation} key={item.name}/>;
    })
  }

  render() {
    return (
      <div>
        <Link to="/createlocation" className="btn btn-primary float-right">
          <BsPlus /> Add Location
        </Link>
        <h2>Manage Locations</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Vehicle Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { this.locationList() }
          </tbody>
        </table>
      </div>
    )
  }
}