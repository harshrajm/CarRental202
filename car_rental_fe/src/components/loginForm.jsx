import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import auth from "../services/authService";

class LoginForm extends Component {
  state = {
    data: {
      username: "",
      password: ""
    }
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
      await auth.login(data);
      //go back to what the user was doing
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
      //window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log("400 error");
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <React.Fragment>
        <div className="row justify-content-center">
          <div className="col-4">
            <div className="card addTopMargin">
              <div className="card-header">Login</div>
              <div className="card-body">
                <form onSubmit={this.handleSubmit}>
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
                  <button type="submit" className="btn btn-primary">
                    Login
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

export default LoginForm;
