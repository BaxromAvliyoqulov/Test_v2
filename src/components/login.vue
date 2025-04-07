<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Welcome Back</h2>
      <p class="login-subtitle">Please enter your credentials to continue</p>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            type="text"
            id="email"
            v-model="form.username"
            placeholder="Enter your email address"
            required
            autofocus
          />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <div class="password-input-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              placeholder="Enter your password"
              required
            />
            <span class="toggle-password" @click="togglePasswordVisibility">
              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </span>
          </div>
        </div>
        <button type="submit" class="button">Login</button>
        <div class="separator">or</div>
        <div class="google-login">
          <button @click.prevent="handleGoogleLog" type="button">
            <img src="../assets/img/googleicon.svg" alt="Google Icon" />
            Continue with Google
          </button>
        </div>
        <div class="link-button">
          <router-link to="/SignUp">
            Don't have an account? <span>Sign up</span>
          </router-link>
        </div>
      </form>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../config/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';

export default {
  setup() {
    const router = useRouter();
    const errorMessage = ref('');
    const successMessage = ref('');
    const form = ref({
      username: '',
      password: '',
    });
    const showPassword = ref(false);

    const handleLogin = () => {
      const { username, password } = form.value;
      signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Login successful:', user);
          router.push('/');
        })
        .catch((error) => {
          errorMessage.value =
            'Username or password is incorrect. Please try again.';
          console.error('Login failed:', error.message);
          setTimeout(() => {
            errorMessage.value = '';
          }, 5000); // Hide the error message after 5 seconds
        });
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const handleGoogleLog = async () => {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        console.log('Google Log In successful:', result.user);
        successMessage.value = 'Google login successful!';
        router.push('/');
      } catch (error) {
        console.error('Google LogIn failed:', error.message);
        errorMessage.value = 'Google login error. Please try again.';
        setTimeout(() => {
          errorMessage.value = '';
        }, 5000); // Hide after 5 seconds
      }
    };

    // Handle Enter key press to trigger login
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleLogin();
      }
    };

    return {
      errorMessage,
      successMessage,
      form,
      showPassword,
      handleLogin,
      togglePasswordVisibility,
      handleGoogleLog,
      handleKeyPress,
    };
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.2rem;
}

.login-box {
  background-color: #ffffff;
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: fadeIn 0.4s ease-in-out;
}

.login-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 0.1rem;
  color: #1e3c72;
}

.login-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 1rem;
}

.input-group {
  text-align: left;
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #1e3c72;
  box-shadow: 0 0 0 2px rgba(30, 60, 114, 0.2);
  outline: none;
}

.password-input-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  cursor: pointer;
}

.separator {
  margin: 20px 0;
  color: #aaa;
  font-size: 14px;
  text-transform: uppercase;
}

.google-login button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.google-login button:hover {
  background-color: #f1f1f1;
}

.google-login img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.link-button {
  margin-top: 1.5rem;
  font-size: 14px;
}

.link-button a {
  color: #1e3c72;
  text-decoration: none;
}

.link-button span {
  font-weight: bold;
  color: #007bff;
}

.error-message {
  margin-top: 1rem;
  background-color: #fdecea;
  color: #d93025;
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  animation: fadeOut 5s ease-out forwards;
}

.error-message::before {
  content: '⚠️ ';
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}

@media (max-width: 480px) {
  .login-box {
    padding: 1.5rem;
  }
  .login-title {
    font-size: 24px;
  }
  .login-button,
  input,
  .google-login button {
    padding: 10px;
    font-size: 14px;
  }
  .link-button {
    font-size: 12px;
  }
  .error-message {
    font-size: 12px;
  }
  .success {
    font-size: 12px;
  }
  .google-login img {
    width: 18px;
    height: 18px;
  }
  .google-login button {
    font-size: 14px;
  }
  .separator {
    font-size: 12px;
  }
}
</style>
