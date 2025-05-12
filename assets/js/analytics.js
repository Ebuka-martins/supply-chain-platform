/**
 * Analytics page functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load analytics data
    loadAnalyticsData();
    
    // Initialize charts
    initCharts();
});

// Load analytics data
async function loadAnalyticsData() {
    try {
        showLoading();
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, you would fetch from an API:
        // const response = await fetch('/api/analytics');
        // const data = await response.json();
        
        // Mock data
        const data = {
            etaPredictions: {
                labels: ['Initial', 'After 6h', 'After 12h', 'After 18h', 'Current'],
                originalETA: [48, 42, 36, 30, 28],
                adjustedETA: [48, 44, 40, 35, 32]
            },
            performanceMetrics: {
                labels: ['On Time', 'Early', 'Late <1h', 'Late 1-4h', 'Late >4h'],
                data: [22, 5, 8, 10, 5]
            },
            currentRoute: {
                stops: [
                    { location: 'New York, NY', type: 'origin' },
                    { location: 'Chicago, IL', type: 'completed' },
                    { location: 'Denver, CO', type: 'current' },
                    { location: 'Los Angeles, CA', type: 'destination' }
                ],
                distance: 1450,
                time: '2 days 8 hours',
                cost: 1250
            },
            optimizedRoute: {
                stops: [
                    { location: 'New York, NY', type: 'origin' },
                    { location: 'St. Louis, MO', type: 'alternative' },
                    { location: 'Flagstaff, AZ', type: 'alternative' },
                    { location: 'Los Angeles, CA', type: 'destination' }
                ],
                distance: 1380,
                time: '2 days 2 hours',
                cost: 1180
            },
            riskAnalysis: {
                weather: 35,
                traffic: 60,
                delay: 75
            }
        };
        
        // Update UI with data
        updateAnalyticsUI(data);
    } catch (error) {
        console.error('Error loading analytics data:', error);
        showError('Failed to load analytics data. Please try again.');
    } finally {
        hideLoading();
    }
}

// Initialize charts
function initCharts() {
    // These will be updated when data loads
    window.etaChart = null;
    window.performanceChart = null;
}

// Update the analytics UI with data
function updateAnalyticsUI(data) {
    // Update ETA chart
    updateETAChart(data.etaPredictions);
    
    // Update performance chart
    updatePerformanceChart(data.performanceMetrics);
    
    // Update route information
    updateRouteInfo('currentRoute', data.currentRoute);
    updateRouteInfo('optimizedRoute', data.optimizedRoute);
    
    // Update risk analysis
    updateRiskAnalysis(data.riskAnalysis);
}

// Update ETA chart
function updateETAChart(data) {
    const ctx = document.getElementById('etaChart').getContext('2d');
    
    if (window.etaChart) {
        window.etaChart.destroy();
    }
    
    window.etaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Original ETA',
                data: data.originalETA,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1
            }, {
                label: 'Adjusted ETA',
                data: data.adjustedETA,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'ETA Changes Over Time (hours)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update performance chart
function updatePerformanceChart(data) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    if (window.performanceChart) {
        window.performanceChart.destroy();
    }
    
    window.performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Shipment Count',
                data: data.data,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Delivery Performance'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update route information
function updateRouteInfo(prefix, data) {
    const stopsList = document.getElementById(`${prefix}Stops`);
    stopsList.innerHTML = '';
    
    data.stops.forEach(stop => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between';
        
        let badge;
        switch(stop.type) {
            case 'origin':
                badge = '<span class="badge bg-primary">Origin</span>';
                break;
            case 'destination':
                badge = '<span class="badge bg-success">Destination</span>';
                break;
            case 'current':
                badge = '<span class="badge bg-warning">Current</span>';
                break;
            case 'completed':
                badge = '<span class="text-muted">Completed</span>';
                break;
            case 'alternative':
                badge = '<span class="text-muted">Alternative</span>';
                break;
        }
        
        li.innerHTML = `
            <span>${stop.location}</span>
            ${badge}
        `;
        
        stopsList.appendChild(li);
    });
    
    document.getElementById(`${prefix}Distance`).textContent = `${data.distance} miles`;
    document.getElementById(`${prefix}Time`).textContent = data.time;
    document.getElementById(`${prefix}Cost`).textContent = `$${data.cost}`;
    
    if (prefix === 'optimizedRoute') {
        const distanceDiff = data.distance - window.currentRouteData.distance;
        const timeDiff = '6 hours'; // This would be calculated in a real app
        const costDiff = data.cost - window.currentRouteData.cost;
        
        document.getElementById('distanceDiff').textContent = `(${distanceDiff} miles)`;
        document.getElementById('distanceDiff').className = distanceDiff < 0 ? 'text-success' : 'text-danger';
        
        document.getElementById('timeDiff').textContent = `(${timeDiff})`;
        document.getElementById('timeDiff').className = timeDiff.includes('-') ? 'text-success' : 'text-danger';
        
        document.getElementById('costDiff').textContent = `($${costDiff})`;
        document.getElementById('costDiff').className = costDiff < 0 ? 'text-success' : 'text-danger';
    } else {
        window.currentRouteData = data;
    }
}

// Update risk analysis
function updateRiskAnalysis(data) {
    document.getElementById('weatherRiskProgress').style.width = `${data.weather}%`;
    document.getElementById('trafficRiskProgress').style.width = `${data.traffic}%`;
    document.getElementById('delayRiskProgress').style.width = `${data.delay}%`;
    
    document.getElementById('weatherRiskValue').textContent = `${data.weather}%`;
    document.getElementById('trafficRiskValue').textContent = `${data.traffic}%`;
    document.getElementById('delayRiskValue').textContent = `${data.delay}%`;
}