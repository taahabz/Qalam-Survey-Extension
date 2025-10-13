// Content script for survey pages
// Auto-fills survey forms with the first option, adds "Good" comment, and submits

(function () {
    'use strict';

    console.log("🟢 Qalam Survey Auto-Fill Script STARTED");

    // Helper function to simulate a delay
    function wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Main async function
    async function autoFillSurvey() {
        // Check if auto-fill is enabled
        const result = await chrome.storage.local.get(['autoFillEnabled']);
        if (!result.autoFillEnabled) {
            console.log('⏸️ Auto-fill is disabled. Skipping survey auto-fill.');
            return;
        }

        console.log("⏳ Waiting for page to fully load...");

        await wait(1000); // Give DOM a moment to settle

        const currentURL = window.location.href;
        console.log("🌐 Current URL:", currentURL);

        // Exit if already submitted or on a thank you page
        if (currentURL.includes("thankyou") || currentURL.includes("submitted")) {
            console.log("✅ Already on a thank you/submitted page. Processing next survey...");
            await processNextSurvey();
            return;
        }

        // Try to click the "Start Survey" button (it can be found dynamically)
        const startBtn = document.querySelector('button.o_survey_start_button, button.btn-primary') as HTMLButtonElement;
        if (startBtn && startBtn.innerText.toLowerCase().includes("start")) {
            console.log("🟩 Found Start Survey button. Clicking it...");
            startBtn.click();

            // Wait for the page to reload and display questions
            console.log("⏳ Waiting for questions to load...");
            await wait(3000); // Increased waiting time to ensure page reload
        } else {
            console.log("⚠️ No Start button found or already clicked.");
        }

        // Get configuration from storage
        const config = await chrome.storage.local.get([
            'ratingOption', 
            'commentText', 
            'randomizeRating',
            'ratingMin',
            'ratingMax',
            'randomizeComment'
        ]);
        const ratingOption = config.ratingOption || 'first';
        const commentText = config.commentText || 'Good';
        const randomizeRating = config.randomizeRating || false;
        const ratingMin = config.ratingMin || 1;
        const ratingMax = config.ratingMax || 5;
        const randomizeComment = config.randomizeComment || false;

        console.log(`⚙️ Using configuration - Rating: ${ratingOption}, Comment: "${commentText}", Randomize: ${randomizeRating}, Range: ${ratingMin}-${ratingMax}`);

        // Now check for the presence of survey questions (radio buttons)
        const rows = document.querySelectorAll('tr.bg-white');
        console.log(`📋 Found ${rows.length} matrix rows`);

        if (rows.length === 0) {
            console.warn("❌ No matrix rows found! Are you sure questions have loaded?");
        }

        for (const [index, row] of Array.from(rows).entries()) {
            const radios = row.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
            if (radios.length > 0) {
                let selectedIndex = 0;
                
                // Determine which radio button to select based on configuration
                if (ratingOption === 'randomize' && randomizeRating) {
                    // Randomize between min and max (convert to 0-based index)
                    const minIndex = Math.max(0, Math.min(ratingMin - 1, radios.length - 1));
                    const maxIndex = Math.max(0, Math.min(ratingMax - 1, radios.length - 1));
                    const range = Math.abs(maxIndex - minIndex) + 1;
                    selectedIndex = Math.min(minIndex, maxIndex) + Math.floor(Math.random() * range);
                    console.log(`🎲 Randomizing: selected ${selectedIndex + 1} from range ${minIndex + 1}-${maxIndex + 1}`);
                } else {
                    switch (ratingOption) {
                        case 'first':
                            selectedIndex = 0;
                            break;
                        case 'last':
                            selectedIndex = radios.length - 1;
                            break;
                        case 'middle':
                            selectedIndex = Math.floor(radios.length / 2);
                            break;
                        case 'second':
                            selectedIndex = Math.min(1, radios.length - 1);
                            break;
                        case 'second-last':
                            selectedIndex = Math.max(0, radios.length - 2);
                            break;
                        default:
                            selectedIndex = 0;
                    }
                }
                
                radios[selectedIndex].checked = true;
                radios[selectedIndex].dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`✅ Selected option ${selectedIndex + 1}/${radios.length} (${ratingOption}) for row ${index + 1}`);
            } else {
                console.warn(`⚠️ No radio buttons found in row ${index + 1}`);
            }
        }

        // Fill the comment field with configured text
        const commentField = document.querySelector('textarea.form-control.o_survey_question_text_box') as HTMLTextAreaElement;
        if (commentField) {
            let finalComment = commentText;
            
            if (randomizeComment && commentText.includes(',')) {
                // Split by comma, trim whitespace, and pick random
                const comments = commentText.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0);
                if (comments.length > 0) {
                    finalComment = comments[Math.floor(Math.random() * comments.length)];
                    console.log(`🎲 Randomly selected comment: "${finalComment}" from ${comments.length} options`);
                }
            }
            
            console.log(`📝 Comment field found. Filling in "${finalComment}"...`);
            commentField.value = finalComment;
            commentField.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event for dynamic forms
        } else {
            console.warn("⚠️ No comment field found.");
        }

        await wait(500); // Pause before submitting

        // Ensure the comment field validation is triggered (if applicable)
        const validateCommentField = document.querySelector('textarea.form-control.o_survey_question_text_box') as HTMLTextAreaElement;
        if (validateCommentField) {
            validateCommentField.dispatchEvent(new Event('blur', { bubbles: true })); // Ensure blur event is triggered to validate the field
        }

        // Try to click the Submit button (dynamically)
        const submitBtn = document.querySelector('button[type="submit"], .o_survey_submit') as HTMLButtonElement;
        if (submitBtn) {
            console.log("🟢 Found Submit button. Clicking it...");
            submitBtn.click();
        } else {
            console.log("⚠️ Submit button not found. Trying Ctrl + Enter to submit...");
            // Simulate Ctrl + Enter to submit the form
            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                ctrlKey: true,
                bubbles: true,
                cancelable: true,
            });
            document.dispatchEvent(event);
        }

        // After survey submission, navigate to the next survey or back to feedback page
        setTimeout(async () => {
            await processNextSurvey();
        }, 2000); // 2 seconds delay to ensure the submission happens first
    }

    async function processNextSurvey() {
        const result = await chrome.storage.local.get(['survey_queue']);
        const queue = result.survey_queue || [];

        if (queue.length > 0) {
            // Remove the first item (current survey) and navigate to the next
            const remainingQueue = queue.slice(1);
            await chrome.storage.local.set({ survey_queue: remainingQueue });

            if (remainingQueue.length > 0) {
                console.log(`🔄 ${remainingQueue.length} surveys remaining. Moving to next...`);
                window.location.href = remainingQueue[0];
            } else {
                console.log("🔙 All surveys completed. Navigating back to feedback page...");
                window.location.href = 'https://qalam.nust.edu.pk/student/qa/feedback';
            }
        } else {
            console.log("🔙 No more surveys in queue. Navigating back to feedback page...");
            window.location.href = 'https://qalam.nust.edu.pk/student/qa/feedback';
        }
    }

    // Catch all errors
    window.onerror = function (msg, _src, lineno, colno, _error) {
        console.error("💥 ERROR:", msg, "at", lineno + ":" + colno);
    };

    // Start the process after a slight delay
    setTimeout(autoFillSurvey, 1000);
})();

