const CONTACT_HEADERS = ["Timestamp", "Name", "Email", "Phone", "Subject", "Message"];
const CONTACT_SPREADSHEET_PROPERTY = "CONTACT_SPREADSHEET_ID";

function setupContactSpreadsheet() {
  const spreadsheet = SpreadsheetApp.create("Wonderweb Technologies - Contact submissions");
  const sheet = spreadsheet.getActiveSheet();
  sheet.setName("Contact submissions");
  sheet.appendRow(CONTACT_HEADERS);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, CONTACT_HEADERS.length).setFontWeight("bold");
  PropertiesService.getScriptProperties().setProperty(
    CONTACT_SPREADSHEET_PROPERTY,
    spreadsheet.getId()
  );
  Logger.log("Contact spreadsheet created: " + spreadsheet.getUrl());
  return spreadsheet.getUrl();
}

function doGet() {
  return ContentService.createTextOutput(
    "Wonderweb Technologies contact endpoint is online. Submit contact details using POST."
  );
}

function doPost(event) {
  try {
    const parameters = event && event.parameter ? event.parameter : {};

    if (String(parameters.website || "").trim()) {
      return contactResponse_(true);
    }

    const submission = {
      name: cleanField_(parameters.name, 120),
      email: cleanField_(parameters.email, 254),
      phone: cleanField_(parameters.phone, 30),
      subject: cleanField_(parameters.subject, 160),
      message: cleanField_(parameters.message, 5000)
    };

    if (
      !submission.name ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email) ||
      !submission.phone ||
      submission.message.length < 10
    ) {
      return contactResponse_(false);
    }

    const spreadsheetId = PropertiesService.getScriptProperties().getProperty(
      CONTACT_SPREADSHEET_PROPERTY
    );
    if (!spreadsheetId) {
      throw new Error("Run setupContactSpreadsheet before accepting submissions.");
    }

    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Contact submissions");
    if (!sheet) {
      throw new Error("Contact submissions sheet was not found.");
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet.appendRow([
        new Date(),
        sheetSafeText_(submission.name),
        sheetSafeText_(submission.email),
        sheetSafeText_(submission.phone),
        sheetSafeText_(submission.subject),
        sheetSafeText_(submission.message)
      ]);
    } finally {
      lock.releaseLock();
    }

    return contactResponse_(true);
  } catch (error) {
    console.error("Contact submission failed: " + error);
    return contactResponse_(false);
  }
}

function cleanField_(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function sheetSafeText_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function contactResponse_(success) {
  const result = JSON.stringify({
    type: "portfolio-contact-result",
    success: success
  });
  const html = "<!doctype html><html><body><script>" +
    "window.parent.postMessage(" + result + ", '*');" +
    "</script></body></html>";

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
