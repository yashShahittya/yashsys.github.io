// --- Global Chart Instances ---
let clockChart, tempChart, ramChart;

// --- Circle Progress Ring ---
function updateCircleProgress(id, value, unit = '%') {
  const container = document.getElementById(id);
  const valueEl = container.querySelector('strong');
  const circle = container.querySelector('.progress-ring__value');

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  if (valueEl) valueEl.textContent = `${value}${unit}`;
  if (circle) circle.style.strokeDashoffset = offset;
}

// --- Update Storage Bars ---
function updateStorageBars() {
  const drives = [
    { id: "C", free: 36.8, total: 111.2 },
    { id: "D", free: 197.9, total: 200.0 },
    { id: "E", free: 163.7, total: 200.0 },
    { id: "F", free: 193.6, total: 200.0 },
    { id: "G", free: 19.6, total: 200.0 },
  ];

  drives.forEach((drive, i) => {
    const percent = 100 - ((drive.free / drive.total) * 100);
    const bar = document.querySelectorAll('.storage-bar .progress-bar')[i];
    if (bar) {
      bar.style.width = `${percent}%`;
    }
  });
}

// --- Chart Creation ---
function createCharts() {
  const ctxClock = document.getElementById('clockChart')?.getContext('2d');
  const ctxTemp = document.getElementById('tempChart')?.getContext('2d');
  const ctxRam = document.getElementById('ramChart')?.getContext('2d');

  const baseLabels = Array.from({ length: 10 }, (_, i) => `T-${10 - i}`);

  if (ctxClock) {
    clockChart = new Chart(ctxClock, {
      type: 'line',
      data: {
        labels: baseLabels,
        datasets: [{
          label: 'Clock MHz',
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          borderColor: '#007bff',
          data: Array(10).fill(2300),
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        animation: { duration: 500 },
        scales: { y: { min: 2000, max: 2700 } }
      }
    });
  }

  if (ctxTemp) {
    tempChart = new Chart(ctxTemp, {
      type: 'line',
      data: {
        labels: baseLabels,
        datasets: [{
          label: 'Temp °C',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: '#9966ff',
          data: Array(10).fill(55),
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        animation: { duration: 500 },
        scales: { y: { min: 40, max: 70 } }
      }
    });
  }

  if (ctxRam) {
    ramChart = new Chart(ctxRam, {
      type: 'line',
      data: {
        labels: baseLabels,
        datasets: [{
          label: 'RAM Usage %',
          backgroundColor: 'rgba(220, 53, 69, 0.2)',
          borderColor: '#dc3545',
          data: Array(10).fill(40),
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        animation: { duration: 500 },
        scales: { y: { min: 0, max: 100 } }
      }
    });
  }
}


function updateCharts() {
  if (clockChart) {
    clockChart.data.datasets[0].data.shift();
    clockChart.data.datasets[0].data.push(2300 + Math.floor(Math.random() * 200));
    clockChart.update();
  }

  if (tempChart) {
    tempChart.data.datasets[0].data.shift();
    tempChart.data.datasets[0].data.push(50 + Math.floor(Math.random() * 10));
    tempChart.update();
  }

  if (ramChart) {
    ramChart.data.datasets[0].data.shift();
    ramChart.data.datasets[0].data.push(30 + Math.floor(Math.random() * 40));
    ramChart.update();
  }
}




// --- View Switcher ---
function setMode(viewId) {
  const sections = document.querySelectorAll('.view-section');
  sections.forEach(section => section.classList.add('d-none'));
  const selected = document.getElementById(viewId);
  if (selected) {
    selected.classList.remove('d-none');

    // Defer chart creation to allow rendering
    if (viewId === 'advanced' && !clockChart && !tempChart && !ramChart) {
      setTimeout(() => {
        createCharts();
      }, 100); // small delay to allow DOM to update
    }
  }
}



// --- Real-Time Updates ---
setInterval(() => {
  // --- CPU ---
  const cpu = Math.floor(Math.random() * 100);
  updateCircleProgress('cpuCircle', cpu);

  // --- RAM ---
  const ram = Math.floor(Math.random() * 100);
  updateCircleProgress('ramCircle', ram);

  // --- Network Speed ---
  const upload = (Math.random() * 1).toFixed(2);
  const download = (Math.random() * 1).toFixed(2);
  document.getElementById('uploadSpeed').textContent = upload;
  document.getElementById('downloadSpeed').textContent = download;

  // --- Drive Health ---
  const driveHealth = 75 + Math.floor(Math.random() * 4);
  updateCircleProgress('driveHealthCircle', driveHealth, '%');

  // --- Drive Temp ---
  const driveTemp = 24 + Math.floor(Math.random() * 4);
  updateCircleProgress('driveTempCircle', driveTemp, '°C');

  // --- Computer Health ---
  const compHealth = 60 + Math.floor(Math.random() * 40);
  updateCircleProgress('compHealthCircle', compHealth, '%');

  const statusLabel = document.getElementById('compHealthStatus');
  if (compHealth >= 85) {
    statusLabel.textContent = 'Excellent';
  } else if (compHealth >= 70) {
    statusLabel.textContent = 'Fair';
  } else {
    statusLabel.textContent = 'Poor';
  }

  // --- Charts ---
  updateCharts();

}, 2000);

// --- Chart Initializer on Page Load ---
window.onload = () => {
  createCharts();
  updateStorageBars();
  changeFanMode('whisper');
};

// --- Booster & Cleaner Interactions ---
function showPopup(message) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.textContent = message;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

function showBoostPopup() {
  showPopup("Boost complete! 950MB RAM cleared.");
}

function showScanResult() {
  const result = Math.random() > 0.5
    ? "System Safe. No threats found."
    : "Warning: Potential threats detected!";
  showPopup(result);
}

// --- Scheduler ---
function openSchedule() {
  const form = document.getElementById('scheduleForm');
  if (form) {
    form.classList.toggle('d-none');
  }
}

function saveSchedule() {
  const date = document.getElementById('scheduleDate')?.value;
  const time = document.getElementById('scheduleTime')?.value;
  if (date && time) {
    showPopup(`Scheduled scan on ${date} at ${time}`);
  } else {
    alert("Please select both date and time.");
  }
}

// --- Enhancer Section Navigation ---
function showSection(id) {
  document.querySelectorAll('.enhancer-section').forEach(section => {
    section.classList.add('d-none');
  });
  const selected = document.getElementById(id);
  if (selected) selected.classList.remove('d-none');
}

function navigateOptimizer(target) {
  localStorage.setItem('enhancerTarget', target);
}

document.addEventListener('DOMContentLoaded', () => {
  const target = localStorage.getItem('enhancerTarget');
  if (target) {
    showSection(target);
    localStorage.removeItem('enhancerTarget');
  }
});
// --- Unified VPN Connection Logic ---
document.addEventListener('DOMContentLoaded', () => {
  // Restore section view if present
  const target = localStorage.getItem('enhancerTarget');
  if (target) {
    showSection(target);
    localStorage.removeItem('enhancerTarget');
  }

  // VPN State Handling
  const vpnButton = document.getElementById('vpnButton');
  const vpnModal = document.getElementById('vpnModal');

  if (vpnButton) {
    const isConnected = localStorage.getItem('vpnConnected') === 'true';

    if (isConnected) {
      vpnButton.classList.add('connected');
      vpnButton.textContent = 'Connected';
    } else {
      vpnButton.classList.remove('connected');
      vpnButton.textContent = 'Connect to VPN';
    }

    vpnButton.addEventListener('click', () => {
      const connected = vpnButton.classList.contains('connected');

      if (connected) {
        vpnButton.classList.remove('connected');
        vpnButton.textContent = 'Connect to VPN';
        localStorage.setItem('vpnConnected', 'false');
      } else {
        vpnButton.classList.add('connected');
        vpnButton.textContent = 'Connected';
        localStorage.setItem('vpnConnected', 'true');
        if (vpnModal) vpnModal.classList.remove('d-none');
      }
    });
  }
});

function closeVPNModal() {
  const vpnModal = document.getElementById('vpnModal');
  if (vpnModal) vpnModal.classList.add('d-none');
}
// --- Clone System Progress ---
function closePreviewModal() {
  const modal = document.getElementById('previewModal');
  if (modal) modal.classList.add('d-none');
}

function clonePC() {
  const modal = document.getElementById('cloneProgressModal');
  const bar = document.getElementById('cloneProgressBar');
  modal.classList.remove('d-none');
  bar.style.width = '0%';

  let percent = 0;
  const interval = setInterval(() => {
    percent += 5;
    bar.style.width = percent + '%';
    bar.setAttribute('aria-valuenow', percent);
    if (percent >= 100) {
      clearInterval(interval);
      modal.classList.add('d-none');
      showPopup("✅ System cloned to cloud successfully!");
    }
  }, 150);
}

// --- Simulation Form Flow ---
function simulateFix() {
  document.getElementById('simulationModal').classList.remove('d-none');
}

document.getElementById('simulationForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const selected = Array.from(document.querySelectorAll('input[name="simOption"]:checked')).map(opt => opt.value);
  localStorage.setItem('simulatedOptions', JSON.stringify(selected));
  document.getElementById('simulationModal').classList.add('d-none');

  const popup = document.getElementById('simulationLoadingPopup');
  popup.textContent = "⏳ Simulating tasks...";
  popup.classList.remove('d-none');

  setTimeout(() => {
    popup.classList.add('d-none');
    showPopup("✅ Simulation complete.");
  }, 3000);
});

// --- Preview Result Based on Simulation ---
function previewChanges() {
  const preview = document.getElementById('previewModal');
  const container = document.getElementById('previewDetails');
  const selected = JSON.parse(localStorage.getItem('simulatedOptions') || "[]");

  let content = "";
  if (selected.length === 0) {
    content = "<p>No simulations were run.</p>";
  } else {
    content += "<ul>";
    selected.forEach(item => {
      switch (item) {
        case "OS Update":
          content += "<li>OS update found a critical patch. No reboots required.</li>"; break;
        case "Driver Update":
          content += "<li>Driver update caused compatibility issue with NVIDIA GPU (fixed automatically).</li>"; break;
        case "System Update":
          content += "<li>System tweaks improved boot time by 18%.</li>"; break;
        case "Regular Check":
          content += "<li>Vendor site sync detected outdated firmware.</li>"; break;
        default: content += `<li>${item}</li>`;
      }
    });
    content += "</ul>";
  }
  container.innerHTML = content;
  preview.classList.remove('d-none');
}

// --- Apply Changes with Progress ---
function applyChanges() {
  const modal = document.getElementById('applyProgressModal');
  const bar = document.getElementById('applyProgressBar');
  modal.classList.remove('d-none');
  bar.style.width = '0%';

  let percent = 0;
  const interval = setInterval(() => {
    percent += 4;
    bar.style.width = percent + '%';
    bar.setAttribute('aria-valuenow', percent);
    if (percent >= 100) {
      clearInterval(interval);
      modal.classList.add('d-none');
      showPopup("✅ Changes applied to your machine.");
    }
  }, 120);
}

function closeSimulationModal() {
  document.getElementById('simulationModal').classList.add('d-none');
}
function toggleAssistant() {
  document.getElementById('sysgenie-box').classList.toggle('d-none');
}

function handleGenieInput(event) {
  if (event.key === 'Enter') {
    const input = document.getElementById('genieInput');
    const message = input.value.trim();
    if (message) {
      simulateLLM(message);
      input.value = '';
    }
  }
}
function simulateLLM(message) {
  const log = document.getElementById('genieChatLog');
  const userMsg = document.createElement('p');
  userMsg.classList.add('user');
  userMsg.textContent = message;
  log.appendChild(userMsg);

  const loading = document.createElement('p');
  loading.classList.add('assistant');
  loading.textContent = "SysGenie is thinking...";
  log.appendChild(loading);
  log.scrollTop = log.scrollHeight;

  setTimeout(() => {
    loading.remove();
    const reply = document.createElement('p');
    reply.classList.add('assistant');

    // Simulated logic
    let response = "Hmm, let me think...";
    if (message.toLowerCase().includes('boost')) response = "System optimization initiated.";
    else if (message.toLowerCase().includes('scan')) response = "Performing a quick scan...";
    else if (message.toLowerCase().includes('driver')) response = "Checking for the latest driver updates...";
    else if (message.toLowerCase().includes('health')) response = "Drive health is currently at optimal levels.";
    else response = "Here's what I found: [simulated answer]";

    reply.textContent = response;
    log.appendChild(reply);
    log.scrollTop = log.scrollHeight;
  }, 1000);
}
function scanFileForVirus(event) {
  const file = event.target.files[0];
  if (!file) return;

  const log = document.getElementById('genieChatLog');

  const userMsg = document.createElement('p');
  userMsg.classList.add('user');
  userMsg.textContent = `Uploaded file: ${file.name}`;
  log.appendChild(userMsg);

  const assistantMsg = document.createElement('p');
  assistantMsg.classList.add('assistant');
  assistantMsg.textContent = `🔍 Scanning "${file.name}" for viruses...`;
  log.appendChild(assistantMsg);
  log.scrollTop = log.scrollHeight;

  setTimeout(() => {
    assistantMsg.textContent = `✅ No threats found in "${file.name}". File is safe to use.`;
  }, 2000);
}
function startRemoteAccess() {
  const status = document.getElementById('remoteAccessStatus');
  status.innerHTML = '⏳ Establishing secure session... <div class="progress mt-2"><div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 0%" id="remoteBar"></div></div>';

  let percent = 0;
  const bar = document.getElementById('remoteBar');
  const interval = setInterval(() => {
    percent += 10;
    bar.style.width = percent + '%';

    if (percent >= 100) {
      clearInterval(interval);
      const otp = Math.floor(100000 + Math.random() * 900000);
      const link = `https://remote.sysmonitor.com/session/${Date.now()}`;
      status.innerHTML = `
        ✅ <strong>Remote Access Ready</strong><br>
        Share this link with your tech support: <a href="${link}" target="_blank">${link}</a><br>
        OTP Code: <strong>${otp}</strong><br>
        <small>This OTP is valid for 15 minutes. Make sure to keep this secure.</small>
      `;
    }
  }, 200);
}
const taskHistoryData = [
  { date: '2025-04-17', type: 'Simulation', detail: 'Applied system update and registry tweaks.', result: 'Success' },
  { date: '2025-04-16', type: 'Apply Changes', detail: 'Driver update failed - NVIDIA GPU not supported.', result: 'Failed' },
  { date: '2025-04-10', type: 'Preview', detail: 'Previewed changes from simulated OS update.', result: 'Viewed' },
];

function filterHistory() {
  const filter = document.getElementById('historyFilter').value;
  const container = document.getElementById('taskHistoryContent');
  container.innerHTML = '';

  const today = new Date();
  const filtered = taskHistoryData.filter(item => {
    const itemDate = new Date(item.date);
    const diff = (today - itemDate) / (1000 * 3600 * 24);
    return (filter === 'today' && diff < 1) ||
           (filter === '7days' && diff <= 7) ||
           (filter === '30days' && diff <= 30);
  });

  if (filtered.length === 0) {
    container.innerHTML = '<p><em>No records found.</em></p>';
    return;
  }

  filtered.forEach(item => {
    const entry = document.createElement('p');
    entry.innerHTML = `<strong>${item.type}:</strong> ${item.detail}<br/><span style="color:${item.result === 'Failed' ? 'red' : '#00c389'}">${item.result}</span>`;
    container.appendChild(entry);
  });
}

document.addEventListener('DOMContentLoaded', filterHistory);

// --- Troubleshoot Logic ---
// === Initialize Logs ===
const troubleshootLogs = JSON.parse(localStorage.getItem('troubleshootHistory') || '[]');

// === Manual Troubleshoot (Optional use) ===
function runManualFix() {
  const type = document.getElementById('manualTroubleOption')?.value;
  let msg = '';
  switch (type) {
    case 'network': msg = 'Network settings reset and reconnected.'; break;
    case 'printer': msg = 'Printer service restarted and spooler cleared.'; break;
    case 'audio': msg = 'Audio drivers refreshed and default device set.'; break;
    case 'update': msg = 'Checked and applied pending Windows Updates.'; break;
    case 'startup': msg = 'Startup services optimized.'; break;
    default: msg = 'Manual troubleshoot completed.';
  }
  addTroubleshootLog('Manual Fix', msg);
  showPopup(msg);
}

// === Add Log & Update History ===
function addTroubleshootLog(type, detail) {
  const timestamp = new Date().toLocaleString();
  troubleshootLogs.push({ type, detail, timestamp });
  localStorage.setItem('troubleshootHistory', JSON.stringify(troubleshootLogs));
  updateTroubleshootHistory();
}

// === Update History UI ===
function updateTroubleshootHistory() {
  const list = document.getElementById('fixHistoryList');
  if (!list) return;
  list.innerHTML = '';

  if (troubleshootLogs.length === 0) {
    list.innerHTML = '<li class="list-group-item text-muted">No logs found.</li>';
    return;
  }

  troubleshootLogs.slice().reverse().forEach(log => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `<strong>[${log.type}]</strong><br>${log.detail}<br><small>${log.timestamp}</small>`;
    list.appendChild(li);
  });
}

// === On Load ===
document.addEventListener('DOMContentLoaded', () => {
  updateTroubleshootHistory();
});

// === Start Detection Process ===
function runDetection() {
  const detectModal = new bootstrap.Modal(document.getElementById('detectionModal'));
  const spinnerModal = new bootstrap.Modal(document.getElementById('detectSpinnerModal'));
  const issueForm = document.getElementById('detectedIssuesForm');
  issueForm.innerHTML = '';

  // Show loading spinner for 2 seconds
  spinnerModal.show();

  setTimeout(() => {
    spinnerModal.hide();

    // Simulated AI-found issues
    const issues = [
      'Outdated Graphics Driver',
      'Slow Boot Time',
      'Background App Crashes',
      'Wi-Fi Disconnection',
      'Windows Update Error',
      'Audio Device Not Detected',
      'High Memory Usage',
      'Printer Queue Stuck'
    ];

    // Add checkboxes
    issues.forEach((issue, index) => {
      const div = document.createElement('div');
      div.className = 'form-check mb-2';
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" id="issue${index}" value="${issue}" name="issueOption">
        <label class="form-check-label" for="issue${index}">${issue}</label>
      `;
      issueForm.appendChild(div);
    });

    detectModal.show();
  }, 2000);
}

// === Submit Selected Issues ===
function submitSelectedIssues() {
  const selected = Array.from(document.querySelectorAll('input[name="issueOption"]:checked')).map(i => i.value);
  if (selected.length === 0) {
    alert("Please select at least one issue to fix.");
    return;
  }

  localStorage.setItem('issuesToFix', JSON.stringify(selected));
  document.getElementById('fixAIButton').disabled = false;

  // Hide modal
  bootstrap.Modal.getInstance(document.getElementById('detectionModal')).hide();

  // Show Fix Summary Section
  document.getElementById('fixSection').classList.remove('d-none');
  document.getElementById('fixSummary').innerHTML = selected.map(issue => `✔ ${issue}`).join('<br>');
}

// === AI Fix Simulation ===
function fixWithAI() {
  const button = document.getElementById('fixAIButton');
  const spinner = document.getElementById('aiSpinner');
  const summary = document.getElementById('fixSummary');

  const issues = JSON.parse(localStorage.getItem('issuesToFix') || '[]');
  if (issues.length === 0) return;

  button.disabled = true;
  spinner.classList.remove('d-none');

  setTimeout(() => {
    spinner.classList.add('d-none');

    let resultHTML = '<ul>';
    issues.forEach(issue => {
      resultHTML += `<li>✅ ${issue} resolved by AI</li>`;
      addTroubleshootLog('AI Fix', `${issue} resolved`);
    });
    resultHTML += '</ul>';

    summary.innerHTML = resultHTML;
    document.getElementById('fixSection').classList.add('d-none');

    showPopup("✅ Troubleshooting complete!");
    updateTroubleshootHistory();
    localStorage.removeItem('issuesToFix');
  }, 3000);
}

// === Notification Toast ===
function showPopup(message) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.textContent = message;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

//security
// --- Security Toggle Logic ---
let pendingToggle = null;

const components = [
  "File Anti-Virus",
  "Network Attack Blocker",
  "Safe Browsing",
  "Mail Anti-Virus",
  "Firewall",
  "System Watcher",
  "Anti-Phishing"
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("securityComponents");
  if (!container) return;

  components.forEach((comp, index) => {
    const id = `component-${index}`;
    const item = document.createElement("div");
    item.className = "col";

    item.innerHTML = `
      <div class="d-flex justify-content-between align-items-center security-toggle">
        <span>${comp}</span>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" checked id="${id}" data-setting="${comp}">
        </div>
      </div>
    `;

    container.appendChild(item);

    // Add toggle event listener
    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.addEventListener("change", () => handleToggle(comp, checkbox));
  });

  updateStatus(); // Initial status
});

function handleToggle(name, checkbox) {
  if (!checkbox.checked) {
    pendingToggle = { name, checkbox };
    checkbox.checked = true; // Temporarily revert
    const confirmModal = new bootstrap.Modal(document.getElementById("securityConfirmModal"));
    confirmModal.show();
  } else {
    updateStatus();
  }
}

function confirmDisable() {
  if (pendingToggle) {
    pendingToggle.checkbox.checked = false;
    showPopup(`${pendingToggle.name} has been disabled. This may put your system at risk.`);
    updateStatus();
    pendingToggle = null;
  }
  const confirmModal = bootstrap.Modal.getInstance(document.getElementById("securityConfirmModal"));
  confirmModal.hide();
}

function cancelDisable() {
  pendingToggle = null;
  const confirmModal = bootstrap.Modal.getInstance(document.getElementById("securityConfirmModal"));
  confirmModal.hide();
}

function updateStatus() {
  const allToggles = document.querySelectorAll('input[type="checkbox"][data-setting]');
  const allOn = Array.from(allToggles).every(cb => cb.checked);
  const status = document.getElementById("securityStatus");

  if (allOn) {
    status.textContent = "All protection components are enabled.";
    status.classList.remove("danger");
  } else {
    status.textContent = "⚠ Some protections are disabled. Your system may be at risk.";
    status.classList.add("danger");
  }
}

function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.textContent = message;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}
// === Network Devices View Toggle ===
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleDevicesView');
  const deviceList = document.getElementById('deviceList');

  if (toggleBtn && deviceList) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = deviceList.classList.contains('d-none');
      toggleBtn.textContent = isHidden ? 'Hide' : 'View';
      deviceList.classList.toggle('d-none');
    });
  }
});


//data leaks
// === Data Leak Checker Popup ===
function showLeakModal() {
  const modal = new bootstrap.Modal(document.getElementById('leakModal'));
  modal.show();
}
function copySystemInfo() {
  const text = document.getElementById('systemInfoText')?.innerText;
  if (!text) return alert("Could not find system info!");

  navigator.clipboard.writeText(text).then(() => {
    if (typeof showPopup === 'function') {
      showPopup("✅ System Info copied!");
    } else {
      alert("✅ System Info copied!");
    }
  }).catch(err => {
    alert("❌ Failed to copy: " + err);
  });
}
function killProcess(name) {
  showPopup(`🛑 Process "${name}" terminated.`);
}

function openTaskManager() {
  showPopup("🧠 Opening Task Manager... (simulated)");
  // You can replace this with actual logic or redirect
}
// Fan profile modes with corresponding RPMs and CSS classes
const fanModes = {
  whisper: { cpu: 800, gpu: 900, class: 'spin-slow' },
  standard: { cpu: 1400, gpu: 1500, class: 'spin-medium' },
  performance: { cpu: 2400, gpu: 2600, class: 'spin-fast' },
  full: { cpu: 3400, gpu: 3600, class: 'spin-max' }
};

let currentMode = 'whisper';
let gpuFanSilent = false;
let savedGpuRpm = fanModes[currentMode].gpu; // store default GPU value

function changeFanMode(mode) {
  currentMode = mode;

  const fanIcon = document.getElementById('fanIcon');
  const cpuRpm = document.getElementById('cpuFanRpm');
  const gpuRpm = document.getElementById('gpuFanRpm');

  // Reset spin classes
  fanIcon.classList.remove('spin-slow', 'spin-medium', 'spin-fast', 'spin-max');
  fanIcon.classList.add(fanModes[mode].class);

  // Update CPU RPM
  cpuRpm.textContent = fanModes[mode].cpu;

  // Update GPU RPM if not in silent mode
  if (!gpuFanSilent) {
    gpuRpm.textContent = fanModes[mode].gpu;
    savedGpuRpm = fanModes[mode].gpu;
  }
}

function toggleGpuFan() {
  const gpuRpm = document.getElementById('gpuFanRpm');
  const toggleBtn = document.getElementById('toggleGpuBtn');

  if (!gpuFanSilent) {
    // Silent mode: save current, show 0
    savedGpuRpm = parseInt(gpuRpm.textContent);
    gpuRpm.textContent = '0';
    toggleBtn.textContent = 'Enable GPU Fan';
    gpuFanSilent = true;
    showPopup("🛑 GPU Fan turned off.");
  } else {
    // Restore
    gpuRpm.textContent = savedGpuRpm;
    toggleBtn.textContent = 'Silent GPU';
    gpuFanSilent = false;
    showPopup("✅ GPU Fan restored.");
  }
}

// Optional popup handler
function showPopup(msg) {
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.textContent = msg;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2500);
}
const gpuHealth = 70 + Math.floor(Math.random() * 10); // 70-79%
updateCircleProgress('gpuHealthCircle', gpuHealth, '%');
document.getElementById('gpuHealthValue').textContent = `${gpuHealth}%`;

const gpuTemp = 48 + Math.floor(Math.random() * 10); // 48–57°C
document.getElementById('gpuTemp').textContent = `${gpuTemp}°C`;
//top process
function toggleProcessStatus(appName) {
  const statusEl = document.getElementById(`status-${appName}`);
  if (!statusEl) return;

  const current = statusEl.textContent.trim();

  if (current === 'Running') {
    statusEl.textContent = 'Idle';
    statusEl.classList.remove('bg-success');
    statusEl.classList.add('bg-warning', 'text-dark');
  } else {
    statusEl.textContent = 'Running';
    statusEl.classList.remove('bg-warning', 'text-dark');
    statusEl.classList.add('bg-success');
  }
}
function showInfo(message) {
  alert(message); // You can later replace this with a modal for better UI
}
function showSuggestionPopup(title, message) {
  const popup = document.getElementById('suggestionPopup');
  const titleElem = document.getElementById('suggestionTitle');
  const msgElem = document.getElementById('suggestionMessage');

  titleElem.textContent = title;
  msgElem.textContent = message;
  popup.style.display = 'block';
}

function hideSuggestionPopup() {
  const popup = document.getElementById('suggestionPopup');
  popup.style.display = 'none';
}


const updatesData = {
  software: {
    title: 'Software Update',
    desc: 'Windows Malicious Software Removal Tool x64 - v5.132 (KB890830)',
    info: 'Removes malware and helps clean infected systems.'
  },
  driver: {
    title: 'Driver Update',
    desc: 'Intel Wireless Driver 22.250.1.2 (Bluetooth, Wi-Fi)',
    info: 'Improves wireless performance and reliability.'
  },
  os: {
    title: 'OS Update',
    desc: '2025-04 Cumulative Update for Windows 10 Version 22H2 (KB5055518)',
    info: 'Includes quality improvements and security fixes.'
  },
  dotnet: {
    title: '.NET Framework',
    desc: '2025-01 Cumulative for .NET 3.5, 4.8 (KB5050188)',
    info: 'Ensures compatibility and performance updates for .NET apps.'
  }
};

let selectedUpdateType = null;

// Show modal with update details
function showUpdateModal(type) {
  selectedUpdateType = type;
  const data = updatesData[type];

  document.getElementById('updateModalTitle').textContent = `${data.title} Details`;
  document.getElementById('updateModalBody').innerHTML = `
    <p><strong>Status:</strong> Pending download</p>
    <p><strong>Update:</strong> ${data.desc}</p>
    <p><strong>Description:</strong> ${data.info}</p>
    <p class="text-danger">Your device is missing important updates.</p>
  `;

  const modalElement = document.getElementById('updateModal');
  let modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (!modalInstance) {
    modalInstance = new bootstrap.Modal(modalElement);
  }
  modalInstance.show();
}


// Handle "Continue" button click
document.getElementById('modalContinueBtn').addEventListener('click', function () {
  const progress = document.getElementById(`${selectedUpdateType}Progress`);
  const updated = document.getElementById(`${selectedUpdateType}Updated`);
  const card = progress.closest('.update-card');
  const status = card.querySelector('p strong');

  // Reset state
  progress.classList.remove('d-none');
  updated.classList.add('d-none');
  status.textContent = 'Status: Updating...';

  // Hide modal
  const modalElement = document.getElementById('updateModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();

  // Simulate update
  setTimeout(() => {
    progress.classList.add('d-none');
    updated.classList.remove('d-none');
    status.textContent = 'Status: Updated ✅';
  }, 2500);
});










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



