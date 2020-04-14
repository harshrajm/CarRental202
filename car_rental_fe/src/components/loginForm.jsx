import React, { Component } from "react";

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

  handleSubmit = e => {
    e.preventDefault();
    console.log("form submitted!!", this.state.data);
    //do http call
  };

  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <div className="row justify-content-center">
          <div className="col-6">
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
