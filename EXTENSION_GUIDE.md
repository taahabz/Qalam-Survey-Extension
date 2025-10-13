# Qalam Surveys Auto-Filler Chrome Extension

A Chrome extension that automatically fills and submits NUST Qalam course feedback surveys with toggle control.

## Features

- 🔄 **Auto-Fill**: Automatically selects the first option for all survey questions
- 💬 **Auto-Comment**: Adds "Good" as the comment in text fields
- ✅ **Auto-Submit**: Submits the survey automatically
- 🎛️ **Toggle Control**: Easy on/off switch to enable/disable functionality
- 📊 **Queue Management**: Tracks pending surveys and processes them sequentially
- 🚨 **Safety First**: Disabled by default - you control when it runs

## Installation

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Build the Extension

```bash
npm run build
```

This will create a `build` folder with all the extension files.

### Step 3: Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `build` folder from this project

## How to Use

### Initial Setup

1. Click on the extension icon in your Chrome toolbar
2. You'll see the Qalam Surveys popup with a toggle switch
3. The extension is **disabled by default** for safety

### Running Auto-Fill

1. **Enable the extension**: Click the toggle switch to turn it ON (it will turn green)
2. **Navigate to Qalam**: Go to [https://qalam.nust.edu.pk/student/qa/feedback](https://qalam.nust.edu.pk/student/qa/feedback)
3. **Watch it work**: The extension will:
   - Detect all unsubmitted surveys
   - Add them to a queue
   - Navigate to each survey automatically
   - Fill all questions with the first option
   - Add "Good" as a comment
   - Submit the survey
   - Move to the next survey in queue
   - Return to the feedback page when done

### Stopping Auto-Fill

1. Click the extension icon
2. Toggle the switch to OFF (it will turn gray)
3. The extension will stop processing new surveys

### Managing the Queue

- The extension shows how many surveys are in the queue
- You can click "Clear Queue" to stop processing remaining surveys
- The queue persists even if you close the browser

## Extension Popup Interface

### Status Indicator
- **Green "Enabled"**: Auto-fill is active
- **Red "Disabled"**: Auto-fill is inactive

### Survey Queue
- Shows number of pending surveys
- "Clear Queue" button appears when surveys are queued

### Warning
- Yellow warning banner appears when auto-fill is enabled
- Reminds you that surveys will be auto-submitted

## How It Works

### Content Scripts

The extension uses two content scripts:

1. **Feedback Page Script** (`content-script-feedback.ts`)
   - Runs on: `https://qalam.nust.edu.pk/student/qa/feedback*`
   - Detects surveys with "Not Submitted" status
   - Builds a queue of survey URLs
   - Navigates to the first survey

2. **Survey Page Script** (`content-script-survey.ts`)
   - Runs on: `https://qalam.nust.edu.pk/survey/*`
   - Clicks "Start Survey" button if present
   - Fills all radio buttons with the first option
   - Adds "Good" to comment fields
   - Clicks the submit button
   - Processes the next survey in queue

### Background Script

- Manages extension state
- Handles communication between popup and content scripts
- Stores toggle state and survey queue

### Storage

The extension uses Chrome's storage API to persist:
- Auto-fill enabled/disabled state
- Survey queue

## Development

### Project Structure

```
qalam-surveys/
├── src/
│   ├── App.tsx                      # Popup UI component
│   ├── background.ts                # Background service worker
│   ├── content-script-feedback.ts   # Feedback page script
│   ├── content-script-survey.ts     # Survey page script
│   ├── main.tsx                     # React entry point
│   └── global.d.ts                  # TypeScript declarations
├── public/
│   ├── images/                      # Extension icons
│   └── manifest.json                # Extension manifest
├── build/                           # Built extension (after npm run build)
└── package.json
```

### Build Configuration

The `vite.config.ts` is configured to:
- Build the React popup UI
- Compile TypeScript content scripts
- Compile TypeScript background script
- Copy manifest and images to build folder

### Scripts

- `npm run dev` - Development mode (for popup UI only)
- `npm run build` - Build the extension
- `npm run lint` - Run ESLint

## Technical Details

### Permissions

The extension requires:
- `storage`: To persist toggle state and survey queue
- `activeTab`: To interact with Qalam pages
- Host permission for `https://qalam.nust.edu.pk/*`

### Browser Compatibility

- Chrome/Chromium (Manifest V3)
- Microsoft Edge (Chromium-based)

### Security & Privacy

- No data is sent to external servers
- All processing happens locally in your browser
- Survey queue and settings are stored locally using Chrome's storage API
- Only works on Qalam NUST website

## Troubleshooting

### Extension not working?

1. **Check if it's enabled**: Open the popup and verify the toggle is ON
2. **Check permissions**: Make sure the extension has permission for qalam.nust.edu.pk
3. **Reload the extension**: Go to chrome://extensions/ and click the reload button
4. **Check console**: Open Developer Tools (F12) and check for errors

### Surveys not being detected?

1. Make sure you're on the feedback page: `https://qalam.nust.edu.pk/student/qa/feedback`
2. Check if surveys have "Not Submitted" status
3. Enable auto-fill toggle before visiting the page

### Extension stops in the middle?

1. Check if you disabled the toggle
2. Check the queue - it might have been cleared
3. Reload the page and try again

## Safety Considerations

⚠️ **Important Notes:**

- The extension submits surveys automatically when enabled
- It fills all questions with the **first option** (typically "Strongly Agree" or highest rating)
- It adds "Good" as the comment
- **Always review** what options you're submitting if you care about the feedback
- The extension is designed for bulk submissions with similar feedback

## License

This is a personal project. Use at your own discretion.

## Disclaimer

This extension is not affiliated with or endorsed by NUST or Qalam. Use responsibly and in accordance with your institution's policies.

