<template>
    <div>
        <v-container>
            <v-text-field
                v-model="search"
                label="Search"
                class="mb-4"
                outlined
            ></v-text-field>
            <v-data-table
                :headers="headers"
                :items="items"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Data Table</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </template>
                <template v-slot:item.timestamp="{ item }">
                    {{ new Date(item.timestamp).toLocaleString() }}
                </template>
            </v-data-table>
        </v-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            search: "",
            headers: [
                { text: "User Name", value: "userName" },
                { text: "Subject", value: "subject" },
                { text: "Test Number", value: "testNumber" },
                { text: "Test Level", value: "testLevel" },
                { text: "Score", value: "score" },
                { text: "Timestamp", value: "timestamp" },
            ],
            items: [
                {
                    userName: "John Doe",
                    subject: "Math",
                    testNumber: 1,
                    testLevel: "Easy",
                    score: 85,
                    timestamp: 1697040000000,
                },
                {
                    userName: "Jane Smith",
                    subject: "Science",
                    testNumber: 2,
                    testLevel: "Medium",
                    score: 90,
                    timestamp: 1697126400000,
                },
                {
                    userName: "Alice Johnson",
                    subject: "History",
                    testNumber: 3,
                    testLevel: "Hard",
                    score: 75,
                    timestamp: 1697212800000,
                },
            ],
        };
    },
};
</script>

<style scoped>
.v-container {
    max-width: 800px;
    margin: auto;
}
</style></div>