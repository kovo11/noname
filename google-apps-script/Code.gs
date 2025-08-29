// Google Apps Script code for receiving personal data only from your React app
// Simplified version to only capture essential personal details

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    console.log('Received data:', data);
    
    // Get or create the spreadsheet
    const spreadsheet = getOrCreateSpreadsheet();
    
    // Route to appropriate handler based on data type
    if (data.type === 'interview') {
      return handleInterviewData(spreadsheet, data);
    } else if (data.type === 'onboarding') {
      return handleOnboardingData(spreadsheet, data);
    } else {
      throw new Error('Unknown data type: ' + data.type);
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSpreadsheet() {
  const SPREADSHEET_NAME = 'Candidate Personal Details';
  
  // Try to find existing spreadsheet
  const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) {
    const file = files.next();
    return SpreadsheetApp.openById(file.getId());
  }
  
  // Create new spreadsheet if it doesn't exist
  const spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
  
  // Create and format the Interview sheet
  const interviewSheet = spreadsheet.getActiveSheet();
  interviewSheet.setName('Interview Candidates');
  setupInterviewSheet(interviewSheet);
  
  // Create and format the Onboarding sheet
  const onboardingSheet = spreadsheet.insertSheet('Onboarding Candidates');
  setupOnboardingSheet(onboardingSheet);
  
  // Create summary dashboard sheet
  const dashboardSheet = spreadsheet.insertSheet('Dashboard');
  setupDashboardSheet(dashboardSheet);
  
  return spreadsheet;
}

