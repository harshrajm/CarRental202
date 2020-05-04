import React, { Component } from "react";
import { getUserList, deleteUser } from "../services/backendCallService";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";

export default class ManageUsers extends Component {
  state = { user: [] };

  async componentDidMount() {
    const { data: user } = await getUserList();
    this.setState({ user });
  }

  handleDelete = async email => {
    alert("to delete " + email);
    const data = {};
    data["email"] = email;
    try {
      //await deleteUser(data);
      toast.success("user deleted");
    } catch (ex) {
      toast.error("Error deleting user");
    }
  };

  getUsersList() {
    if (this.state.user) {
      return this.state.user.map(item => (
        <tr>
          <td>{item.name}</td>
          <td>{item.username}</td>
          <td>{item.email}</td>
          <td>
            {item.membershipActive ? (
              <span class="badge badge-success">Active</span>
            ) : (
              <span class="badge badge-danger">Inactive</span>
            )}
          </td>
          <td>
            <button
              onClick={() => this.handleDelete(item.email)}
              className="btn btn-link"
            >
              <RiDeleteBin6Line />
            </button>
          </td>
        </tr>
      ));
    }
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
          <tbody>{this.getUsersList()}</tbody>
        </table>
      </div>
    );
  }
}
