import http from "./httpService";
import { apiUrl } from "../config.json";

export function getLocation() {
  return http.get(apiUrl + "/locations");
}

export function getVehicles(queryString) {
  return http.get(apiUrl + "/vehicles?" + queryString);
}

export function postNewBooking(queryString) {
  return http.post(apiUrl + "/booking?" + queryString);
}

export function getBookings() {
  return http.get(apiUrl + "/bookings");
}

export function postReturnVehicle(queryString, body) {
  return http.post(apiUrl + "/return?" + queryString, body);
}

export function cancelBooking(bookingId) {
  return http.delete(apiUrl + "/booking?bookingId=" + bookingId);
}

export function getUser() {
  return http.get(apiUrl + "/user");
}
