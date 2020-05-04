import React, { Component } from "react";
import {
  getBookings,
  postReturnVehicle,
  cancelBooking
} from "../services/backendCallService";
import BookingCard from "./common/bookingCard";
import Modal from "react-modal";
import moment from "moment";
import Rating from "react-rating";
import qs from "query-string";
import { toast } from "react-toastify";

class MyBooking extends Component {
  state = {
    showModal: false,
    data: { rating: 0, bookingId: "", condition: "", feedback: "" }
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  async loadBookings() {
    let { data: bookings } = await getBookings();
    bookings = bookings.sort(
      (a, b) => new Date(b.checkOut) - new Date(a.checkOut)
    );
    this.setState({ bookings });
  }

  async componentDidMount() {
    await this.loadBookings();
    //console.log(bookings);
  }

  handleEndTripClick = id => {
    //alert("id " + id);
    const selectedBooking = this.state.bookings.filter(b => {
      return b._id === id;
    });
    const data = { ...this.state.data };
    data["bookingId"] = id;
    this.setState({ data, selected: selectedBooking[0], showModal: true });
  };

  handleCancelBooking = async id => {
    //alert("cancel " + id);
    //backend call
    try {
      await cancelBooking(id);
      //const { data: bookings } = await getBookings();
      //this.setState({ bookings });
      await this.loadBookings();
      toast.success("Booking cancelled");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log("400 error");
      }
    }
    //update list
  };

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  handleChangeRating = value => {
    const data = { ...this.state.data };
    data["rating"] = value;
    this.setState({ data });
  };
  handleSubmit = async e => {
    e.preventDefault();
    //alert("form submitted");
    //console.log("form submitted!!", this.state.data);
    //call backend
    const data = { ...this.state.data };

    try {
      //backend call
      await postReturnVehicle(qs.stringify(data), data);
      //update state with new list
      //const { data: bookings } = await getBookings();
      await this.loadBookings();
      this.setState({ showModal: false });
      toast.success("Trip Ended!");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log("400 error");
      }
    }
  };
  render() {
    Modal.setAppElement("#root");
    if (!this.state.bookings)
      return <p className="text-center mt-3"> No bookings to display</p>;
    return (
      <React.Fragment>
        {this.state.bookings && (
          <p className="ml-4 mt-3">
            {" "}
            displaying {this.state.bookings.length} booking(s)
          </p>
        )}
        {this.state.bookings &&
          this.state.bookings.map(b => (
            <BookingCard
              key={b._id}
              bookingsDtls={b}
              onEndTripClicked={this.handleEndTripClick}
              onCancelBookingClicked={this.handleCancelBooking}
            />
          ))}

        <Modal
          isOpen={this.state.showModal}
          contentLabel="Minimal Modal Example"
        >
          <button
            onClick={this.handleCloseModal}
            className="btn btn-light float-right"
          >
            x
          </button>
          <br />
          <br />
          {this.state.selected && (
            <div className="row justify-content-center">
              <div className="col-3 addTopMargin">
                <div className="card">
                  <div className=" thumbnail text-center">
                    <img
                      src={this.state.selected.vehicleObject.vehicleImageURL}
                      className="card-img"
                      max-width="100%"
                      height="180px"
                      alt="car"
                    />
                    <div className="imgBadge">
                      <span className="badge badge-secondary">
                        {this.state.selected.vehicleObject.type}
                      </span>
                    </div>
                    <div className="caption">
                      <h2>
                        <strong>
                          {this.state.selected.vehicleObject.registrationTag}
                        </strong>
                      </h2>
                    </div>
                  </div>

                  <div className="card-body">
                    <h5 className="card-title">
                      {this.state.selected.vehicleObject.manufacturer +
                        " " +
                        this.state.selected.vehicleObject.name}
                    </h5>
                    <span className="badge badge-light">
                      Checkout :{" "}
                      {moment(this.state.selected.checkOut).format(
                        "ddd MMM DD HH:mm"
                      )}
                    </span>

                    <br />
                    <span className="badge badge-light">
                      Expected return :{" "}
                      {moment(this.state.selected.expectedCheckin).format(
                        "ddd MMM DD HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-7">
                <form onSubmit={this.handleSubmit}>
                  <h3>Overall Rating</h3>
                  <Rating
                    onChange={this.handleChangeRating}
                    placeholderRating={this.state.data.rating}
                  />

                  <hr />
                  <label>Feedback about Vehicle and rental service</label>
                  <textarea
                    name="feedback"
                    onChange={this.handleChange}
                    className="form-control"
                    rows="3"
                    required
                    placeholder="Enter feedback"
                  ></textarea>
                  <br />
                  <label>
                    Anything we need to know about vehicle return condition?
                  </label>
                  <textarea
                    name="condition"
                    onChange={this.handleChange}
                    className="form-control"
                    rows="3"
                    required
                    placeholder="eg. cracked windshield"
                  ></textarea>
                  <br />
                  <button type="submit" className="btn btn-danger">
                    End Trip
                  </button>
                </form>
              </div>
            </div>
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

export default MyBooking;
