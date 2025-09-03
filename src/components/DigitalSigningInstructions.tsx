import React, { useState } from 'react';

interface DigitalSigningInstructionsProps {
  onClose: () => void;
  isVisible: boolean;
  documentType: 'contract' | 'consent' | 'nda' | 'general';
}

const DigitalSigningInstructions: React.FC<DigitalSigningInstructionsProps> = ({ 
  onClose, 
  isVisible, 
  documentType 
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'browser' | 'mobile' | 'software'>('browser');

  if (!isVisible) return null;

  const documentNames = {
    contract: 'Employment Contract',
    consent: 'Background Check Consent',
    nda: 'Non-Disclosure Agreement',
    general: 'Legal Document'
  };

  const renderBrowserMethod = () => (
    <div className="signing-method-content">
      <h4><i className="fas fa-globe"></i> Browser-Based Signing (Recommended)</h4>
      
      <div className="step-by-step">
        <div className="step">
          <span className="step-number">1</span>
          <div className="step-content">
            <strong>Open the Document</strong>
            <p>Click the "Download & Sign" button to open the document in your browser</p>
          </div>
        </div>

        <div className="step">
          <span className="step-number">2</span>
          <div className="step-content">
            <strong>Use Built-in PDF Editor</strong>
            <p>Modern browsers (Chrome, Firefox, Safari, Edge) have built-in PDF editing tools</p>
            <ul>
              <li>Look for the signature tool in the PDF viewer</li>
              <li>Click on the signature field or "Add Signature" button</li>
            </ul>
          </div>
        </div>

        <div className="step">
          <span className="step-number">3</span>
          <div className="step-content">
            <strong>Create Your Signature</strong>
            <div className="signature-options">
              <div className="signature-option">
                <i className="fas fa-pen"></i>
                <strong>Draw:</strong> Use mouse or touchscreen to draw your signature
              </div>
              <div className="signature-option">
                <i className="fas fa-keyboard"></i>
                <strong>Type:</strong> Type your name and select a signature font
              </div>
              <div className="signature-option">
                <i className="fas fa-upload"></i>
                <strong>Upload:</strong> Upload an image of your handwritten signature
              </div>
            </div>
          </div>
        </div>

        <div className="step">
          <span className="step-number">4</span>
          <div className="step-content">
            <strong>Add Date & Save</strong>
            <p>Fill in the date field and save the signed document to your device</p>
          </div>
        </div>

        <div className="step">
          <span className="step-number">5</span>
          <div className="step-content">
            <strong>Upload Signed Document</strong>
            <p>Use the file upload section to submit your signed document</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMobileMethod = () => (
    <div className="signing-method-content">
      <h4><i className="fas fa-mobile-alt"></i> Mobile Device Signing</h4>
      
      <div className="mobile-apps">
        <h5>Recommended Mobile Apps:</h5>
        <div className="app-list">
          <div className="app-item">
            <i className="fab fa-google-play"></i>
            <div>
              <strong>Adobe Acrobat Reader</strong>
              <p>Free on iOS & Android - Full PDF signing capabilities</p>
            </div>
          </div>
          <div className="app-item">
            <i className="fab fa-app-store"></i>
            <div>
              <strong>DocuSign</strong>
              <p>Professional e-signature solution</p>
            </div>
          </div>
          <div className="app-item">
            <i className="fas fa-file-pdf"></i>
            <div>
              <strong>PDF Expert (iOS)</strong>
              <p>Advanced PDF editing with signature tools</p>
            </div>
          </div>
        </div>
      </div>

      <div className="step-by-step">
        <div className="step">
          <span className="step-number">1</span>
          <div className="step-content">
            <strong>Download the Document</strong>
            <p>Tap "Download & Sign" and save the PDF to your device</p>
          </div>
        </div>

        <div className="step">
          <span className="step-number">2</span>
          <div className="step-content">
            <strong>Open in PDF App</strong>
            <p>Open the downloaded file with your chosen PDF app</p>
          </div>
        </div>

        <div className="step">
          <span className="step-number">3</span>
          <div className="step-content">
            <strong>Add Signature</strong>
            <p>Use your finger or stylus to sign directly on the screen</p>
          </div>
        </div>

        <div className="step">
          <span className="step-number">4</span>
          <div className="step-content">
            <strong>Save & Upload</strong>
            <p>Save the signed document and upload it through this form</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSoftwareMethod = () => (
    <div className="signing-method-content">
      <h4><i className="fas fa-desktop"></i> Desktop Software Signing</h4>
      
      <div className="software-options">
        <div className="software-item">
          <i className="fas fa-file-pdf"></i>
          <div>
            <strong>Adobe Acrobat Reader DC (Free)</strong>
            <p>Industry standard with built-in signing tools</p>
            <a href="https://get.adobe.com/reader/" target="_blank" rel="noopener noreferrer">
              Download Free
            </a>
          </div>
        </div>

        <div className="software-item">
          <i className="fas fa-edit"></i>
          <div>
            <strong>LibreOffice Draw (Free)</strong>
            <p>Open-source alternative with PDF editing</p>
            <a href="https://www.libreoffice.org/download/download/" target="_blank" rel="noopener noreferrer">
              Download Free
            </a>
          </div>
        </div>

        <div className="software-item">
          <i className="fas fa-tools"></i>
          <div>
            <strong>PDF-XChange Editor</strong>
            <p>Professional PDF editor with advanced signing</p>
          </div>
        </div>
      </div>

      <div className="step-by-step">
        <div className="step">
          <span className="step-number">1</span>
          <div className="step-content">
            <strong>Install PDF Software</strong>
            <p>Download and install your preferred PDF editing software</p>
          </div>
        </div>

        <div className="step">
          <span className="step-number">2</span>
          <div className="step-content">
            <strong>Open Document</strong>
            <p>Download the document and open it in your PDF software</p>
          </div>
        </div>

        <div className="step">
          <span className="step-number">3</span>
          <div className="step-content">
            <strong>Use Signature Tool</strong>
            <p>Look for "Sign" or "Add Signature" in the toolbar</p>
          </div>
        </div>

        <div className="step">
          <span className="step-number">4</span>
          <div className="step-content">
            <strong>Create Digital Signature</strong>
            <p>Create a reusable digital signature for future documents</p>
          </div>
        </div>

        <div className="step">
          <span className="step-number">5</span>
          <div className="step-content">
            <strong>Save & Upload</strong>
            <p>Save the signed PDF and upload it using the form below</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="signing-instructions-overlay">
      <div className="signing-instructions-modal">
        <div className="signing-instructions-header">
          <h2><i className="fas fa-signature"></i> Digital Signing Instructions</h2>
          <p>How to digitally sign your {documentNames[documentType]}</p>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="signing-methods">
          <div className="method-tabs">
            <button 
              className={`method-tab ${selectedMethod === 'browser' ? 'active' : ''}`}
              onClick={() => setSelectedMethod('browser')}
            >
              <i className="fas fa-globe"></i>
              Browser
            </button>
            <button 
              className={`method-tab ${selectedMethod === 'mobile' ? 'active' : ''}`}
              onClick={() => setSelectedMethod('mobile')}
            >
              <i className="fas fa-mobile-alt"></i>
              Mobile
            </button>
            <button 
              className={`method-tab ${selectedMethod === 'software' ? 'active' : ''}`}
              onClick={() => setSelectedMethod('software')}
            >
              <i className="fas fa-desktop"></i>
              Software
            </button>
          </div>

          <div className="method-content">
            {selectedMethod === 'browser' && renderBrowserMethod()}
            {selectedMethod === 'mobile' && renderMobileMethod()}
            {selectedMethod === 'software' && renderSoftwareMethod()}
          </div>
        </div>

        <div className="signing-instructions-footer">
          <div className="important-notes">
            <h4><i className="fas fa-exclamation-circle"></i> Important Notes</h4>
            <ul>
              <li>Ensure your signature is legible and consistent</li>
              <li>Include the current date when signing</li>
              <li>Save the document as a PDF after signing</li>
              <li>Your signature legally binds you to the document terms</li>
            </ul>
          </div>

          <div className="support-info">
            <p>
              <i className="fas fa-question-circle"></i>
              Need help? Contact support at: <strong>support@gitmatcher.com</strong>
            </p>
          </div>

          <button className="btn btn-primary" onClick={onClose}>
            <i className="fas fa-check"></i>
            Got It, Let's Sign
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalSigningInstructions;
