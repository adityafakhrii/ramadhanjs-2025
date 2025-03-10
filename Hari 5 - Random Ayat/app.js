
        // Initialize particles background
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 50,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#818cf8"
                },
                "shape": {
                    "type": "circle",
                },
                "opacity": {
                    "value": 0.15,
                    "random": true,
                },
                "size": {
                    "value": 3,
                    "random": true,
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#818cf8",
                    "opacity": 0.1,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 0.5,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": false,
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.3
                        }
                    }
                }
            },
            "retina_detect": true
        });

        // Dark/Light mode toggle
        const themeToggle = document.getElementById('theme-toggle');
        const darkIcon = document.getElementById('dark-icon');
        const lightIcon = document.getElementById('light-icon');
        const body = document.body;

        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                darkIcon.classList.add('hidden');
                lightIcon.classList.remove('hidden');
                
                // Update particles for light mode
                window.pJSDom[0].pJS.particles.color.value = '#4F46E5';
                window.pJSDom[0].pJS.particles.line_linked.color = '#4F46E5';
                window.pJSDom[0].pJS.fn.particlesRefresh();
            } else {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                lightIcon.classList.add('hidden');
                darkIcon.classList.remove('hidden');
                
                // Update particles for dark mode
                window.pJSDom[0].pJS.particles.color.value = '#818cf8';
                window.pJSDom[0].pJS.particles.line_linked.color = '#818cf8';
                window.pJSDom[0].pJS.fn.particlesRefresh();
            }
        });

        // Animate title on load
        document.addEventListener('DOMContentLoaded', () => {
            gsap.from("#animate-title", {
                y: -50,
                opacity: 0,
                duration: 1,
                ease: "back.out(1.7)"
            });
        });

        // Fetching random ayah with animations
        async function fetchRandomAyah() {
            // Show loading spinner
            document.getElementById('loading-spinner').style.display = 'block';
            document.getElementById('ayah-text').style.opacity = 0;
            document.getElementById('ayah-details').style.opacity = 0;
            
            // Animate loading bar
            gsap.fromTo(".loading-bar", {
                width: "0%"
            }, {
                width: "100%",
                duration: 2
            });
            
            try {
                // Random nomor surat dan ayat (ada 114 surat)
                let surahNumber = Math.floor(Math.random() * 114) + 1;
                
                // Fetch jumlah ayat dalam surat tersebut
                let surahInfo = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
                let surahData = await surahInfo.json();
                let ayahNumber = Math.floor(Math.random() * surahData.data.numberOfAyahs) + 1;

                // Fetch ayat random
                let response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-uthmani,id.indonesian`);
                let data = await response.json();

                // Ambil teks Arab dan terjemahan
                let arabicText = data.data[0].text;
                let translation = data.data[1].text;
                let surahName = data.data[0].surah.englishName;
                let ayahInfo = `${data.data[0].surah.englishName} (${data.data[0].surah.englishNameTranslation}) - Ayat ${ayahNumber}`;

                // Hide loading spinner after a short delay
                setTimeout(() => {
                    // Tampilkan di HTML
                    document.getElementById("ayah-text").innerText = arabicText;
                    document.getElementById("ayah-translation").innerText = translation;
                    document.getElementById("ayah-surah").innerText = ayahInfo;
                    
                    document.getElementById('loading-spinner').style.display = 'none';
                    
                    // Animate content appearing
                    gsap.to("#ayah-text", {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                    
                    gsap.to("#ayah-details", {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: 0.3,
                        ease: "power2.out"
                    });
                }, 1000);
                
            } catch (error) {
                document.getElementById("ayah-text").innerText = "Gagal mengambil ayat.";
                document.getElementById('loading-spinner').style.display = 'none';
                document.getElementById('ayah-text').style.opacity = 1;
                console.error("Error fetching ayah:", error);
            }
        }

        // Panggil pertama kali saat halaman dimuat
        fetchRandomAyah();