/**
 * Tracking page functionality with Google Maps integration
 */

let map;
let shipmentMarker;
let routePolyline;
let directionsService;
let directionsRenderer;
let currentShipmentData = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get shipment ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const shipmentId = urlParams.get('shipment') || 'SH-789456';
    
    // Set the shipment ID in the input field
    document.getElementById('trackingId').value = shipmentId;
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial shipment data
    loadShipmentData(shipmentId);
});

// Google Maps initialization callback
window.initGoogleMap = function() {
    console.log('Google Maps loaded successfully');
    initMap();
    
    // If we have shipment data, update the map
    if (currentShipmentData) {
        updateMap(currentShipmentData);
    }
};

// Set up event listeners
function setupEventListeners() {
    const trackBtn = document.getElementById('trackShipmentBtn');
    const trackingInput = document.getElementById('trackingId');
    
    if (trackBtn) {
        trackBtn.addEventListener('click', function() {
            const trackingId = trackingInput.value.trim();
            if (trackingId) {
                loadShipmentData(trackingId);
                // Update URL without reloading
                window.history.pushState({}, '', `tracking.html?shipment=${trackingId}`);
            }
        });
    }
    
    // Allow Enter key to trigger tracking
    if (trackingInput) {
        trackingInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                trackBtn.click();
            }
        });
    }
}

// Initialize Google Maps
function initMap() {
    try {
        // Hide loading spinner
        const loadingDiv = document.getElementById('mapLoading');
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
        
        // Initialize map centered on Denver, CO
        map = new google.maps.Map(document.getElementById('trackingMap'), {
            zoom: CONFIG.MAP_DEFAULT_ZOOM,
            center: { lat: CONFIG.MAP_DEFAULT_CENTER[0], lng: CONFIG.MAP_DEFAULT_CENTER[1] },
            mapTypeId: 'roadmap',
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });
        
        // Initialize directions service and renderer
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true, // We'll add custom markers
            polylineOptions: {
                strokeColor: '#2196F3',
                strokeWeight: 4,
                strokeOpacity: 0.8
            }
        });
        directionsRenderer.setMap(map);
        
        console.log('Google Maps initialized successfully');
    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        showError('Failed to initialize map. Please check your internet connection.');
    }
}

// Load shipment data
async function loadShipmentData(shipmentId) {
    try {
        showLoading();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch from an API:
        // const response = await fetch(`/api/shipments/${shipmentId}`);
        // const data = await response.json();
        
        // Mock data based on shipment ID
        const data = generateMockShipmentData(shipmentId);
        
        // Store current data
        currentShipmentData = data;
        
        // Update UI with data
        updateTrackingUI(data);
        
        // Update map if Google Maps is loaded
        if (map && google) {
            updateMap(data);
        }
        
    } catch (error) {
        console.error('Error loading shipment data:', error);
        showError('Failed to load shipment data. Please try again.');
    } finally {
        hideLoading();
    }
}

// Generate mock shipment data
function generateMockShipmentData(shipmentId) {
    const routes = {
        'SH-789456': {
            origin: 'New York, NY',
            destination: 'Los Angeles, CA',
            currentLocation: 'Denver, CO',
            currentCoords: { lat: 39.7392, lng: -104.9903 },
            status: 'in_transit',
            progress: 76
        },
        'SH-123789': {
            origin: 'Chicago, IL',
            destination: 'Miami, FL',
            currentLocation: 'Atlanta, GA',
            currentCoords: { lat: 33.7490, lng: -84.3880 },
            status: 'in_transit',
            progress: 65
        },
        'SH-456123': {
            origin: 'Seattle, WA',
            destination: 'Boston, MA',
            currentLocation: 'Minneapolis, MN',
            currentCoords: { lat: 44.9778, lng: -93.2650 },
            status: 'in_transit',
            progress: 45
        }
    };
    
    const route = routes[shipmentId] || routes['SH-789456'];
    
    return {
        id: shipmentId,
        status: route.status,
        origin: route.origin,
        destination: route.destination,
        currentLocation: route.currentLocation,
        currentCoords: route.currentCoords,
        eta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        carrier: 'FedEx',
        distance: 1450,
        traveled: Math.round(1450 * (route.progress / 100)),
        speed: Math.floor(Math.random() * 20) + 55, // Random speed between 55-75 mph
        weather: {
            condition: 'Partly Cloudy',
            temperature: Math.floor(Math.random() * 30) + 50, // Random temp 50-80°F
            wind: Math.floor(Math.random() * 15) + 5, // Random wind 5-20 mph
            precipitation: Math.floor(Math.random() * 30) // Random precipitation 0-30%
        },
        history: [
            {
                event: `Departed ${route.currentLocation}`,
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
                location: route.currentLocation,
                coords: route.currentCoords
            },
            {
                event: `Arrived in ${route.currentLocation}`,
                timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
                location: route.currentLocation,
                coords: route.currentCoords
            },
            {
                event: `Departed Chicago, IL`,
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                location: 'Chicago, IL',
                coords: { lat: 41.8781, lng: -87.6298 }
            },
            {
                event: `Picked Up in ${route.origin}`,
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                location: route.origin,
                coords: getCoordinatesForCity(route.origin)
            }
        ]
    };
}

