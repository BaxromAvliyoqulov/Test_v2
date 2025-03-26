<template>
    <div class="subject-form-container">
        <h3>Add Subject</h3>
        <form @submit.prevent="addSubject">
            <input type="text" v-model="subjectName" class="input-field" placeholder="Subject Name" />
            <textarea v-model="description" class="textarea-field" placeholder="Description"></textarea>
            <button type="submit" class="submit-button">Add Subject</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            subjectName: '',
            description: ''
        };
    },
    methods: {
        addSubject() {
            // Fan qo'shish logikasi
            console.log(`Adding subject: ${this.subjectName}`);
        }
    }
}
</script>

<style scoped>
.subject-form-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.input-field,
.textarea-field {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.textarea-field {
    height: 100px;
    resize: none;
    /* Disable resizing */
}

.submit-button {
    width: 100%;
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.submit-button:hover {
    background-color: #0056b3;
}
</style>