import axios from "axios/index";
import Constants from "../core/Constants";

class RequestEngine {
  constructor() {
    let token = localStorage.getItem("token");
    this.apiEngine = axios.create({
      baseURL: Constants.serverlink,
      timeout: Constants.timeout,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
    // this.debugit();
  }

  debugit() {
    this.apiEngine.interceptors.request.use((request) => {
      console.log("Starting Request", request);
      return request;
    });

    this.apiEngine.interceptors.response.use((response) => {
      console.log("Response:", response);
      return response;
    });
  }

  async createUser(path) {
      const link = "/api/user/create"
      return await this.apiEngine.post(link)
  }

  async deleteItem(path, id) {
    const link = "/api/admin/" + path + "/delete/" + id;
    console.log(link);
    return await this.apiEngine.get(link);
  }

  async login(username, password) {
    const link = "/api/admin/login";
    const data = { username: username, password: password };
    console.warn(link);
    return await this.apiEngine.post(link, data);
  }

  async saveItem(path, data) {
    const link = "/api/" + path + "/save";
    console.warn(link);
    return await this.apiEngine.post(link, data);
  }

  async getItem(path, param = "/list") {
    const link = "/api/" + path + param;
    console.warn(link);
    return await this.apiEngine.get(link);
  }

  async postItem(path, param = "/list", filtered = {}) {
    const link = "/api/" + path + param;
    return await this.apiEngine.post(link, filtered);
  }

  async downloadItem() {
    const link = "http://localhost:3061/upload/0e179966-fbd3-437d-bb51-9f3139143bc2.docx"
    return await this.apiEngine.get(link)
  }

}

export default RequestEngine;
