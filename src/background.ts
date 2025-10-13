// Background script for the extension
// Manages extension state and initialization

console.log('🟢 Qalam Surveys Background Script Loaded');

// Initialize storage with default values
chrome.runtime.onInstalled.addListener(async () => {
    console.log('📦 Extension installed/updated');
    
    // Set default values
    const result = await chrome.storage.local.get([
        'autoFillEnabled', 
        'ratingOption', 
        'commentText',
        'randomizeRating',
        'ratingMin',
        'ratingMax',
        'randomizeComment'
    ]);
    
    const defaults: { [key: string]: any } = {};
    
    if (result.autoFillEnabled === undefined) {
        defaults.autoFillEnabled = false;
    }
    if (result.ratingOption === undefined) {
        defaults.ratingOption = 'first';
    }
    if (result.commentText === undefined) {
        defaults.commentText = 'Good';
    }
    if (result.randomizeRating === undefined) {
        defaults.randomizeRating = false;
    }
    if (result.ratingMin === undefined) {
        defaults.ratingMin = 1;
    }
    if (result.ratingMax === undefined) {
        defaults.ratingMax = 5;
    }
    if (result.randomizeComment === undefined) {
        defaults.randomizeComment = false;
    }
    
    if (Object.keys(defaults).length > 0) {
        await chrome.storage.local.set(defaults);
        console.log('✅ Default settings initialized:', defaults);
    }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log('📨 Message received:', message);
    
    if (message.type === 'GET_STATUS') {
        chrome.storage.local.get(['autoFillEnabled', 'survey_queue'], (result) => {
            sendResponse({
                autoFillEnabled: result.autoFillEnabled || false,
                queueLength: (result.survey_queue || []).length
            });
        });
        return true; // Will respond asynchronously
    }
    
    if (message.type === 'TOGGLE_AUTOFILL') {
        chrome.storage.local.set({ autoFillEnabled: message.enabled }, () => {
            console.log(`🔄 Auto-fill ${message.enabled ? 'enabled' : 'disabled'}`);
            sendResponse({ success: true });
        });
        return true; // Will respond asynchronously
    }
    
    if (message.type === 'CLEAR_QUEUE') {
        chrome.storage.local.remove('survey_queue', () => {
            console.log('🗑️ Survey queue cleared');
            sendResponse({ success: true });
        });
        return true; // Will respond asynchronously
    }
});

export {};

