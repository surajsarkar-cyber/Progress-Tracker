let progressData = JSON.parse(localStorage.getItem('progressData')) || {};
let questsData = JSON.parse(localStorage.getItem('questsData')) || {};
let expensesData = JSON.parse(localStorage.getItem('expensesData')) || {};

let currentWeekOffset = 0;

const DAILY_QUESTS = [
    { id: 'pushups', name: '20 Pushups 💪', points: 1 },
    { id: 'study6h', name: 'Study 6 hours 📚', points: 3 },
    { id: 'coldshower', name: 'Cold Shower 🥶', points: 1 },
    { id: 'meditate', name: '10 min Meditation 🧘', points: 1 },
    { id: 'readbook', name: 'Read 20 pages 📖', points: 1 }
];

function switchTab(tabName, element) {

    document.querySelectorAll('.tab-content')
        .forEach(tab => tab.classList.remove('active'));

    document.querySelectorAll('.tab')
        .forEach(tab => tab.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');

    element.classList.add('active');

    if (tabName === 'quests') displayQuests();
    if (tabName === 'finance') displayExpenses();
    if (tabName === 'weekly') renderWeek();
}

function saveToday() {

    const today = getTodayDate();

    progressData[today] = {
        python: {
            time: document.getElementById('pythonTime').value,
            notes: document.getElementById('pythonNotes').value
        },

        cyber: {
            time: document.getElementById('cyberTime').value,
            notes: document.getElementById('cyberNotes').value
        }
    };

    localStorage.setItem('progressData', JSON.stringify(progressData));

    alert("✅ Progress Saved!");
}

function displayQuests() {

    const today = getTodayDate();

    const questList = document.getElementById('questList');

    questList.innerHTML = DAILY_QUESTS.map(quest => {

        const completed = questsData[today]?.[quest.id] || false;

        return `
            <div class="quest-item">
                <div>
                    <strong>${quest.name}</strong>
                </div>

                <input 
                    type="checkbox"
                    class="quest-checkbox"
                    ${completed ? 'checked' : ''}
                    onchange="toggleQuest('${quest.id}', this.checked)"
                >
            </div>
        `;
    }).join('');
}

function toggleQuest(questId, completed) {

    const today = getTodayDate();

    if (!questsData[today]) {
        questsData[today] = {};
    }

    questsData[today][questId] = completed;

    localStorage.setItem('questsData', JSON.stringify(questsData));
}

function resetQuests() {

    delete questsData[getTodayDate()];

    localStorage.setItem('questsData', JSON.stringify(questsData));

    displayQuests();

    alert("🔄 Quests Reset!");
}

function renderWeek() {

    const totalPythonWeek = document.getElementById('totalPythonWeek');
    const totalCyberWeek = document.getElementById('totalCyberWeek');
    const totalQuestsWeek = document.getElementById('totalQuestsWeek');

    let pythonMinutes = 0;
    let cyberMinutes = 0;
    let quests = 0;

    Object.values(progressData).forEach(day => {
        pythonMinutes += parseInt(day.python.time || 0);
        cyberMinutes += parseInt(day.cyber.time || 0);
    });

    Object.values(questsData).forEach(day => {
        quests += Object.values(day).filter(Boolean).length;
    });

    totalPythonWeek.textContent =
        `${Math.floor(pythonMinutes / 60)}h ${pythonMinutes % 60}m`;

    totalCyberWeek.textContent =
        `${Math.floor(cyberMinutes / 60)}h ${cyberMinutes % 60}m`;

    totalQuestsWeek.textContent = `${quests}/35`;
}

function addExpense() {

    const amount = parseFloat(document.getElementById('expenseAmount').value);

    const category = document.getElementById('expenseCategory').value;

    const notes = document.getElementById('expenseNotes').value;

    if (!amount || amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    const today = getTodayDate();

    if (!expensesData[today]) {
        expensesData[today] = [];
    }

    expensesData[today].push({
        id: Date.now(),
        amount,
        category,
        notes
    });

    localStorage.setItem('expensesData', JSON.stringify(expensesData));

    displayExpenses();

    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseNotes').value = '';
}

function displayExpenses() {

    const today = getTodayDate();

    const expenseList = document.getElementById('expenseList');

    const todayExpenses = expensesData[today] || [];

    let total = 0;

    expenseList.innerHTML = todayExpenses.map(expense => {

        total += expense.amount;

        return `
            <div class="quest-item">
                <div>
                    ₹${expense.amount} - ${expense.notes}
                </div>

                <button 
                    class="btn"
                    onclick="deleteExpense('${today}', ${expense.id})"
                >
                    Delete
                </button>
            </div>
        `;
    }).join('');

    document.getElementById('dailyTotal').textContent =
        total.toFixed(2);
}

function deleteExpense(date, id) {

    expensesData[date] =
        expensesData[date].filter(exp => exp.id != id);

    localStorage.setItem('expensesData', JSON.stringify(expensesData));

    displayExpenses();
}

function loadCurrentWeek() {
    currentWeekOffset = 0;
    renderWeek();
}

function loadPreviousWeek() {
    currentWeekOffset--;
    renderWeek();
}

function loadNextWeek() {
    currentWeekOffset++;
    renderWeek();
}

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

displayQuests();
displayExpenses();
renderWeek();