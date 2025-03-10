// Dark mode toggle
const html = document.querySelector('html');
const toggleCheckbox = document.getElementById('toggle');

// Check if dark mode is stored in localStorage
if (localStorage.getItem('darkMode') === 'true') {
    html.classList.remove('light');
    html.classList.add('dark');
    toggleCheckbox.checked = true;
}

toggleCheckbox.addEventListener('change', function() {
    if (this.checked) {
        html.classList.remove('light');
        html.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
    } else {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('darkMode', 'false');
    }
});

// Initial Data
const initialRituals = [
    { id: 1, text: "Niyyah (Intention) for Umrah", completed: false },
    { id: 2, text: "Enter state of Ihram at Miqat", completed: false },
    { id: 3, text: "Tawaf around the Kaaba (7 times)", completed: false },
    { id: 4, text: "Sa'i between Safa and Marwah", completed: false },
    { id: 5, text: "Halq or Taqsir (Cutting of hair)", completed: false }
];

const initialPackingItems = [
    { id: 1, text: "Ihram clothing (for men)", completed: false },
    { id: 2, text: "Prayer mat", completed: false },
    { id: 3, text: "Quran (or Quran app)", completed: false },
    { id: 4, text: "Comfortable walking shoes", completed: false },
    { id: 5, text: "Medicine and toiletries", completed: false }
];

const initialDuas = [
    { id: 1, title: "Talbiyah", text: "Labbayk Allahumma labbayk, labbayk la shareeka laka labbayk, innal-hamda wan-ni'mata laka wal-mulk, la shareeka lak." },
    { id: 2, title: "When Entering Masjid al-Haram", text: "Bismillahi wassalatu wassalamu 'ala Rasoolillah. Allahumma aftah li abwaba rahmatik." },
    { id: 3, title: "When Starting Tawaf", text: "Bismillahi Allahu Akbar. Allahumma imanan bika, wa tasdiqan bi kitabika, wa wafa'an bi 'ahdika, wattiba'an li sunnati nabiyyika Muhammadin sallallahu 'alaihi wa sallam." }
];

// Render functions
function renderRituals() {
    const ritualsList = document.getElementById('rituals-list');
    ritualsList.innerHTML = '';
    
    initialRituals.forEach(ritual => {
        const div = document.createElement('div');
        div.className = `task-item flex items-center p-3 rounded-lg bg-card shadow-sm`;
        div.innerHTML = `
            <input type="checkbox" id="ritual-${ritual.id}" data-id="${ritual.id}" class="ritual-checkbox w-5 h-5 rounded accent-blue-500 cursor-pointer" ${ritual.completed ? 'checked' : ''}>
            <label for="ritual-${ritual.id}" class="ml-3 flex-grow ${ritual.completed ? 'line-through text-secondary' : ''}">${ritual.text}</label>
            <button class="delete-ritual text-red-500 hover:text-red-700" data-id="${ritual.id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;
        ritualsList.appendChild(div);
    });

    // Add event listeners for checkboxes and delete buttons
    document.querySelectorAll('.ritual-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const id = parseInt(this.dataset.id);
            const ritual = initialRituals.find(r => r.id === id);
            if (ritual) {
                ritual.completed = this.checked;
                renderRituals();
            }
        });
    });

    document.querySelectorAll('.delete-ritual').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const index = initialRituals.findIndex(r => r.id === id);
            if (index !== -1) {
                initialRituals.splice(index, 1);
                renderRituals();
            }
        });
    });
}

function renderPackingItems() {
    const packingList = document.getElementById('packing-list');
    packingList.innerHTML = '';
    
    initialPackingItems.forEach(item => {
        const div = document.createElement('div');
        div.className = `task-item flex items-center p-3 rounded-lg bg-card shadow-sm`;
        div.innerHTML = `
            <input type="checkbox" id="item-${item.id}" data-id="${item.id}" class="item-checkbox w-5 h-5 rounded accent-blue-500 cursor-pointer" ${item.completed ? 'checked' : ''}>
            <label for="item-${item.id}" class="ml-3 flex-grow ${item.completed ? 'line-through text-secondary' : ''}">${item.text}</label>
            <button class="delete-item text-red-500 hover:text-red-700" data-id="${item.id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;
        packingList.appendChild(div);
    });

    // Add event listeners for checkboxes and delete buttons
    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const id = parseInt(this.dataset.id);
            const item = initialPackingItems.find(i => i.id === id);
            if (item) {
                item.completed = this.checked;
                renderPackingItems();
            }
        });
    });

    document.querySelectorAll('.delete-item').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const index = initialPackingItems.findIndex(i => i.id === id);
            if (index !== -1) {
                initialPackingItems.splice(index, 1);
                renderPackingItems();
            }
        });
    });
}

function renderDuas() {
    const duasList = document.getElementById('duas-list');
    duasList.innerHTML = '';
    
    initialDuas.forEach(dua => {
        const div = document.createElement('div');
        div.className = 'bg-card p-4 rounded-lg shadow-sm border-l-4 border-indigo-500';
        div.innerHTML = `
            <h3 class="font-medium mb-2">${dua.title}</h3>
            <p class="text-secondary text-sm">${dua.text}</p>
        `;
        duasList.appendChild(div);
    });
}

// Add new ritual
document.getElementById('add-ritual').addEventListener('click', function() {
    const input = document.getElementById('new-ritual');
    const text = input.value.trim();
    
    if (text) {
        const newId = initialRituals.length > 0 ? Math.max(...initialRituals.map(r => r.id)) + 1 : 1;
        initialRituals.push({ id: newId, text, completed: false });
        renderRituals();
        input.value = '';
    }
});

// Add new packing item
document.getElementById('add-item').addEventListener('click', function() {
    const input = document.getElementById('new-item');
    const text = input.value.trim();
    
    if (text) {
        const newId = initialPackingItems.length > 0 ? Math.max(...initialPackingItems.map(i => i.id)) + 1 : 1;
        initialPackingItems.push({ id: newId, text, completed: false });
        renderPackingItems();
        input.value = '';
    }
});

// Enter key functionality for inputs
document.getElementById('new-ritual').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('add-ritual').click();
    }
});

document.getElementById('new-item').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('add-item').click();
    }
});

// Initialize
renderRituals();
renderPackingItems();
renderDuas();