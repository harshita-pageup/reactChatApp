export const setToken = (token: string): void => {
    localStorage.setItem("authToken", token);
  };
  
  export const getToken = (): string | null => {
    return localStorage.getItem("authToken");
  };
  
  export const removeToken = (): void => {
    localStorage.clear();
  };
  
  export const isAuthenticated = (): boolean => {
    const token = getToken();
    return token !== null;
  };
  