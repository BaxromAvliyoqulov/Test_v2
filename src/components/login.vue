<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="form.email" required autofocus />
        </div>
        <div class="input-group">
          <label for="password">Password:</label>
          <div class="password-input-wrapper">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" required />
            <span class="toggle-password" @click="togglePasswordVisibility">
              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </span>
          </div>
        </div>
        <button type="submit" class="login-button">Login</button>
        <div class="google-login">
          <button @click.prevent="handleGoogleLogin" type="button">
            <img src="../assets/img/googleicon.svg" alt="Google Icon" />
            Continue with Google
          </button>
        </div>
        <div class="link-button">
          <router-link to="/SignUp">Don't have an account? <span>Sign up</span></router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      showPassword: false
    };
  },
  methods: {
    handleLogin() {
      console.log('Login attempt:', this.form.email, this.form.password);
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    handleGoogleLogin() {
      console.log('Google login attempt');
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.login-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: white;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
  text-align: center;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  transition: border 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.input-group input:focus {
  border-color: #1e3c72;
  outline: none;
  box-shadow: 0 0 5px rgba(30, 60, 114, 0.5);
}

.password-input-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0056b3;
}

.google-login {
  margin-top: 20px;
}

.google-login button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.google-login button:hover {
  background-color: #f8f8f8;
  border-color: #999;
}

.google-login img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.link-button {
  margin-top: 20px;
  text-align: center;
}

.link-button a {
  color: #333;
  text-decoration: none;
}

.link-button span {
  color: #007bff;
  font-weight: bold;
}

/* Responsive styles */
@media (max-width: 480px) {
  .login-box {
    padding: 20px;
  }
  
  .input-group input {
    padding: 10px;
  }
  
  .login-button {
    padding: 10px;
  }
}

@media (max-width: 320px) {
  .login-box {
    padding: 15px;
  }
  
  .login-title {
    font-size: 20px;
  }
  
  .input-group {
    margin-bottom: 15px;
  }
}
</style>

