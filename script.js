const userData = [
    {
        id: 1,
        name: 'John Doe',
        workouts: [
            { type: 'Running', minutes: 30 },
            { type: 'Cycling', minutes: 45 }
        ]
    },
    {
        id: 2,
        name: 'Jane Smith',
        workouts: [
            { type: 'Swimming', minutes: 60 },
            { type: 'Running', minutes: 20 }
        ]
    },
    {
        id: 3,
        name: 'Mike Johnson',
        workouts: [
            { type: 'Yoga', minutes: 50 },
            { type: 'Cycling', minutes: 40 }
        ]
    }
];

const userList = document.getElementById('userList');
const workoutTableBody = document.getElementById('workoutTableBody');
const userTitle = document.getElementById('userTitle');
const workoutChart = document.getElementById('workoutChart');


function renderUserList() {
    userList.innerHTML = userData.map(user =>
        `<li class="name" data-id="${user.id}">${user.name}</li>`
    ).join('');
}

function renderWorkoutTable() {
    workoutTableBody.innerHTML = userData.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.workouts.map(w => w.type).join(', ')}</td>
            <td>${user.workouts.length}</td>
            <td>${user.workouts.reduce((sum, w) => sum + w.minutes, 0)}</td>
        </tr>
    `).join('');
}

function filterTable() {
    const search = document.getElementById('search').value.toLowerCase();
    const filterValue = document.getElementById('workout-filter-type').value.toLowerCase();
    const rows = workoutTableBody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const nameCell = rows[i].getElementsByTagName('td')[0];
        const workoutCell = rows[i].getElementsByTagName('td')[1];
        if (nameCell && workoutCell) {
            const nameValue = nameCell.textContent || nameCell.innerText;
            const workoutValue = workoutCell.textContent || workoutCell.innerText;

            const searchResult = nameValue.toLowerCase().indexOf(search) > -1;
            const workoutResult = filterValue === 'all' || workoutValue.toLowerCase().indexOf(filterValue) > -1;
            if (searchResult && workoutResult)
                rows[i].style.display = '';
            else
                rows[i].style.display = 'none';
        }
    }
}

let chartInstance;

function updateGraph(userId) {
    const user = userData.find(u => u.id === userId);
    userTitle.textContent = `${user.name}'s Workout Progress`;

    const labels = user.workouts.map(w => w.type);
    const data = user.workouts.map(w => w.minutes);

    if (chartInstance) {
        chartInstance.destroy();
    }

    const ctx = workoutChart.getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Workout Minutes',
                data: data,
                backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                }
            }
        }
    });
}

userList.addEventListener('click', function (event) {
    if (event.target.classList.contains('name')) {
        const userId = parseInt(event.target.getAttribute('data-id'));
        updateGraph(userId);
    }
});

search.addEventListener('input', filterTable);
document.getElementById('workout-filter-type').addEventListener('change', filterTable);

renderUserList();
renderWorkoutTable();
updateGraph(1);