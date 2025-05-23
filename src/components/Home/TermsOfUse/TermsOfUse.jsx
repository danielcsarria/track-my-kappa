import { Dialog } from "primereact/dialog";

export const TermsOfUse = ({
  termsOfUseVisible,
  setTermsOfUseVisible
}) => {
  return (
    <Dialog
      header="Terms Of Use"
      visible={termsOfUseVisible}
      style={{ width: '50vw' }}
      onHide={() => { if (!termsOfUseVisible) return; setTermsOfUseVisible(false); }}
    >
      <p><strong>Effective Date:</strong> 05/23/2025 </p>
        <p>Welcome to <strong>Track My Kappa</strong>! By accessing or using this application, you agree to be bound by the following terms and conditions:</p>

        <h2>1. Intellectual Property</h2>
        <p>
          All content and source code associated with this application are the property of <strong>SaVille Media LLC</strong>, and are protected by copyright and other intellectual property laws.
        </p>
        <p><strong>You may not:</strong></p>
        <ul>
          <li>Copy, reproduce, or distribute any part of the application’s code or design.</li>
          <li>Reverse-engineer, decompile, or attempt to extract the source code of the software.</li>
          <li>Use any part of the application for commercial purposes without written permission.</li>
        </ul>

        <h2>2. Usage</h2>
        <p>
          This application is provided for personal or internal use only. Any unauthorized use of the application or its code is strictly prohibited.
        </p>

        <h2>3. Disclaimer</h2>
        <p>
          The application is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free operation.
        </p>

        <h2>4. Changes to Terms</h2>
        <p>
          We reserve the right to update or change these terms at any time. Continued use of the application after changes constitutes acceptance of those changes.
        </p>
    </Dialog>
  )
}