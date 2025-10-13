// Content script for the feedback page
// Detects unsubmitted surveys and queues them

(function () {
    'use strict';

    console.log('🟢 Qalam Feedback Page Script Loaded');

    async function processQueuedSurveys() {
        // Check if auto-fill is enabled
        const result = await chrome.storage.local.get(['autoFillEnabled']);
        if (!result.autoFillEnabled) {
            console.log('⏸️ Auto-fill is disabled. Skipping survey detection.');
            return;
        }

        const base = "https://qalam.nust.edu.pk";

        const surveyLinks = Array.from(document.querySelectorAll("ul.classCards")).filter(ul => {
            const items = Array.from(ul.querySelectorAll("li .md-list-content .md-list-heading"));
            const statusItem = items.find(el => el.nextElementSibling && el.nextElementSibling.textContent.trim().toLowerCase() === "status");

            const status = statusItem ? statusItem.textContent.trim().toLowerCase() : "";

            console.log(`🔎 Extracted status: "${status}"`);

            const include = status === "not submitted" || status === "";

            console.log(`👉 include: ${include}, status: "${status}"`);

            return include;
        }).map(ul => {
            const aTag = ul.querySelector("a[href*='/survey/']");
            return aTag ? base + aTag.getAttribute("href") : null;
        }).filter(link => link) as string[];

        console.log("📝 Found", surveyLinks.length, "uncompleted surveys to attempt.");

        if (surveyLinks.length > 0) {
            // Store in chrome.storage instead of localStorage
            await chrome.storage.local.set({ survey_queue: surveyLinks });
            
            // Navigate to first survey
            window.location.href = surveyLinks[0];
        } else {
            console.log("✅ No uncompleted surveys found.");
            // Clear the queue
            await chrome.storage.local.remove('survey_queue');
        }
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(processQueuedSurveys, 1000);
        });
    } else {
        setTimeout(processQueuedSurveys, 1000);
    }
})();

