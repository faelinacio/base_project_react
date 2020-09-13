import api from "./config/api";

export default class AuthService {

  static login = ({username, password}, cb) => {
    return (dispatch) => {
      api.post('/auth/login', {
        email: username,
        password
      }).then(({data}) => {
        dispatch({
          type: 'LOGIN',
          payload: data
        });
        cb(data);
      }).catch(err => {
        cb(null, err?.response?.data?.message || err);
      });
    }
  }

  static logout() {
    return {
      type: 'LOGOUT'
    }
  }
}