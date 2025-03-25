<template>
    <div class="dashboard-container">
        <div class="table-header">
            <h2>Test Results</h2>
            <div class="search-filter">
                <input 
                    v-model="search" 
                    type="text" 
                    placeholder="Search..."
                    class="search-input"
                >
                <select v-model="filterSubject" class="filter-select">
                    <option value="">All Subjects</option>
                    <option v-for="subject in uniqueSubjects" :key="subject" :value="subject">
                        {{ subject }}
                    </option>
                </select>
                <select v-model="filterLevel" class="filter-select">
                    <option value="">All Levels</option>
                    <option v-for="level in uniqueLevels" :key="level" :value="level">
                        {{ level }}
                    </option>
                </select>
            </div>
        </div>

        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th v-for="header in headers" :key="header.value" @click="sortBy(header.value)">
                            {{ header.text }}
                            <span v-if="sortKey === header.value" class="sort-indicator">
                                {{ sortOrder === 'asc' ? '↑' : '↓' }}
                            </span>
                        </th>
                        <th>Event</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in paginatedAndFilteredItems" :key="item.id">
                        <td>{{ item.userName }}</td>
                        <td>{{ item.subject }}</td>
                        <td>{{ item.testNumber }}</td>
                        <td>{{ item.testLevel }}</td>
                        <td :class="getScoreClass(item.score)">{{ item.score }}%</td>
                        <td>{{ formatDate(item.timestamp) }}</td>
                        <td class="actions">
                            <button @click="deleteItem(item)" class="action-btn delete">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="pagination">
            <button 
                :disabled="currentPage === 1" 
                @click="currentPage--"
                class="pagination-btn"
            >
                Previous
            </button>
            <span class="page-info">
                Page {{ currentPage }} is {{ totalPages }}
            </span>
            <button 
                :disabled="currentPage === totalPages" 
                @click="currentPage++"
                class="pagination-btn"
            >
                Next
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            search: "",
            filterSubject: "",
            filterLevel: "",
            currentPage: 1,
            itemsPerPage: 5,
            sortKey: 'timestamp',
            sortOrder: 'desc',
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
                    userName:"John Wick",
                    subject:"English",
                    testNumber:1,
                    testLevel:"A1",
                    score: 100,
                    timestamp: 1696953600000,
                },
                {
                    userName: "John Doe",
                    subject: "Math",
                    testNumber: 2,
                    testLevel: "Easy",
                    score: 85,
                    timestamp: 1697050000000,
                },
                {
                    userName: "Jane Smith",
                    subject: "Science",
                    testNumber: 3,
                    testLevel: "Medium",
                    score: 90,
                    timestamp: 1697126400000,
                },
                {
                    userName: "Alice Johnson",
                    subject: "History",
                    testNumber: 4,
                    testLevel: "Hard",
                    score: 75,
                    timestamp: 1697212800000,
                },
                {
                    userName: "Jack Sparrow",
                    subject: "English",
                    testNumber: 5,
                    testLevel: "A2",
                    score: 100, 
                    timestamp: 1697136400000,
                },
                {
                    userName: "Jackie Chan",
                    subject: "Martial Arts",
                    testNumber: 6,
                    testLevel: "B1",
                    score: 95,
                    timestamp: 1697236400000,
                },
                {
                    userName: "Bruce Lee",
                    subject: "Philosophy",
                    testNumber: 7,
                    testLevel: "B2",
                    score: 98,
                    timestamp: 1697336400000,
                },
                {
                    userName: "Albert Einstein",
                    subject: "Physics",
                    testNumber: 8,
                    testLevel: "C1",
                    score: 99,
                    timestamp: 1697436400000,
                }
            ],
        };
    },
    computed: {
        uniqueSubjects() {
            return [...new Set(this.items.map(item => item.subject))];
        },
        uniqueLevels() {
            return [...new Set(this.items.map(item => item.testLevel))];
        },
        filteredItems() {
            return this.items.filter(item => {
                const matchesSearch = Object.values(item).some(value =>
                    String(value).toLowerCase().includes(this.search.toLowerCase())
                );
                const matchesSubject = !this.filterSubject || item.subject === this.filterSubject;
                const matchesLevel = !this.filterLevel || item.testLevel === this.filterLevel;
                return matchesSearch && matchesSubject && matchesLevel;
            });
        },
        sortedItems() {
            return [...this.filteredItems].sort((a, b) => {
                let aValue = a[this.sortKey];
                let bValue = b[this.sortKey];
                
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }
                
                if (this.sortOrder === 'asc') {
                    return aValue > bValue ? 1 : -1;
                }
                return aValue < bValue ? 1 : -1;
            });
        },
        paginatedAndFilteredItems() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.sortedItems.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredItems.length / this.itemsPerPage);
        }
    },
    methods: {
        formatDate(timestamp) {
            return new Date(timestamp).toLocaleDateString();
        },
        getScoreClass(score) {
            if (score >= 90) return 'score-excellent';
            if (score >= 70) return 'score-good';
            return 'score-poor';
        },
        sortBy(key) {
            if (this.sortKey === key) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = key;
                this.sortOrder = 'asc';
            }
        },
        deleteItem(item) {
            if (confirm('Вы уверены, что хотите удалить эту запись?')) {
                const index = this.items.indexOf(item);
                this.items.splice(index, 1);
            }
        },
        viewDetails(item) {
            this.$router.push(`/test-details/${item.id}`);
        }
    },
    watch: {
        filteredItems() {
            this.currentPage = 1;
        }
    }
};
</script>

<style scoped>
.dashboard-container {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.search-filter {
    display: flex;
    gap: 1rem;
}

.search-input, .filter-select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
}

.table-wrapper {
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

th {
    background: #f8f9fa;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
}

th:hover {
    background: #f1f3f5;
}

.sort-indicator {
    margin-left: 0.5rem;
    color: #007bff;
}

.actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.view {
    background: #007bff;
    color: white;
}

.delete {
    background: #dc3545;
    color: white;
}

.action-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.score-excellent {
    color: #28a745;
    font-weight: 600;
}

.score-good {
    color: #ffc107;
    font-weight: 600;
}

.score-poor {
    color: #dc3545;
    font-weight: 600;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
}

.pagination-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #007bff;
    background: white;
    color: #007bff;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
    background: #007bff;
    color: white;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-info {
    font-size: 0.9rem;
    color: #666;
}

@media (max-width: 768px) {
    .table-header {
        flex-direction: column;
        gap: 1rem;
    }

    .search-filter {
        flex-direction: column;
        width: 100%;
    }

    .search-input, .filter-select {
        width: 100%;
    }

    .actions {
        flex-direction: column;
    }

    .action-btn {
        width: 100%;
    }
}
</style>