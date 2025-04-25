document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin panel
    initializeAdminPanel();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Initialize admin panel
function initializeAdminPanel() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn) {
        showAdminPanel();
        loadAdminData();
    }
}

// Show admin panel and hide login
function showAdminPanel() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
}

// Show login and hide admin panel
function showLoginPanel() {
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    
    // Format time: HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    // Format date: Day, DD Month YYYY
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const dateString = `${day}, ${date} ${month} ${year}`;
    
    // Update DOM
    document.getElementById('admin-current-time').textContent = timeString;
    document.getElementById('admin-current-date').textContent = dateString;
}

// Load admin data
function loadAdminData() {
    // Load instansi name
    const instansiNama = localStorage.getItem('instansiNama') || 'Puskesmas Sehat Sejahtera';
    document.getElementById('admin-instansi-nama').textContent = instansiNama;
    document.getElementById('instansi-name-input').value = instansiNama;
    
    // Load running text
    const runningText = localStorage.getItem('runningText') || 'Selamat datang di Puskesmas Sehat Sejahtera. Untuk pendaftaran pasien baru, silakan hubungi petugas administrasi.';
    document.getElementById('running-text-input').value = runningText;
    
    // Load queue data
    const currentQueue = localStorage.getItem('currentQueue') || '-';
    document.getElementById('admin-current-number').textContent = currentQueue;
    
    // Load queue note
    const queueNote = localStorage.getItem('queueNote') || 'Silakan menunggu nomor antrian Anda dipanggil';
    document.getElementById('queue-note-input').value = queueNote;
    
    // Load queue statistics
    const totalQueue = parseInt(localStorage.getItem('totalQueue') || '0');
    const processedQueue = parseInt(localStorage.getItem('processedQueue') || '0');
    const remainingQueue = parseInt(localStorage.getItem('remainingQueue') || '0');
    
    document.getElementById('total-queue').textContent = totalQueue;
    document.getElementById('processed-queue').textContent = processedQueue;
    document.getElementById('remaining-queue').textContent = remainingQueue;
    
    // Load slideshow
    loadSlideshowSettings();
}

// Load slideshow settings
function loadSlideshowSettings() {
    const slideshowList = document.getElementById('slideshow-list');
    slideshowList.innerHTML = '';
    
    // Get slides from localStorage or use defaults
    let slides = JSON.parse(localStorage.getItem('slides')) || [
        { src: 'assets/slide1.jpg' },
        { src: 'assets/slide2.jpg' },
        { src: 'assets/slide3.jpg' }
    ];
    
    // Create slide items
    slides.forEach((slide, index) => {
        const slideItem = document.createElement('div');
        slideItem.className = 'slideshow-item';
        slideItem.innerHTML = `
            <img src="${slide.src}" alt="Slide ${index + 1}">
            <div class="slideshow-item-overlay">
                <div class="slideshow-item-actions">
                    <button class="slide-action-btn edit-slide" data-index="${index}">✏️</button>
                    <button class="slide-action-btn delete-slide" data-index="${index}">🗑️</button>
                </div>
            </div>
        `;
        slideshowList.appendChild(slideItem);
    });
    
    // Add edit and delete event listeners
    document.querySelectorAll('.edit-slide').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            editSlide(index);
        });
    });
    
    document.querySelectorAll('.delete-slide').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteSlide(index);
        });
    });
}

// Edit slide
function editSlide(index) {
    let slides = JSON.parse(localStorage.getItem('slides')) || [];
    const slide = slides[index];
    
    const sourceType = prompt('Pilih sumber gambar (1: URL, 2: Local)', '1');
    
    if (sourceType === '1') {
        const url = prompt('Masukkan URL gambar:', slide.src);
        if (url && url.trim() !== '') {
            slides[index].src = url;
            localStorage.setItem('slides', JSON.stringify(slides));
            loadSlideshowSettings();
        }
    } else if (sourceType === '2') {
        alert('Untuk demo ini, fitur upload file local tidak tersedia. Silakan gunakan URL.');
    }
}

// Delete slide
function deleteSlide(index) {
    if (confirm('Apakah Anda yakin ingin menghapus slide ini?')) {
        let slides = JSON.parse(localStorage.getItem('slides')) || [];
        slides.splice(index, 1);
        localStorage.setItem('slides', JSON.stringify(slides));
        loadSlideshowSettings();
    }
}

// Add new slide
function addSlide() {
    const sourceType = prompt('Pilih sumber gambar (1: URL, 2: Local)', '1');
    
    if (sourceType === '1') {
        const url = prompt('Masukkan URL gambar:');
        if (url && url.trim() !== '') {
            let slides = JSON.parse(localStorage.getItem('slides')) || [];
            slides.push({ src: url });
            localStorage.setItem('slides', JSON.stringify(slides));
            loadSlideshowSettings();
        }
    } else if (sourceType === '2') {
        alert('Untuk demo ini, fitur upload file local tidak tersedia. Silakan gunakan URL.');
    }
}

