import React, { Component } from "react";
import {
  getUserList,
  getVehicles,
  getMembershipFee,
  updateMembershipfee
} from "../services/backendCallService";
import { toast } from "react-toastify";

class AdminHome extends Component {
  state = {
    userLen: 0,
    vehicleLen: 0
  };

  async componentDidMount() {
    const { data: users } = await getUserList();
    const { data: vehicles } = await getVehicles();
    const { data: membershipFee } = await getMembershipFee();

    this.setState({
      userLen: users.length,
      vehicleLen: vehicles.length,
      membershipFee,
      currFee: membershipFee[0].membershipFee
    });
  }

  handleChange = ({ currentTarget: input }) => {
    const membershipFee = { ...this.state.membershipFee };
    membershipFee[0].membershipFee = input.value;
    this.setState({ membershipFee });
  };

  handleUpdateMembershipfee = async () => {
    //alert("handleUpdateMembershipfee");
    const membershipFee = { ...this.state.membershipFee };
    updateMembershipfee(membershipFee);
    toast.success("Membership fee updated");
    this.componentDidMount();
  };

  render() {
    return (
      <React.Fragment>
        <h2>Admin Home</h2>
        <hr />
        <div className="row">
          {/* <div className="col">
            <small>Total Bookings</small>
            <h3>todo</h3>
          </div> */}
          <div className="col">
            <small>Total users</small>
            <h3>{this.state.userLen}</h3>
          </div>
          <div className="col">
            <small>Total vehicles</small>
            <h3>{this.state.vehicleLen}</h3>
          </div>
        </div>
        <hr />
        <div className="row">
          {this.state.currFee && (
            <div className="col-3">
              <small>Current Membership Fee</small>
              <h3>${this.state.currFee}</h3>
            </div>
          )}
          <div className="col">
            {this.state.membershipFee && (
              <React.Fragment>
                <h5>Edit membership fees</h5>
                <div className="row">
                  <div className="col">
                    <input
                      name="membershipFee"
                      onChange={this.handleChange}
                      required
                      type="number"
                      className="form-control"
                      placeholder="Edit membership fee"
                      value={this.state.membershipFee[0].membershipFee}
                    />
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      onClick={this.handleUpdateMembershipfee}
                    >
                      Update membership fee to{" $"}
                      {this.state.membershipFee[0].membershipFee}
                    </button>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminHome;
