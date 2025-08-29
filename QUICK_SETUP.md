# 🚀 Quick Start: Google Sheets Integration

## Step 1: Set Up Google Apps Script (5 minutes)

1. **Go to Google Apps Script**: Visit [script.google.com](https://script.google.com)
2. **Create New Project**: Click "New Project"
3. **Copy the Code**: Replace the default code with everything from `google-apps-script/Code.gs`
4. **Save**: Give it a name like "Candidate Data Handler"

## Step 2: Deploy as Web App (2 minutes)

1. **Deploy**: Click "Deploy" → "New Deployment"
2. **Type**: Select "Web app"
3. **Settings**: 
   - Execute as: "Me"
   - Who has access: "Anyone"
4. **Deploy**: Click "Deploy" and authorize if needed
5. **Copy URL**: Copy the Web App URL (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

## Step 3: Update Your App (1 minute)

1. Open `src/services/DataService.ts`
2. Find line 14: `this.googleSheetsUrl = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';`
3. Replace `YOUR_DEPLOYMENT_ID` with your actual deployment ID from the URL you copied

**Example:**
```typescript
// Before
this.googleSheetsUrl = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

// After (use your actual ID)
this.googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbzXyZ123abc456def789ghi/exec';
```

## Step 4: Test (2 minutes)

1. **Start your app**: `npm start`
2. **Complete an interview or onboarding**
3. **Check Google Drive**: Look for "Candidate Data - Interview & Onboarding" spreadsheet
4. **Verify data**: Your submission should appear in the spreadsheet

## 🎉 You're Done!

Your interview and onboarding data will now automatically save to Google Sheets with:
- ✅ Organized tabs for interviews and onboarding
- ✅ Clickable video links
- ✅ HR review columns
- ✅ Dashboard with statistics
- ✅ Automatic backup if internet fails

## 💡 Pro Tip

The system automatically creates local backups if Google Sheets is unreachable, then syncs when the connection is restored. Check the browser console for sync status.

---

**Need help?** Check `GOOGLE_SHEETS_SETUP.md` for detailed troubleshooting and alternative setups.
