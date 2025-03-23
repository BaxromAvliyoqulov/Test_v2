<template>
  <div class="signup-container">
    <div class="signup-box">
      <h1 class="signup-title">Sign Up</h1>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="input-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password:</label>
          <div class="password-input-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              maxlength="10"
            />
            <span class="toggle-password" @click="togglePasswordVisibility">
              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </span>
          </div>
        </div>
        <button type="submit" class="signup-button">Sign Up</button>
      </form>
      
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <div class="google-signup">
        <button @click="handleGoogleSignUp" type="button">
          <img src="../assets/img/googleicon.svg" alt="Google Icon" />
          Continue with Google
        </button>
      </div>

      <div class="link-button">
        <router-link to="/login">
          Already have an account? <span>Log In</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default {
  name: "SignUp",
  setup() {
    const router = useRouter()
    const username = ref("")
    const email = ref("")
    const password = ref("")
    const showPassword = ref(false)
    const errorMessage = ref(null)
    const successMessage = ref(null)

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const handleSubmit = async () => {
      errorMessage.value = null
      successMessage.value = null

      if (!email.value || !password.value || !username.value) {
        errorMessage.value = "Пожалуйста, заполните все поля"
        return
      }

      if (password.value.length > 10) {
        errorMessage.value = "Пароль не должен превышать 10 символов"
        return
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        )
        console.log("User created:", userCredential.user)
        successMessage.value = "Регистрация успешна!"
        
        router.push('/')
      } catch (error) {
        console.error("Error signing up:", error.message)
        errorMessage.value = "Ошибка: " + error.message
      }
    }

    const handleGoogleSignUp = async () => {
      try {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        console.log("Google Sign Up successful:", result.user)
        successMessage.value = "Вход через Google выполнен успешно!"
        router.push('/')
      } catch (error) {
        console.error("Google Sign Up failed:", error.message)
        errorMessage.value = "Ошибка входа через Google: " + error.message
      }
    }

    return {
      username,
      email,
      password,
      showPassword,
      errorMessage,
      successMessage,
      togglePasswordVisibility,
      handleSubmit,
      handleGoogleSignUp
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.signup-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: white;
  margin-top: 20px;
  margin-top: 20px;
}

.signup-box {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.signup-title {
  margin-bottom: 25px;
  color: #333;
  font-size: 24px;
  text-align: center;
  font-weight: 600;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
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
  padding: 4px;
}

.signup-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.signup-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.signup-button:active {
  transform: translateY(0);
}

.error-message,
.success-message {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.google-signup {
  margin-top: 20px;
}

.google-signup button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 10px;
}

.google-signup button:hover {
  background-color: #f8f9fa;
  border-color: #999;
  transform: translateY(-2px);
}

.google-signup img {
  width: 20px;
  height: 20px;
}

.link-button {
  margin-top: 20px;
  text-align: center;
}

.link-button a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.link-button a:hover {
  color: #333;
}

.link-button span {
  color: #007bff;
  font-weight: 500;
}

@media (max-width: 768px) {
  .signup-box {
    width: 95%;
    padding: 25px;
  }
  
  .signup-title {
    font-size: 22px;
    margin-bottom: 20px;
  }
}

@media (max-width: 480px) {
  .signup-container {
    padding: 15px;
    margin-top: 40px;
  }

  .signup-box {
    width: 100%;
    padding: 20px;
  }
  
  .signup-title {
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  .input-group {
    margin-bottom: 15px;
  }
  
  .input-group input {
    padding: 10px;
  }
  
  .signup-button,
  .google-signup button {
    padding: 10px;
  }
}

@media (max-width: 320px) {
  .signup-container {
    padding: 10px;
    margin-top: 30px;
  }

  .signup-box {
    padding: 15px;
  }
  
  .signup-title {
    font-size: 18px;
  }
  
  .input-group {
    margin-bottom: 12px;
  }
  
  .input-group label {
    font-size: 12px;
  }
  
  .input-group input,
  .signup-button,
  .google-signup button {
    padding: 8px;
    font-size: 12px;
  }
  
  .google-signup img {
    width: 16px;
    height: 16px;
  }
  
  .link-button a {
    font-size: 12px;
  }
}
</style>