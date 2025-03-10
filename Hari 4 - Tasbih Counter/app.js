
        // Ambil elemen
        const countEl = document.getElementById("count");
        const incrementBtn = document.getElementById("increment");
        const resetBtn = document.getElementById("reset");
        const vibrateBtn = document.getElementById("vibrate");
        const historyEl = document.getElementById("history");
        const toggleThemeBtn = document.getElementById("toggle-theme");
        const clearHistoryBtn = document.getElementById("clear-history");

        let count = localStorage.getItem("tasbihCount") ? parseInt(localStorage.getItem("tasbihCount")) : 0;
        let history = JSON.parse(localStorage.getItem("tasbihHistory")) || [];
        let vibrateEnabled = localStorage.getItem("vibrateEnabled") === "true";

        updateUI();

        // Tambah hitungan
        incrementBtn.addEventListener("click", () => {
            increment(1, "Tasbih +1");
        });

        // Fungsi tambah hitungan
        function increment(value, label) {
            count += value;
            localStorage.setItem("tasbihCount", count);
            
            // Tambahkan efek visual
            countEl.classList.add("scale-105", "text-blue-600", "dark:text-blue-400");
            setTimeout(() => {
                countEl.classList.remove("scale-105", "text-blue-600", "dark:text-blue-400");
            }, 200);
            
            // Jalankan vibrasi jika diaktifkan
            if (vibrateEnabled && 'vibrate' in navigator) {
                navigator.vibrate(20);
            }
            
            updateUI();
        }

        // Reset hitungan & simpan history
        resetBtn.addEventListener("click", () => {
            if (count > 0) {
                history.unshift({ time: new Date().toLocaleString(), value: count, label: "Completed" });
                if (history.length > 50) history.pop(); // Batasi history
                localStorage.setItem("tasbihHistory", JSON.stringify(history));
            }
            count = 0;
            localStorage.setItem("tasbihCount", count);
            
            // Jalankan vibrasi jika diaktifkan
            if (vibrateEnabled && 'vibrate' in navigator) {
                navigator.vibrate([30, 50, 30]);
            }
            
            updateUI();
        });

        // Clear history
        clearHistoryBtn.addEventListener("click", () => {
            if (confirm("Hapus semua riwayat?")) {
                history = [];
                localStorage.setItem("tasbihHistory", JSON.stringify(history));
                
                // Jalankan vibrasi jika diaktifkan
                if (vibrateEnabled && 'vibrate' in navigator) {
                    navigator.vibrate([50, 50, 50]);
                }
                
                updateUI();
            }
        });

        // Toggle vibrate
        vibrateBtn.addEventListener("click", () => {
            vibrateEnabled = !vibrateEnabled;
            localStorage.setItem("vibrateEnabled", vibrateEnabled);
            
            // Berikan feedback
            if (vibrateEnabled && 'vibrate' in navigator) {
                navigator.vibrate([50, 100, 50, 100, 50]);
            }
            
            // Update UI
            vibrateBtn.classList.toggle("bg-blue-100", vibrateEnabled);
            vibrateBtn.classList.toggle("dark:bg-blue-900", vibrateEnabled);
            vibrateBtn.classList.toggle("text-blue-700", vibrateEnabled);
            vibrateBtn.classList.toggle("dark:text-blue-300", vibrateEnabled);
        });

        // Toggle dark mode
        toggleThemeBtn.addEventListener("click", () => {
            document.documentElement.classList.toggle("dark");
            localStorage.setItem("darkMode", document.documentElement.classList.contains("dark"));
        });

        // Perbarui UI
        function updateUI() {
            countEl.textContent = count;
            
            if (history.length === 0) {
                historyEl.innerHTML = '<li class="text-center text-gray-500 dark:text-gray-400 py-2">Belum ada riwayat</li>';
                clearHistoryBtn.classList.add("opacity-50", "cursor-not-allowed");
                clearHistoryBtn.disabled = true;
            } else {
                historyEl.innerHTML = history.map(h => 
                    `<li class="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div class="flex justify-between items-center">
                            <span class="font-semibold ${h.label === "Completed" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}">${h.label || "Tasbih"}</span>
                            <span class="text-gray-500 dark:text-gray-400 text-xs">${h.time}</span>
                        </div>
                        <div class="text-lg font-semibold mt-1">${h.value}x</div>
                    </li>`
                ).join("");
                clearHistoryBtn.classList.remove("opacity-50", "cursor-not-allowed");
                clearHistoryBtn.disabled = false;
            }
            
            // Update tampilan tombol vibrate
            vibrateBtn.classList.toggle("bg-blue-100", vibrateEnabled);
            vibrateBtn.classList.toggle("dark:bg-blue-900", vibrateEnabled);
            vibrateBtn.classList.toggle("text-blue-700", vibrateEnabled);
            vibrateBtn.classList.toggle("dark:text-blue-300", vibrateEnabled);
        }

        // Load dark mode jika sebelumnya aktif
        if (localStorage.getItem("darkMode") === "true" || 
            (!localStorage.getItem("darkMode") && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add("dark");
        }