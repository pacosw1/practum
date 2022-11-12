import React, { createContext, useEffect, useState } from "react";
import { client } from "./../../config/environment";

const sessionContext = createContext({});

const SessionProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const logoutWindow = async () => {
    setIsLogged(false);
  };

  const logout = async () => {
    logoutWindow();
    await client.post("auth/logout");
    localStorage.clear();
    localStorage.setItem("logout", Date.now()); // Force logout on every tab
  };

  useEffect(() => {
    const fetchSession = async () => {
      await client.get("auth").then((res) => {
        const data = res?.data?.data?.data;
        const authentication = res?.data?.data?.authenticated;
        setIsLogged(authentication);
        setUser(data);
        setLoading(false);
      });
    };

    setLoading(true);
    fetchSession().catch((err) => {
      setLoading(false);
    });
  }, []);

  return (
    <sessionContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        logout,
        loading,
      }}
    >
      {children}
    </sessionContext.Provider>
  );
};

export { sessionContext };
export default SessionProvider;
