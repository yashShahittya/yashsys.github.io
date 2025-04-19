// Store scheduled tasks
let scheduledTasks = [];
let totalSpaceRecovered = 0;
let lastCleanedDate = null;

// Initialize cleaner page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sidebar navigation
    initNavigation();
    
    // Initialize top navbar with notifications
    initTopNavbar();
    
    // Set up scan button
    const scanButton = document.getElementById('scan-button');
    scanButton.addEventListener('click', startScan);
    
    // Set up clean button
    const cleanButton = document.getElementById('clean-button');
    cleanButton.addEventListener('click', startCleaning);
    
    // Set up schedule button
    const scheduleButton = document.getElementById('schedule-button');
    scheduleButton.addEventListener('click', scheduleCleaningTask);
    
    // Set up frequency change event
    const frequencySelect = document.getElementById('schedule-frequency');
    frequencySelect.addEventListener('change', handleFrequencyChange);
    
    // Load any existing scheduled tasks
    loadScheduledTasks();
    
    // Check if we have any cleaning history
    loadCleaningHistory();
});

// Initialize navigation (placeholder function)
function initNavigation() {
    // This was previously empty in the original code
    // Adding simple implementation
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.sidebar-item').forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');
            
            if (this.querySelector('div:last-child').textContent.trim() === 'Dashboard') {
                window.location.href = 'index.html'; // Navigate to dashboard
            }
        });
    });
}

// Initialize top navbar (placeholder function)
function initTopNavbar() {
    // This was previously empty in the original code
    // We can leave it empty or add basic functionality if needed
}

// Start the system scan
function startScan() {
    // Update UI to scanning state
    const scanIcon = document.getElementById('scan-icon');
    const scanMessage = document.getElementById('scan-message');
    const scanButton = document.getElementById('scan-button');
    const scanProgressFill = document.getElementById('scan-progress-fill');
    const scanProgressText = document.getElementById('scan-progress-text');
    
    // Disable scan button during scan
    scanButton.disabled = true;
    
    // Update scan message
    scanMessage.textContent = 'Scanning system...';
    
    // Add spinning animation to icon
    scanIcon.classList.add('scanning');
    
    // Reset progress
    scanProgressFill.style.width = '0%';
    scanProgressText.textContent = '0%';
    
    // Reset results
    document.getElementById('recycle-size').textContent = '0 MB';
    document.getElementById('temp-size').textContent = '0 MB';
    document.getElementById('cache-size').textContent = '0 MB';
    document.getElementById('packages-size').textContent = '0 MB';
    document.getElementById('total-size').textContent = '0 MB';
    
    // Simulate scanning with progress updates
    let progress = 0;
    const scanInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1;
        if (progress > 100) progress = 100;
        
        scanProgressFill.style.width = `${progress}%`;
        scanProgressText.textContent = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(scanInterval);
            completeScan();
        }
    }, 200);
}

// Complete the scan and show results
function completeScan() {
    // Generate random file sizes to clean
    const recycleBinSize = Math.floor(Math.random() * 500) + 50; // 50-550 MB
    const tempFilesSize = Math.floor(Math.random() * 1000) + 100; // 100-1100 MB
    const browserCacheSize = Math.floor(Math.random() * 300) + 50; // 50-350 MB
    const packagesSize = Math.floor(Math.random() * 200) + 20; // 20-220 MB
    
    // Calculate total
    const totalSize = recycleBinSize + tempFilesSize + browserCacheSize + packagesSize;
    
    // Update UI with results
    document.getElementById('recycle-size').textContent = `${recycleBinSize} MB`;
    document.getElementById('temp-size').textContent = `${tempFilesSize} MB`;
    document.getElementById('cache-size').textContent = `${browserCacheSize} MB`;
    document.getElementById('packages-size').textContent = `${packagesSize} MB`;
    document.getElementById('total-size').textContent = `${totalSize} MB`;
    
    // Update scan status
    const scanIcon = document.getElementById('scan-icon');
    const scanMessage = document.getElementById('scan-message');
    const scanButton = document.getElementById('scan-button');
    const cleanButton = document.getElementById('clean-button');
    
    // Stop spinning animation
    scanIcon.classList.remove('scanning');
    
    // Update message and buttons
    scanMessage.textContent = 'Scan complete. Ready to clean.';
    scanButton.disabled = false;
    cleanButton.disabled = false; // Ensure clean button is enabled
}

