import React, { Component } from "react";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";

class CarSearchForm extends Component {
  state = {
    data: {
      startDate: moment(new Date())
        .add(1, "hours")
        .toDate(),
      endDate: moment(new Date())
        .add(2, "hours")
        .toDate(),
      selectedLocation: ""
    },
    locations: ["test1", "test2"]
  };

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
  };

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  handleSubmit = async e => {
    e.preventDefault();
    console.log("form submitted!!", this.state.data);
    //call backend
    try {
      const { data } = this.state;
      //await auth.login(data);
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
            <div className="card-header">Enter details to book a car</div>
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
                          <option key={l}>{l}</option>
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
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary float-right">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CarSearchForm;
