let trackerData = JSON.parse(localStorage.getItem('ironTracker')) || {};

function getBDTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const bdTime = new Date(utc + (3600000 * 6));
    return bdTime;
}

let bdTime = getBDTime();

const calendarEl = document.getElementById('calendar');
const currentMonthEl = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const morningBtn = document.getElementById('morningBtn');
const noonBtn = document.getElementById('noonBtn');
const nightBtn = document.getElementById('nightBtn');

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function generateCalendar() {
    calendarEl.innerHTML = '';

    const year = bdTime.getFullYear();
    const month = bdTime.getMonth();

    currentMonthEl.textContent = bdTime.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'h-12 bg-blue-50 rounded-lg';
        calendarEl.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'h-12 bg-blue-50 rounded-lg flex flex-col items-center justify-center p-1';

        const dateStr = formatDate(new Date(year, month, day));
        const todayStr = formatDate(getBDTime());

        if (dateStr === todayStr) {
            dayCell.classList.add('ring-2', 'ring-blue-500');
        }

        const dayNumber = document.createElement('span');
        dayNumber.className = 'text-sm font-semibold';
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);

        if (trackerData[dateStr]) {
            const checksContainer = document.createElement('div');
            checksContainer.className = 'flex space-x-1 mt-1';

            const morningCheck = document.createElement('span');
            morningCheck.className = trackerData[dateStr].morning
                ? 'text-green-500'
                : 'text-gray-300';
            morningCheck.innerHTML = '<i class="fas fa-check text-xs"></i>';
            checksContainer.appendChild(morningCheck);

            const noonCheck = document.createElement('span');
            noonCheck.className = trackerData[dateStr].noon
                ? 'text-green-500'
                : 'text-gray-300';
            noonCheck.innerHTML = '<i class="fas fa-check text-xs"></i>';
            checksContainer.appendChild(noonCheck);

            const nightCheck = document.createElement('span');
            nightCheck.className = trackerData[dateStr].night
                ? 'text-green-500'
                : 'text-gray-300';
            nightCheck.innerHTML = '<i class="fas fa-check text-xs"></i>';
            checksContainer.appendChild(nightCheck);

            dayCell.appendChild(checksContainer);
        }

        calendarEl.appendChild(dayCell);
    }
}

function markDose(type) {
    const today = formatDate(getBDTime());

    if (!trackerData[today]) {
        trackerData[today] = { morning: false, noon: false, night: false };
    }

    trackerData[today][type] = !trackerData[today][type];

    const button = type === 'morning' ? morningBtn :
        type === 'noon' ? noonBtn : nightBtn;
    const isTaken = trackerData[today][type];

    if (isTaken) {
        button.innerHTML = '<i class="fas fa-check-square mr-2"></i> Taken';
        button.classList.remove('bg-blue-100', 'text-[#1ec5ce]');
        button.classList.add('bg-green-100', 'text-green-700');
    } else {
        button.innerHTML = '<i class="far fa-square mr-2"></i> Mark as taken';
        button.classList.remove('bg-green-100', 'text-green-700');
        button.classList.add('bg-blue-100', 'text-[#1ec5ce]');
    }

    localStorage.setItem('ironTracker', JSON.stringify(trackerData));
    generateCalendar();
}

function initTodayButtons() {
    const today = formatDate(getBDTime());

    if (trackerData[today]) {
        if (trackerData[today].morning) {
            morningBtn.innerHTML = '<i class="fas fa-check-square mr-2"></i> Taken';
            morningBtn.classList.remove('bg-blue-100', 'text-[#1ec5ce]');
            morningBtn.classList.add('bg-green-100', 'text-green-700');
        }

        if (trackerData[today].noon) {
            noonBtn.innerHTML = '<i class="fas fa-check-square mr-2"></i> Taken';
            noonBtn.classList.remove('bg-blue-100', 'text-[#1ec5ce]');
            noonBtn.classList.add('bg-green-100', 'text-green-700');
        }

        if (trackerData[today].night) {
            nightBtn.innerHTML = '<i class="fas fa-check-square mr-2"></i> Taken';
            nightBtn.classList.remove('bg-blue-100', 'text-[#1ec5ce]');
            nightBtn.classList.add('bg-green-100', 'text-green-700');
        }
    }
}

prevMonthBtn.addEventListener('click', () => {
    bdTime.setMonth(bdTime.getMonth() - 1);
    generateCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    bdTime.setMonth(bdTime.getMonth() + 1);
    generateCalendar();
});

morningBtn.addEventListener('click', () => markDose('morning'));
noonBtn.addEventListener('click', () => markDose('noon'));
nightBtn.addEventListener('click', () => markDose('night'));

generateCalendar();
initTodayButtons();