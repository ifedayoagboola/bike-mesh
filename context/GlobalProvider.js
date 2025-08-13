import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logout } from "../lib/appwrite";
import * as Updates from "expo-updates";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  const handleLogout = async (navigationCallback) => {
    try {
      // Clear local state first
      setIsLoggedIn(false);
      setUser(null);
      
      // Attempt to logout from Appwrite
      await logout();
      
      // Use the navigation callback if provided
      if (navigationCallback) {
        navigationCallback();
      }
    } catch (error) {
      console.log("Logout error:", error);
      // Even if logout fails, ensure we're logged out locally
      setIsLoggedIn(false);
      setUser(null);
      
      // Use the navigation callback if provided
      if (navigationCallback) {
        navigationCallback();
      }
    }
  };

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    onFetchUpdateAsync();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        handleLogout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
