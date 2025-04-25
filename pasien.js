document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadSettings();
    
    // Set up event listeners
    setupEventListeners();
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
    document.getElementById('pasien-current-time').textContent = timeString;
    document.getElementById('pasien-current-date').textContent = dateString;
}

// Load settings from localStorage
function loadSettings() {
    // Load instansi name
    const instansiNama = localStorage.getItem('instansiNama') || 'Puskesmas Sehat Sejahtera';
    document.getElementById('pasien-instansi-nama').textContent = instansiNama;
}

// Take queue number
function takeQueueNumber() {
    // Get current queue list
    let queueList = JSON.parse(localStorage.getItem('queueList')) || [];
    
    // Determine next queue number
    let nextQueueNumber;
    
    if (queueList.length === 0) {
        // If queue is empty, start from 1
        const processedQueue = parseInt(localStorage.getItem('processedQueue') || '0');
        nextQueueNumber = processedQueue + 1;
    } else {
        // If queue has items, get the last number and increment
        const lastQueueNumber = parseInt(queueList[queueList.length - 1]);
        nextQueueNumber = lastQueueNumber + 1;
    }
    
    // Format queue number with leading zeros
    const formattedQueueNumber = String(nextQueueNumber).padStart(3, '0');
    
    // Add to queue list
    queueList.push(formattedQueueNumber);
    localStorage.setItem('queueList', JSON.stringify(queueList));
    
    // Update statistics
    const totalQueue = parseInt(localStorage.getItem('totalQueue') || '0') + 1;
    const remainingQueue = queueList.length;
    
    localStorage.setItem('totalQueue', totalQueue.toString());
    localStorage.setItem('remainingQueue', remainingQueue.toString());
    
    // Show result
    document.getElementById('result-number').textContent = formattedQueueNumber;
    document.getElementById('queue-result').classList.remove('hidden');
    
    // Play sound notification
    speakText(`Anda mendapatkan nomor antrian ${formattedQueueNumber} Terima kasih.`);
}

// Close result popup
function closeResult() {
    document.getElementById('queue-result').classList.add('hidden');
}

// Print ticket (simplified for demo)
function printTicket() {
    const queueNumber = document.getElementById('result-number').textContent;
    const instansiNama = document.getElementById('pasien-instansi-nama').textContent;
    
    // Create a printable window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Tiket Antrian</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                }
                .ticket {
                    border: 1px solid #000;
                    padding: 20px;
                    width: 200px;
                    margin: 0 auto;
                }
                .number {
                    font-size: 48px;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .info {
                    font-size: 12px;
                    margin-top: 20px;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="ticket">
                <div>${instansiNama}</div>
                <div>NOMOR ANTRIAN</div>
                <div class="number">${queueNumber}</div>
                <div class="info">
                    ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    <br>
                    ${new Date().toLocaleTimeString('id-ID')}
                </div>
            </div>
            <p class="no-print">Halaman ini akan otomatis dicetak</p>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(function() {
                        window.close();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Setup event listeners
function setupEventListeners() {
    // Take number button
    document.getElementById('take-number-btn').addEventListener('click', takeQueueNumber);
    
    // Close result button
    document.getElementById('close-result-btn').addEventListener('click', closeResult);
    
    // Print ticket button
    document.getElementById('print-ticket-btn').addEventListener('click', printTicket);
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