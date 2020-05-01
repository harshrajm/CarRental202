import React, { Component } from "react";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
import qs from "query-string";
import { getLocation, getVehicles } from "../services/backendCallService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

class CarSearchForm extends Component {
  state = {
    //2020-04-12 hh:mm:ss
    data: {
      startDate: moment(new Date())
        .add(1, "hours")
        .toDate(),
      endDate: moment(new Date())
        .add(2, "hours")
        .toDate(),
      selectedLocation: ""
    },
    locations: [
      {
        _id: "5e95650dc764413c1e8b396c",
        name: "San Jose",
        address: "101 E San Fernando Street"
      },
      {
        _id: "5e95650dc764413c1e8b396a",
        name: "Santa Clara",
        address: "Vista Montana"
      }
    ]
  };

  async componentDidMount() {
    const { data: locations } = await getLocation();
    //console.log(locations);
    this.state.data.selectedLocation = locations[0].name;
    this.setState({
      locations //: locations.map(each => ({
      //   _id: each._id,
      //   name: each.name,
      //   address: each.address
      // }))
    });
  }

  onChangeStartDate = start => {
    const data = { ...this.state.data };
    data.startDate = start;
    data.endDate = moment(start)
      .add(1, "hours")
      .toDate();
    this.setState({ data });
  };

  onChangeEndDate = end => {
    const data = { ...this.state.data };
    data.endDate = end;
    this.setState({ data });
    console.log(end);
  };

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  handleSubmit = async e => {
    //toast.error("component did mount");
    e.preventDefault();
    //console.log("form submitted!!", this.state.data);

    //TO DO validate fields
    //1. check start date is valid
    if (!moment(this.state.data.startDate).isSameOrAfter(moment(new Date()))) {
      toast.error("Invalid start date");
      return;
    }
    //2. check end date is greater then start date
    if (
      !moment(this.state.data.endDate).isAfter(
        moment(this.state.data.startDate)
      )
    ) {
      toast.error("Invalid end date");
      return;
    }
    //3. check if range between start and end date is 72 hrs
    if (
      moment
        .duration(
          moment(this.state.data.endDate).diff(
            moment(this.state.data.startDate)
          )
        )
        .asHours() > 72
    ) {
      toast.error("Max booking time for vehicle is 72 hrs");
      return;
    }
    //call backend
    try {
      const data = {};
      data["expectedCheckin"] = this.state.data.endDate;
      data["checkOut"] = this.state.data.startDate;
      data["location"] = this.state.data.selectedLocation;
      //console.log("toBeSent", data);
      const { data: vehicles } = await getVehicles(qs.stringify(data));
      console.log("vehicles", vehicles);
      if (vehicles.length > 0) {
        this.props.onVehiclesUpdate(vehicles, data);
      } else {
        alert("no vehicles");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log("400 error");
      }
    }
  };

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-8">
          <div className="card addTopMargin">
            <div className="card-header">Enter details to book Vehicle</div>
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="locationSelect">Pickup Location</label>
                      <br />
                      <select
                        name="selectedLocation"
                        className="form-control"
                        id="locationSelect"
                        onChange={this.handleChange}
                        required
                      >
                        {this.state.locations.map(l => (
                          <option key={l._id} value={l.name}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-4">
                    {" "}
                    <div className="form-group">
                      <label>Trip Start Date and Time</label>
                      <br />
                      <DateTimePicker
                        onChange={this.onChangeStartDate}
                        value={this.state.data.startDate}
                        name="startDate"
                        clearIcon={null}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-group">
                      <label>Trip End Date and Time</label>
                      <br />
                      <DateTimePicker
                        onChange={this.onChangeEndDate}
                        value={this.state.data.endDate}
                        name="endDate"
                        clearIcon={null}
                      />
                    </div>
                  </div>
                </div>

                {this.state.data.selectedLocation && (
                  <span>
                    Address :{" "}
                    {
                      this.state.locations.filter(
                        each => each.name === this.state.data.selectedLocation
                      )[0].name
                    }
                  </span>
                )}
                <button
                  type="submit"
                  className="btn btn-primary float-right"
                  disabled={this.props.user && this.props.user.isAdmin}
                >
                  Search
                </button>
                <Link
                  className="btn btn-secondary float-right mr-1"
                  to="/ViewAllVehicles"
                >
                  View all
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CarSearchForm;
