// Check if user is authenticated
export const checkAuth = async () => {
  try {
    // In a real app, this would verify the token with the backend
    // For now, we'll just check if there's a user in localStorage
    const user = localStorage.getItem('user');
    return !!user;
  } catch (error) {
    console.error('验证身份时出错:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('获取当前用户时出错:', error);
    return null;
  }
};

// Mock login function (for development)
export const mockLogin = async (username, password) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && password) {
        const user = {
          id: 1,
          username,
          name: '学生',
          role: 'student'
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error('用户名或密码不正确'));
      }
    }, 1000);
  });
};

// Mock register function (for development)
export const mockRegister = async (userData) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userData.username && userData.password) {
        resolve({ success: true });
      } else {
        reject(new Error('注册信息不完整'));
      }
    }, 1000);
  });
};

// Logout
export const logout = () => {
  localStorage.removeItem('user');
};