// Start the cleaning process
function startCleaning() {
    // Update UI to cleaning state
    const scanIcon = document.getElementById('scan-icon');
    const scanMessage = document.getElementById('scan-message');
    const scanButton = document.getElementById('scan-button');
    const cleanButton = document.getElementById('clean-button');
    const scanProgressFill = document.getElementById('scan-progress-fill');
    const scanProgressText = document.getElementById('scan-progress-text');
    
    // Disable buttons during cleaning
    scanButton.disabled = true;
    cleanButton.disabled = true;
    
    // Update message
    scanMessage.textContent = 'Cleaning files...';
    
    // Add spinning animation to icon
    scanIcon.classList.add('scanning');
    
    // Reset progress
    scanProgressFill.style.width = '0%';
    scanProgressText.textContent = '0%';
    
    // Get the total size to clean
    const totalSizeText = document.getElementById('total-size').textContent;
    const totalSize = parseInt(totalSizeText.split(' ')[0]);
    
    // Simulate cleaning with progress updates
    let progress = 0;
    const cleanInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 7) + 3;
        if (progress > 100) progress = 100;
        
        scanProgressFill.style.width = `${progress}%`;
        scanProgressText.textContent = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(cleanInterval);
            completeCleaning(totalSize);
        }
    }, 200);
}

// Complete the cleaning process
function completeCleaning(sizeCleaned) {
    // Update UI to completed state
    const scanIcon = document.getElementById('scan-icon');
    const scanMessage = document.getElementById('scan-message');
    const scanButton = document.getElementById('scan-button');
    const cleanButton = document.getElementById('clean-button');
    
    // Stop spinning animation
    scanIcon.classList.remove('scanning');
    
    // Update message and buttons
    scanMessage.textContent = 'Cleaning complete!';
    scanMessage.classList.add('success');
    scanButton.disabled = false;
    cleanButton.disabled = true;
    
    // Reset results
    document.getElementById('recycle-size').textContent = '0 MB';
    document.getElementById('temp-size').textContent = '0 MB';
    document.getElementById('cache-size').textContent = '0 MB';
    document.getElementById('packages-size').textContent = '0 MB';
    document.getElementById('total-size').textContent = '0 MB';
    
    // Update cleaning history
    updateCleaningHistory(sizeCleaned);
    
    // Show completion modal
    showCleaningCompleteModal(sizeCleaned);
    
    // Reset success message after a delay
    setTimeout(() => {
        scanMessage.textContent = 'Ready to scan your system';
        scanMessage.classList.remove('success');
    }, 3000);
}

// Handle frequency change for scheduling
function handleFrequencyChange() {
    const frequencySelect = document.getElementById('schedule-frequency');
    const dateGroup = document.getElementById('date-group');
    
    // Only show date picker for one-time cleaning
    if (frequencySelect.value === 'once') {
        dateGroup.style.display = 'block';
    } else {
        dateGroup.style.display = 'none';
    }
}

// Schedule a new cleaning task
function scheduleCleaningTask() {
    const frequency = document.getElementById('schedule-frequency').value;
    const date = document.getElementById('schedule-date').value;
    const time = document.getElementById('schedule-time').value;
    
    // Validate inputs
    if (!time) {
        alert('Please select a time for the scheduled cleaning.');
        return;
    }
    
    if (frequency === 'once' && !date) {
        alert('Please select a date for the one-time cleaning.');
        return;
    }
    
    // Get selected items to clean
    const cleanRecycle = document.getElementById('clean-recycle').checked;
    const cleanTemp = document.getElementById('clean-temp').checked;
    const cleanCache = document.getElementById('clean-cache').checked;
    const cleanPackages = document.getElementById('clean-packages').checked;
    
    if (!cleanRecycle && !cleanTemp && !cleanCache && !cleanPackages) {
        alert('Please select at least one item to clean.');
        return;
    }
    
    // Create task object
    const task = {
        id: Date.now(),
        frequency: frequency,
        date: date || null,
        time: time,
        items: {
            recycle: cleanRecycle,
            temp: cleanTemp,
            cache: cleanCache,
            packages: cleanPackages
        }
    };
    
    // Add task to list
    scheduledTasks.push(task);
    
    // Save tasks
    saveScheduledTasks();
    
    // Update UI
    renderScheduledTasks();
    
    // Reset form
    document.getElementById('schedule-time').value = '';
    if (frequency === 'once') {
        document.getElementById('schedule-date').value = '';
    }
}

// Save scheduled tasks to localStorage
function saveScheduledTasks() {
    localStorage.setItem('scheduledCleaningTasks', JSON.stringify(scheduledTasks));
}

// Load scheduled tasks from localStorage
function loadScheduledTasks() {
    const savedTasks = localStorage.getItem('scheduledCleaningTasks');
    if (savedTasks) {
        scheduledTasks = JSON.parse(savedTasks);
        renderScheduledTasks();
    }
}

