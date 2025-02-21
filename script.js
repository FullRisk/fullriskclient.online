document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Toggle sidebar
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !toggleButton.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Dark mode toggle
    function setTheme(isDark) {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            darkModeToggle.checked = true;
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            darkModeToggle.checked = false;
        }
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme === 'dark');

    // Handle theme toggle
    darkModeToggle.addEventListener('change', (e) => {
        setTheme(e.target.checked);
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Update active state
                document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
                // Close sidebar on mobile after clicking
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });

    // Keep active state in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Minecraft Server Status
    async function updateServerStatus() {
        const serverIp = 'play.example.com'; // Replace with your server IP
        const apiUrl = `https://api.mcsrvstat.us/2/${serverIp}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const statusBox = document.querySelector('.status-box');
            if (!statusBox) return; // Only run on the Minecraft page

            const statusIndicator = statusBox.querySelector('.status-indicator');
            const playerCount = statusBox.querySelector('.player-count');

            if (data.online) {
                statusIndicator.classList.add('online');
                statusIndicator.classList.remove('offline');
                playerCount.textContent = `Players Online: ${data.players.online}/${data.players.max}`;
            } else {
                statusIndicator.classList.add('offline');
                statusIndicator.classList.remove('online');
                playerCount.textContent = 'Server Offline';
            }
        } catch (error) {
            console.error('Failed to fetch server status:', error);
        }
    }

    // Update server status every 60 seconds if we're on the Minecraft page
    if (document.querySelector('.minecraft-section')) {
        updateServerStatus();
        setInterval(updateServerStatus, 60000);
    }

    // Color Picker Functionality
    const colorPickerBtn = document.getElementById('colorPickerBtn');
    const colorPickerPopup = document.querySelector('.color-picker-popup');
    const customColorPicker = document.getElementById('customColorPicker');
    const presetColors = document.querySelectorAll('.preset-color');

    // Load saved color
    const savedColor = localStorage.getItem('themeColor') || '#4A90E2';
    document.documentElement.style.setProperty('--accent-color', savedColor);
    customColorPicker.value = savedColor;

    // Toggle color picker popup
    colorPickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        colorPickerPopup.classList.toggle('show');
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!colorPickerPopup.contains(e.target) && !colorPickerBtn.contains(e.target)) {
            colorPickerPopup.classList.remove('show');
        }
    });

    // Handle preset colors
    presetColors.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            updateThemeColor(color);
        });
    });

    // Handle custom color picker
    customColorPicker.addEventListener('input', (e) => {
        updateThemeColor(e.target.value);
    });

    customColorPicker.addEventListener('change', (e) => {
        updateThemeColor(e.target.value);
        colorPickerPopup.classList.remove('show');
    });

    function updateThemeColor(color) {
        document.documentElement.style.setProperty('--accent-color', color);
        localStorage.setItem('themeColor', color);
        customColorPicker.value = color;
    }

    // Hover Sound Functionality
    const hoverSound = new Audio('sounds/hover.mp3');
    hoverSound.volume = 0.2; // Reduziere die Lautstärke auf 20%

    // Füge den Sound zu allen Navigationslinks hinzu
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        // Verwende mouseenter statt hover für bessere Performance
        link.addEventListener('mouseenter', () => {
            // Starte den Sound von Anfang an
            hoverSound.currentTime = 0;
            hoverSound.play().catch(error => {
                // Ignoriere Fehler wenn der Sound noch nicht hochgeladen wurde
                console.log('Sound wird noch geladen oder ist nicht verfügbar');
            });
        });
    });

    // Sound-Einstellungen speichern
    let soundEnabled = localStorage.getItem('soundEnabled');
    // Wenn noch keine Einstellung existiert, setze auf true (Sound an)
    if (soundEnabled === null) {
        soundEnabled = true;
        localStorage.setItem('soundEnabled', 'true');
    } else {
        soundEnabled = soundEnabled === 'true';
    }

    // Füge Sound-Toggle zur Sidebar hinzu
    const soundToggle = document.createElement('div');
    soundToggle.className = 'sound-toggle';
    soundToggle.innerHTML = `
        <button class="sound-toggle-btn" title="Toggle Sound">
            <i class="fas ${soundEnabled ? 'fa-volume-up' : 'fa-volume-mute'}"></i>
        </button>
    `;

    // Füge den Toggle-Button VOR dem Dark Mode ein
    const themeSwitch = document.querySelector('.theme-switch');
    themeSwitch.parentNode.insertBefore(soundToggle, themeSwitch);

    // Sound-Toggle-Funktionalität
    const soundToggleBtn = document.querySelector('.sound-toggle-btn');
    soundToggleBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('soundEnabled', soundEnabled);
        soundToggleBtn.innerHTML = `<i class="fas ${soundEnabled ? 'fa-volume-up' : 'fa-volume-mute'}"></i>`;
        hoverSound.muted = !soundEnabled;
    });

    // Initialer Sound-Status
    hoverSound.muted = !soundEnabled;
});
