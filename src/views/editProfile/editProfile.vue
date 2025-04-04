<template>
  <div class="edit-profile">
    <h1>Edit Profile</h1>
    <form @submit.prevent="saveProfile">
      <div class="form-group">
        <label for="username">User Name</label>
        <input type="text" id="username" v-model="profile.username" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="profile.password"
            :class="{ error: passwordError }"
            @input="validatePassword"
          />
          <i
            :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            @click="togglePasswordVisibility"
            id="toggle-password-icon"
          ></i>
        </div>
        <span class="error-message" v-if="passwordError">{{
          passwordError
        }}</span>
      </div>

      <p class="hintText">* Password o‘zgaradi faqat kiritilgan bo‘lsa</p>

      <div class="form-group">
        <label for="profilePicture">Profile Photo</label>
        <div class="image-upload-wrapper">
          <input
            type="file"
            id="profilePicture"
            @change="onFileChange"
            accept="image/*"
          />
          <img v-if="imagePreview" :src="imagePreview" class="image-preview" />
        </div>
        <span class="error-message" v-if="fileError">{{ fileError }}</span>
      </div>

      <button type="submit" :disabled="loading">
        <span v-if="loading">Saving...</span>
        <span v-else>Save</span>
      </button>
    </form>
  </div>
</template>

<script>
import { getAuth, updatePassword, updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../config/firebase.js";

export default {
  data() {
    return {
      profile: {
        username: "",
        password: "",
        profilePicture: null,
      },
      showPassword: false,
      loading: false,
      passwordError: "",
      fileError: "",
      imagePreview: null,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    };
  },
  async mounted() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.profile.username = data.username || "";
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    validatePassword() {
      if (this.profile.password && this.profile.password.length < 6) {
        this.passwordError = "Password must be at least 6 characters";
      } else {
        this.passwordError = "";
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > this.maxFileSize) {
          this.fileError = "File size should not exceed 5MB";
          event.target.value = "";
          return;
        }
        if (!file.type.includes("image/")) {
          this.fileError = "Please upload an image file";
          event.target.value = "";
          return;
        }
        this.fileError = "";
        this.profile.profilePicture = file;
        this.createImagePreview(file);
      }
    },
    createImagePreview(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async saveProfile() {
      if (this.loading) return;
      if (this.passwordError || this.fileError) return;

      this.loading = true;
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          alert("User not logged in");
          return;
        }

        let photoURL = user.photoURL;

        if (this.profile.profilePicture) {
          const imageRef = ref(storage, `profilePics/${user.uid}`);
          await uploadBytes(imageRef, this.profile.profilePicture);
          photoURL = await getDownloadURL(imageRef);
        }

        // ❗️YANGI - setDoc o‘rniga, merge:true bilan
        await setDoc(
          doc(db, "users", user.uid),
          {
            username: this.profile.username,
            photoURL,
          },
          { merge: true },
        );

        await updateProfile(user, {
          displayName: this.profile.username,
          photoURL,

     user     
        });

        if (this.profile.password) {
          await updatePassword(user, this.profile.password);
        }

        alert("Profil yangilandi!");
      } catch (err) {
        console.error("Error updating profile:", err);
        alert("Profilni yangilashda xatolik: " + err.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.edit-profile {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-profile h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper input {
  width: 100%;
  padding-right: 2.5rem; /* O‘ng tomonda ikonka uchun joy */
}

#toggle-password-icon {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.2rem;
  color: #007bff;
  transition: color 0.3s;
}

#toggle-password-icon:hover {
  color: #0056b3;
}

.hintText {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1rem;
}

.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.image-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-preview {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
