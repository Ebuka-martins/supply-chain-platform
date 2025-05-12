/**
 * Dashboard page functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load dashboard data
    loadDashboardData();
    
    // Set up event listeners
    document.querySelectorAll('.shipment-row').forEach(row => {
        row.addEventListener('click', function() {
            const shipmentId = this.getAttribute('data-shipment-id');
            window.location.href = `tracking.html?shipment=${shipmentId}`;
        });
    });
    
    // Refresh button
    document.getElementById('refreshDashboard').addEventListener('click', function() {
        loadDashboardData();
    });
});

// Load dashboard data from API
async function loadDashboardData() {
    try {
        showLoading();
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, you would fetch from an API:
        // const response = await fetch('/api/dashboard');
        // const data = await response.json();
        
        // Mock data
        const data = {
            activeShipments: 12,
            delayedShipments: 3,
            onTimeRate: 98,
            monthlyShipments: 45,
            recentShipments: [
                {
                    id: 'SH-789456',
                    origin: 'New York',
                    destination: 'Los Angeles',
                    status: 'in_transit',
                    eta: '2023-05-15T12:00:00'
                },
                {
                    id: 'SH-123456',
                    origin: 'Chicago',
                    destination: 'Miami',
                    status: 'delivered',
                    eta: '2023-05-10T14:30:00'
                },
                {
                    id: 'SH-654321',
                    origin: 'Houston',
                    destination: 'Seattle',
                    status: 'processing',
                    eta: '2023-05-18T09:00:00'
                }
            ],
            recentAlerts: [
                {
                    type: 'delay',
                    message: 'Shipment SH-789456 delayed due to weather conditions',
                    timestamp: '2023-05-12T08:15:00'
                },
                {
                    type: 'route_change',
                    message: 'Shipment SH-654321 rerouted due to traffic',
                    timestamp: '2023-05-11T16:45:00'
                },
                {
                    type: 'delivery',
                    message: 'Shipment SH-123456 delivered successfully',
                    timestamp: '2023-05-10T14:30:00'
                }
            ]
        };
        
        // Update UI with data
        updateDashboardUI(data);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data. Please try again.');
    } finally {
        hideLoading();
    }
}

// Update the dashboard UI with data
function updateDashboardUI(data) {
    // Update stats
    document.getElementById('activeShipmentsCount').textContent = data.activeShipments;
    document.getElementById('delayedShipmentsCount').textContent = data.delayedShipments;
    document.getElementById('onTimeRate').textContent = `${data.onTimeRate}%`;
    document.getElementById('monthlyShipments').textContent = data.monthlyShipments;
    
    // Update shipments table
    const shipmentsTable = document.getElementById('shipmentsTableBody');
    shipmentsTable.innerHTML = '';
    
    data.recentShipments.forEach(shipment => {
        const row = document.createElement('tr');
        row.className = 'shipment-row';
        row.setAttribute('data-shipment-id', shipment.id);
        
        let statusBadge;
        switch(shipment.status) {
            case 'in_transit':
                statusBadge = '<span class="badge bg-warning">In Transit</span>';
                break;
            case 'delivered':
                statusBadge = '<span class="badge bg-success">Delivered</span>';
                break;
            case 'processing':
                statusBadge = '<span class="badge bg-info">Processing</span>';
                break;
            default:
                statusBadge = '<span class="badge bg-secondary">Unknown</span>';
        }
        
        row.innerHTML = `
            <td><a href="tracking.html?shipment=${shipment.id}">${shipment.id}</a></td>
            <td>${shipment.origin}</td>
            <td>${shipment.destination}</td>
            <td>${statusBadge}</td>
            <td>${formatDate(shipment.eta)}</td>
        `;
        
        shipmentsTable.appendChild(row);
    });
    
    // Update alerts
    const alertsContainer = document.getElementById('alertsContainer');
    alertsContainer.innerHTML = '';
    
    data.recentAlerts.forEach(alert => {
        let alertClass, icon;
        switch(alert.type) {
            case 'delay':
                alertClass = 'alert-warning';
                icon = 'fa-exclamation-triangle';
                break;
            case 'route_change':
                alertClass = 'alert-info';
                icon = 'fa-route';
                break;
            case 'delivery':
                alertClass = 'alert-success';
                icon = 'fa-check-circle';
                break;
            default:
                alertClass = 'alert-secondary';
                icon = 'fa-info-circle';
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${alertClass}`;
        alertDiv.innerHTML = `
            <strong><i class="fas ${icon} me-2"></i>${alert.type.replace('_', ' ').toUpperCase()}:</strong> 
            ${alert.message}
            <small class="text-muted d-block mt-1">${formatDate(alert.timestamp)}</small>
        `;
        
        alertsContainer.appendChild(alertDiv);
    });
}

// Show error message
function showError(message) {
    const errorAlert = document.createElement('div');
    errorAlert.className = 'alert alert-danger alert-dismissible fade show';
    errorAlert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.getElementById('alertsContainer') || document.querySelector('.container');
    container.prepend(errorAlert);
}