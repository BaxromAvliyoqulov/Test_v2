<template>
  <div class="subject-container">
    <h3>Add Subject</h3>
    <form @submit.prevent="addSubject" class="form">
      <div class="form-group">
        <label>Select Subject</label>
        <select v-model="selectedSubject">
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
import { db } from "../../config/firebase";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";

export default {
  data() {
    return {
      selectedSubject: "",
      selectedLevel: "",
      subjects: ["English", "Math", "Physics", "History"],
      levels: ["Beginner", "Elementary", "Intermediate", "Advanced"],
      file: null,
      loading: false,
      status: null,
    };
  },
  methods: {
    updateLevels() {
      // Logic to update levels based on selected subject
      if (this.selectedSubject === "Math") {
        this.levels = ["Algebra", "Geometry", "Calculus"];
      } else if (this.selectedSubject === "Physics") {
        this.levels = ["Mechanics", "Thermodynamics", "Quantum Physics"];
      } else if (this.selectedSubject === "History") {
        this.levels = ["Ancient", "Medieval", "Modern"];
      } else if (this.selectedSubject === "English") {
        this.levels = ["Grammar", "Literature", "Writing"];
      } else {
        this.levels = ["Beginner", "Elementary", "Intermediate", "Advanced"];
      }
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async addSubject() {
      this.loading = true;
      this.status = null;
      try {
        const subjectRef = doc(db, "subjects", this.selectedSubject);
        await setDoc(
          subjectRef,
          { name: this.selectedSubject, level: this.selectedLevel },
          { merge: true },
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
                  (item) => item.question && item.options && item.answer,
                )
              ) {
                throw new Error(
                  "Har bir test obyektida 'question', 'options', va 'answer' bo'lishi kerak!",
                );
              }
              const levelCollectionRef = collection(
                subjectRef,
                this.selectedLevel,
              );
              for (const test of parsedData) {
                await addDoc(levelCollectionRef, {
                  question: test.question,
                  options: test.options,
                  answer: test.answer,
                });
              }
              this.status = {
                type: "success",
                message: "✅ Subject and tests added successfully!",
              };
            } catch (error) {
              console.error("❌ JSON faylni o'qishda xatolik:", error);
              this.status = {
                type: "error",
                message: "❌ Xatolik: Noto'g'ri JSON fayl!",
              };
            }
          };
          reader.readAsText(this.file);
        }
      } catch (error) {
        console.error("❌ Error adding subject:", error);
        this.status = { type: "error", message: "❌ Error adding subject!" };
      } finally {
        this.loading = false;
      }
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
  transition:
    background-color 0.3s,
    transform 0.2s;
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
