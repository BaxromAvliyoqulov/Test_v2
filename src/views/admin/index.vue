<script setup>
import { ref } from "vue";
import { db } from "../../../firebase";
import { collection, addDoc, doc } from "firebase/firestore";

const fanlar = ref(["Matematika", "Ingliz tili", "Fizika"]);
const darajalar = ref(["beginner", "intermediate", "advanced"]);
const selectedFan = ref("");
const selectedDaraja = ref("");
const testlar = ref([]);
const uploadMessage = ref("");

// ✅ JSON fayl yuklash
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsedData = JSON.parse(e.target.result);

      // JSON strukturasi to'g'riligini tekshiramiz
      if (!Array.isArray(parsedData)) throw new Error("JSON massiv bo‘lishi kerak!");
      if (!parsedData.every((item) => item.question && item.options && item.answer)) {
        throw new Error("Har bir test obyektida 'question', 'options', va 'answer' bo‘lishi kerak!");
      }

      testlar.value = parsedData;
      uploadMessage.value = "Fayl muvaffaqiyatli yuklandi!";
    } catch (error) {
      console.error("JSONni o‘qishda xatolik:", error);
      uploadMessage.value = "Xatolik: Noto‘g‘ri JSON fayl!";
    }
  };
  reader.readAsText(file);
};

// ✅ Firebase'ga yuklash (avtomatik ID bilan)
const uploadTests = async () => {
  if (!selectedFan.value || !selectedDaraja.value || testlar.value.length === 0) {
    uploadMessage.value = "Iltimos, fan, daraja tanlang va test fayl yuklang!";
    return;
  }

  try {
    const testCollectionRef = collection(doc(db, "fanlar", selectedFan.value), selectedDaraja.value);

    for (const test of testlar.value) {
      await addDoc(testCollectionRef, {
        question: test.question,
        options: test.options,
        answer: test.answer
      });
    }

    uploadMessage.value = "✅ Testlar muvaffaqiyatli yuklandi!";
    
    // Formani tozalash
    selectedFan.value = "";
    selectedDaraja.value = "";
    testlar.value = [];
  } catch (error) {
    console.error("Firebasega yuklashda xatolik:", error);
    uploadMessage.value = "❌ Yuklashda xatolik!";
  }
};
</script>

<template>
  <div class="container">
    <h1>Testlarni Firebase'ga yuklash</h1>

    <!-- Fan va daraja tanlash -->
    <div>
      <label>Fan tanlang:</label>
      <select v-model="selectedFan">
        <option v-for="fan in fanlar" :key="fan" :value="fan">{{ fan }}</option>
      </select>
    </div>

    <div>
      <label>Darajani tanlang:</label>
      <select v-model="selectedDaraja">
        <option v-for="daraja in darajalar" :key="daraja" :value="daraja">{{ daraja }}</option>
      </select>
    </div>

    <!-- JSON fayl yuklash -->
    <div>
      <input type="file" @change="handleFileUpload" accept="application/json" />
    </div>

    <button @click="uploadTests">Testlarni yuklash</button>

    <p v-if="uploadMessage">{{ uploadMessage }}</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
}
select, input, button {
  width: 100%;
  margin-top: 5px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
button {
  background: #007bff;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px;
}
button:hover {
  background: #0056b3;
}
p {
  font-weight: bold;
  margin-top: 10px;
}
</style>
