\# Managed Security Portal



A desktop security management application built with React, TypeScript, Ant Design, Pear Electron, Corestore, and Autopass.



\## Features



\- Security overview dashboard with illustrative demo statistics

\- Vulnerability management: Add, View, Edit, and Delete

\- Vulnerability priority and status tracking

\- Form validation and user feedback

\- Persistent vulnerability storage using Autopass and Corestore

\- Worker-based communication between the React interface and Autopass



\## Technology Stack



\*\*Frontend:\*\* React, TypeScript, Vite, Ant Design, React Router



\*\*Desktop:\*\* Pear Electron



\*\*Data storage:\*\* Autopass and Corestore



\*\*Communication:\*\* Electron IPC and Pear worker IPC



\## Project Structure



\- `frontend/` — React and TypeScript user interface

\- `pear-desktop/` — Pear Electron application, preload bridge, and Autopass worker



\## Running the Application



Development setup currently uses a Vite server and a separate Pear Electron process.



\### Frontend



From the `frontend` directory:



1\. Run `npm install`

2\. Run `npm run dev`



\### Desktop



From the `pear-desktop` directory:



1\. Run `npm install`

2\. Set `PEAR\_DEV\_SERVER\_URL` to `http://localhost:5173/`

3\. Run `npm start`



These instructions describe the development workflow. Standalone production startup and Pear application sharing are still to be verified.



\## Autopass Integration



Vulnerability records are stored through an Autopass worker. The frontend communicates with the worker using IPC messages.



Supported operations include adding, listing, and removing records. Editing a vulnerability uses the add operation with the existing record key.



The frontend requests the latest records after successful changes and when the Vulnerabilities page is opened.



\## Known Limitations



\- Dashboard statistics are illustrative demo data rather than live Autopass metrics.

\- File attachment and device pairing functionality are not implemented.

\- The application currently requires verification of standalone production startup.



\## AI Usage Disclosure



AI assistance was used for understanding the Pear/Autopass stack, exploring implementation options, and discussing debugging and code-review considerations.



The implementation and final code should be reviewed and verified by the candidate before submission.

