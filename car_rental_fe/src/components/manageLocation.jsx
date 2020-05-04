import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Location = props => (
  <tr>
    <td>{props.location.name}</td>
    <td>{props.location.address}</td>
    <td>{props.location.vehicleCapacity}</td>
    <td>
      <Link to={"/edit/" + props.location.name}>edit</Link> | <a href="#" onClick={() => { props.deleteLocation(props.location.name) }}>delete</a>
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
        <h3>Manage Locations</h3>
        <Link to="/createlocation">+ Create</Link>

        <table className="table">
          <thead className="thead-light">
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