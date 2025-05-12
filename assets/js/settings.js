/**
 * Settings page functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load user settings
    loadUserSettings();
    
    // Set up form submissions
    document.getElementById('profileForm').addEventListener('submit', saveProfileSettings);
    document.getElementById('preferencesForm').addEventListener('submit', savePreferences);
    document.getElementById('notificationsForm').addEventListener('submit', saveNotificationSettings);
    document.getElementById('integrationsForm').addEventListener('submit', saveIntegrationSettings);
    document.getElementById('securityForm').addEventListener('submit', saveSecuritySettings);
    
    // Set up API key visibility toggle
    document.getElementById('showApiKey').addEventListener('click', toggleApiKeyVisibility);
});

// Load user settings
async function loadUserSettings() {
    try {
        showLoading();
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - in a real app, you would fetch from an API
        const data = {
            user: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                company: 'ACME Corp'
            },
            preferences: {
                theme: 'light',
                timezone: 'America/New_York',
                language: 'en-US'
            },
            notifications: {
                email: true,
                sms: false,
                push: true,
                delayAlerts: true,
                routeChanges: true,
                deliveryUpdates: false,
                weeklyReports: true
            },
            integrations: {
                erp: 'SAP',
                wms: 'Manhattan',
                tms: 'MercuryGate',
                apiKey: 'sk_test_51MZ...' // Truncated for security
            },
            security: {
                enable2FA: false
            }
        };
        
        // Update UI with data
        updateSettingsUI(data);
    } catch (error) {
        console.error('Error loading settings:', error);
        showToast('Failed to load settings. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Update the settings UI with data
function updateSettingsUI(settings) {
    if (!settings) return;
    
    // User info
    if (settings.user) {
        document.getElementById('userName').value = settings.user.name || '';
        document.getElementById('userEmail').value = settings.user.email || '';
        document.getElementById('userPhone').value = settings.user.phone || '';
        document.getElementById('userCompany').value = settings.user.company || '';
    }
    
    // Preferences
    if (settings.preferences) {
        document.getElementById('themeSelect').value = settings.preferences.theme || 'light';
        document.getElementById('timezoneSelect').value = settings.preferences.timezone || 'America/New_York';
        document.getElementById('languageSelect').value = settings.preferences.language || 'en-US';
    }
    
    // Notifications
    if (settings.notifications) {
        document.getElementById('emailNotifications').checked = !!settings.notifications.email;
        document.getElementById('smsNotifications').checked = !!settings.notifications.sms;
        document.getElementById('pushNotifications').checked = !!settings.notifications.push;
        document.getElementById('delayAlerts').checked = !!settings.notifications.delayAlerts;
        document.getElementById('routeChanges').checked = !!settings.notifications.routeChanges;
        document.getElementById('deliveryUpdates').checked = !!settings.notifications.deliveryUpdates;
        document.getElementById('weeklyReports').checked = !!settings.notifications.weeklyReports;
    }
    
    // Integrations
    if (settings.integrations) {
        document.getElementById('erpSystem').value = settings.integrations.erp || 'SAP';
        document.getElementById('wmsSystem').value = settings.integrations.wms || 'Manhattan';
        document.getElementById('tmsSystem').value = settings.integrations.tms || 'MercuryGate';
        document.getElementById('apiKey').value = settings.integrations.apiKey || '';
    }
    
    // Security
    if (settings.security) {
        document.getElementById('enable2FA').checked = !!settings.security.enable2FA;
    }
}

// Save profile settings
async function saveProfileSettings(e) {
    e.preventDefault();
    
    try {
        showLoading();
        
        const profileData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            company: document.getElementById('userCompany').value
        };
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        showToast('Profile settings saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving profile:', error);
        showToast('Failed to save profile settings', 'error');
    } finally {
        hideLoading();
    }
}

// Save preferences
async function savePreferences(e) {
    e.preventDefault();
    
    try {
        showLoading();
        
        const preferences = {
            theme: document.getElementById('themeSelect').value,
            timezone: document.getElementById('timezoneSelect').value,
            language: document.getElementById('languageSelect').value
        };
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Apply theme immediately (in a real app)
        applyTheme(preferences.theme);
        
        showToast('Preferences saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving preferences:', error);
        showToast('Failed to save preferences', 'error');
    } finally {
        hideLoading();
    }
}

// Save notification settings
async function saveNotificationSettings(e) {
    e.preventDefault();
    
    try {
        showLoading();
        
        const notifications = {
            email: document.getElementById('emailNotifications').checked,
            sms: document.getElementById('smsNotifications').checked,
            push: document.getElementById('pushNotifications').checked,
            delayAlerts: document.getElementById('delayAlerts').checked,
            routeChanges: document.getElementById('routeChanges').checked,
            deliveryUpdates: document.getElementById('deliveryUpdates').checked,
            weeklyReports: document.getElementById('weeklyReports').checked
        };
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        showToast('Notification settings saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving notifications:', error);
        showToast('Failed to save notification settings', 'error');
    } finally {
        hideLoading();
    }
}

// Save integration settings
async function saveIntegrationSettings(e) {
    e.preventDefault();
    
    try {
        showLoading();
        
        const integrations = {
            erp: document.getElementById('erpSystem').value,
            wms: document.getElementById('wmsSystem').value,
            tms: document.getElementById('tmsSystem').value,
            apiKey: document.getElementById('apiKey').value
        };
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        showToast('Integration settings saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving integrations:', error);
        showToast('Failed to save integration settings', 'error');
    } finally {
        hideLoading();
    }
}

// Save security settings
async function saveSecuritySettings(e) {
    e.preventDefault();
    
    try {
        showLoading();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        if (newPassword.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }
        
        const security = {
            currentPassword,
            newPassword,
            enable2FA: document.getElementById('enable2FA').checked
        };
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        showToast('Security settings updated successfully!', 'success');
    } catch (error) {
        console.error('Error saving security settings:', error);
        showToast(error.message || 'Failed to update security settings', 'error');
    } finally {
        hideLoading();
    }
}

// Toggle API key visibility
function toggleApiKeyVisibility() {
    const apiKeyInput = document.getElementById('apiKey');
    const showButton = document.getElementById('showApiKey');
    
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        showButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        apiKeyInput.type = 'password';
        showButton.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Apply theme (example function)
function applyTheme(theme) {
    document.body.setAttribute('data-bs-theme', theme);
    console.log(`Theme changed to ${theme}`);
}

// Show toast notification
function showToast(message, type = 'info') {
    // In a real app, you would use a proper toast library
    console.log(`${type.toUpperCase()}: ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
}

// Helper functions from common.js
function showLoading() {
    // Implement or import from common.js
    console.log('Loading...');
}

function hideLoading() {
    // Implement or import from common.js
    console.log('Loading complete');
}