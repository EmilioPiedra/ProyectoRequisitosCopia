import { useContext, createContext, useState, useEffect } from 'react';
import type { AccessTokenResponse, AuthResponse, User, Tanquero } from "../types/types";
import { API_URL } from './constants';


interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  isAuthenticated: boolean;
  getAccessToken: () => string;
  saveUser: (userData: AuthResponse) => void;
  getRefreshToken: () => string | null;
  getUser: () => User | undefined;
  signOut: () => void;
  getTanqueroRecords: () => Promise<Tanquero[]>; // Ajustado para devolver una promesa de Tanquero[]
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  getAccessToken: () => "",
  saveUser: (userData: AuthResponse) => {},
  getRefreshToken: () => null,
  getUser: () => undefined,
  signOut: () => {},
  getTanqueroRecords: async () => [], // Inicialmente devuelve una promesa vacía
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function requestNewAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch(`${API_URL}/refresh-Token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken}`,
        },
      });
      if (response.ok) {
        const json = await response.json() as AccessTokenResponse;
        if (json.error) {
          throw new Error(json.error);
        }
        return json.body.accessToken;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function getUserInfo(accessToken: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }
        return json.body;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function getTanqueroRecords(): Promise<Tanquero[]> {
    try {
      const response = await fetch(`${API_URL}/tanquero`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.error) {
          throw new Error(json.error);
        }
        return json.body as Tanquero[];
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener registros de tanquero:", error);
      return []; // Maneja el error según tu lógica
    }
  }

  async function checkAuth() {
    if (accessToken) {
      const userInfo = await getUserInfo(accessToken);
      if (userInfo) {
        saveSessionInfo(userInfo, accessToken, getRefreshToken()!);
        setIsLoading(false);
        return;
      }
    } else {
      const token = getRefreshToken();
      if (token) {
        const newAccessToken = await requestNewAccessToken(token);
        if (newAccessToken) {
          const userInfo = await getUserInfo(newAccessToken);
          if (userInfo) {
            saveSessionInfo(userInfo, newAccessToken, token);
            setIsLoading(false);
            return;
          }
        }
      }
    }
    setIsLoading(false);
  }

  function signOut() {
    setIsAuthenticated(false);
    setAccessToken("");
    setUser(undefined);
    localStorage.removeItem("token");
  }

  function saveSessionInfo(userInfo: User, accessToken: string, refreshToken: string) {
    setAccessToken(accessToken);
    localStorage.setItem("token", JSON.stringify(refreshToken));
    setIsAuthenticated(true);
    setUser(userInfo);
  }

  function getAccessToken() {
    return accessToken;
  }

  function getRefreshToken(): string | null {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      const { token } = JSON.parse(tokenData);
      return token;
    }
    return null;
  }

  function saveUser(userData: AuthResponse) {
    saveSessionInfo(userData.body.user, userData.body.accessToken, userData.body.refreshToken);
  }

  function getUser() {
    return user;
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      getAccessToken,
      saveUser,
      getRefreshToken,
      getUser,
      signOut,
      getTanqueroRecords,
    }}>
      {isLoading ? <div>cargando...</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
