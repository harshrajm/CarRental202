import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { deleteOneUser, getUserList } from "../services/backendCallService";
import { toast } from "react-toastify";

const User = props => (
  <tr>
    <td>{props.user.name}</td>
    <td>{props.user.username}</td>
    <td>{props.user.email}</td>
    <td>
      {props.user.membershipActive ? (
        <span className="badge badge-success">Active</span>
      ) : (
        <span className="badge badge-danger">Inactive</span>
      )}
    </td>
    <td>
      <button
        className="btn btn-danger"
        onClick={() => {
          props.deleteUser(props.user.email);
        }}
      >
        Terminate
      </button>
    </td>
  </tr>
);

export default class ManageUsers extends Component {
  constructor(props) {
    super(props);

    this.deleteUser = this.deleteUser.bind(this);

    this.state = { user: [] };
  }

  async componentDidMount() {
    const { data: user } = await getUserList();
    this.setState({ user });
    // axios
    //   .get("http://localhost:8080/admin/manageUsers")
    //   .then(response => {
    //     this.setState({ user: response.data });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }

  deleteUser = async email => {
    var q = { email: email };
    var data = await deleteOneUser(q);
    this.setState({
      user: this.state.user.filter(el => el.email !== email)
    });
    toast.success("user deleted");
  };

  userList() {
    return this.state.user.map(item => {
      return <User user={item} deleteUser={this.deleteUser} key={item.email} />;
    });
  }

  render() {
    return (
      <div>
        <h2>Manage Users</h2>
        <table className="table ">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Membership</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{this.userList()}</tbody>
        </table>
      </div>
    );
  }
}
