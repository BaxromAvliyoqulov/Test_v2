<template>
  <div>
    <!-- Test Page -->
    <div class="test-page">
      <div class="questionScreen">
        <h1 class="question">
          Savol uchun
        </h1>
        <div class="answers">
          <input type="radio" class="answer" name="answer" id="answer1" value="1">
          <label for="answer1">Javob 1</label>
          <br>
          <input type="radio" class="answer" name="answer" id="answer2" value="2">
          <label for="answer2">Javob 2</label>
          <br>
          <input type="radio" class="answer" name="answer" id="answer3" value="3">
          <label for="answer3">Javob 3</label>
          <br>
          <input type="radio" class="answer" name="answer" id="answer4" value="4">
          <label for="answer4">Javob 4</label>
        </div>
        <div class="pagnitation">
          <button v-for="page in testQuantities" :key="page" class="pagination-button"
            :class="{ active: currentPage === page }" @click="goToPage(page)">
            {{ page }}
          </button>
        </div>
        <button class="button" id="submit-button">Submit</button>
      </div>

      <!-- Prev and Next Buttons -->
      <div class="navigation-buttons">
        <button class="button" id="prev-button">Prev</button>
        <button class="button" id="next-button">Next</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "TestPage",
  data() {
    return {
      testQuantities: [1, 2, 3, 4, 5],
      currentPage: 1,
    };
  },
};
</script>

<style scoped>
.test-page {
  text-align: center;
  margin-top: 20px;
}

.answers {
  margin-top: 20px;
}

label {
  font-size: 18px;
  margin-left: 10px;
}

.navigation-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.pagnitation {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-button {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

.pagination-button.active {
  color: white;
  background-color: #007BFF;
  border-color: #0056b3;
  font-weight: bold;
  border: 1px solid transparent;
}

.pagination-button:hover {
  background-color: #0056b3;
  color: white;
  transform: translateY(-2px);
}

.pagination-button:active {
  transform: translateY(2px);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}


@media (max-width: 768px) {
  .test-page {
    margin-top: 10px;
    padding: 0 5px;
  }

  .answers {
    gap: 8px;
  }

  .navigation-buttons {
    gap: 5px;
  }
}
</style>