// Call next queue
function callNextQueue() {
    let queueList = JSON.parse(localStorage.getItem('queueList')) || [];
    
    if (queueList.length > 0) {
        // Get next queue number
        const nextQueue = queueList.shift();
        
        // Update current queue
        localStorage.setItem('currentQueue', nextQueue);
        document.getElementById('admin-current-number').textContent = nextQueue;
        
        // Update queue list
        localStorage.setItem('queueList', JSON.stringify(queueList));
        
        // Update statistics
        const totalQueue = parseInt(localStorage.getItem('totalQueue') || '0');
        const processedQueue = parseInt(localStorage.getItem('processedQueue') || '0') + 1;
        const remainingQueue = queueList.length;
        
        localStorage.setItem('processedQueue', processedQueue.toString());
        localStorage.setItem('remainingQueue', remainingQueue.toString());
        
        document.getElementById('processed-queue').textContent = processedQueue;
        document.getElementById('remaining-queue').textContent = remainingQueue;
        
        // Announce the next queue
        speakText(`Panggilan nomor antrian ${nextQueue} terima kasih.`);
    } else {
        alert('Tidak ada antrian berikutnya.');
    }
}

// Reset queue
function resetQueue() {
    if (confirm('Apakah Anda yakin ingin mereset seluruh antrian?')) {
        localStorage.setItem('currentQueue', '-');
        localStorage.setItem('queueList', JSON.stringify([]));
        localStorage.setItem('totalQueue', '0');
        localStorage.setItem('processedQueue', '0');
        localStorage.setItem('remainingQueue', '0');
        
        document.getElementById('admin-current-number').textContent = '-';
        document.getElementById('total-queue').textContent = '0';
        document.getElementById('processed-queue').textContent = '0';
        document.getElementById('remaining-queue').textContent = '0';
        
        alert('Antrian telah direset.');
    }
}

// Update queue note
function updateQueueNote() {
    const note = document.getElementById('queue-note-input').value;
    localStorage.setItem('queueNote', note);
    alert('Catatan antrian telah diperbarui.');
}

// Save display settings
function saveDisplaySettings() {
    const instansiNama = document.getElementById('instansi-name-input').value;
    const runningText = document.getElementById('running-text-input').value;
    
    localStorage.setItem('instansiNama', instansiNama);
    localStorage.setItem('runningText', runningText);
    
    document.getElementById('admin-instansi-nama').textContent = instansiNama;
    
    alert('Pengaturan tampilan telah disimpan.');
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    const errorElement = document.getElementById('password-error');
    const successElement = document.getElementById('password-success');
    
    errorElement.textContent = '';
    successElement.textContent = '';
    
    // Get stored password hash
    const storedHash = localStorage.getItem('adminPasswordHash') || hashPassword('admin123');
    
    // Verify current password
    if (hashPassword(currentPassword) !== storedHash) {
        errorElement.textContent = 'Password saat ini tidak valid!';
        return;
    }
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
        errorElement.textContent = 'Password baru dan konfirmasi tidak cocok!';
        return;
    }
    
    // Check password strength
    if (newPassword.length < 6) {
        errorElement.textContent = 'Password baru terlalu pendek (minimal 6 karakter)!';
        return;
    }
    
    // Save new password
    localStorage.setItem('adminPasswordHash', hashPassword(newPassword));
    successElement.textContent = 'Password berhasil diubah!';
    
    // Clear form
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

// Login
function login() {
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    // Get stored password hash or use default
    const storedHash = localStorage.getItem('adminPasswordHash') || hashPassword('admin123');
    
    if (hashPassword(password) === storedHash) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        loadAdminData();
        errorElement.textContent = '';
    } else {
        errorElement.textContent = 'Password tidak valid!';
    }
}

// Logout
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    showLoginPanel();
}

// Hash password (simple hash for demo purposes)
function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

// Setup event listeners
function setupEventListeners() {
    // Login
    document.getElementById('login-btn').addEventListener('click', login);
    
    // Sidebar navigation
    document.querySelectorAll('.sidebar-btn').forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Hide all sections
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            document.getElementById(target).classList.add('active');
            
            // Update active button
            document.querySelectorAll('.sidebar-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Queue management
    document.getElementById('call-next-btn').addEventListener('click', callNextQueue);
    document.getElementById('reset-queue-btn').addEventListener('click', resetQueue);
    document.getElementById('update-note-btn').addEventListener('click', updateQueueNote);
    
    // Display settings
    document.getElementById('add-slide-btn').addEventListener('click', addSlide);
    document.getElementById('save-display-settings').addEventListener('click', saveDisplaySettings);
    
    // System settings
    document.getElementById('change-password-btn').addEventListener('click', changePassword);
    
    // Password input - submit on Enter
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
}

// Speech functionality
function speakText(text) {
    // Using the free Web Speech API
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'id-ID';
    speech.text = text;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    
    window.speechSynthesis.speak(speech);
}