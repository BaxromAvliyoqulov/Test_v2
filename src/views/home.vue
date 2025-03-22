<script setup>
import { ref, watch } from "vue";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

// Foydalanuvchi tanlaydigan fan va daraja
const selectedFan = ref("");
const selectedDaraja = ref("");
const testlar = ref([]);
const availableFans = ["Matematika", "Ingliz tili", "Fizika"];
const availableDarajalar = ["Beginner", "Intermediate", "Advanced"];

// Firestore-dan testlarni olish
const fetchTests = async () => {
  if (!selectedFan.value || !selectedDaraja.value) {
    testlar.value = [];
    return;
  }

  try {
    const testCollection = collection(db, "fanlar", selectedFan.value, selectedDaraja.value, "testlar");
    const querySnapshot = await getDocs(testCollection);
    
    testlar.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
  } catch (error) {
    console.error("Testlarni olishda xatolik:", error);
  }
};

// Fan yoki daraja o'zgarganda testlarni yuklash
watch([selectedFan, selectedDaraja], fetchTests);
</script>

<template>
  <div>
    <h2>Testlarni Ko‘rish</h2>

    <!-- Fan tanlash -->
    <label>Fan tanlang:</label>
    <select v-model="selectedFan">
      <option v-for="fan in availableFans" :key="fan" :value="fan">{{ fan }}</option>
    </select>

    <!-- Daraja tanlash -->
    <label>Daraja tanlang:</label>
    <select v-model="selectedDaraja">
      <option v-for="daraja in availableDarajalar" :key="daraja" :value="daraja">{{ daraja }}</option>
    </select>

    <h3>Testlar:</h3>
    <ul v-if="testlar.length > 0">
      <li v-for="test in testlar" :key="test.id">
        <strong>{{ test.question }}</strong>
        <ul>
          <li v-for="(option, i) in test.options" :key="i">
            {{ option }}
          </li>
        </ul>
        <p><strong>Javob:</strong> {{ test.answer }}</p>
      </li>
    </ul>
    <p v-else>Testlar topilmadi</p>
  </div>
</template>
