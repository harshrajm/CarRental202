import React, { Component } from "react";
import {
  getUser,
  extendMembership,
  getMembershipFee,
  deleteUser
} from "../services/backendCallService";
import moment from "moment";
import { toast } from "react-toastify";
import auth from "../services/authService";

class MyProfile extends Component {
  state = { user: {} };

  async componentDidMount() {
    const { data: user } = await getUser();
    const { data: membershipFee } = await getMembershipFee();
    this.setState({ user, membershipFee: membershipFee[0].membershipFee });
  }

  handleExtend = async () => {
    //alert("extend membership clicked");
    await extendMembership();
    const { data: user } = await getUser();
    this.setState({ user });
    toast.success("Membership extended");
  };

  handleDelete = async () => {
    const data = { ...this.state.user };
    //const email = this.state.user.email;
    try {
      await deleteUser(data);
      toast.success("user deleted");
      auth.logout();
      window.location = "/";
    } catch (ex) {
      toast.error("You have active bookings");
    }
  };

  render() {
    const {
      name,
      profilePictureURL,
      email,
      membershipEndDate,
      membershipActive
    } = this.state.user;

    return (
      <React.Fragment>
        <div className="justify-content-center row mt-5">
          <div className="card w-75">
            <div className="card-body row">
              <div className="col-4">
                <img
                  src={profilePictureURL}
                  className="card-img"
                  max-width="100%"
                  height="180px"
                  alt="car"
                />
              </div>
              <div className="col-8">
                {membershipActive ? (
                  <span className="badge badge-success float-right">
                    MEMBERSHIP ACTIVE
                  </span>
                ) : (
                  <span className="badge badge-danger float-right">
                    MEMBERSHIP ENDED
                  </span>
                )}
                <h2 className="card-title">{name}</h2>
                <p className="card-text">{email}</p>
                <p className="card-text">
                  Member till :{" "}
                  {moment(membershipEndDate).format("ddd DD MMM YYYY, HH:mm")}
                </p>

                <button
                  type="button"
                  className="btn btn-primary float-right"
                  onClick={this.handleExtend}
                >
                  Extend membership +6 months for ${this.state.membershipFee}
                </button>
                <button
                  type="button"
                  className="btn btn-danger float-right mr-2"
                  onClick={this.handleDelete}
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MyProfile;
