<template>
    <div>
        <h1>Testlar</h1>

        <select v-model="selectedFan" @change="fetchTests">
            <option v-for="fan in fanlar" :key="fan" :value="fan">{{ fan }}</option>
        </select>

        <select v-model="selectedDaraja" @change="fetchTests">
            <option v-for="daraja in darajalar" :key="daraja" :value="daraja">{{ daraja }}</option>
        </select>

        <ul>
            <li v-for="test in testlar" :key="test.id">{{ test.name }}</li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../../firebase';
import { collection, doc, getDocs } from 'firebase/firestore';

const fanlar = ref(["Matematika", "Fizika", "Kimyo", "Ingliz tili"]);
const darajalar = ref(["beginner", "intermediate", "advanced"]);

const selectedFan = ref(fanlar.value[0]);
const selectedDaraja = ref(darajalar.value[0]);
const testlar = ref([]);

const fetchTests = async () => {
    try {
        testlar.value = [];
        const subjectRef = doc(db, "Fanlar", selectedFan.value);
        const testsCollectionRef = collection(subjectRef, selectedDaraja.value);
        
        const querySnapshot = await getDocs(testsCollectionRef);
        testlar.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Xatolik:", error);
    }
};

onMounted(fetchTests);
</script>
