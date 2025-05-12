/**
 * Tracking page functionality
 */

let map;
let shipmentMarker;
let routePolyline;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    initMap();
    
    // Get shipment ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const shipmentId = urlParams.get('shipment') || 'SH-789456';
    
    // Set the shipment ID in the input field
    document.getElementById('trackingId').value = shipmentId;
    
    // Load shipment data
    loadShipmentData(shipmentId);
    
    // Set up event listeners
    document.getElementById('trackShipmentBtn').addEventListener('click', function() {
        const trackingId = document.getElementById('trackingId').value.trim();
        if (trackingId) {
            loadShipmentData(trackingId);
            // Update URL without reloading
            window.history.pushState({}, '', `tracking.html?shipment=${trackingId}`);
        }
    });
});

// Initialize the map
function initMap() {
    map = L.map('trackingMap').setView([39.7392, -104.9903], 5);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

// Load shipment data
async function loadShipmentData(shipmentId) {
    try {
        showLoading();
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch from an API:
        // const response = await fetch(`/api/shipments/${shipmentId}`);
        // const data = await response.json();
        
        // Mock data
        const data = {
            id: shipmentId,
            status: 'in_transit',
            origin: 'New York, NY',
            destination: 'Los Angeles, CA',
            currentLocation: 'Denver, CO',
            currentCoords: [39.7392, -104.9903],
            eta: '2023-05-15T18:00:00',
            carrier: 'FedEx',
            distance: 1450,
            traveled: 1100,
            speed: 62,
            weather: {
                condition: 'Partly Cloudy',
                temperature: 68,
                wind: 12,
                precipitation: 10
            },
            history: [
                {
                    event: 'Departed Denver, CO',
                    timestamp: '2023-05-12T10:30:00',
                    location: 'Denver, CO',
                    coords: [39.7392, -104.9903]
                },
                {
                    event: 'Arrived in Denver, CO',
                    timestamp: '2023-05-11T20:45:00',
                    location: 'Denver, CO',
                    coords: [39.7392, -104.9903]
                },
                {
                    event: 'Departed Chicago, IL',
                    timestamp: '2023-05-10T15:15:00',
                    location: 'Chicago, IL',
                    coords: [41.8781, -87.6298]
                },
                {
                    event: 'Picked Up in New York, NY',
                    timestamp: '2023-05-08T09:00:00',
                    location: 'New York, NY',
                    coords: [40.7128, -74.0060]
                }
            ],
            route: [
                [40.7128, -74.0060], // New York
                [41.8781, -87.6298], // Chicago
                [39.7392, -104.9903], // Denver
                [34.0522, -118.2437]  // Los Angeles
            ]
        };
        
        // Update UI with data
        updateTrackingUI(data);
    } catch (error) {
        console.error('Error loading shipment data:', error);
        showError('Failed to load shipment data. Please try again.');
    } finally {
        hideLoading();
    }
}

// Update the tracking UI with data
function updateTrackingUI(data) {
    // Update shipment details
    document.getElementById('shipmentId').textContent = data.id;
    
    let statusBadge;
    switch(data.status) {
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
    
    document.getElementById('shipmentStatus').innerHTML = statusBadge;
    document.getElementById('shipmentOrigin').textContent = data.origin;
    document.getElementById('shipmentDestination').textContent = data.destination;
    document.getElementById('currentLocation').textContent = data.currentLocation;
    document.getElementById('shipmentETA').textContent = formatDate(data.eta);
    document.getElementById('shipmentCarrier').textContent = data.carrier;
    
    // Update route info
    document.getElementById('routeDistance').textContent = `${data.distance} miles`;
    document.getElementById('routeTraveled').textContent = `${data.traveled} miles (${Math.round((data.traveled / data.distance) * 100)}%)`;
    document.getElementById('currentSpeed').textContent = `${data.speed} mph`;
    
    // Update weather info
    document.getElementById('weatherCondition').textContent = data.weather.condition;
    document.getElementById('weatherTemp').textContent = `${data.weather.temperature}°F`;
    document.getElementById('weatherWind').textContent = `${data.weather.wind} mph`;
    document.getElementById('weatherPrecip').textContent = `${data.weather.precipitation}%`;
    
    // Update timeline
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    
    data.history.forEach(event => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <p class="mb-0 fw-bold">${event.event}</p>
                <small class="text-muted">${formatDate(event.timestamp)} - ${event.location}</small>
            </div>
        `;
        timeline.appendChild(item);
    });
    
    // Update map
    updateMap(data);
}

// Update the map with shipment data
function updateMap(data) {
    // Clear existing layers
    if (shipmentMarker) map.removeLayer(shipmentMarker);
    if (routePolyline) map.removeLayer(routePolyline);
    
    // Add route
    routePolyline = L.polyline(data.route, {color: 'blue'}).addTo(map);
    
    // Add origin marker
    L.marker(data.route[0]).addTo(map)
        .bindPopup(`Origin: ${data.origin}`);
    
    // Add destination marker
    L.marker(data.route[data.route.length - 1]).addTo(map)
        .bindPopup(`Destination: ${data.destination}`);
    
    // Add current location marker
    shipmentMarker = L.marker(data.currentCoords, {
        icon: L.divIcon({
            className: 'current-location-marker',
            html: '<i class="fas fa-truck fa-2x text-danger"></i>',
            iconSize: [30, 30]
        })
    }).addTo(map)
      .bindPopup(`Current Location: ${data.currentLocation}`);
    
    // Fit map to show the entire route
    map.fitBounds(routePolyline.getBounds());
}