// Render scheduled tasks in the UI
function renderScheduledTasks() {
    const tasksList = document.getElementById('tasks-list');
    const noTasksMessage = document.getElementById('no-tasks-message');
    
    // Clear current list
    tasksList.innerHTML = '';
    
    if (scheduledTasks.length === 0) {
        // Show no tasks message
        noTasksMessage.style.display = 'block';
        tasksList.style.display = 'none';
    } else {
        // Hide no tasks message and show list
        noTasksMessage.style.display = 'none';
        tasksList.style.display = 'block';
        
        // Add each task to the list
        scheduledTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            
            // Format date and time for display
            let dateTimeDisplay = '';
            if (task.frequency === 'once') {
                const taskDate = new Date(task.date + 'T' + task.time);
                dateTimeDisplay = taskDate.toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } else {
                dateTimeDisplay = `${task.frequency.charAt(0).toUpperCase() + task.frequency.slice(1)} at ${task.time}`;
            }
            
            // Get selected items
            const selectedItems = [];
            if (task.items.recycle) selectedItems.push('Recycle Bin');
            if (task.items.temp) selectedItems.push('Temp Files');
            if (task.items.cache) selectedItems.push('Browser Cache');
            if (task.items.packages) selectedItems.push('Packages');
            
            // Create task HTML
            taskElement.innerHTML = `
                <div class="task-details">
                    <div class="task-date">${dateTimeDisplay}</div>
                    <div class="task-items">${selectedItems.join(', ')}</div>
                </div>
                <div class="delete-task" data-id="${task.id}">×</div>
            `;
            
            tasksList.appendChild(taskElement);
        });
        
        // Add delete event listeners
        document.querySelectorAll('.delete-task').forEach(deleteBtn => {
            deleteBtn.addEventListener('click', function() {
                const taskId = parseInt(this.getAttribute('data-id'));
                deleteScheduledTask(taskId);
            });
        });
    }
}

// Delete a scheduled task
function deleteScheduledTask(taskId) {
    scheduledTasks = scheduledTasks.filter(task => task.id !== taskId);
    saveScheduledTasks();
    renderScheduledTasks();
}

// Update cleaning history
function updateCleaningHistory(sizeCleaned) {
    // Update total space recovered
    totalSpaceRecovered += sizeCleaned;
    
    // Update last cleaned date
    lastCleanedDate = new Date();
    
    // Update footer information
    document.querySelector('.footer-info:first-child').textContent = 
        `Last cleaned: ${lastCleanedDate.toLocaleString()}`;
    document.querySelector('.footer-info:last-child').textContent = 
        `Total space recovered: ${totalSpaceRecovered} MB`;
    
    // Save to localStorage
    saveCleaningHistory();
}

// Save cleaning history to localStorage
function saveCleaningHistory() {
    localStorage.setItem('cleaningHistory', JSON.stringify({
        totalSpaceRecovered: totalSpaceRecovered,
        lastCleanedDate: lastCleanedDate ? lastCleanedDate.toISOString() : null
    }));
}

// Load cleaning history from localStorage
function loadCleaningHistory() {
    const savedHistory = localStorage.getItem('cleaningHistory');
    if (savedHistory) {
        const history = JSON.parse(savedHistory);
        totalSpaceRecovered = history.totalSpaceRecovered || 0;
        lastCleanedDate = history.lastCleanedDate ? new Date(history.lastCleanedDate) : null;
        
        // Update footer information
        if (lastCleanedDate) {
            document.querySelector('.footer-info:first-child').textContent = 
                `Last cleaned: ${lastCleanedDate.toLocaleString()}`;
        }
        document.querySelector('.footer-info:last-child').textContent = 
            `Total space recovered: ${totalSpaceRecovered} MB`;
    }
}

// Function to display the completion modal
function showCleaningCompleteModal(sizeCleaned) {
    // Create modal element if it doesn't exist
    let cleanModal = document.getElementById('cleanModal');
    if (!cleanModal) {
        cleanModal = document.createElement('div');
        cleanModal.id = 'cleanModal';
        cleanModal.className = 'vpn-modal';
        
        // Create modal content
        cleanModal.innerHTML = `
        <div class="vpn-modal-content">
            <div class="vpn-status-icon">✅</div>
            <h5 id="clean-status-title">Cleaning Complete</h5>
            <p id="clean-status-message">Your system has been successfully cleaned.</p>
            <div class="boost-results">
                <div class="boost-result-item">
                    <span>Space Recovered:</span>
                    <span id="clean-size-recovered">${sizeCleaned} MB</span>
                </div>
                <div class="boost-result-item">
                    <span>Total Recovered (All-time):</span>
                    <span id="clean-total-recovered">${totalSpaceRecovered} MB</span>
                </div>
                <div class="boost-result-item">
                    <span>Last Cleaned:</span>
                    <span id="clean-last-date">${new Date().toLocaleString()}</span>
                </div>
            </div>
            <button class="action-button primary" onclick="closeCleanModal()">OK</button>
        </div>
        `;
        
        // Add to body
        document.body.appendChild(cleanModal);
    } else {
        // Update existing modal values
        document.getElementById('clean-size-recovered').textContent = `${sizeCleaned} MB`;
        document.getElementById('clean-total-recovered').textContent = `${totalSpaceRecovered} MB`;
        document.getElementById('clean-last-date').textContent = new Date().toLocaleString();
    }
    
    // Show the modal
    cleanModal.classList.remove('d-none');
}

// Function to close the clean modal
function closeCleanModal() {
    const cleanModal = document.getElementById('cleanModal');
    if (cleanModal) {
        cleanModal.classList.add('d-none');
    }
}