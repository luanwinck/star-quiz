import createGlobalState from "react-create-global-state";

const AUTH_KEY = "STAR_QUIZ_USER";

const initialState = {
  token: "",
};

const stringifyUser = localStorage.getItem(AUTH_KEY);
const user = JSON.parse(stringifyUser) || initialState;

const [_useGlobalUser, UserGlobalProvider] = createGlobalState(user);

function useGlobalUser() {
  const [globalUser, _setGlobalUser] = _useGlobalUser();

  function setState(value) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(value));
    _setGlobalUser(value);
  };

  return [globalUser, setState];
};

export { useGlobalUser, UserGlobalProvider };
