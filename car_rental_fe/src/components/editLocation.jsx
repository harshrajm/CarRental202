import React, { Component } from 'react';
import axios from 'axios';

export default class EditLocation extends Component {
  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangevehicleCapacity = this.onChangevehicleCapacity.bind(this);

    this.state = {
      name: '',
      address: '',
      vehicleCapacity: 0,
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8080/locations/'+this.props.match.params.loc)
      .then(response => {
        this.setState({
          name: response.data.name,
          address: response.data.address,
          vehicleCapacity: response.data.vehicleCapacity,
        })   
      })
      .catch(function (error) {
        console.log(error);
      })

    axios.get('http://localhost:8080/location/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            location: response.data.map(location => item.name),
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })

  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    })
  }

  onChangeAddress(e) {
    this.setState({
      address: e.target.value
    })
  }

  onChangevehicleCapacity(e) {
    this.setState({
      vehicleCapacity: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const location = {
      name: this.state.name,
      address: this.state.address,
      vehicleCapacity: this.state.vehicleCapacity,
    }

    console.log(location);

    axios.post('http://localhost:8080/location' + this.props.match.params.id, location)
      .then(res => console.log(res.data));

    window.location = '/';
  }

  render() {
    return (
    <div>
      <h3>Edit Location</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group"> 
          <label>Name: </label>
          <select ref="userInput"
              required
              className="form-control"
              value={this.state.name}
              onChange={this.onChangeName}>
              {
                this.state.location.map(function(item) {
                  return <option 
                    key={item}
                    value={item}>{item}
                    </option>;
                })
              }
          </select>
        </div>
        <div className="form-group"> 
          <label>Address: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.address}
              onChange={this.onChangeAddress}
              />
        </div>
        <div className="form-group">
          <label>Vehicle Capacity: </label>
          <input 
              type="text" 
              className="form-control"
              value={this.state.vehicleCapacity}
              onChange={this.onChangevehicleCapacity}
              />
        </div>

        <div className="form-group">
          <input type="submit" value="Edit Location" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}