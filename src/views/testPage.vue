<template>
  <div class="container">
    <h2 class="title">{{ subject }} - {{ level }} Tests</h2>

    <div v-if="loading" class="loading">Loading tests...</div>
    <div v-else-if="tests.length === 0" class="no-tests">No tests found.</div>

    <div v-else class="test-list">
      <div v-for="(test, index) in tests" :key="index" class="test-card">
        <p class="question">
          <strong>Test {{ index + 1 }}:</strong> {{ test.question }}
        </p>

        <ul class="options">
          <li v-for="(option, i) in test.options" :key="i">{{ option }}</li>
        </ul>

        <p class="correct">
          ✅ Correct Answer: <strong>{{ test.correctAnswer }}</strong>
        </p>
      </div>
    </div>

    <button class="button" @click="goBack">Back</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

const route = useRoute();
const router = useRouter();

const subject = route.params.subject;
const level = route.params.level;

const tests = ref([]);
const loading = ref(true);

const fetchTests = async () => {
  try {
    const testRef = collection(db, 'subjects', subject, level);
    const snapshot = await getDocs(testRef);
    tests.value = snapshot.docs.map((doc) => doc.data());
  } catch (err) {
    console.error('Error fetching tests:', err);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};

onMounted(fetchTests);
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
}

.loading,
.no-tests {
  text-align: center;
  font-size: 18px;
  color: #777;
}

.test-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.test-card {
  background-color: #f9f9f9;
  border-left: 5px solid #007bff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}

.question {
  font-size: 18px;
  margin-bottom: 10px;
}

.options {
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
}

.options li {
  padding: 8px 12px;
  margin: 4px 0;
  background: #eef3f8;
  border-radius: 5px;
}

.correct {
  font-size: 16px;
  color: green;
}

.button {
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 700;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  margin: 40px auto 0;
  display: block;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

.button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.3);
}
</style>