// Get coordinates for major cities
function getCoordinatesForCity(cityName) {
    const cityCoords = {
        'New York, NY': { lat: 40.7128, lng: -74.0060 },
        'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
        'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
        'Miami, FL': { lat: 25.7617, lng: -80.1918 },
        'Seattle, WA': { lat: 47.6062, lng: -122.3321 },
        'Boston, MA': { lat: 42.3601, lng: -71.0589 },
        'Denver, CO': { lat: 39.7392, lng: -104.9903 },
        'Atlanta, GA': { lat: 33.7490, lng: -84.3880 },
        'Minneapolis, MN': { lat: 44.9778, lng: -93.2650 }
    };
    
    return cityCoords[cityName] || { lat: 39.7392, lng: -104.9903 };
}

// Update the tracking UI with data
function updateTrackingUI(data) {
    // Update shipment details
    const elements = {
        shipmentId: data.id,
        shipmentOrigin: data.origin,
        shipmentDestination: data.destination,
        currentLocation: data.currentLocation,
        shipmentETA: formatDate(data.eta),
        shipmentCarrier: data.carrier,
        routeDistance: `${data.distance} miles`,
        routeTraveled: `${data.traveled} miles (${Math.round((data.traveled / data.distance) * 100)}%)`,
        currentSpeed: `${data.speed} mph`
    };
    
    // Update text elements
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    // Update status badge
    const statusElement = document.getElementById('shipmentStatus');
    if (statusElement) {
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
        statusElement.innerHTML = statusBadge;
    }
    
    // Update weather info
    const weatherElements = {
        weatherCondition: data.weather.condition,
        weatherTemp: `${data.weather.temperature}°F`,
        weatherWind: `${data.weather.wind} mph`,
        weatherPrecip: `${data.weather.precipitation}%`,
        weatherLocation: data.currentLocation
    };
    
    Object.entries(weatherElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    // Update timeline
    updateTimeline(data.history);
}

// Update timeline with history data
function updateTimeline(history) {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    
    timeline.innerHTML = '';
    
    history.forEach(event => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <p class="mb-0 fw-bold">${event.event}</p>
                <small class="text-muted">${formatDate(event.timestamp)}</small>
            </div>
        `;
        timeline.appendChild(item);
    });
}

// Update Google Maps with shipment data
function updateMap(data) {
    if (!map || !google) {
        console.log('Google Maps not ready yet');
        return;
    }
    
    try {
        // Clear existing markers and polylines
        if (shipmentMarker) {
            shipmentMarker.setMap(null);
        }
        
        // Get coordinates for origin and destination
        const originCoords = getCoordinatesForCity(data.origin);
        const destinationCoords = getCoordinatesForCity(data.destination);
        
        // Create route using Directions API
        const request = {
            origin: originCoords,
            destination: destinationCoords,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false
        };
        
        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(result);
                
                // Add custom markers
                addCustomMarkers(data, originCoords, destinationCoords);
                
                // Fit map bounds to show the route
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(originCoords);
                bounds.extend(destinationCoords);
                bounds.extend(data.currentCoords);
                map.fitBounds(bounds);
                
            } else {
                console.error('Directions request failed:', status);
                // Fallback: show basic markers without route
                addBasicMarkers(data, originCoords, destinationCoords);
            }
        });
        
    } catch (error) {
        console.error('Error updating map:', error);
    }
}

// Add custom markers to the map
function addCustomMarkers(data, originCoords, destinationCoords) {
    // Origin marker (green flag)
    new google.maps.Marker({
        position: originCoords,
        map: map,
        title: `Origin: ${data.origin}`,
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new google.maps.Size(32, 32)
        }
    });
    
    // Destination marker (red flag)
    new google.maps.Marker({
        position: destinationCoords,
        map: map,
        title: `Destination: ${data.destination}`,
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(32, 32)
        }
    });
    
    // Current location marker (truck icon)
    shipmentMarker = new google.maps.Marker({
        position: data.currentCoords,
        map: map,
        title: `Current Location: ${data.currentLocation}`,
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(32, 32)
        }
    });
}

// Utility functions

// Format date for display
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show loading state
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingOverlay';
    loadingDiv.className = 'loading-overlay';
    loadingDiv.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

// Hide loading state
function hideLoading() {
    const loadingDiv = document.getElementById('loadingOverlay');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Show error message
function showError(message) {
    hideLoading();
    
    // Create or update error message
    let errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessage';
        errorDiv.className = 'alert alert-danger alert-dismissible fade show';
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '20px';
        errorDiv.style.right = '20px';
        errorDiv.style.zIndex = '1000';
        errorDiv.innerHTML = `
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            <strong>Error:</strong> <span id="errorText">${message}</span>
        `;
        document.body.appendChild(errorDiv);
    } else {
        document.getElementById('errorText').textContent = message;
    }
}

// Add basic markers when Directions API fails
function addBasicMarkers(data, originCoords, destinationCoords) {
    // Origin marker
    new google.maps.Marker({
        position: originCoords,
        map: map,
        title: `Origin: ${data.origin}`,
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new google.maps.Size(32, 32)
        }
    });
    
    // Destination marker
    new google.maps.Marker({
        position: destinationCoords,
        map: map,
        title: `Destination: ${data.destination}`,
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(32, 32)
        }
    });
    
    // Current location marker
    shipmentMarker = new google.maps.Marker({
        position: data.currentCoords,
        map: map,
        title: `Current Location: ${data.currentLocation}`,
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(32, 32)
        }
    });
    
    // Draw a simple polyline between points
    const routePath = new google.maps.Polyline({
        path: [originCoords, data.currentCoords, destinationCoords],
        geodesic: true,
        strokeColor: '#2196F3',
        strokeOpacity: 0.8,
        strokeWeight: 4
    });
    routePath.setMap(map);
    
    // Fit bounds to show all markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(originCoords);
    bounds.extend(destinationCoords);
    bounds.extend(data.currentCoords);
    map.fitBounds(bounds);
}