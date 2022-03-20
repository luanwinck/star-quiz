import createGlobalState from "react-create-global-state";

const AUTH_KEY = "STAR_QUIZ_USER";

const initialState = {
  isHost: false,
  user: '',
};

const stringifyUser = localStorage.getItem(AUTH_KEY);
const user = JSON.parse(stringifyUser) || initialState;

const [_useGlobalUser, UserGlobalProvider] = createGlobalState(user);

function useGlobalUser() {
  const [globalUser, _setGlobalUser] = _useGlobalUser();

  function setState({ user }) {
    const newUser = {
      user,
      isHost: user === 'luan.winck', // TODO: como definir o host
    }
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    _setGlobalUser(newUser);
  };

  return [globalUser, setState];
};

export { useGlobalUser, UserGlobalProvider };
