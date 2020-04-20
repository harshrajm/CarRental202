import http from "./httpService";
import { apiUrl } from "../config.json";

export function getLocation() {
  return http.get(apiUrl + "/locations");
}

export function getVehicles(queryString) {
  return http.get(apiUrl + "/vehicles?" + queryString);
}
