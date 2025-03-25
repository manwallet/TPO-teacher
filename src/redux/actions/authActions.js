import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE
} from '../types';

// Login action
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  
  try {
    // In a real app, this would be an API call
    // For now, we'll simulate a successful login
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        if (credentials.username && credentials.password) {
          resolve({
            id: 1,
            username: credentials.username,
            name: '学生',
            role: 'student'
          });
        } else {
          throw new Error('用户名或密码不正确');
        }
      }, 1000);
    });
    
    // Save user to localStorage
    localStorage.setItem('user', JSON.stringify(response));
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: response
    });
    
    return true;
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.message
    });
    
    return false;
  }
};

// Register action
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  
  try {
    // In a real app, this would be an API call
    // For now, we'll simulate a successful registration
    await new Promise((resolve) => {
      setTimeout(() => {
        if (userData.username && userData.password) {
          resolve(true);
        } else {
          throw new Error('注册信息不完整');
        }
      }, 1000);
    });
    
    dispatch({ type: REGISTER_SUCCESS });
    
    return true;
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.message
    });
    
    return false;
  }
};

// Logout action
export const logout = () => (dispatch) => {
  // Remove user from localStorage
  localStorage.removeItem('user');
  
  dispatch({ type: LOGOUT });
};

// Check if user is already logged in (from localStorage)
export const checkAuthState = () => (dispatch) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: user
    });
    
    return true;
  }
  
  return false;
};
