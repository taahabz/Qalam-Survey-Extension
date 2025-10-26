// Background script for the extension
// Manages extension state and initialization

console.log('🟢 Qalam Surveys Background Script Loaded');

// Initialize storage with default values
chrome.runtime.onInstalled.addListener(async (details) => {
    console.log('📦 Extension installed/updated', details);
    
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

    // If this is a fresh install, open the post-install page once
    try {
        if (details && details.reason === 'install') {
            console.log('🔔 Opening post-install page');
            await chrome.tabs.create({ url: chrome.runtime.getURL('post-install.html') });
            await chrome.storage.local.set({ postInstallShown: true });
        }
    } catch (err) {
        console.error('Failed to open post-install page:', err);
    }
});

// On startup, if the post-install page hasn't been shown yet, open it once.
chrome.runtime.onStartup.addListener(async () => {
    try {
        const res = await chrome.storage.local.get(['postInstallShown']);
        if (!res.postInstallShown) {
            console.log('🔔 Opening post-install page on startup');
            await chrome.tabs.create({ url: chrome.runtime.getURL('post-install.html') });
            await chrome.storage.local.set({ postInstallShown: true });
        }
    } catch (err) {
        console.error('Failed to check/open post-install page on startup:', err);
    }
});

// Helper function to inject content scripts into existing tabs
async function injectContentScripts() {
    try {
        // Get all tabs matching our target URLs
        const tabs = await chrome.tabs.query({
            url: [
                'https://qalam.nust.edu.pk/student/qa/feedback*',
                'https://qalam.nust.edu.pk/survey/*'
            ]
        });
        
        for (const tab of tabs) {
            if (!tab.id) continue;
            
            try {
                // Inject the appropriate content script based on URL
                if (tab.url?.includes('/student/qa/feedback')) {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content-script-feedback.js']
                    });
                    console.log(`✅ Injected feedback script into tab ${tab.id}`);
                } else if (tab.url?.includes('/survey/')) {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content-script-survey.js']
                    });
                    console.log(`✅ Injected survey script into tab ${tab.id}`);
                }
            } catch (err) {
                console.log(`⚠️ Could not inject into tab ${tab.id}:`, err);
            }
        }
    } catch (err) {
        console.error('Failed to inject content scripts:', err);
    }
}

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
        chrome.storage.local.set({ autoFillEnabled: message.enabled }, async () => {
            console.log(`🔄 Auto-fill ${message.enabled ? 'enabled' : 'disabled'}`);
            
            // If enabling, inject content scripts into existing tabs
            if (message.enabled) {
                console.log('🔧 Injecting content scripts into existing tabs...');
                await injectContentScripts();
            }
            
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

