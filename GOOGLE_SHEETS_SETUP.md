# 📊 Google Sheets Integration Setup Guide

This guide will help you set up automatic data saving to Google Sheets for both interview and onboarding data.

## 🚀 Step-by-Step Setup (15 minutes total)

### Step 1: Prepare the Google Apps Script Code (2 minutes)

1. **Find the code file**: In your project folder, open `google-apps-script/Code.gs`
2. **Select all the code**: Press `Ctrl+A` to select all the code in that file
3. **Copy the code**: Press `Ctrl+C` to copy it
4. **Keep this tab open** - you'll paste this code in the next step

### Step 2: Create Google Apps Script Project (3 minutes)

1. **Open Google Apps Script**: Go to [script.google.com](https://script.google.com/) in a new tab
2. **Sign in**: Use your Google account (the same one where you want the spreadsheet)
3. **Create new project**: Click the blue "New Project" button
4. **Delete default code**: Select all the default code (`function myFunction() { ... }`) and delete it
5. **Paste your code**: Press `Ctrl+V` to paste the code you copied from `Code.gs`
6. **Save the project**: Press `Ctrl+S` and name it "Candidate Data Handler"

### Step 3: Deploy as Web App (4 minutes)

1. **Start deployment**: Click "Deploy" button (top right) → "New Deployment"
2. **Choose type**: Click the gear icon ⚙️ next to "Type" and select "Web app"
3. **Fill in details**:
   - Description: "Candidate Data API"
   - Execute as: "Me (your-email@gmail.com)"
   - Who has access: "Anyone" ⚠️ **Important: Must be "Anyone"**
4. **Deploy**: Click "Deploy" button
5. **Authorize**: Click "Authorize access" and follow the prompts
6. **Copy the URL**: You'll see a URL like `https://script.google.com/macros/s/AKfycbz.../exec`
   - **Important**: Copy this ENTIRE URL and save it somewhere

### Step 4: Update Your React App (3 minutes)

1. **Open DataService file**: Go to `src/services/DataService.ts` in your project
2. **Find line 17**: Look for this line:
   ```typescript
   this.googleSheetsUrl = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```
3. **Replace the URL**: Replace the entire URL with the one you copied from Google Apps Script
   
   **Example:**
   ```typescript
   // BEFORE (what you see now):
   this.googleSheetsUrl = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   
   // AFTER (with your actual URL):
   this.googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbzXyZ123abc456def789ghi_actual_deployment_id/exec';
   ```
4. **Save the file**: Press `Ctrl+S`

### Step 5: Test the Integration (3 minutes)

1. **Start your app**: Open terminal and run `npm start`
2. **Test with interview**:
   - Go to your app (usually http://localhost:3000)
   - Click "Start Virtual Interview"
   - Fill out a test interview and submit
3. **Test with onboarding**:
   - Click "Employee Login"
   - Use credentials: `john.doe` / `password123`
   - Complete the onboarding process
4. **Check Google Drive**: 
   - Go to [drive.google.com](https://drive.google.com)
   - Look for a new spreadsheet: "Candidate Data - Interview & Onboarding"
   - Open it and verify your test data is there

## ✅ What You'll Get

### Automatic Spreadsheet Creation
When you first submit data, Google Apps Script will automatically create a spreadsheet with:

**📋 Interview Responses Tab:**
- Candidate information (name, email, phone, position)
- All technical question answers
- **Clickable video links** for easy review
- HR review columns (notes, reviewer, decision)
- Status tracking (AWAITING_REVIEW, etc.)

**👤 Onboarding Data Tab:**
- Complete personal information
- Compensation preferences
- Emergency contact details
- Legal consent and transaction IDs
- HR review columns

**📊 Dashboard Tab:**
- Real-time statistics (total interviews, pending reviews)
- Quick action items
- Summary counts and charts

### Smart Features
- **Automatic Row Colors**: Alternating colors for easy reading
- **Data Validation**: Proper formatting and organization
- **Video Integration**: Direct links to candidate video responses
- **Backup System**: If Google Sheets fails, data saves locally and retries later
- **Mobile Friendly**: Works on all devices

## 🔧 Troubleshooting

### ❌ Common Issues and Fixes

**Issue: "Access Denied" Error**
- **Fix**: Make sure "Who has access" is set to "Anyone" (not "Anyone with Google account")
- **Why**: Your React app needs to send data without authentication

**Issue: Data not appearing in spreadsheet**
- **Check 1**: Verify the URL in `DataService.ts` is exactly what Google Apps Script gave you
- **Check 2**: Look at browser console (F12) for error messages
- **Check 3**: Try the test function in Google Apps Script

**Issue: Spreadsheet not created**
- **Fix**: Submit one piece of data first - the spreadsheet creates automatically
- **Alternative**: Run the `testSetup()` function in Google Apps Script manually

**Issue: Videos not clickable**
- **Note**: Video links should auto-convert to clickable links
- **Manual Fix**: If not, check that video URLs are valid Google Drive share links

### 🔍 Testing Your Setup

**Test the Google Apps Script:**
1. In Google Apps Script, find the `testSetup()` function at the bottom
2. Click "Run" to test it
3. Check Google Drive for the test spreadsheet
4. If it works, your setup is correct

**Test the React Integration:**
1. Open browser developer tools (F12)
2. Submit test data through your app
3. Check the Console tab for success/error messages
4. Look for "✅ Data saved to Google Sheets successfully"

## 🛡️ Security & Privacy

### Data Security
- **Your Control**: Data stays in YOUR Google account
- **No Third Parties**: No external services involved
- **Standard Security**: Uses Google's enterprise-grade security
- **Access Control**: Only you can access the spreadsheet (unless you share it)

### Privacy Compliance
- **GDPR Ready**: All data stays in your Google account
- **Data Retention**: You control how long data is kept
- **Export Options**: Easy to export or delete data
- **Audit Trail**: Complete history of data submissions

## � Advanced Options

### Email Notifications (Optional)
To get notified when new data arrives:
1. In Google Apps Script, find the `sendNotificationEmail` function
2. Replace `hr@yourcompany.com` with your email
3. Uncomment the email sending lines in the data handlers
4. Redeploy the Web App

### Custom Spreadsheet Templates
To customize the spreadsheet format:
1. Modify the `setupInterviewSheet` and `setupOnboardingSheet` functions
2. Add your company branding colors
3. Include additional columns as needed
4. Redeploy to apply changes

### Multiple Environments
For development vs production:
1. Create separate Google Apps Script projects
2. Use different deployment URLs
3. Update `DataService.ts` based on environment
4. Consider using environment variables

## � Still Need Help?

### Quick Diagnostics
1. **Check the console**: Browser F12 → Console tab
2. **Verify the URL**: Make sure it ends with `/exec`
3. **Test permissions**: Try accessing the Google Apps Script URL directly in browser
4. **Check Google Drive**: Look for any new spreadsheets

### Error Messages Guide
- **"Network Error"**: Check internet connection and URL
- **"403 Forbidden"**: Check "Anyone" access setting in deployment
- **"404 Not Found"**: URL is incorrect, redeploy and get new URL
- **"500 Internal Error"**: Check Google Apps Script for errors

### Support Resources
- **Google Apps Script Docs**: [developers.google.com/apps-script](https://developers.google.com/apps-script)
- **Troubleshooting Guide**: Check browser console for specific error messages
- **Community Help**: Google Apps Script has active community forums

---

## 📱 Mobile & Browser Compatibility

**Supported Browsers:**
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

**Mobile Features:**
- Touch-friendly interface
- Video recording on mobile
- Responsive forms
- Offline backup support

---

*🎯 The system is designed to be bulletproof - if anything fails, your data is safely backed up locally and will automatically sync when the connection is restored.*
