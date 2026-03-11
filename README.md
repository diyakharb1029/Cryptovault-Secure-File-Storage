# CryptoVault

CryptoVault is a secure file storage prototype that protects files using **client-side hybrid encryption**.  
Files are encrypted directly inside the browser before being stored, ensuring **confidentiality, integrity, and controlled access**.

The system demonstrates how modern web applications can use cryptography to protect sensitive data without relying entirely on server-side trust.

---

## Live Demo

**Application:**  
https://cryptovault-secure-file-storage-qvv.vercel.app

---

## Demo Login Credentials

To access the secure vault dashboard, use the following credentials:

| Field | Value |
|------|------|
| **Email** | demo@cryptovault.com |
| **Password** | CryptoVault@123 |

These credentials allow access to the demo vault environment for evaluating the hybrid encryption workflow.

---

## Screenshots

### Secure Workspace
<img width="1435" height="800" alt="dashboard_1" src="https://github.com/user-attachments/assets/08c30ee1-2e4b-48a1-a24c-b925cf6e7a3d" />

### Login Page
<img width="1433" height="796" alt="login" src="https://github.com/user-attachments/assets/f9dc1c6d-b769-4291-beb9-b2f3cf79d3c0" />

### Signup Page
<img width="1431" height="799" alt="signup" src="https://github.com/user-attachments/assets/4cf9edaa-b3ff-4204-93aa-7dff67ebef28" />

### Vault Dashboard
<img width="1434" height="802" alt="vault_1" src="https://github.com/user-attachments/assets/b15f1cff-6eb7-4640-9eff-78b7fcd41f1e" />

<img width="1314" height="549" alt="vault_2" src="https://github.com/user-attachments/assets/18c7dd52-ff93-4ab5-bbd0-cae347fc1cc3" />

---

## Key Features

- Client-side file encryption before storage
- Hybrid cryptography architecture
- Secure file upload and retrieval
- Integrity verification using hashing
- Modern responsive interface
- Built using **Next.js and modern web technologies**

---

## Security Architecture

CryptoVault uses a **hybrid encryption model** to balance performance and security.

### Encryption Layer
**AES-GCM**  
Used for fast encryption of file contents.

### Key Protection
**RSA-OAEP**  
Used to encrypt and protect the AES encryption key.

### Integrity Verification
**SHA-256**  
Used to generate a hash fingerprint of the file to detect tampering.

### Encryption Workflow

1. The file is encrypted locally using **AES-GCM**.
2. The AES key is encrypted using **RSA-OAEP**.
3. A **SHA-256 hash** is generated for integrity verification.
4. The encrypted file and metadata are stored securely.

---

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Security & Cryptography
- Web Crypto API
- AES-GCM Encryption
- RSA-OAEP Key Protection
- SHA-256 Hashing

### Deployment
- Vercel

---

## Project Structure

```

cryptovault
│
├── app
│   ├── page.tsx
│   └── vault
│
├── lib
│   ├── crypto.ts
│   └── storage.ts
│
├── public
│
├── screenshots
│
├── package.json
├── tsconfig.json
└── README.md

```

---

## How It Works

1. User uploads a file through the CryptoVault interface.
2. The file is encrypted locally using **AES-GCM**.
3. The encryption key is protected using **RSA-OAEP**.
4. A **SHA-256 hash** is generated for file integrity.
5. The encrypted file is stored in the vault.
6. Only authorized retrieval can decrypt the file.

---

## Running the Project Locally

Clone the repository

Navigate into the project folder

```

cd cryptovault-secure-file-storage

```

Install dependencies

```

npm install

```

Start the development server

```

npm run dev

```

Open the app in your browser

```

http://localhost:3000

```

---

## Future Improvements

- Cloud storage integration
- Multi-user authentication
- End-to-end encrypted file sharing
- Secure key management system
- Large file encryption optimization

---

## Author

**Diya Kharb**  

---

## License

This project was developed as an academic prototype demonstrating secure client-side encryption techniques.
