import React, { useState } from 'react';
import { DocumentInfo } from '../types';

interface FileUploadProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  uploadedFiles: Record<string, DocumentInfo>;
  setUploadedFiles: React.Dispatch<React.SetStateAction<Record<string, DocumentInfo>>>;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  icon,
  title,
  description,
  uploadedFiles,
  setUploadedFiles,
  error
}) => {
  const [driveUrl, setDriveUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const validateGoogleDriveUrl = (url: string): string | null => {
    // Check if it's a valid Google Drive sharing URL - more flexible patterns
    const drivePatterns = [
      /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view(\?usp=sharing)?$/,
      /^https:\/\/drive\.google\.com\/open\?id=[a-zA-Z0-9_-]+$/,
      /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+$/,
      /^https:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+/,
      /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]+/,
      /^https:\/\/docs\.google\.com\/presentation\/d\/[a-zA-Z0-9_-]+/
    ];
    
    const isValidGoogleUrl = drivePatterns.some(pattern => pattern.test(url));
    
    if (!isValidGoogleUrl) {
      return 'Please provide a valid Google Drive sharing link (drive.google.com or docs.google.com)';
    }

    return null;
  };

  const handleUrlSubmit = async () => {
    if (!driveUrl.trim()) {
      setUploadStatus('Please enter a Google Drive URL');
      return;
    }

    const validationError = validateGoogleDriveUrl(driveUrl);
    if (validationError) {
      setUploadStatus(validationError);
      return;
    }
    
    // Create DocumentInfo object
    const documentInfo: DocumentInfo = {
      filename: `${title}_${Date.now()}`,
      size: 0, // We can't get size from Drive URL easily
      type: 'application/pdf', // Default type
      driveUrl: driveUrl
    };

    // Update uploaded files
    setUploadedFiles(prev => ({
      ...prev,
      [id]: documentInfo
    }));

    setUploadStatus(`✓ Google Drive link added successfully`);
    setDriveUrl('');
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDriveUrl(e.target.value);
    if (uploadStatus && !uploadStatus.startsWith('✓')) {
      setUploadStatus('');
    }
  };

  const isUploaded = uploadedFiles[id];
  const hasError = error || (uploadStatus && !uploadStatus.startsWith('✓'));

  return (
    <div className="upload-item">
      <div className={`upload-box google-drive ${isUploaded ? 'uploaded' : ''}`}>
        <i className={icon}></i>
        <p>{title}</p>
        <span className="upload-text">{description}</span>
        
        {!isUploaded ? (
          <div className="drive-input-container">
            <input
              type="url"
              placeholder="Paste Google Drive sharing link here..."
              value={driveUrl}
              onChange={handleUrlChange}
              className="drive-url-input"
            />
            <button 
              type="button" 
              onClick={handleUrlSubmit}
              className="btn btn-secondary"
              disabled={!driveUrl.trim()}
            >
              Add Link
            </button>
          </div>
        ) : (
          <div className="uploaded-info">
            <p><strong>File linked successfully!</strong></p>
            <a 
              href={isUploaded.driveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="drive-link"
            >
              <i className="fab fa-google-drive"></i> View on Google Drive
            </a>
          </div>
        )}
      </div>
      
      <div className={`upload-status ${hasError ? 'error' : isUploaded ? 'success' : ''}`}>
        {error || uploadStatus}
      </div>
      
      {!isUploaded && (
        <div className="drive-instructions">
          <p><strong>How to share from Google Drive:</strong></p>
          <ol>
            <li>Upload your file to Google Drive</li>
            <li>Right-click the file and select "Share"</li>
            <li>Click "Get shareable link"</li>
            <li>Set permissions to "Anyone with the link can view"</li>
            <li>Copy and paste the link above</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
