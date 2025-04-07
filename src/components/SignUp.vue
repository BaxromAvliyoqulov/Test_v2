<template>
  <div class="signup-container">
    <h2>Create Account</h2>

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

      <button type="submit" class="button">Sign Up</button>
      <div class="separator">or</div>
      <div class="google-login">
        <button @click.prevent="handleGoogleLog" type="button">
          <img src="../assets/img/googleicon.svg" alt="Google Icon" />
          Continue with Google
        </button>
      </div>
      <div class="link-button">
        <router-link to="/login" class="link-button">
          Already have an account? <span>Log in</span>
        </router-link>
      </div>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default {
  name: 'Signup',
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');
    const router = useRouter();
    const db = getFirestore();

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const handleSubmit = async () => {
      errorMessage.value = '';
      successMessage.value = '';

      if (!username.value.trim() || !email.value.trim() || !password.value) {
        errorMessage.value = 'All fields are required.';
        return;
      }

      try {
        // Create user
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );

        // Update profile display name + save to Firestore
        await Promise.all([
          updateProfile(user, { displayName: username.value }),
          setDoc(doc(db, 'users', user.uid), {
            username: username.value,
            email: email.value,
            createdAt: serverTimestamp(),
          }),
        ]);

        successMessage.value = 'Account created successfully!';
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } catch (error) {
        console.error('Signup Error:', error);
        errorMessage.value = getFirebaseErrorMessage(
          error.code || error.message
        );
      }
    };

    // Optional: Cleaner Firebase error messages
    const getFirebaseErrorMessage = (code) => {
      const errors = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/invalid-email': 'Invalid email format.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/too-many-requests': 'Too many requests. Please try again later.',
      };
      return errors[code] || 'Something went wrong. Please try again.';
    };
    const signInWithGoogle = async () => {
      const provider = new GoogleAuthProvider();

      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Agar yangi foydalanuvchi bo‘lsa, firestore ga yozamiz
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
          username: user.displayName || 'Anonymous',
          email: user.email,
          createdAt: serverTimestamp(),
        });

        successMessage.value = 'Logged in with Google!';
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } catch (error) {
        console.error('Google login error:', error);
        errorMessage.value = 'Google login failed.';
      }
    };

    return {
      username,
      email,
      password,
      showPassword,
      togglePasswordVisibility,
      handleSubmit,
      errorMessage,
      successMessage,
      signInWithGoogle,
      getFirebaseErrorMessage,
    };
  },
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  background-color: #f7f7f7;
  border-radius: 10px;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.input-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.4rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.password-input-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem;
  font-weight: bold;
  width: 100%;
  cursor: pointer;
}

.google-button:hover {
  background-color: #357ae8;
}
.link-button {
  margin-top: 1.5rem;
  font-size: 14px;
  text-align: center;
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

.success {
  color: green;
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  animation: fadeOut 5s ease-out forwards;
  opacity: 1;
  transition: opacity 0.5s ease;
}
.success::before {
  content: '✅ ';
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
  .signup-container {
    padding: 1.5rem;
  }
  h2 {
    font-size: 24px;
  }
  .button,
  .google-button {
    padding: 10px;
    font-size: 14px;
  }
  .input-group {
    margin-bottom: 0.8rem;
  }
  .input-group label,
  input {
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
  .google-button {
    font-size: 14px;
  }
  .google-button img {
    width: 16px;
    height: 16px;
  }
  .separator {
    font-size: 12px;
  }
}
</style>
