export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };
  
  export const logout = () => {
    localStorage.removeItem('token');  // Remove the JWT token
    localStorage.removeItem('user');   // Remove user data
    window.location.href = '/login';   // Redirect to login page
  };
  