import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  email?: string;
  name?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  window.location.href = "/auth/sign-in";
};

export const checkTokenExpiry = (): boolean => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const decoded: DecodedToken = jwtDecode(token);
    
    // If token is expired, logout the user
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn("Token expired. Logging out user...");
      logoutUser();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    logoutUser();
    return false;
  }
};

export const getAdminIdFromToken = (): number | null => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage");
      return null;
    }

    // Check expiry before decoding
    if (!checkTokenExpiry()) {
      return null;
    }

    const decoded: DecodedToken = jwtDecode(token);
    return decoded.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getToken = (): string | null => {
  // Check expiry before returning token
  if (!checkTokenExpiry()) {
    return null;
  }
  return localStorage.getItem("token");
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    
    // Check if token is expired - auto logout if expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn("Token expired. Logging out user...");
      logoutUser();
      return false;
    }
    
    return true;
  } catch {
    logoutUser();
    return false;
  }
};

// Get decoded token data
export const getDecodedToken = (): DecodedToken | null => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    // Check expiry before decoding
    if (!checkTokenExpiry()) {
      return null;
    }

    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Setup auto-check for token expiry (call this on app initialization)
export const setupTokenExpiryCheck = (intervalMs: number = 60000): ReturnType<typeof setInterval> => {
  // Check immediately
  checkTokenExpiry();
  
  // Then check periodically (default: every 1 minute)
  return setInterval(() => {
    checkTokenExpiry();
  }, intervalMs);
};