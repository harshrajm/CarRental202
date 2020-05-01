import React, { Component } from "react";
import UsStates from "./common/usStatesDropdown";
import { registerUser } from "../services/authService";
import { toast } from "react-toastify";

class RegisterForm extends Component {
  state = {
    data: {
      username: "",
      password: "",
      email: "",
      address: "",
      creditCard: "",
      creditCardNameonCard: "ambani",
      creditCardCVV: "",
      licenseState: "California",
      licenseNumber: ""
    }
  };

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  handleSubmit = async e => {
    e.preventDefault();
    console.log("form submitted!!");
    //do http call
    const { data } = this.state;
    data["name"] = this.state.data.username;
    try {
      await registerUser(data);
      toast.success("User registered");
      window.location = "/login";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log("400 error");
        toast.error(ex.response.data);
      }
    }
  };

  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <div className="row justify-content-center">
          <div className="col-8">
            <div className="card addTopMargin">
              <div className="card-header">Register</div>
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>Username</label>
                        <input
                          name="username"
                          onChange={this.handleChange}
                          required
                          type="text"
                          className="form-control"
                          placeholder="Enter username"
                        />
                      </div>
                      <div className="form-group">
                        <label>Password</label>
                        <input
                          name="password"
                          onChange={this.handleChange}
                          required
                          type="password"
                          className="form-control"
                          placeholder="Password"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email address</label>
                        <input
                          name="email"
                          onChange={this.handleChange}
                          required
                          type="email"
                          className="form-control"
                          placeholder="Enter email"
                        />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <textarea
                          name="address"
                          onChange={this.handleChange}
                          className="form-control"
                          rows="1"
                          required
                          placeholder="Enter address"
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <div className="col-8">
                          <div className="form-group">
                            <label>Credit card number</label>
                            <input
                              name="creditCard"
                              onChange={this.handleChange}
                              required
                              type="text"
                              className="form-control"
                              placeholder="Enter CC number"
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-group">
                            <label>CVV</label>
                            <input
                              name="creditCardCVV"
                              onChange={this.handleChange}
                              required
                              type="text"
                              className="form-control"
                              placeholder="CVV"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Name on card</label>
                        <input
                          name="creditCardNameonCard"
                          onChange={this.handleChange}
                          required
                          type="text"
                          className="form-control"
                          placeholder="Enter name on card"
                        />
                      </div>
                      <hr />
                      <div className="form-group">
                        <label>Driving license number</label>
                        <input
                          name="licenseNumber"
                          onChange={this.handleChange}
                          required
                          type="text"
                          className="form-control"
                          placeholder="Enter DL number"
                        />
                      </div>
                      <div className="form-group">
                        <label>DL issue state</label>
                        <br />
                        <UsStates
                          name="licenseState"
                          defaultValue={data.licenseState}
                          onSelectState={this.handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default RegisterForm;
