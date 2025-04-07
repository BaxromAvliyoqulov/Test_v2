<template>
  <div class="edit-profile">
    <h1>Edit Profile</h1>
    <form @submit.prevent="saveProfile">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="profile.username" required />
      </div>

      <div class="form-group">
        <label for="password">New Password</label>
        <div class="password-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="profile.password"
            @input="validatePassword"
            :class="{ error: passwordError }"
          />
          <i
            :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            @click="togglePasswordVisibility"
            class="toggle-icon"
          ></i>
        </div>
        <small class="hint">* Parol faqat kiritilgan bo‘lsa yangilanadi</small>
        <span v-if="passwordError" class="error-message">{{
          passwordError
        }}</span>
      </div>

      <button type="submit" :disabled="loading">
        <span v-if="loading">Saving...</span>
        <span v-else>Save Changes</span>
      </button>
    </form>
  </div>
</template>

<script>
import { getAuth, updatePassword, updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      profile: {
        username: '',
        password: '',
      },
      showPassword: false,
      loading: false,
      passwordError: '',
    };
  },
  async mounted() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          this.profile.username = userDoc.data().username || '';
        }
      }
    } catch (e) {
      console.error('Error loading user data:', e);
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    validatePassword() {
      const pwd = this.profile.password;
      this.passwordError =
        pwd && pwd.length < 6 ? 'Password must be at least 6 characters' : '';
    },
    async saveProfile() {
      if (this.loading || this.passwordError) return;
      this.loading = true;

      const router = useRouter(); // vue-router orqali redirect

      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('User not found');

        // update Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          username: this.profile.username,
        });

        // update Firebase Auth profile
        await updateProfile(user, {
          displayName: this.profile.username,
        });

        // update password if available
        if (this.profile.password) {
          await updatePassword(user, this.profile.password);
        }

        alert('Profile updated successfully!');
        this.profile.username = ''; // Clear username field
        this.profile.password = ''; // Clear password field
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        this.loading = false;
      }
      router.push('/');
    },
  },
};
</script>

<style scoped>
.edit-profile {
  max-width: 420px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  font-family: 'Fira Code', monospace;
}

h1 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 600;
  color: #444;
}

input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border 0.2s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

.password-wrapper {
  position: relative;
}

.toggle-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #007bff;
}

.hint {
  font-size: 0.85rem;
  color: #888;
  margin-top: 0.25rem;
  display: block;
}

.error {
  border-color: #dc3545 !important;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

@media (max-width: 480px) {
  .edit-profile {
    padding: 1.25rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  input {
    font-size: 0.95rem;
  }

  button {
    font-size: 0.95rem;
  }
}
</style>
