// Notification and Top Navbar functionality
function initTopNavbar() {
    // Get the notification and settings icons and panels
    const notificationIcon = document.getElementById('notification-icon');
    const settingsIcon = document.getElementById('settings-icon');
    const notificationPanel = document.getElementById('notificationPanel');
    const settingsPanel = document.getElementById('settingsPanel');
    const closePanelButtons = document.querySelectorAll('.close-panel');
    
    // Initialize notification count
    let notificationCount = 0;
    updateNotificationBadge(notificationCount);
    
    // Add event listeners to icons
    notificationIcon.addEventListener('click', function() {
      // Close settings panel if open
      settingsPanel.classList.remove('active');
      // Toggle notification panel
      notificationPanel.classList.toggle('active');
      // Reset notification count when opened
      if (notificationPanel.classList.contains('active')) {
        notificationCount = 0;
        updateNotificationBadge(notificationCount);
      }
    });
    
    settingsIcon.addEventListener('click', function() {
      // Close notification panel if open
      notificationPanel.classList.remove('active');
      // Toggle settings panel
      settingsPanel.classList.toggle('active');
    });
    
    // Add close functionality to panel close buttons
    closePanelButtons.forEach(button => {
      button.addEventListener('click', function() {
        const panel = this.closest('.side-panel');
        panel.classList.remove('active');
      });
    });
    
    // Close panels when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.side-panel') && 
          !event.target.closest('.navbar-icon')) {
        notificationPanel.classList.remove('active');
        settingsPanel.classList.remove('active');
      }
    });
    
    // Arrays of warning and info notifications
    const warningNotifications = [
      { title: 'High CPU Temperature', message: 'CPU temperature is above 80°C. Consider cleaning your fans.' },
      { title: 'High RAM Usage', message: 'System is using 92% of available RAM. Close unused applications.' },
      { title: 'Low Disk Space', message: 'Your C: drive has less than 10% free space remaining.' },
      { title: 'Drive Health Warning', message: 'Your primary drive health has dropped to 65%. Consider backup.' },
      { title: 'High CPU Usage', message: 'System CPU usage has been above 85% for over 5 minutes.' },
      { title: 'Network Bottleneck', message: 'Network traffic is unusually high, affecting system performance.' }
    ];
    
    const infoNotifications = [
      { 
        title: 'System Scan Recommended', 
        message: 'Your system has not been scanned in 3 days.',
        type: 'cleaner',
        actionText: 'Would you like to run a system scan now to optimize performance?',
        buttonText: 'Go to System Cleaner'
      },
      { 
        title: 'Software Update Available', 
        message: 'Updates are available for 3 applications. Check updates tab.',
        type: 'update',
        actionText: 'Install critical updates to maintain system security and performance.',
        buttonText: 'Go to Update Center'
      },
      { 
        title: 'Driver Update', 
        message: 'New graphics driver update available for your GPU.',
        type: 'update',
        actionText: 'Update your graphics driver for better performance and compatibility.',
        buttonText: 'Go to Driver Update'
      },
      { 
        title: 'Security Definitions', 
        message: 'Antivirus definitions need to be updated for optimal protection.',
        type: 'update',
        actionText: 'Keep your system protected with the latest security definitions.',
        buttonText: 'Update Security Definitions'
      },
      { 
        title: 'System Optimization', 
        message: 'Regular boost recommended to optimize performance.',
        type: 'booster',
        actionText: 'Boost your system performance with our optimization tools.',
        buttonText: 'Go to Performance Booster'
      }
    ];
    
    // Track shown notifications to prevent duplicates
    const shownNotifications = new Set();
    
    // Start with a warning notification after 1 second
    setTimeout(() => {
      const firstNotification = warningNotifications[0];
      addNotification(firstNotification.title, firstNotification.message, true);
      shownNotifications.add(firstNotification.title);
    }, 1000);
    
    // Set interval for alternating notifications
    let warningIndex = 1; // Start from the second warning (index 1)
    let infoIndex = 0;
    let isWarning = false; // Start with info after the first warning
    
    setInterval(() => {
      if (isWarning) {
        // Find the next unique warning notification
        let nextWarning;
        let startIndex = warningIndex;
        do {
          nextWarning = warningNotifications[warningIndex];
          warningIndex = (warningIndex + 1) % warningNotifications.length;
          // If we've checked all warnings and found no unique ones, reset the tracking
          if (warningIndex === startIndex) {
            shownNotifications.clear();
            break;
          }
        } while (shownNotifications.has(nextWarning.title));
        
        // Add the notification and track it
        addNotification(nextWarning.title, nextWarning.message, true);
        shownNotifications.add(nextWarning.title);
      } else {
        // Find the next unique info notification
        let nextInfo;
        let startIndex = infoIndex;
        do {
          nextInfo = infoNotifications[infoIndex];
          infoIndex = (infoIndex + 1) % infoNotifications.length;
          // If we've checked all info notifications and found no unique ones, reset the tracking
          if (infoIndex === startIndex) {
            shownNotifications.clear();
            break;
          }
        } while (shownNotifications.has(nextInfo.title));
        
        // Add the notification and track it
        addNotification(
          nextInfo.title, 
          nextInfo.message, 
          false, 
          nextInfo.type, 
          nextInfo.actionText, 
          nextInfo.buttonText
        );
        shownNotifications.add(nextInfo.title);
      }
      // Toggle between warning and info for the next notification
      isWarning = !isWarning;
    }, 10000); // 30 seconds interval
  }
  
  // Update notification badge
  function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    badge.textContent = count;
    
    if (count === 0) {
      badge.style.display = 'none';
    } else {
      badge.style.display = 'flex';
    }
  }
  
  // Enhanced notification function with warning/info styling and clickable functionality
  function addNotification(title, message, isWarning = false, type = '', actionText = '', buttonText = '') {
    const panel = document.getElementById('notificationPanel');
    const content = panel.querySelector('.panel-content');
    const noNotifications = content.querySelector('.no-notifications');
    
    // Check if notification with same title already exists
    const existingNotifications = content.querySelectorAll('.notification-item');
    for (let i = 0; i < existingNotifications.length; i++) {
      const existingTitle = existingNotifications[i].querySelector('.notification-title').textContent;
      if (existingTitle === title) {
        return; // Skip adding duplicate notification
      }
    }
    
    // Remove "no notifications" message if it exists
    if (noNotifications) {
      noNotifications.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-item ${isWarning ? 'warning' : 'info'}`;
    
    // Only make info notifications clickable
    if (!isWarning) {
      notification.classList.add('clickable');
      notification.dataset.type = type;
      notification.dataset.actionText = actionText;
      notification.dataset.buttonText = buttonText;
    }
    
    notification.innerHTML = `
      <div class="notification-icon">${isWarning ? '⚠️' : 'ℹ️'}</div>
      <div class="notification-content">
        <div class="notification-time">${new Date().toLocaleTimeString()}</div>
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
      <div class="notification-close" title="Dismiss">×</div>
    `;
    
    // Add to panel
    content.prepend(notification);
    
    // Add click event listener only for info notifications
    if (!isWarning) {
      notification.addEventListener('click', function(event) {
        // Don't trigger notification click if close button was clicked
        if (!event.target.closest('.notification-close')) {
          handleInfoNotificationClick(this);
        }
      });
    }
    
    // Add click event listener for the close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function(event) {
      event.stopPropagation(); // Prevent notification click event
      notification.remove();
      
      // Also remove any associated action message
      const nextElement = notification.nextElementSibling;
      if (nextElement && nextElement.classList.contains('action-message')) {
        nextElement.remove();
      }
      
      // Update notification count
      updateNotificationBadge(document.querySelectorAll('.notification-item').length);
      
      // Show "no notifications" message if this was the last one
      if (document.querySelectorAll('.notification-item').length === 0) {
        content.innerHTML = '<p class="no-notifications">No new notifications</p>';
      }
    });
    
    // Update notification count
    updateNotificationBadge(document.querySelectorAll('.notification-item').length);
  }
  
  // Handle info notification click
  function handleInfoNotificationClick(notification) {
    // Remove any existing action messages
    const existingActionMessages = document.querySelectorAll('.action-message');
    existingActionMessages.forEach(msg => msg.remove());
    
    // Create action message element
    const actionMessage = document.createElement('div');
    actionMessage.className = 'action-message';
    
    // Get data from notification
    const type = notification.dataset.type;
    const actionText = notification.dataset.actionText;
    const buttonText = notification.dataset.buttonText;
    
    // Add content to action message with close button
    actionMessage.innerHTML = `
      <div class="action-message-header">
        <span class="action-message-close" title="Close">×</span>
      </div>
      <p>${actionText}</p>
      <button class="action-button" onclick="redirectToPage('${type}')">${buttonText}</button>
    `;
    
    // Insert action message after the notification
    notification.after(actionMessage);
    
    // Add event listener for close button
    const closeButton = actionMessage.querySelector('.action-message-close');
    closeButton.addEventListener('click', function() {
      actionMessage.classList.remove('visible');
      notification.classList.remove('expanded');
      
      // Remove the action message after animation
      setTimeout(() => {
        actionMessage.remove();
      }, 300);
    });
    
    // Show the action message with animation
    setTimeout(() => {
      actionMessage.classList.add('visible');
      // Make notification appear expanded
      notification.classList.add('expanded');
    }, 10);
  }
  
  // Function to handle redirection to different pages
  function redirectToPage(pageType) {
    switch (pageType) {
      case 'update':
        window.location.href = '/update.html';
        break;
      case 'cleaner':
        window.location.href = '/Cleaner.html';
        break;
      case 'booster':
        window.location.href = '/Booster.html';
        break;
      default:
        console.warn('Unknown page type:', pageType);
        break;
    }
  }
  
  // Initialize top navbar with notifications
  initTopNavbar();

  