function setupInterviewSheet(sheet) {
  // Simplified headers - only personal details
  const headers = [
    'Interview ID', 
    'Submission Date', 
    'Full Name', 
    'Email', 
    'Position Applied',
    'Status',
    'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285F4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // Interview ID
  sheet.setColumnWidth(2, 150); // Date
  sheet.setColumnWidth(3, 200); // Name
  sheet.setColumnWidth(4, 250); // Email
  sheet.setColumnWidth(5, 150); // Position
  sheet.setColumnWidth(6, 120); // Status
  sheet.setColumnWidth(7, 200); // Notes
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

function setupOnboardingSheet(sheet) {
  // Simplified headers - only personal details
  const headers = [
    'Username', 
    'Completion Date', 
    'First Name', 
    'Last Name', 
    'Email', 
    'Address',
    'Status',
    'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#34A853');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // Username
  sheet.setColumnWidth(2, 150); // Date
  sheet.setColumnWidth(3, 150); // First Name
  sheet.setColumnWidth(4, 150); // Last Name
  sheet.setColumnWidth(5, 250); // Email
  sheet.setColumnWidth(6, 300); // Address
  sheet.setColumnWidth(7, 120); // Status
  sheet.setColumnWidth(8, 200); // Notes
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

function setupDashboardSheet(sheet) {
  // Dashboard title
  sheet.getRange('A1').setValue('📊 Candidate Personal Details Dashboard');
  sheet.getRange('A1').setFontSize(18);
  sheet.getRange('A1').setFontWeight('bold');
  
  // Summary sections
  sheet.getRange('A3').setValue('📋 Summary Statistics');
  sheet.getRange('A3').setFontWeight('bold');
  sheet.getRange('A3').setBackground('#E8F0FE');
  
  sheet.getRange('A5').setValue('Total Interview Candidates:');
  sheet.getRange('B5').setFormula('=COUNTA(\'Interview Candidates\'!A:A)-1');
  
  sheet.getRange('A6').setValue('Total Onboarding Candidates:');
  sheet.getRange('B6').setFormula('=COUNTA(\'Onboarding Candidates\'!A:A)-1');
  
  sheet.getRange('A7').setValue('Pending Reviews:');
  sheet.getRange('B7').setFormula('=COUNTIF(\'Interview Candidates\'!F:F,"AWAITING_REVIEW")');
  
  sheet.getRange('A9').setValue('📈 Quick Actions');
  sheet.getRange('A9').setFontWeight('bold');
  sheet.getRange('A9').setBackground('#E8F0FE');
  
  sheet.getRange('A11').setValue('• Review interview candidates in "Interview Candidates" tab');
  sheet.getRange('A12').setValue('• Check onboarding status in "Onboarding Candidates" tab');
  sheet.getRange('A13').setValue('• Only essential personal details are captured for easier management');
}

function handleInterviewData(spreadsheet, data) {
  const sheet = spreadsheet.getSheetByName('Interview Candidates');
  
  // Extract only essential personal details
  const rowData = [
    data.interviewId || 'N/A',
    data.timestamp || new Date().toISOString(),
    data.data.fullName || 'N/A',
    data.data.email || 'N/A',
    data.data.position || 'N/A',
    data.data.status || 'AWAITING_REVIEW',
    '' // Notes (empty for HR to fill)
  ];
  
  // Add the row
  sheet.appendRow(rowData);
  
  // Get the row number that was just added
  const lastRow = sheet.getLastRow();
  
  // Format the new row
  const range = sheet.getRange(lastRow, 1, 1, rowData.length);
  
  // Alternate row colors for better readability
  if (lastRow % 2 === 0) {
    range.setBackground('#F8F9FA');
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Personal details saved successfully',
      rowNumber: lastRow
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleOnboardingData(spreadsheet, data) {
  const sheet = spreadsheet.getSheetByName('Onboarding Candidates');
  
  // Extract only essential personal details
  const rowData = [
    data.username || 'N/A',
    data.timestamp || new Date().toISOString(),
    data.data.firstName || 'N/A',
    data.data.lastName || 'N/A',
    data.data.email || 'N/A',
    data.data.address || 'N/A',
    data.data.status || 'COMPLETED',
    '' // Notes (empty for HR to fill)
  ];
  
  // Add the row
  sheet.appendRow(rowData);
  
  // Get the row number that was just added
  const lastRow = sheet.getLastRow();
  
  // Format the new row
  const range = sheet.getRange(lastRow, 1, 1, rowData.length);
  
  // Alternate row colors for better readability
  if (lastRow % 2 === 0) {
    range.setBackground('#F8F9FA');
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Personal details saved successfully',
      rowNumber: lastRow
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: Function to send email notifications (simplified)
function sendNotificationEmail(type, data) {
  const HR_EMAIL = 'hr@yourcompany.com'; // Change this to your HR email
  
  let subject, body;
  
  if (type === 'interview') {
    subject = `🎯 New Interview Candidate: ${data.data.fullName}`;
    body = `
A new candidate has completed the virtual interview:

👤 Name: ${data.data.fullName}
📧 Email: ${data.data.email}
🎯 Position: ${data.data.position}
⏰ Submitted: ${data.timestamp}
🆔 Interview ID: ${data.interviewId}

📊 View personal details in the Interview Candidates spreadsheet.
Note: Only essential personal information is captured for easier management.
    `;
  } else if (type === 'onboarding') {
    subject = `✅ Onboarding Completed: ${data.data.firstName} ${data.data.lastName}`;
    body = `
A candidate has completed their onboarding:

👤 Name: ${data.data.firstName} ${data.data.lastName}
👤 Username: ${data.username}
📧 Email: ${data.data.email}
🏠 Address: ${data.data.address}
⏰ Completed: ${data.timestamp}

📊 View personal details in the Onboarding Candidates spreadsheet.
Note: Only essential personal information is captured for easier management.
    `;
  }
  
  try {
    MailApp.sendEmail(HR_EMAIL, subject, body);
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
}

// Test function (simplified)
function testSetup() {
  const testData = {
    type: 'interview',
    interviewId: 'TEST_123',
    timestamp: new Date().toISOString(),
    data: {
      fullName: 'Test Candidate',
      email: 'test@example.com',
      position: 'Software Engineer',
      status: 'AWAITING_REVIEW'
    }
  };
  
  const spreadsheet = getOrCreateSpreadsheet();
  return handleInterviewData(spreadsheet, testData);
}
