<template>
    <div class="login">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="form.email" />
            </div>
            <div class="password-field">
                <label for="password">Password:</label>
                <div class="password-input-wrapper">
                    <input
                        :type="showPassword ? 'text' : 'password'"
                        id="password"
                        v-model="form.password"
                    />
                    <span class="toggle-password" @click="togglePasswordVisibility">
                        <img
                            :src="showPassword ? '../assets/img/eye-open.png' : '../assets/img/eye-closed.png'"
                            alt="Toggle Password Visibility"
                        />
                    </span>
                </div>
            </div>
            <button type="submit">Login</button>
        </form>
        <div class="google-login">
            <button @click="handleGoogleLogin">
                <img src="../assets/img/googleicon.png" alt="Google Icon" />
                Continue with Google
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            form: {
                email: "",
                password: "",
            },
            showPassword: false, // Parolni ko'rish uchun flag
        };
    },
    methods: {
        handleLogin() {
            console.log("Login form submitted:", this.form);
        },
        handleGoogleLogin() {
            console.log("Google Login clicked");
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword; // Parolni ko'rish yoki yashirish
        },
    },
};
</script>

<style scoped>
.login {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

form div {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

.password-field {
    position: relative;
}

.password-input-wrapper {
    display: flex;
    align-items: center;
    position: relative;
}

.password-input-wrapper input {
    flex: 1;
    padding-right: 40px; /* Ko'zcha uchun joy qoldirish */
}

.toggle-password {
    position: absolute;
    right: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.toggle-password img {
    width: 20px;
    height: 20px;
}

button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

.google-login {
    margin-top: 20px;
    text-align: center;
}

.google-login button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    background-color: white;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.google-login button:hover {
    background-color: #f1f1f1;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.google-login img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}
</style>