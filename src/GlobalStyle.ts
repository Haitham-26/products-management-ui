import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    min-height: 100vh;

    background: linear-gradient(90deg, #cde5ff 0%, #f6faff 100%);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  * {
    &::-webkit-scrollbar {
      width: 3px; 
    }
    &::-webkit-scrollbar-track {
      background: #f0f4f8; 
    }
    &::-webkit-scrollbar-thumb {
      background: #4da3ff;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #2f8cff;
    }
    scrollbar-width: thin;
    scrollbar-color: #4da3ff #f0f4f8;
  }

  @font-face {
    font-family: "Inter";
    src: url('/fonts/inter-regular.ttf') format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }


  @font-face {
    font-family: "IBM Plex Sans Arabic";
    src: url('/fonts/ibm-plex-sans-arabic-regular.ttf') format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  body {
    font-family: "Inter", "IBM Plex Sans Arabic", sans-serif;
  }

  a {
    font-weight: 500;
    color: inherit;
    text-decoration: inherit;
  }

  a:hover {
    color: inherit;
  }
  
.ant-notification-notice {
  border-radius: 16px;
  padding: 18px 24px 18px 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ant-notification-notice-message {
  font-weight: 600;
  font-size: 15px;
  color: #0f172a;
  margin-bottom: 4px;
}

.ant-notification-notice-description {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

.ant-notification-notice:has(.ant-notification-notice-icon-success) {
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%);
  border-left: 4px solid #10b981;
}

.ant-notification-notice:has(.ant-notification-notice-icon-success) .ant-notification-notice-icon {
  color: #10b981;
}

.ant-notification-notice:has(.ant-notification-notice-icon-error) {
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 50%);
  border-left: 4px solid #ef4444;
}

.ant-notification-notice:has(.ant-notification-notice-icon-error) .ant-notification-notice-icon {
  color: #ef4444;
}

.ant-notification-notice-close {
  top: 18px;
  inset-inline-end: 18px;
  color: #94a3b8;
  transition: color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.ant-notification-notice-close:hover {
  color: #475569;
  transform: scale(1.05);
}

`;

export default GlobalStyle;
