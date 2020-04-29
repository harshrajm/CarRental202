import React, { Component } from 'react';
import { getUserList } from "../services/backendCallService";
import axios from 'axios';

export default class ManageUsers extends Component {
  state = { user: [] };
  
  async componentDidMount() {
    const { data: user } = await getUserList();
    this.setState({ user });

    this.deleteUser = this.deleteUser.bind(this)
  }

  deleteUser(id) {
    axios.delete('http://localhost:8080/admin/user'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      item: this.state.user.filter(el => el._id !== id)
    })
  }

  getUsersList() {
    if (this.state.user) {
      return this.state.user.map(item => (
        <tr>
          <td>{item.name}</td>
          <td>{item.username}</td>
          <td>{item.email}</td>
          <td>{item.membershipActive.toString()}</td>
          <td>
      <a href="#" onClick={() => { item.deleteUser(item._id) }}>Terminate</a>
    </td>
        </tr>
      ));
    }
  }
  
  render() {
    return (
      <div>
        <h3>Manage Users</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Membership Active</th>
            </tr>
          </thead>
          <tbody>
            {this.getUsersList()}
          </tbody>
        </table>
      </div>
    )
  }
}

