<template>
  <div class="subject-container">
    <h3>Add Subject</h3>
    <form @submit.prevent="addSubject" class="form">
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
        <input
          type="file"
          @change="handleFileUpload"
          accept="application/json"
          ref="fileInput"
        />
      </div>

      <button type="submit" class="btn" :disabled="loading">
        <span v-if="!loading">Send</span>
        <span v-else class="loader"></span>
      </button>
    </form>

    <div v-if="status" :class="['status', status.type]" style="cursor: pointer">
      {{ status.message }}
    </div>
  </div>
</template>

<script>
import { db } from '../../config/firebase';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      selectedSubject: '',
      selectedLevel: '',
      subjects: ['English', 'Math', 'Physics', 'History'],
      levels: ['Beginner', 'Elementary', 'Intermediate', 'Advanced'],
      file: null,
      loading: false,
      status: null,
    };
  },
  methods: {
    updateLevels() {
      const previousLevel = this.selectedLevel; // Saqlab qo'yish
      if (this.selectedSubject === 'Math') {
        this.levels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced'];
      } else if (this.selectedSubject === 'Physics') {
        this.levels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced'];
      } else if (this.selectedSubject === 'History') {
        this.levels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced'];
      } else if (this.selectedSubject === 'English') {
        this.levels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced'];
      }
      // Tanlangan darajani saqlab qolish
      this.selectedLevel = previousLevel;
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
      if (this.file && this.file.type !== 'application/json') {
        alert('Please upload a valid JSON file!');
        this.file = null;
      }
    },
    async addSubject() {
      this.loading = true;
      this.status = null;

      // Bo'sh qiymatlar tekshirilmoqda
      if (!this.selectedSubject || !this.selectedLevel) {
        this.status = {
          type: 'error',
          message: '❌ Please select both subject and level!',
        };
        setTimeout(() => {
          this.status = null;
        }, 3000);
        this.loading = false;
        return;
      }

      try {
        const subjectRef = doc(db, 'subjects', this.selectedSubject);
        await setDoc(
          subjectRef,
          { name: this.selectedSubject, level: this.selectedLevel },
          { merge: true }
        );

        if (this.file) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const parsedData = JSON.parse(e.target.result);
              if (!Array.isArray(parsedData))
                throw new Error("JSON massiv bo'lishi kerak!");
              if (
                !parsedData.every(
                  (item) => item.question && item.options && item.answer
                )
              ) {
                throw new Error(
                  "JSON format noto'g'ri: har bir testda 'question', 'options', va 'answer' bo'lishi kerak!"
                );
              }

              // Daraja va predmetni to'g'ri pathga uzatish
              const levelCollectionRef = collection(
                subjectRef,
                this.selectedLevel
              );

              // Agar collection bo'sh bo'lsa, xatolik chiqariladi
              if (!levelCollectionRef) {
                throw new Error('Collection path is empty!');
              }

              for (const test of parsedData) {
                await addDoc(levelCollectionRef, {
                  question: test.question,
                  options: test.options,
                  answer: test.answer,
                });
              }

              this.status = {
                type: 'success',
                message: '✅ Subject and tests added successfully!',
              };
              setTimeout(() => {
                this.status = null;
              }, 3000);
            } catch (error) {
              console.error("❌ JSON faylni o'qishda xatolik:", error);
              this.status = {
                type: 'error',
                message: `❌ ${error.message}`,
              };
              setTimeout(() => {
                this.status = null;
              }, 3000);
            }
          };
          reader.readAsText(this.file);
        }
      } catch (error) {
        console.error('❌ Error adding subject:', error);
        this.status = { type: 'error', message: '❌ Error adding subject!' };
        setTimeout(() => {
          this.status = null;
        }, 3000);
      } finally {
        this.loading = false;
      }

      // Tozalash
      this.selectedLevel = '';
      this.selectedSubject = '';
      this.file = null;
      this.$refs.fileInput.value = null;
    },
  },
};
</script>

<style scoped>
.subject-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  background: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
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
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  background-color: #007bff;
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
</style>
