document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadSettings();
    initializeSlideshow();
    loadQueueData();
    
    // Set up WebSocket connection for real-time updates
    setupWebSocket();
});

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
    document.getElementById('current-time').textContent = timeString;
    document.getElementById('current-date').textContent = dateString;
}

// Load settings from localStorage
function loadSettings() {
    // Load instansi name
    const instansiNama = localStorage.getItem('instansiNama') || 'Puskesmas Sehat Sejahtera';
    document.getElementById('instansi-nama').textContent = instansiNama;
    
    // Load running text
    const runningText = localStorage.getItem('runningText') || 'Selamat datang di Puskesmas Sehat Sejahtera. Untuk pendaftaran pasien baru, silakan hubungi petugas administrasi.';
    document.getElementById('running-text').textContent = runningText;
}

// Initialize slideshow
function initializeSlideshow() {
    const slideshowContainer = document.getElementById('slideshow');
    const dotsContainer = document.getElementById('dots-container');
    
    // Get slides from localStorage or use defaults
    let slides = JSON.parse(localStorage.getItem('slides')) || [
        { src: 'assets/slide1.jpg' },
        { src: 'assets/slide2.jpg' },
        { src: 'assets/slide3.jpg' }
    ];
    
    // Clear existing slides and dots
    slideshowContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // Create slides and dots
    slides.forEach((slide, index) => {
        // Create slide
        const slideElement = document.createElement('img');
        slideElement.src = slide.src;
        slideElement.className = 'slide';
        if (index === 0) slideElement.classList.add('active');
        slideElement.alt = `Slide ${index + 1}`;
        slideshowContainer.appendChild(slideElement);
        
        // Create dot
        const dotElement = document.createElement('div');
        dotElement.className = 'dot';
        if (index === 0) dotElement.classList.add('active');
        dotElement.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dotElement);
    });
    
    // Start slideshow
    if (slides.length > 1) {
        startSlideshow();
    }
}

// Slideshow functionality
let slideshowInterval;
let currentSlide = 0;

function startSlideshow() {
    slideshowInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + 1) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    // Clear the interval and restart
    clearInterval(slideshowInterval);
    
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    startSlideshow();
}

// Load queue data from localStorage
function loadQueueData() {
    const currentQueue = localStorage.getItem('currentQueue') || '-';
    const queueNote = localStorage.getItem('queueNote') || 'Silakan menunggu nomor antrian Anda dipanggil';
    
    document.getElementById('current-queue-number').textContent = currentQueue;
    document.getElementById('queue-note').textContent = queueNote;
    
    // Load next queue items
    const queueList = JSON.parse(localStorage.getItem('queueList')) || [];
    for (let i = 0; i < 4; i++) {
        const queueItem = document.getElementById(`queue-next-${i + 1}`);
        queueItem.textContent = queueList[i] || '-';
    }
}

// Setup WebSocket for real-time updates
function setupWebSocket() {
    // Using local storage events for the demo
    // In a real system, you would implement WebSocket here
    window.addEventListener('storage', function(e) {
        if (e.key === 'currentQueue' || e.key === 'queueList' || e.key === 'queueNote') {
            loadQueueData();
        } else if (e.key === 'instansiNama' || e.key === 'runningText') {
            loadSettings();
        } else if (e.key === 'slides') {
            clearInterval(slideshowInterval);
            initializeSlideshow();
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
    speech.pitch = 3;
    
    window.speechSynthesis.speak(speech);
}