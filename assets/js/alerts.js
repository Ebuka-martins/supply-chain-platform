/**
 * Alerts page functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load alerts data
    loadAlertsData();
    
    // Set up filter button
    document.getElementById('filterAlertsBtn').addEventListener('click', showFilterModal);
    
    // Set up alert settings button
    document.getElementById('alertSettingsBtn').addEventListener('click', function() {
        // In a real app, this would open a settings modal
        alert('Alert settings would open here');
    });
});

// Load alerts data
async function loadAlertsData() {
    try {
        showLoading();
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, you would fetch from an API:
        // const response = await fetch('/api/alerts');
        // const data = await response.json();
        
        // Mock data
        const data = [
            {
                id: 'ALT-789',
                type: 'delay',
                severity: 'high',
                message: 'Shipment SH-789456 delayed by approximately 2 hours due to severe weather conditions in Colorado.',
                affectedShipment: 'SH-789456',
                affectedRoute: 'New York to Los Angeles',
                timestamp: '2023-05-12T08:15:00',
                read: false
            },
            {
                id: 'ALT-456',
                type: 'route_change',
                severity: 'medium',
                message: 'Shipment SH-654321 has been rerouted to avoid traffic congestion on I-70 near Kansas City.',
                affectedShipment: 'SH-654321',
                affectedRoute: 'Houston to Seattle',
                timestamp: '2023-05-11T16:45:00',
                read: true
            },
            {
                id: 'ALT-123',
                type: 'delivery',
                severity: 'low',
                message: 'Shipment SH-123456 delivered successfully at destination warehouse.',
                affectedShipment: 'SH-123456',
                affectedRoute: 'Chicago to Miami',
                timestamp: '2023-05-10T14:30:00',
                read: true
            },
            {
                id: 'ALT-987',
                type: 'customs',
                severity: 'high',
                message: 'Customs clearance required for shipment SH-321654 at border crossing.',
                affectedShipment: 'SH-321654',
                affectedRoute: 'Toronto to Dallas',
                timestamp: '2023-05-09T11:20:00',
                read: false
            },
            {
                id: 'ALT-654',
                type: 'equipment',
                severity: 'medium',
                message: 'Temperature alert: Reefer unit on shipment SH-147258 reporting fluctuation.',
                affectedShipment: 'SH-147258',
                affectedRoute: 'Seattle to Phoenix',
                timestamp: '2023-05-08T09:45:00',
                read: true
            }
        ];
        
        // Update UI with data
        updateAlertsUI(data);
    } catch (error) {
        console.error('Error loading alerts data:', error);
        showError('Failed to load alerts. Please try again.');
    } finally {
        hideLoading();
    }
}

// Update the alerts UI with data
function updateAlertsUI(alerts) {
    const alertsContainer = document.getElementById('alertsContainer');
    alertsContainer.innerHTML = '';
    
    alerts.forEach(alert => {
        const alertElement = createAlertElement(alert);
        alertsContainer.appendChild(alertElement);
    });
    
    // Update unread count
    const unreadCount = alerts.filter(a => !a.read).length;
    document.getElementById('unreadCountBadge').textContent = unreadCount;
    document.getElementById('unreadCountBadge').style.display = unreadCount > 0 ? 'inline-block' : 'none';
}

// Create an alert element
function createAlertElement(alert) {
    let alertClass, icon;
    switch(alert.severity) {
        case 'high':
            alertClass = 'alert-danger';
            icon = 'fa-exclamation-triangle';
            break;
        case 'medium':
            alertClass = 'alert-warning';
            icon = 'fa-exclamation-circle';
            break;
        case 'low':
            alertClass = 'alert-info';
            icon = 'fa-info-circle';
            break;
        default:
            alertClass = 'alert-secondary';
            icon = 'fa-bell';
    }
    
    if (!alert.read) {
        alertClass += ' unread-alert';
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
            <div>
                <h5 class="alert-heading">
                    <i class="fas ${icon} me-2"></i>
                    ${alert.type.replace('_', ' ').toUpperCase()} ALERT
                    <span class="badge bg-${alert.severity === 'high' ? 'danger' : alert.severity === 'medium' ? 'warning' : 'info'} ms-2">
                        ${alert.severity.toUpperCase()}
                    </span>
                </h5>
                <p class="mb-1">${alert.message}</p>
                <small class="text-muted">
                    <i class="fas fa-shipping-fast me-1"></i> ${alert.affectedShipment} (${alert.affectedRoute})
                </small>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <div class="d-flex justify-content-between mt-2">
            <small class="text-muted">${formatDate(alert.timestamp)}</small>
            <div>
                <button class="btn btn-sm btn-outline-secondary me-1 mark-as-read-btn" data-alert-id="${alert.id}">
                    <i class="fas fa-check me-1"></i>Mark as Read
                </button>
                <button class="btn btn-sm btn-outline-primary view-details-btn" data-alert-id="${alert.id}">
                    <i class="fas fa-search me-1"></i>Details
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    alertDiv.querySelector('.mark-as-read-btn').addEventListener('click', function(e) {
        e.preventDefault();
        markAlertAsRead(alert.id);
    });
    
    alertDiv.querySelector('.view-details-btn').addEventListener('click', function(e) {
        e.preventDefault();
        viewAlertDetails(alert.id);
    });
    
    return alertDiv;
}

// Mark alert as read
function markAlertAsRead(alertId) {
    // In a real app, you would make an API call to update the alert status
    console.log(`Marking alert ${alertId} as read`);
    
    // Update UI immediately
    const alertElement = document.querySelector(`[data-alert-id="${alertId}"]`).closest('.alert');
    alertElement.classList.remove('unread-alert');
    
    // Update unread count
    const unreadCount = document.querySelectorAll('.unread-alert').length;
    document.getElementById('unreadCountBadge').textContent = unreadCount;
    document.getElementById('unreadCountBadge').style.display = unreadCount > 0 ? 'inline-block' : 'none';
}

// View alert details
function viewAlertDetails(alertId) {
    // In a real app, this would show more details about the alert
    console.log(`Viewing details for alert ${alertId}`);
    window.location.href = `tracking.html?shipment=${alertId.replace('ALT-', 'SH-')}`;
}

// Show filter modal
function showFilterModal() {
    // In a real app, this would show a modal with filter options
    console.log('Showing filter modal');
    alert('Filter modal would appear here with options to filter alerts by type, severity, date, etc.');
}