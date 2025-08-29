// Google Apps Script code for receiving data from your React app
// You'll need to deploy this as a Web App in Google Apps Script

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
  const SPREADSHEET_NAME = 'Candidate Data - Interview & Onboarding';
  
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
  interviewSheet.setName('Interview Responses');
  setupInterviewSheet(interviewSheet);
  
  // Create and format the Onboarding sheet
  const onboardingSheet = spreadsheet.insertSheet('Onboarding Data');
  setupOnboardingSheet(onboardingSheet);
  
  // Create summary dashboard sheet
  const dashboardSheet = spreadsheet.insertSheet('Dashboard');
  setupDashboardSheet(dashboardSheet);
  
  return spreadsheet;
}

function setupInterviewSheet(sheet) {
  const headers = [
    'Interview ID', 'Submission Date', 'Status',
    'Full Name', 'Email', 'Phone', 'Position', 'Experience',
    'GitMatcher Scaling', 'Collaboration Balance', 'Infrastructure Design', 'UI Design',
    'Preferred Language', 'Work Style', 'Team Size',
    'Intro Video', 'Technical Video',
    'Notes', 'Reviewer', 'Decision'
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
  sheet.setColumnWidth(4, 200); // Name
  sheet.setColumnWidth(5, 200); // Email
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

function setupOnboardingSheet(sheet) {
  const headers = [
    'Username', 'Completion Date', 'Status',
    'First Name', 'Last Name', 'Email', 'Phone', 'Address',
    'Salary Acceptable', 'Salary Request',
    'Emergency Name', 'Emergency Relation', 'Emergency Phone', 'Emergency Email',
    'Consent Given', 'Transaction ID',
    'Notes', 'HR Review'
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
  sheet.setColumnWidth(4, 150); // First Name
  sheet.setColumnWidth(5, 150); // Last Name
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

function setupDashboardSheet(sheet) {
  // Dashboard title
  sheet.getRange('A1').setValue('📊 Candidate Data Dashboard');
  sheet.getRange('A1').setFontSize(18);
  sheet.getRange('A1').setFontWeight('bold');
  
  // Summary sections
  sheet.getRange('A3').setValue('📋 Summary Statistics');
  sheet.getRange('A3').setFontWeight('bold');
  sheet.getRange('A3').setBackground('#E8F0FE');
  
  sheet.getRange('A5').setValue('Total Interviews:');
  sheet.getRange('B5').setFormula('=COUNTA(\'Interview Responses\'!A:A)-1');
  
  sheet.getRange('A6').setValue('Total Onboardings:');
  sheet.getRange('B6').setFormula('=COUNTA(\'Onboarding Data\'!A:A)-1');
  
  sheet.getRange('A7').setValue('Pending Reviews:');
  sheet.getRange('B7').setFormula('=COUNTIF(\'Interview Responses\'!C:C,"AWAITING_REVIEW")');
  
  sheet.getRange('A9').setValue('📈 Quick Actions');
  sheet.getRange('A9').setFontWeight('bold');
  sheet.getRange('A9').setBackground('#E8F0FE');
  
  sheet.getRange('A11').setValue('• Review pending interviews in "Interview Responses" tab');
  sheet.getRange('A12').setValue('• Check onboarding completion in "Onboarding Data" tab');
  sheet.getRange('A13').setValue('• Video links are clickable for easy access');
}

function handleInterviewData(spreadsheet, data) {
  const sheet = spreadsheet.getSheetByName('Interview Responses');
  
  // Prepare row data
  const rowData = [
    data.interviewId,
    data.timestamp,
    data.data.status,
    data.data.fullName,
    data.data.email,
    data.data.phone,
    data.data.position,
    data.data.experience,
    data.data.gitMatcherScaling,
    data.data.collaborationBalance,
    data.data.infrastructureDesign,
    data.data.uiDesign,
    data.data.preferredLanguage,
    data.data.workStyle,
    data.data.teamSize,
    data.data.introVideo,
    data.data.technicalVideo,
    '', // Notes (empty for HR to fill)
    '', // Reviewer (empty for HR to fill)
    ''  // Decision (empty for HR to fill)
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
  
  // Make video links clickable
  if (data.data.introVideo) {
    sheet.getRange(lastRow, 16).setFormula(`=HYPERLINK("${data.data.introVideo}","View Video")`);
  }
  if (data.data.technicalVideo) {
    sheet.getRange(lastRow, 17).setFormula(`=HYPERLINK("${data.data.technicalVideo}","View Video")`);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Interview data saved successfully',
      rowNumber: lastRow
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleOnboardingData(spreadsheet, data) {
  const sheet = spreadsheet.getSheetByName('Onboarding Data');
  
  // Prepare row data
  const rowData = [
    data.username,
    data.timestamp,
    data.data.status,
    data.data.firstName,
    data.data.lastName,
    data.data.email,
    data.data.phone,
    data.data.address,
    data.data.salaryAcceptable ? 'YES' : 'NO',
    data.data.salaryRequest,
    data.data.emergencyName,
    data.data.emergencyRelation,
    data.data.emergencyPhone,
    data.data.emergencyEmail,
    data.data.consentCheck ? 'YES' : 'NO',
    data.data.transactionId,
    '', // Notes (empty for HR to fill)
    ''  // HR Review (empty for HR to fill)
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
      message: 'Onboarding data saved successfully',
      rowNumber: lastRow
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: Function to send email notifications
function sendNotificationEmail(type, data) {
  const HR_EMAIL = 'hr@yourcompany.com'; // Change this to your HR email
  
  let subject, body;
  
  if (type === 'interview') {
    subject = `🎯 New Interview Submission: ${data.data.fullName}`;
    body = `
A new candidate has completed the virtual interview:

👤 Name: ${data.data.fullName}
📧 Email: ${data.data.email}
📱 Phone: ${data.data.phone}
🎯 Position: ${data.data.position}
⏰ Submitted: ${data.timestamp}
🆔 Interview ID: ${data.interviewId}

🎥 Video Responses:
• Intro: ${data.data.introVideo}
• Technical: ${data.data.technicalVideo}

📊 View full details in the Interview Responses spreadsheet.
    `;
  } else if (type === 'onboarding') {
    subject = `✅ Onboarding Completed: ${data.data.firstName} ${data.data.lastName}`;
    body = `
A candidate has completed their onboarding:

👤 Name: ${data.data.firstName} ${data.data.lastName}
👤 Username: ${data.username}
📧 Email: ${data.data.email}
📱 Phone: ${data.data.phone}
⏰ Completed: ${data.timestamp}
🆔 Transaction ID: ${data.data.transactionId}

📊 View full details in the Onboarding Data spreadsheet.
    `;
  }
  
  try {
    MailApp.sendEmail(HR_EMAIL, subject, body);
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
}

// Test function (you can run this to test the setup)
function testSetup() {
  const testData = {
    type: 'interview',
    interviewId: 'TEST_123',
    timestamp: new Date().toISOString(),
    data: {
      fullName: 'Test Candidate',
      email: 'test@example.com',
      phone: '123-456-7890',
      position: 'Software Engineer',
      experience: '3 years',
      gitMatcherScaling: 'I would design a scalable GitHub analysis system using...',
      collaborationBalance: 'To balance technical and soft metrics, I would...',
      infrastructureDesign: 'For handling GitHub rate limits, I would implement...',
      uiDesign: 'For the developer profile UI, I would use React with...',
      preferredLanguage: 'TypeScript',
      workStyle: 'Hybrid',
      teamSize: '5-10',
      introVideo: 'https://example.com/video1',
      technicalVideo: 'https://example.com/video2',
      submissionDate: new Date().toLocaleString(),
      status: 'AWAITING_REVIEW'
    }
  };
  
  const spreadsheet = getOrCreateSpreadsheet();
  return handleInterviewData(spreadsheet, testData);
}
