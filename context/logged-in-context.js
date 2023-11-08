import React from "react";

const LoggedInContext = React.createContext({
  onboarded: false,
  setOnboarded: () => {},
});
// export const useLoggedInContext = () => React.useContext(LoggedInContext);
export { LoggedInContext };
