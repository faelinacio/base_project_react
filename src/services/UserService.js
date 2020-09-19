import api from "./config/api";

export default class UserService {

  static getUsers = (pageSize, pageNumber) => {
    return api.get('/users', {params: {pageSize, pageNumber}});
  }
}