        // Theme toggle functionality
        const htmlElement = document.documentElement;
        const themeToggle = document.getElementById('themeToggle');

        function updateTheme() {
            if (htmlElement.classList.contains('dark')) {
                document.querySelectorAll('.light\\:shadow-neon-light').forEach(el => {
                    el.classList.remove('animate-pulse-light');
                    el.classList.add('animate-pulse-dark');
                });
                document.querySelectorAll('.dark\\:shadow-neon-dark').forEach(el => {
                    el.classList.remove('animate-pulse-light');
                    el.classList.add('animate-pulse-dark');
                });
            } else {
                document.querySelectorAll('.light\\:shadow-neon-light').forEach(el => {
                    el.classList.add('animate-pulse-light');
                    el.classList.remove('animate-pulse-dark');
                });
                document.querySelectorAll('.dark\\:shadow-neon-dark').forEach(el => {
                    el.classList.add('animate-pulse-light');
                    el.classList.remove('animate-pulse-dark');
                });
            }
        }

        function toggleTheme() {
            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                htmlElement.classList.add('light');
            } else {
                htmlElement.classList.remove('light');
                htmlElement.classList.add('dark');
            }
            localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
            updateTheme();
        }

        // Check for saved theme
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && 
            window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            htmlElement.classList.remove('light');
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light');
        }

        themeToggle.addEventListener('click', toggleTheme);
        updateTheme();

        // Calendar functionality
        const calendarDays = document.getElementById('calendarDays');
        const currentMonthElement = document.getElementById('currentMonth');
        const prevMonthButton = document.getElementById('prevMonth');
        const nextMonthButton = document.getElementById('nextMonth');
        const worshipDetails = document.getElementById('worshipDetails');
        const selectedDateElement = document.getElementById('selectedDate');
        const closeDetailsButton = document.getElementById('closeDetails');
        const saveWorshipButton = document.getElementById('saveWorship');
        
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();
        let selectedDay = null;
        let worshipData = JSON.parse(localStorage.getItem('worshipData')) || {};

        function updateStats() {
            let totalDays = 0;
            let totalPrayers = 0;
            let totalFasts = 0;
            let totalQuran = 0;
            let totalDzikir = 0;

            Object.keys(worshipData).forEach(dateKey => {
                const dateData = worshipData[dateKey];
                let hasWorship = false;
                
                if (dateData.subuh) { totalPrayers++; hasWorship = true; }
                if (dateData.dzuhur) { totalPrayers++; hasWorship = true; }
                if (dateData.ashar) { totalPrayers++; hasWorship = true; }
                if (dateData.maghrib) { totalPrayers++; hasWorship = true; }
                if (dateData.isya) { totalPrayers++; hasWorship = true; }
                if (dateData.tahajud) { totalPrayers++; hasWorship = true; }
                if (dateData.dhuha) { totalPrayers++; hasWorship = true; }
                if (dateData.puasa) { totalFasts++; hasWorship = true; }
                if (dateData.quran) { totalQuran++; hasWorship = true; }
                if (dateData.dzikir) { totalDzikir++; hasWorship = true; }

                if (hasWorship) totalDays++;
            });

            document.getElementById('totalDays').textContent = totalDays;
            document.getElementById('totalPrayers').textContent = totalPrayers;
            document.getElementById('totalFasts').textContent = totalFasts;
            document.getElementById('totalQuran').textContent = totalQuran;
            document.getElementById('totalDzikir').textContent = totalDzikir;
        }

        function renderCalendar() {
            calendarDays.innerHTML = '';
            currentMonthElement.textContent = new Date(currentYear, currentMonth, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            
            // Add empty cells for days before the first day of the month
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                calendarDays.appendChild(emptyDay);
            }

            // Add days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
                
                dayElement.className = 'calendar-day relative bg-opacity-80 rounded-lg h-12 flex items-center justify-center cursor-pointer light:hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors duration-300';
                
                // Check if this date has worship data
                let hasCompleteWorship = false;
                if (worshipData[dateKey]) {
                    const worship = worshipData[dateKey];
                    const totalItems = Object.keys(worship).length;
                    const completedItems = Object.values(worship).filter(Boolean).length;
                    
                    if (completedItems > 0) {
                        hasCompleteWorship = true;
                        dayElement.classList.add('day-completed');
                        
                        // Add gradient background based on completion percentage
                        const completionRate = completedItems / totalItems;
                        if (htmlElement.classList.contains('dark')) {
                            dayElement.style.background = `linear-gradient(to top, rgba(16, 185, 129, ${completionRate}), transparent)`;
                        } else {
                            dayElement.style.background = `linear-gradient(to top, rgba(59, 130, 246, ${completionRate}), transparent)`;
                        }
                    }
                }

                // Check if this is today
                const today = new Date();
                if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                    if (htmlElement.classList.contains('dark')) {
                        dayElement.classList.add('dark:ring-2', 'dark:ring-green-400');
                    } else {
                        dayElement.classList.add('light:ring-2', 'light:ring-blue-500');
                    }
                }

                dayElement.textContent = day;
                dayElement.dataset.day = day;
                dayElement.dataset.dateKey = dateKey;
                
                dayElement.addEventListener('click', () => {
                    document.querySelectorAll('.calendar-day').forEach(el => {
                        el.classList.remove('light:bg-blue-200', 'dark:bg-gray-600');
                    });
                    dayElement.classList.add('light:bg-blue-200', 'dark:bg-gray-600');
                    
                    selectedDay = dateKey;
                    selectedDateElement.textContent = new Date(currentYear, currentMonth, day).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                    
                    // Set checkboxes based on saved data
                    const dayData = worshipData[dateKey] || {};
                    document.getElementById('subuh').checked = dayData.subuh || false;
                    document.getElementById('dzuhur').checked = dayData.dzuhur || false;
                    document.getElementById('ashar').checked = dayData.ashar || false;
                    document.getElementById('maghrib').checked = dayData.maghrib || false;
                    document.getElementById('isya').checked = dayData.isya || false;
                    document.getElementById('tahajud').checked = dayData.tahajud || false;
                    document.getElementById('dhuha').checked = dayData.dhuha || false;
                    document.getElementById('puasa').checked = dayData.puasa || false;
                    document.getElementById('quran').checked = dayData.quran || false;
                    document.getElementById('dzikir').checked = dayData.dzikir || false;
                    
                    worshipDetails.classList.remove('hidden');
                    worshipDetails.scrollIntoView({ behavior: 'smooth' });
                });
                
                calendarDays.appendChild(dayElement);
            }
        }

        // Initialize calendar
        renderCalendar();
        updateStats();

        // Event listeners for month navigation
        prevMonthButton.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });

        nextMonthButton.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });

        // Close worship details
        closeDetailsButton.addEventListener('click', () => {
            worshipDetails.classList.add('hidden');
        });

        // Save worship data
        saveWorshipButton.addEventListener('click', () => {
            if (!selectedDay) return;
            
            // Create object for the selected day if it doesn't exist
            if (!worshipData[selectedDay]) {
                worshipData[selectedDay] = {};
            }
            
            // Save checkbox states
            worshipData[selectedDay].subuh = document.getElementById('subuh').checked;
            worshipData[selectedDay].dzuhur = document.getElementById('dzuhur').checked;
            worshipData[selectedDay].ashar = document.getElementById('ashar').checked;
            worshipData[selectedDay].maghrib = document.getElementById('maghrib').checked;
            worshipData[selectedDay].isya = document.getElementById('isya').checked;
            worshipData[selectedDay].tahajud = document.getElementById('tahajud').checked;
            worshipData[selectedDay].dhuha = document.getElementById('dhuha').checked;
            worshipData[selectedDay].puasa = document.getElementById('puasa').checked;
            worshipData[selectedDay].quran = document.getElementById('quran').checked;
            worshipData[selectedDay].dzikir = document.getElementById('dzikir').checked;
            
            // Save to localStorage
            localStorage.setItem('worshipData', JSON.stringify(worshipData));
            
            // Update calendar UI
            renderCalendar();
            updateStats();
            
            // Provide visual feedback
            const originalText = saveWorshipButton.textContent;
            saveWorshipButton.textContent = 'Tersimpan!';
            saveWorshipButton.classList.add('light:bg-green-600', 'dark:bg-blue-600');
            
            setTimeout(() => {
                saveWorshipButton.textContent = originalText;
                saveWorshipButton.classList.remove('light:bg-green-600', 'dark:bg-blue-600');
            }, 1500);
        });

        // Add animation to checkboxes
        document.querySelectorAll('.worship-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    this.parentElement.classList.add('completed');
                } else {
                    this.parentElement.classList.remove('completed');
                }
            });
        });