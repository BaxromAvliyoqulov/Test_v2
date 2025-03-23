<template>

    <h1>Select Your Subject</h1>
    <div class="selections">
        <!-- subject -->
        <div class="selectionSubject">
            <select name="" id="">
                <optgroup label="Kids">
                    <option value="mathKids">Kids Math</option>
                    <option value="englishKids">Kids English</option>
                </optgroup>
                <option value="math">English</option>
            </select>
        </div>
        <!-- number -->
        <div class="selectQuantity">
            <select name="" id="">
                <option value="5">5</option>
            </select>
        </div>
        <!-- degree -->
        <div class="selectDegree">
            <select name="" id="">
                <option value="A1">A1</option>
            </select>
        </div>
    </div>
    <!-- Start Button -->
        <div class="selectStart">
            <button class="button" id="startTest" @click="$router.push({name:'testPage'})">Start Test</button>
        </div>
</template>

<script>
export default {
}
</script>

<style scoped>
h1{
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

.selectionSubject, .selectQuantity, .selectDegree, .selectStart {
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