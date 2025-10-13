# 🚀 Qalam Surveys Auto-Filler

> **Because life's too short for repetitive surveys** ✨

Your friendly neighborhood Chrome extension that makes NUST Qalam course feedback surveys... actually bearable. No cap! 🎯

---

## 🤔 What Even Is This?

You know that moment when you have like 10+ surveys to fill at the end of the semester? Yeah, we've all been there. This extension is basically your survey-filling bestie that does all the clicking for you while you binge your favorite show. 🍿

### The Vibe ✨

- **Zero Effort Required** - Just toggle it on and watch the magic happen
- **Fully Customizable** - Because you're unique and so are your responses
- **Randomization Options** - Keep it natural, keep it real
- **Clean AF Interface** - Dark mode by default (obviously)

---

## 🎨 Features That Hit Different

### 🎛️ **One-Click Toggle**
Turn it on when you need it, off when you don't. Simple as that.

### 🎲 **Smart Randomization**
- **Rating Randomizer**: Pick a range (like 3-5) and it'll randomly select within that for each question
- **Comment Shuffler**: Drop multiple comments separated by commas, and it picks one randomly for each survey
- Makes your responses look more natural and less... robotic 🤖❌

### ⚙️ **Custom Everything**
Choose your rating strategy:
- First option (highest rating) - The enthusiast route 🌟
- Last option (lowest rating) - When you're not feeling it 💀
- Middle option - Playing it safe 😌
- Or just randomize it - Chaos mode activated 🎲

### 💬 **Your Comments, Your Rules**
Type whatever comment you want. Single comment? Cool. Multiple options separated by commas? Even cooler. The extension's got your back.

---

## 🎯 How To Use This Thing

### Installation (Literally 3 Steps)

#### 🚀 Quick Install (Recommended)

1. **Download the Extension**
   - Click the green "Code" button on GitHub
   - Select "Download ZIP"
   - Extract the ZIP file somewhere you can find it

2. **Open Chrome Extensions**
   - Open Chrome/Edge browser
   - Go to `chrome://extensions/`
   - Turn on "Developer mode" (toggle switch in top right)

3. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to the extracted folder
   - **Select the `build` folder** (this is important!)
   - Click "Select Folder"

That's it! The extension icon should appear in your toolbar. 🎉

---

### 🛠️ For Developers (Want to modify the code?)

If you want to make changes to the extension:

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd qalam-surveys
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Make your changes** to the source code

4. **Build it**
   ```bash
   npm run build
   ```

5. **Reload the extension** in Chrome
   - Go to `chrome://extensions/`
   - Click the refresh icon on the Qalam Surveys extension

---

---

## 💡 Quick Start Guide

### Step 1: Configure Your Preferences
Click the extension icon and set up your vibe:

**Rating Options:**
- Pick your preferred rating strategy
- Or select "Randomize" and set a range (e.g., options 3-5)

**Comments:**
- Type your comment(s)
- Toggle on randomization if you want variety
- Use commas to separate multiple options: `Good, Great, Excellent`

### Step 2: Activate
Toggle the switch to **ON** (it'll turn green ✅)

### Step 3: Let It Cook
Navigate to your Qalam feedback page and watch it work its magic. The extension will:
- 🔍 Find all unsubmitted surveys
- 📝 Fill them according to your preferences
- ✅ Submit them automatically
- 🔄 Move to the next one

You can literally go make coffee and come back to finished surveys. ☕

---

## 🎨 Screenshots

### Main Interface
![Extension UI](https://via.placeholder.com/400x500?text=Clean+Dark+UI+With+Toggle)

*Simple, clean, and actually good-looking* ✨

### Configuration Panel
![Config Panel](https://via.placeholder.com/400x400?text=Customization+Options)

*All the options you need, none of the clutter* 🎯

---

## ⚡ Pro Tips

1. **Randomization is Your Friend** - Makes your responses look more human and less like a bot went ham
2. **Multiple Comments Work Best** - Try: `Good, Great, Excellent, Well-structured, Informative`
3. **Test Your Settings** - Maybe try on one survey first to see if you like the results
4. **Keep It Real** - Don't use randomization if you actually want to give specific feedback on a specific course

---

## 🛡️ Is This Safe?

- ✅ **No data leaves your browser** - Everything happens locally
- ✅ **No sketchy permissions** - Only accesses Qalam pages
- ✅ **Open source** - You can literally see all the code
- ✅ **No tracking** - We don't know (or care) what you're doing

---

## 🤝 Built With

- **React** - For that smooth UI
- **TypeScript** - Because we're not savages
- **Chrome Extension API** - The foundation
- **Vite** - Lightning fast builds ⚡
- **Raleway Font** - Making it look pretty
- **Love & Procrastination** - The true MVPs 💜

---

## ⚠️ Disclaimer

This extension is a tool to help with repetitive tasks. Use it responsibly:
- ✅ Great for courses where you genuinely have positive feedback
- ✅ Perfect when you have 10+ surveys and they're all similar
- ❌ Maybe not ideal if you actually want to provide specific detailed feedback
- ❌ Don't blame us if your professor asks why all your comments say "sheesh" 💀

**Remember:** The extension works FOR you, not FOR the university. Use it wisely.

---

## 🐛 Something's Broken?

**Extension won't load:**
- Make sure you selected the `build` folder, not the root folder
- Check that "Developer mode" is enabled in Chrome
- Try restarting Chrome

**Extension loads but doesn't work:**
1. Check if the toggle is actually ON (green = yes, gray = no)
2. Make sure you're on the right Qalam page (`qalam.nust.edu.pk/student/qa/feedback`)
3. Try reloading the extension in `chrome://extensions/`
4. Check the browser console (F12) for error messages
5. Still broken? Open an issue on GitHub

---

## 💭 FAQ

**Q: Do I need to install Node.js or any technical stuff?**  
A: Nope! Just download the repo and load the `build` folder into Chrome. That's it. No coding required.

**Q: I don't see the build folder?**  
A: Make sure you downloaded the whole repo. The build folder should be right there with all the ready-to-use extension files.

**Q: Will I get caught using this?**  
A: It just fills forms like a human would. It's not hacking anything, just automating clicks.

**Q: Can I use this for other websites?**  
A: Nah, it's specifically built for Qalam NUST. But the code is open source if you want to modify it!

**Q: Does this work on mobile?**  
A: Chrome extensions are desktop only, fam.

**Q: What if I want to give actual detailed feedback?**  
A: Then... just fill it manually? This tool isn't forcing you to use it 😅

**Q: Why did you make this?**  
A: Because we had 15 surveys to fill and honestly? Ain't nobody got time for that.

**Q: The extension isn't showing up after I loaded it?**  
A: Make sure you selected the `build` folder specifically, not the main project folder. Chrome needs the build folder!

---

## 🎉 Final Thoughts

If this extension saved you even 10 minutes, we did our job. Now go touch some grass or something. 🌱

Made with 💜 by students who were tired of clicking the same buttons 47 times.

**Star this repo if it helped you!** ⭐ It costs nothing but means everything.

---

## 📜 License

Do whatever you want with this code. Just don't sell it or claim you made it. That's not cool.

---

<div align="center">

### 🔥 Save Time. Stay Sane. Submit Surveys. 🔥

**[Install Now](#installation-super-easy-i-promise)** • **[Report Bug](issues)** • **[Star on GitHub](.)** ⭐

</div>

---

<sub>This extension is not affiliated with or endorsed by NUST or Qalam. It's just a helpful tool made by students for students. Peace out! ✌️</sub>
