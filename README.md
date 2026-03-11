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
<img width="1439" height="805" alt="Screenshot 2026-03-11 at 7 35 48 PM" src="https://github.com/user-attachments/assets/734cb20e-dcc6-433b-8b07-1501595fa308" />

<img width="1440" height="808" alt="Screenshot 2026-03-11 at 7 36 03 PM" src="https://github.com/user-attachments/assets/99a3584f-e6c1-446b-a007-1830df65c6df" />

<img width="1431" height="804" alt="Screenshot 2026-03-11 at 7 36 16 PM" src="https://github.com/user-attachments/assets/07cec316-b9d0-4e87-af86-34b8ed4466b4" />

### Login Page
<img width="1431" height="796" alt="Screenshot 2026-03-11 at 7 36 40 PM" src="https://github.com/user-attachments/assets/04f45643-b545-4194-9a71-b75ce0f6f0ee" />

### Signup Page
<img width="1440" height="805" alt="Screenshot 2026-03-11 at 7 36 47 PM" src="https://github.com/user-attachments/assets/4c804d7d-16a5-4018-a556-668088be4cf8" />

### Vault Dashboard
<img width="1439" height="539" alt="Screenshot 2026-03-11 at 7 38 38 PM" src="https://github.com/user-attachments/assets/30ee5910-78fc-4d6e-bc50-ab8f97b5829c" />

<img width="1440" height="603" alt="Screenshot 2026-03-11 at 7 38 51 PM" src="https://github.com/user-attachments/assets/17807c8b-30bd-4c7d-a2bf-0fe8bf7f4c85" />

<img width="1440" height="553" alt="Screenshot 2026-03-11 at 7 38 56 PM" src="https://github.com/user-attachments/assets/d0d9a458-afb5-4da7-ac5e-297acc23e35e" />

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
