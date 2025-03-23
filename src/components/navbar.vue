<template>
  <div class="navbar">
    <div class="logo">
      <h1 @click="navigateTo('/')">Test.me</h1>
    </div>
    <div class="profile-container">
      <!-- Добавляем отображение имени пользователя -->
      <div class="username-display" v-if="username">
        Welcome, {{ username }}
      </div>
      <div class="profile" ref="profileDropdown">
        <div class="profile-image-container">
          <img 
            :src="profileImage" 
            @click="toggleDropdown" 
            class="profile-image" 
            alt="User Avatar"
          >
          <!-- Добавляем кнопку для загрузки новой фотографии -->
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleImageUpload" 
            accept="image/*" 
            style="display: none"
          >
          <button class="change-photo-btn" @click="triggerFileInput">
            <i class="fas fa-camera"></i>
          </button>
        </div>
        <div v-if="dropdownOpen" class="dropdown-content">
          <div class="user-info">
            <img :src="profileImage" class="mini-profile-image" alt="User Avatar">
            <div class="user-details">
              <span class="username">{{ username || 'User' }}</span>
              <span class="email">{{ userEmail }}</span>
            </div>
          </div>
          <hr class="custom-hr">
          <!-- Остальные пункты меню -->
          <router-link to="/points">Points</router-link>
          <router-link to="/about">About Us</router-link>
          <router-link to="/contact-us">Contact Us</router-link>
          <router-link to="/dashboard">Dashboard</router-link>
          <hr class="custom-hr">
          <router-link to="/login" @click="logout">Log Out</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import defaultUserImage from '../assets/img/user.png'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const dropdownOpen = ref(false)
    const username = ref(null)
    const profileImage = ref(defaultUserImage)
    const isMobile = ref(false)
    const profileDropdown = ref(null)

    const navigateTo = (path) => {
      router.push(path)
      dropdownOpen.value = false
    }

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value
    }

    const checkUserLogin = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
          username.value = user.displayName || user.name || 'User'
          if (user.photoURL) {
            profileImage.value = user.photoURL
          }
        }
      } catch (error) {
        console.error('Error checking user login:', error)
      }
    }

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768
    }

    const handleClickOutside = (event) => {
      if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
        dropdownOpen.value = false
      }
    }

    const logout = () => {
      localStorage.removeItem('user')
      username.value = null
      profileImage.value = defaultUserImage
      router.push('/login')
    }

    onMounted(() => {
      checkUserLogin()
      checkScreenSize()
      window.addEventListener('resize', checkScreenSize)
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkScreenSize)
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      dropdownOpen,
      username,
      profileImage,
      isMobile,
      profileDropdown,
      navigateTo,
      toggleDropdown,
      logout
    }
  }
}
</script>


<style scoped>
* {
  box-sizing: border-box;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  max-width: 1140px;
  width: 90%;
  height: 70px;
  margin: 15px auto 20px;
  background: linear-gradient(145deg, #0056b3, #007bff); 
  color: white;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3), -4px -4px 10px rgba(255, 255, 255, 0.1); 
  border-radius: 10px;
}

.navbar h1 {
  margin: 0;
  font-size: 26px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.profile-container {
  display: flex;
  align-items: center;
}

.username-display {
  margin-right: 15px;
  font-weight: 500;
  font-size: 16px;
  color: white;
}

.profile {
  position: relative;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dropdown-content {
  position: absolute;
  top: 50px;
  right: 0;
  min-width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.dropdown-username {
  padding: 5px 0 15px;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #eee;
  width: 100%;
}

.dropdown-content a {
  margin-bottom: 10px;
  text-align: left;
  color: #333;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s ease, transform 0.3s ease;
  display: block;
  width: 100%;
}

.dropdown-content a:hover {
  color: #007bff;
  transform: translateX(5px);
}

.custom-hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 10px 0;
  width: 100%;
}

.custom-hr::after {
  content: '';
  display: block;
  height: 1px;
  background: linear-gradient(to right, #007bff, #0056b3);
  margin-top: -1px;
}

/* Media Queries */
@media screen and (max-width: 768px) {
  .navbar {
    padding: 0 15px;
    height: 60px;
    width: 95%;
  }

  .navbar h1 {
    font-size: 22px;
  }

  .profile-image {
    width: 35px;
    height: 35px;
  }

  .dropdown-content {
    right: 0;
    min-width: 180px;
  }
}

@media screen and (max-width: 480px) {
  .navbar {
    padding: 0 10px;
    height: 50px;
    width: 90%;
    margin: 10px auto;
  }

  .navbar h1 {
    font-size: 18px;
  }

  .profile-image {
    width: 30px;
    height: 30px;
  }

  .dropdown-content {
    right: -10px;
    min-width: 160px;
  }

  .dropdown-content a {
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .dropdown-username {
    font-size: 14px;
    padding-bottom: 10px;
  }
}

@media screen and (max-width: 320px) {
  .navbar {
    padding: 0 8px;
    height: 45px;
    width: 95%;
  }

  .navbar h1 {
    font-size: 16px;
  }

  .profile-image {
    width: 28px;
    height: 28px;
  }

  .dropdown-content {
    right: -15px;
    min-width: 140px;
    padding: 10px 15px;
  }

  .dropdown-content a {
    font-size: 13px;
    margin-bottom: 6px;
  }
  
  .dropdown-username {
    font-size: 13px;
    padding-bottom: 8px;
  }
}
</style>


