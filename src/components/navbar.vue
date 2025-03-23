<template>
    <div class="navbar">
        <div class="logo">
            <h1>Test.me</h1>
        </div>
        <div class="profile">
            <img src="../assets/img/user.png" @click="toggleDropdown" class="profile-image" alt="User Avatar">
            <div v-if="dropdownOpen" class="dropdown-content">
                <a href="/points">Points</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/contact-us">Contact Us</a>
                <hr class="custom-hr">
                <a href="/logout">Log Out</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dropdownOpen: false
        };
    },
    methods: {
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
        }
    }
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    height: 70px;
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
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Matn uchun 3D effekt */
}

.profile-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-image:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background: transparent;
}

.dropdown-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
    padding: 15px 20px;
    position: absolute;
    top: 70px;
    right: 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
}

.dropdown-content a {
    margin-bottom: 10px;
    text-align: left;
    color: #333;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    transition: color 0.3s ease, transform 0.3s ease;
    text-decoration: none;
}

.dropdown-content a:hover {
    color: #007bff;
    transform: translateX(5px) scale(1.05); 
}

.profile:hover .dropdown-content {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
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
</style>

