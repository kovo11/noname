# React Candidate Onboarding Portal

A comprehensive, modern React TypeScript application for job candidate onboarding with three main phases: Application, Identity Verification, and Legal Onboarding.

## 🚀 Features

### Three-Phase Onboarding Process

1. **📝 Application Phase**
   - Personal and professional information collection
   - Skills assessment and motivation questions
   - Real-time form validation with TypeScript

2. **🆔 Identity Verification Phase**
   - Document upload with drag & drop (Passport/ID/Driver's License, Photo)
   - Emergency contact information
   - File validation and upload status tracking

3. **⚖️ Legal Onboarding Phase**
   - Background check consent and payment
   - Legal document uploads (Developer Contract, Signed Consent Letter)
   - Secure payment processing ($50 USD)
   - Detailed explanation of background check requirements

### 💾 Data Management

- **Local Storage**: All candidate data stored in browser localStorage as JSON
- **TypeScript**: Full type safety across the application
- **React State Management**: Efficient state handling with React hooks
- **File Upload Simulation**: Simulates Google Drive integration for document storage

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **CSS3** with modern features (Grid, Flexbox, Animations)
- **Font Awesome** for icons
- **Google Fonts** (Inter) for typography
- **Local Storage API** for data persistence

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation & Running

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

```bash
npm start          # Runs the app in development mode
npm run build      # Builds the app for production
npm test           # Launches the test runner
npm run eject      # Ejects from Create React App (irreversible)
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Progress indicator and branding
│   ├── ApplicationForm.tsx     # Phase 1: Job application form
│   ├── IdentityForm.tsx        # Phase 2: Identity verification
│   ├── LegalForm.tsx           # Phase 3: Legal onboarding
│   ├── FileUpload.tsx          # Reusable file upload component
│   ├── SuccessPage.tsx         # Completion confirmation
│   └── LoadingOverlay.tsx      # Loading animation
├── types.ts                    # TypeScript interfaces
├── App.tsx                     # Main application component
├── App.css                     # Complete styling
└── index.tsx                   # Application entry point
```

## 🎯 Background Check Process

### Mandatory Requirements

1. **Security Compliance**: Client requirements for security clearance
2. **Trust & Safety**: Maintaining high standards for sensitive data access
3. **Legal Requirements**: Industry regulations for employee verification
4. **Workplace Safety**: Ensuring secure work environment
5. **Professional Standards**: Maintaining organizational reputation

### Process Details

- **Coverage**: Criminal history, employment verification, education verification
- **Cost**: $50 USD
- **Duration**: 5 business days
- **Payment**: Refundable upon successful onboarding completion, secure digital payment required

## 💡 Key Features

### TypeScript Integration

- **Full Type Safety**: All components, props, and data structures are typed
- **Interface Definitions**: Clear contracts for data structures
- **IDE Support**: Excellent IntelliSense and error checking
- **Compile-time Validation**: Catch errors before runtime

### Form Validation

```typescript
// Real-time validation with TypeScript
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address';
  }
  
  return Object.keys(newErrors).length === 0;
};
```

### State Management

```typescript
// React hooks for state management
const [candidateData, setCandidateData] = useState<CandidateData>({});
const [currentPhase, setCurrentPhase] = useState<number>(1);
const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

### Deployment Options

- **Netlify**: Drag & drop deployment
- **Vercel**: GitHub integration
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for public repos

## 🔮 Future Enhancements

- [ ] **Real Google Drive API**: Replace simulation with actual integration
- [ ] **Email Notifications**: Automated status updates
- [ ] **Admin Dashboard**: Candidate management interface
- [ ] **Multiple Cryptocurrencies**: Support for Bitcoin, Ethereum
- [ ] **Digital Signatures**: DocuSign integration
- [ ] **Multi-language Support**: i18n implementation
- [ ] **Accessibility**: WCAG 2.1 compliance

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
