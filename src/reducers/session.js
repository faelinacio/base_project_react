const initialState = {
  isLogged: !!localStorage.getItem("accessToken"),
  user: JSON.parse(localStorage.getItem("user")),
  accessToken: localStorage.getItem("accessToken"),
};

const session = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('accessToken', action.payload.accessToken);
      return {
        isLogged: true,
        user: action.payload,
        accessToken: action.payload.accessToken
      };
    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      return {
        isLogged: false,
        user: null,
        accessToken: null,
      }
    case 'UPDATE-USER':
      return {
        ...state,
        user: action.payload
      }
    default:
      return {
        ...initialState
      }
  }
}

export default session;
