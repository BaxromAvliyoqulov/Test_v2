<template>
  <div class="container">
    <LoginModal :show="!authenticated" @authenticated="handleAuthentication" />
    <div v-if="authenticated">
      <h2 class="title">Admin Panel</h2>
      <button @click="currentView = 'addSubject'">Add Subject</button>
      <button @click="currentView = 'addAdmin'">Add Admin</button>
      <button @click="currentView = 'addProduct'">Add Product</button>
      <button @click="logout" class="logout-btn">Logout</button>
      <!-- Komponentlarni shartli ko'rsatish -->
      <AddSubjectComponent v-if="currentView === 'addSubject'" />
      <AddAdminComponent v-if="currentView === 'addAdmin'" />
      <AddProductComponent v-if="currentView === 'addProduct'" />
      <h2 class="title">Add New Subject</h2>

      <form @submit.prevent="addFan" class="form">
        <div class="form-group">
          <label>Select Subject</label>
          <select v-model="selectedSubject" @change="updateLevels">
            <option disabled value="">Choose a subject</option>
            <option v-for="subject in subjects" :key="subject" :value="subject">
              {{ subject }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Select Level</label>
          <select v-model="selectedLevel">
            <option disabled value="">Choose a level</option>
            <option v-for="level in levels" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Upload File</label>
          <input type="file" @change="handleFileUpload" accept="application/json" />
        </div>

        <button type="submit" class="btn" :disabled="loading">
          <span v-if="!loading">Send</span>
          <span v-else class="loader"></span>
        </button>
      </form>

      <div v-if="status" :class="['status', status.type]" style="cursor: pointer;">
        {{ status.message }}
      </div>
    </div>
  </div>
</template>

<script>
import LoginModal from './loginModal.vue';
import AddAdminComponent from './addAdmin.vue';
import AddSubjectComponent from './addSubject.vue';
import AddProductComponent from './addProduct.vue';

export default {
  components: {
    LoginModal,
    AddAdminComponent,
    AddSubjectComponent,
    AddProductComponent
  },
  data() {
    return {
      currentView: null, // Joriy ko'rsatilayotgan komponent
      authenticated: false,
      selectedSubject: "",
      selectedLevel: "",
      tests: [],
      loading: false,
      status: null,
      subjects: ["English", "Math", "Physics", "History"],
      levels: []
    };
  },
  created() {
    // Проверяем наличие токена при создании компонента
    const authToken = localStorage.getItem('adminAuth');
    if (authToken) {
      this.authenticated = true;
    }
  },
  methods: {
    handleAuthentication(status) {
      this.authenticated = status;
      if (status) {
        // Сохраняем статус аутентификации в localStorage
        localStorage.setItem('adminAuth', 'true');
      } else {

        // Удаляем данные при выходе
        localStorage.removeItem('adminAuth');
        this.$router.push('/');
        this.levels = ["Elementary", "Beginner", "Intermediate", "Advanced"];
      }
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    // 
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
          // JSON strukturasi to‘g‘ri ekanligini tekshirish
          if (!Array.isArray(parsedData)) throw new Error("JSON massiv bo‘lishi kerak!");
          if (!parsedData.every((item) => item.question && item.options && item.answer)) {
            throw new Error("Har bir test obyektida 'question', 'options', va 'answer' bo‘lishi kerak!");
          }
          this.testlar = parsedData;
          this.uploadMessage = "✅ JSON fayl muvaffaqiyatli yuklandi!";
        } catch (error) {
          console.error("❌ JSON faylni o‘qishda xatolik:", error);
          this.uploadMessage = "❌ Xatolik: Noto‘g‘ri JSON fayl!";
        }
      };
      reader.readAsText(file);
    },
    // 
    async addFan() {
      this.loading = true;
      this.status = null;
      console.log(this.selectedLevel, this.selectedSubject);

      try {
        const fanRef = doc(db, "subjects", this.selectedSubject);
        await setDoc(fanRef, {}, { merge: true });

        const levelCollectionRef = collection(fanRef, this.selectedLevel);

        for (const test of this.testlar) {
          await addDoc(levelCollectionRef, {
            question: test.question,
            options: test.options,
            answer: test.answer,
          });
        }

        this.status = { type: "success", message: "✅ Subject and tests added successfully!" };
      } catch (error) {
        console.error("❌ Error adding subject:", error);
        this.status = { type: "error", message: "❌ Error adding subject!" };
      } finally {
        this.loading = false;
      }
    }

  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

input,
select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.btn {
  width: 80%;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s, transform 0.2s;
}

.btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(1px);
}

.btn:disabled {
  background: #ccc;
}

.loader {
  display: inline-block;
  width: 15px;
  height: 15px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.status {
  margin-top: 15px;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
}

.status.success {
  background: #d4edda;
  color: #155724;
}

.status.error {
  background: #f8d7da;
  color: #721c24;
}

/* Log out button */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c82333;
}
</style>