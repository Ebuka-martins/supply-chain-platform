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
                name: 'Martins Ebuka',
                email: 'martin4best@gmail.com',
                phone: '+353 899 728 953',
                company: 'Phantom Supply Chain'
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
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger';
        alertDiv.textContent = 'Failed to load settings. Please try again.';
        document.querySelector('.container').prepend(alertDiv);
    } finally {
        hideLoading();
    }
}

// Update the settings UI with data
function updateSettingsUI(settings) {
    if (!settings) return;
    
    // User info
    const userName = document.getElementById('userName');
    if (userName && settings.user) {
        userName.value = settings.user.name || '';
    }
    const userEmail = document.getElementById('userEmail');
    if (userEmail && settings.user) {
        userEmail.value = settings.user.email || '';
    }
    const userPhone = document.getElementById('userPhone');
    if (userPhone && settings.user) {
        userPhone.value = settings.user.phone || '';
    }
    const userCompany = document.getElementById('userCompany');
    if (userCompany && settings.user) {
        userCompany.value = settings.user.company || '';
    }
    
    // Preferences
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect && settings.preferences) {
        themeSelect.value = settings.preferences.theme || 'light';
    }
    const timezoneSelect = document.getElementById('timezoneSelect');
    if (timezoneSelect && settings.preferences) {
        timezoneSelect.value = settings.preferences.timezone || 'America/New_York';
    }
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect && settings.preferences) {
        languageSelect.value = settings.preferences.language || 'en-US';
    }
    
    // Notifications
    const emailNotifications = document.getElementById('emailNotifications');
    if (emailNotifications && settings.notifications) {
        emailNotifications.checked = !!settings.notifications.email;
    }
    const smsNotifications = document.getElementById('smsNotifications');
    if (smsNotifications && settings.notifications) {
        smsNotifications.checked = !!settings.notifications.sms;
    }
    const pushNotifications = document.getElementById('pushNotifications');
    if (pushNotifications && settings.notifications) {
        pushNotifications.checked = !!settings.notifications.push;
    }
    const delayAlerts = document.getElementById('delayAlerts');
    if (delayAlerts && settings.notifications) {
        delayAlerts.checked = !!settings.notifications.delayAlerts;
    }
    const routeChanges = document.getElementById('routeChanges');
    if (routeChanges && settings.notifications) {
        routeChanges.checked = !!settings.notifications.routeChanges;
    }
    const deliveryUpdates = document.getElementById('deliveryUpdates');
    if (deliveryUpdates && settings.notifications) {
        deliveryUpdates.checked = !!settings.notifications.deliveryUpdates;
    }
    const weeklyReports = document.getElementById('weeklyReports');
    if (weeklyReports && settings.notifications) {
        weeklyReports.checked = !!settings.notifications.weeklyReports;
    }
    
    // Integrations
    const erpSystem = document.getElementById('erpSystem');
    if (erpSystem && settings.integrations) {
        erpSystem.value = settings.integrations.erp || 'SAP';
    }
    const wmsSystem = document.getElementById('wmsSystem');
    if (wmsSystem && settings.integrations) {
        wmsSystem.value = settings.integrations.wms || 'Manhattan';
    }
    const tmsSystem = document.getElementById('tmsSystem');
    if (tmsSystem && settings.integrations) {
        tmsSystem.value = settings.integrations.tms || 'MercuryGate';
    }
    const apiKey = document.getElementById('apiKey');
    if (apiKey && settings.integrations) {
        apiKey.value = settings.integrations.apiKey || '';
    }
    
    // Security
    const enable2FA = document.getElementById('enable2FA');
    if (enable2FA && settings.security) {
        enable2FA.checked = !!settings.security.enable2FA;
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
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.remove('d-none');
    }
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.add('d-none');
    }
}