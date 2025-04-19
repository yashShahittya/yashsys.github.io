document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded and script running");

  updateMetrics();
  setInterval(updateMetrics, 5000);

  // Event listeners
  document.getElementById('boost-button').addEventListener('click', startBoost);
  document.getElementById('auto-boost-button').addEventListener('click', toggleAutoBoost);

  // Optional: only if this element exists
  const applySettingsBtn = document.getElementById('apply-settings');
  if (applySettingsBtn) {
    applySettingsBtn.addEventListener('click', applySettings);
  }

  // Tooltip initialization
  if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    Array.from(tooltips).forEach(tooltip => {
      new bootstrap.Tooltip(tooltip);
    });
  }
});

  
  // Set up event listeners
  document.getElementById('boost-button').addEventListener('click', startBoost);
  document.getElementById('auto-boost-button').addEventListener('click', toggleAutoBoost);
  document.getElementById('apply-settings').addEventListener('click', applySettings);
  
  // Initialize tooltips
  if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    var tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    Array.from(tooltips).forEach(tooltip => {
      new bootstrap.Tooltip(tooltip);
    });
  }


// Tab switching
function switchTab(tabName) {
  const tabs = document.querySelectorAll('.tab-item');
  tabs.forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');
  
  // Here you would show/hide content based on the selected tab
  console.log('Switched to tab:', tabName);
}

// Update system metrics
function updateMetrics() {
  // Simulate changing metrics
  const cpuUsage = Math.floor(Math.random() * 15) + 25; // 25-40%
  document.getElementById('cpu-usage-stat').textContent = `${cpuUsage}%`;
}

// Add this code to your Booster.script.js file

// Modified startBoost function with completion popup
function startBoost() {
  const boostCircle = document.getElementById('boost-circle');
  const boostProgress = document.getElementById('boost-progress');
  const boostPercentage = document.getElementById('boost-percentage');
  const boostStatusText = document.getElementById('boost-status-text');
  
  // Add boosting class for animation
  boostCircle.classList.add('boosting');
  boostStatusText.textContent = 'Optimizing...';
  
  // Set CSS variable for the conic gradient
  document.documentElement.style.setProperty('--boost-percent', '0%');
  
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 1;
    boostPercentage.textContent = `${progress}%`;
    
    // Update the CSS variable for the progress circle
    document.documentElement.style.setProperty('--boost-percent', `${progress}%`);
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      completeBoost();
    }
  }, 30);
}

/// Modified completeBoost function with popup
function completeBoost() {
  const boostCircle = document.getElementById('boost-circle');
  const boostStatusText = document.getElementById('boost-status-text');
  
  // Remove boosting animation
  boostCircle.classList.remove('boosting');
  boostStatusText.textContent = 'Optimization Complete';
  
  // Update statistics
  const memoryFreed = Math.floor(Math.random() * 500) + 800; // 800-1300 MB
  document.getElementById('memory-freed-stat').textContent = `${memoryFreed} MB`;
  
  const performanceGain = Math.floor(Math.random() * 15) + 25; // 25-40%
  document.getElementById('performance-gain-stat').textContent = `${performanceGain}%`;
  
  // Update RAM usage
  const newRamUsage = Math.floor(Math.random() * 20) + 60; // 60-80%
  document.getElementById('ram-usage-percentage').textContent = `${newRamUsage}%`;
  document.getElementById('memory-used').style.width = `${newRamUsage}%`;
  
  const ramAvailable = 7.9 - ((newRamUsage / 100) * 7.9);
  document.getElementById('ram-available').textContent = `${ramAvailable.toFixed(2)}GB available`;
  
  // Show completion popup
  showBoostCompletePopup(memoryFreed, performanceGain, newRamUsage);
}

