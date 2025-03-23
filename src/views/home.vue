<script setup>
import { ref, onMounted, watch } from "vue";
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const fanlar = ref([]);
const darajalar = ref([]);
const testlar = ref([]);
const selectedFan = ref("");
const selectedDaraja = ref("");
const uploadMessage = ref("");

// ✅ Fanlarni Firebase'dan olish
const fetchFanlar = async () => {
  try {
    const fanlarSnapshot = await getDocs(collection(db, "fanlar"));
    console.log(fanlarSnapshot);
    
    fanlar.value = fanlarSnapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error("Fanlarni olishda xatolik:", error);
  }
};

// ✅ Tanlangan fandan kelib chiqib darajalarni olish
const fetchDarajalar = async () => {
  if (!selectedFan.value) return;
  
  try {
    const darajaSnapshot = await getDocs(collection(db, "fanlar", selectedFan.value));
    darajalar.value = darajaSnapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error("Darajalarni olishda xatolik:", error);
  }
};

// ✅ Tanlangan fan va darajaga mos testlarni Firebase'dan olish
const fetchTests = async () => {
  if (!selectedFan.value || !selectedDaraja.value) return;

  try {
    const testCollectionRef = collection(db, "fanlar", selectedFan.value, selectedDaraja.value);
    const testSnapshot = await getDocs(testCollectionRef);

    testlar.value = testSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Testlarni olishda xatolik:", error);
  }
};

// ✅ Firebase'ga yuklash (avtomatik ID bilan)
const uploadTests = async () => {
  if (!selectedFan.value || !selectedDaraja.value || testlar.value.length === 0) {
    uploadMessage.value = "Iltimos, fan, daraja tanlang va test fayl yuklang!";
    return;
  }

  try {
    const testCollectionRef = collection(db, "fanlar", selectedFan.value, selectedDaraja.value);

    for (const test of testlar.value) {
      await addDoc(testCollectionRef, {
        question: test.question,
        options: test.options,
        answer: test.answer
      });
    }

    uploadMessage.value = "Testlar muvaffaqiyatli yuklandi!";
    fetchTests(); // Testlar yuklangandan keyin qayta olish
  } catch (error) {
    console.error("Firebasega yuklashda xatolik:", error);
    uploadMessage.value = "Yuklashda xatolik!";
  }
};

// ✅ Fan yoki daraja tanlanganda testlarni yuklash
watch([selectedFan, selectedDaraja], fetchTests);

// **Komponent yuklanganda fanlarni olish**
onMounted(fetchFanlar);
</script>

<template>
  <div class="container">
    <h1>Testlarni Firebase'ga yuklash va olish</h1>

    <!-- Fan tanlash -->
    <div>
      <label>Fan tanlang:</label>
      <select v-model="selectedFan" @change="fetchDarajalar">
        <option disabled value="">Fan tanlang</option>
        <option v-for="fan in fanlar" :key="fan" :value="fan">{{ fan }}</option>
      </select>
    </div>

    <!-- Darajani tanlash -->
    <div>
      <label>Darajani tanlang:</label>
      <select v-model="selectedDaraja">
        <option disabled value="">Daraja tanlang</option>
        <option v-for="daraja in darajalar" :key="daraja" :value="daraja">{{ daraja }}</option>
      </select>
    </div>

    <!-- Testlarni chiqarish -->
    <div v-if="testlar.length > 0">
      <h2>Testlar</h2>
      <ul>
        <li v-for="test in testlar" :key="test.id">
          <strong>{{ test.question }}</strong>
          <ul>
            <li v-for="option in test.options" :key="option">{{ option }}</li>
          </ul>
          <p><strong>Javob:</strong> {{ test.answer }}</p>
        </li>
      </ul>
    </div>
    <p v-else-if="selectedFan && selectedDaraja">Testlar topilmadi.</p>

    <p v-if="uploadMessage">{{ uploadMessage }}</p>
  </div>
</template>
