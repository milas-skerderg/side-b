document.addEventListener('DOMContentLoaded', () => {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const calendarDays = document.querySelectorAll('.calendar div');
    const dateDisplay = document.getElementById('selected-date-display');
    const datePickerInput = document.getElementById('date-picker-input');

    let selectedDate = null;

    // Tab switching logic
    tabLinks.forEach(tab => {
        tab.addEventListener('click', () => {
            tabLinks.forEach(link => link.classList.remove('current'));
            tab.classList.add('current');

            const tabId = tab.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('current');
                if (content.id === tabId) {
                    content.classList.add('current');
                }
            });
        });
    });

    // Date selection logic
    calendarDays.forEach(day => {
        day.addEventListener('click', () => {
            calendarDays.forEach(d => d.classList.remove('selected-date'));
            day.classList.add('selected-date');
            selectedDate = day.textContent;
            dateDisplay.textContent = `Selected Date: ${selectedDate}`;
            datePickerInput.value = ''; // Clear the date picker when using calendar
        });
    });

    // Date picker selection logic
    datePickerInput.addEventListener('change', (e) => {
        const newDate = new Date(e.target.value).toLocaleDateString();
        selectedDate = newDate;
        dateDisplay.textContent = `Selected Date: ${selectedDate}`;
    });
});

let currentDate = new Date();
const mapElement = document.getElementById("map");
const timeSlotContainer = document.getElementById("time-slots");
const currentMonthElement = document.getElementById("current-month");

// Generate random unavailable dates
function getRandomUnavailableDates(totalDays) {
    const unavailableDates = new Set();
    const count = Math.floor(Math.random() * totalDays / 4); // Randomly mark 0 to 25% as unavailable
    while (unavailableDates.size < count) {
        const randomDay = Math.floor(Math.random() * totalDays) + 1;
        unavailableDates.add(randomDay);
    }
    return unavailableDates;
}


// Generate calendar dates for the current month
function generateCalendar() {
    const calendar = document.querySelector(".calendar");
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const unavailableDates = getRandomUnavailableDates(daysInMonth); // Get random unavailable dates

    calendar.innerHTML = `<div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>`;

    for (let i = 0; i < firstDay; i++) {
        calendar.innerHTML += `<div></div>`; // Empty space for the first week
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isUnavailable = unavailableDates.has(day);
        const className = isUnavailable ? 'unavailable-date' : 'date';
        calendar.innerHTML += `<div class="${className}" onclick="${isUnavailable ? '' : `selectDate(${day})`}">${day}</div>`;
    }

    // Update the current month displayed
    currentMonthElement.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
}

// Select a date and show time slots instead of the map
function selectDate(day) {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Clear previous selections
    const previousSelected = document.querySelector(".selected-date");
    if (previousSelected) {
        previousSelected.classList.remove("selected-date");
    }

    // Highlight the selected date
    const dateCells = document.querySelectorAll(".calendar div.date");
    dateCells.forEach((cell, index) => {
        // Clear previous selections
        cell.classList.remove("selected-date"); 
    });

    // Apply the selected class to the correct cell
    const selectedElement = document.querySelector(`.calendar div:nth-child(${day + (new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() + 7)})`);
    selectedElement.classList.add("selected-date");
}

// Show the booking confirmation modal
function showPopup(time) {
    const modal = document.getElementById("booking-modal");
    const bookingTime = document.getElementById("booking-time");
    bookingTime.textContent = `You have selected ${time} on ${new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toLocaleDateString()}`;
    
    modal.style.display = "block"; // Show modal
}

// Navigation for the calendar (previous and next month)
document.getElementById("prev-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
    initMap(); // Reinitialize the map for the new month
});

document.getElementById("next-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
    initMap(); // Reinitialize the map for the new month
});

// Initialize calendar and map on load
window.onload = function() {
    generateCalendar();
    initMap();
};