// New function to create and show the completion popup
function showBoostCompletePopup(memoryFreed, performanceGain, newRamUsage) {
  // Create modal if it doesn't exist
  if (!document.getElementById('boostCompleteModal')) {
    const modal = document.createElement('div');
    modal.id = 'boostCompleteModal';
    modal.className = 'boost-modal';
    
    modal.innerHTML = `
      <div class="boost-modal-content">
        <div class="boost-status-icon">✅</div>
        <h5>Optimization Complete!</h5>
        <p>Your system performance has been successfully optimized.</p>
        <div class="boost-results">
          <div class="boost-result-item">
            <span>Memory Freed:</span>
            <span id="memory-freed">${memoryFreed} MB</span>
          </div>
          <div class="boost-result-item">
            <span>RAM Usage:</span>
            <span id="new-ram-usage">${newRamUsage}%</span>
          </div>
          <div class="boost-result-item">
            <span>Performance Gain:</span>
            <span id="performance-increase">${performanceGain}%</span>
          </div>
        </div>
        <button class="action-button primary" onclick="closeBoostCompleteModal()">OK</button>
      </div>
    `;
    
    document.body.appendChild(modal);
  } else {
    // Update existing modal with new values
    document.getElementById('memory-freed').textContent = `${memoryFreed} MB`;
    document.getElementById('new-ram-usage').textContent = `${newRamUsage}%`;
    document.getElementById('performance-increase').textContent = `${performanceGain}%`;
  }
  
  // Show the modal
  document.getElementById('boostCompleteModal').classList.remove('d-none');
}

// Function to close the popup
function closeBoostCompleteModal() {
  document.getElementById('boostCompleteModal').classList.add('d-none');
}

// Make sure these functions are available in the global scope
window.startBoost = startBoost;
window.closeBoostCompleteModal = closeBoostCompleteModal;

// Toggle auto boost
function toggleAutoBoost() {
  const autoBoostButton = document.getElementById('auto-boost-button');
  if (autoBoostButton.classList.contains('primary')) {
    autoBoostButton.classList.remove('primary');
    autoBoostButton.classList.add('secondary');
    alert('Auto Boost disabled');
  } else {
    autoBoostButton.classList.remove('secondary');
    autoBoostButton.classList.add('primary');
    alert('Auto Boost enabled - System will be optimized automatically every hour');
  }
}

// Apply performance settings
function applySettings() {
  alert('Settings applied successfully');
}


// Navigation function for optimizer sections
function navigateOptimizer(section) {
  console.log(`Navigating to ${section}`);
  // Here you would implement navigation between optimizer sections
}
let pomodoroInterval = null;
let remainingSeconds = 25 * 60;
let isRunning = false;

// Format time as MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update display
function updatePomodoroDisplay() {
  document.getElementById('pomodoro-display').textContent = formatTime(remainingSeconds);
}

// Start the timer
function startPomodoro() {
  if (isRunning) return;
  isRunning = true;
  document.getElementById('pomodoro-status').textContent = 'Work in progress...';

  pomodoroInterval = setInterval(() => {
    remainingSeconds--;
    updatePomodoroDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(pomodoroInterval);
      document.getElementById('pomodoro-status').textContent = 'Time for a break!';
      isRunning = false;
    }
  }, 1000);
}

// Pause the timer
function pausePomodoro() {
  clearInterval(pomodoroInterval);
  document.getElementById('pomodoro-status').textContent = 'Paused';
  isRunning = false;
}

// Reset the timer
function resetPomodoro() {
  clearInterval(pomodoroInterval);
  isRunning = false;

  const selectedWork = parseInt(document.getElementById('pomodoro-work').value);
  remainingSeconds = selectedWork * 60;

  updatePomodoroDisplay();
  document.getElementById('pomodoro-status').textContent = 'Ready to start';
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', function () {
  updatePomodoroDisplay(); // Initial setup
  document.getElementById('pomodoro-start').addEventListener('click', startPomodoro);
  document.getElementById('pomodoro-pause').addEventListener('click', pausePomodoro);
  document.getElementById('pomodoro-reset').addEventListener('click', resetPomodoro);

  // Update timer when dropdown changes
  document.getElementById('pomodoro-work').addEventListener('change', function () {
    resetPomodoro();
  });
})



