<template>

  <h1>Select Your Subject</h1>
  <div class="selections">
    <!-- subject -->
    <div class="selectionSubject">
      <select v-model="selectedFan" name="" id="">
        <option selected disabled> Fanlarni Tanlang</option>
        <option :value="item" v-for="(item, idx) in Fanlar"> {{ item }}</option>
      </select>
    </div>
    <!-- number -->
    <div class="selectQuantity">
      <select name="" id="">
        <option selected disabled> test sonini tanlang</option>
        <option value="5" v-for="item in TestNumber">{{ item }}</option>
      </select>
    </div>
    <!-- degree -->
    <div class="selectDegree">
      <select name="" id="" v-model="selectedDaraja">
        <option selected disabled> darajangizni tanlang</option>
        <option value="A1" v-for="item in darajalar">{{ item }}</option>
      </select>
    </div>
  </div>
  <!-- Start Button -->
  <div class="selectStart">
    <button class="button" id="startTest" @click="$router.push({ name: 'testPage' })">Start Test</button>
  </div>
</template>

<script>
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
export default {
  data() {
    return {
      Fanlar: [],
      TestNumber: ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
      darajalar: [],
      selectedFan: "",
      selectedDaraja: "",
    }
  },
  methods: {
    // --- fanlarni olish
    async fetchFanlar() {
      try {
        const querySnapshot = await getDocs(collection(db, "fanlar"));

        const fanlar = [];
        querySnapshot.forEach((doc) => {
          fanlar.push({ id: doc.id, ...doc.data() }); // ID bilan qo‘shib olamiz
        });

        console.log("Barcha fanlar:", fanlar);
      } catch (error) {
        console.error("Xatolik:", error);
      }


    },
    // darajalarni olish
    // async fetchDarajalar() {
    //   if (!this.selectedFan) return;
    //   const fanDocRef = collection(db, "fanlar", this.selectedFan);
    //   const darajaSnapshot = await getDocs(fanDocRef)
    //   console.log(darajaSnapshot);
    //   this.darajalar = darajaSnapshot.docs.map((doc) => doc.id)
    //   this.selectedDaraja = ""
    // }
  },
  mounted() {
    this.fetchFanlar()
  }
}
</script>

<style scoped>
h1 {
  text-align: center;
  margin-top: 20px;
}

.selections {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.selectionSubject,
.selectQuantity,
.selectDegree,
.selectStart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
  max-width: 200px;
}

#startTest {
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 700;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  margin-top: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

#startTest:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0px 10px 8px rgba(0, 0, 0, 0.3);
}

#startTest:active {
  transform: translateY(2px);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .selections {
    flex-direction: column;
    gap: 1.5rem;
  }

  select {
    width: 200px;
  }

  button {
    max-width: 100%;
  }
}
</style>