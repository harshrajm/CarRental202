import React, { Component } from "react";
import { Link } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import { getLocation, addVehicle } from "../services/backendCallService";
import DateTimePicker from "react-datetime-picker";
import { toast } from "react-toastify";

class VehicleForm extends Component {
  state = {
    data: {
      hourlyRate: [25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11],
      type: "Sedan",
      location: "San Jose",
      name: "",
      registrationTag: "",
      manufacturer: "",
      mileage: "",
      lateFees: "",
      modelYear: "",
      lastService: "",
      vehicleImageURL: "",
      condition: "good",
      baseRate: "",
      modelYear: new Date(),
      lastService: new Date()
    },
    vehicleType: ["Hatchback", "Sedan", "SUV", "Van", "Truck"],
    vehicleCondition: ["good", "fair", "old"],
    locations: []
    //hourlyRateHeading:[5,10,15,20,25,30,35,40,45,50,55,60,65]
  };

  async componentDidMount() {
    const { data: locations } = await getLocation();
    this.setState({ locations });
  }

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    if (input.name === "hourlyRate") {
      data[input.name] = input.value.split(",");
    } else {
      data[input.name] = input.value;
    }
    this.setState({ data });
  };

  handleSubmit = async e => {
    e.preventDefault();
    console.log("form submitted!!");
    //do http call
    const { data } = this.state;
    console.log(data);
    try {
      alert("handle submit");
      const resp = await addVehicle(data);
      this.props.onReload();
      this.props.history.replace("/admin/vehicle");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log("400 error");
        toast.alert("error occured");
      }
    }
  };

  onChangeModelYear = modelYear => {
    const data = { ...this.state.data };
    data.modelYear = modelYear;
    this.setState({ data });
  };
  onChangeLastService = lastService => {
    const data = { ...this.state.data };
    data.lastService = lastService;
    this.setState({ data });
  };

  handlePrice = (e, i) => {
    console.log(e.target.value, i);
    const data = { ...this.state.data };
    data.hourlyRate[i] = parseInt(e.target.value);
    this.setState({ data });
  };

  render() {
    return (
      <React.Fragment>
        <Link className="btn btn-link float-right" to="/admin/vehicle/">
          <BsArrowLeftShort /> Back
        </Link>
        <h2>Add Vehicle</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-4">
              <div className="form-group">
                <label>Type</label>
                <select
                  name="type"
                  className="form-control"
                  id="locationSelect"
                  onChange={this.handleChange}
                  //value={this.state.data.type}
                  value={this.state.vehicleType.filter(
                    option => option === this.state.data.type
                  )}
                  required
                >
                  {this.state.vehicleType.map(vt => (
                    <option key={vt} value={vt}>
                      {vt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  onChange={this.handleChange}
                  required
                  type="text"
                  className="form-control"
                  placeholder="Enter name"
                />
              </div>
              <div className="form-group">
                <label>Manufacturer</label>
                <input
                  name="manufacturer"
                  onChange={this.handleChange}
                  required
                  type="text"
                  className="form-control"
                  placeholder="Enter vehicle Manufacturer"
                />
              </div>
              <div className="form-group">
                <label>Registraton Number</label>
                <input
                  name="registrationTag"
                  onChange={this.handleChange}
                  required
                  type="text"
                  className="form-control"
                  placeholder="Enter registration number"
                />
              </div>
              <div className="form-group">
                <label>Image Url</label>
                <input
                  name="vehicleImageURL"
                  onChange={this.handleChange}
                  required
                  type="text"
                  className="form-control"
                  placeholder="Enter image Url"
                />
              </div>
              <div className="form-group">
                <label>Vehicle Condition</label>
                <select
                  name="condition"
                  className="form-control"
                  id="conditionSelect"
                  onChange={this.handleChange}
                  //value={this.state.data.condition}
                  value={this.state.vehicleCondition.filter(
                    option => option === this.state.data.condition
                  )}
                  required
                >
                  {this.state.vehicleCondition.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label>Location</label>
                <select
                  name="location"
                  className="form-control"
                  id="locationSelect"
                  onChange={this.handleChange}
                  //value={this.state.data.location}
                  value={
                    this.state.locations.filter(
                      option => option.name === this.state.data.location
                    ).name
                  }
                  required
                >
                  {this.state.locations.map(l => (
                    <option key={l._id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Base rate</label>
                <input
                  name="baseRate"
                  onChange={this.handleChange}
                  required
                  type="number"
                  className="form-control"
                  placeholder="Enter base rate"
                />
              </div>
              {/* <div className="form-group">
                <label>Hourly Rate</label>
                <br />
                <input
                  name="hourlyRate"
                  onChange={this.handleChange}
                  type="text"
                  className="form-control"
                  placeholder="Enter 15 comma seperated rates"
                  value={this.state.data.hourlyRate.join(",")}
                  required
                  disabled={true}
                />
                <small>
                  Note: Here the first value in the comma separated string is
                  for 0-5hrs, second value is for 6-10 hrs,.....and the last
                  value i.e the 15th value is for 70-75hrs
                </small>
              </div> */}
              <div className="form-group">
                <label>Late fees</label>
                <input
                  name="lateFees"
                  onChange={this.handleChange}
                  required
                  type="number"
                  className="form-control"
                  placeholder="Enter late fees"
                />
              </div>
              <div className="form-group">
                <label>Current Milage</label>
                <input
                  name="mileage"
                  onChange={this.handleChange}
                  required
                  type="number"
                  className="form-control"
                  placeholder="Enter milage"
                />
              </div>
              <div className="form-group">
                <label>Last Serviced</label>
                <br />
                <DateTimePicker
                  onChange={this.onChangeLastService}
                  value={this.state.data.lastService}
                  clearIcon={null}
                />
              </div>
              <div className="form-group">
                <label>Model Year</label>
                <br />
                <DateTimePicker
                  onChange={this.onChangeModelYear}
                  value={this.state.data.modelYear}
                  clearIcon={null}
                />
              </div>
            </div>
            <div className="col-4 text-center">
              <label>Hourly Rate</label>
              <table>
                <tbody>
                  {[
                    5,
                    10,
                    15,
                    20,
                    25,
                    30,
                    35,
                    40,
                    45,
                    50,
                    55,
                    60,
                    65,
                    70,
                    75
                  ].map((hrs, i) => (
                    <tr key={hrs} className="row">
                      <td className="col-5 text-right"> {"< " + hrs} hrs</td>
                      <td className="col-5">
                        <input
                          name="hourlyPriceTable"
                          onChange={e => {
                            this.handlePrice(e, i);
                          }}
                          className="form-control"
                          value={this.state.data.hourlyRate[i]}
                          type="number"
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="submit" className="btn btn-primary ml-3">
              Add Vehicle
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default VehicleForm;
