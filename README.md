# 🔐 Password Vault

A secure, privacy-first password manager built with Next.js and MongoDB Atlas. Features client-side encryption, strong password generation, and a clean vault interface.

## ✨ Features

- **🔒 Client-side encryption** - Your passwords are encrypted before leaving your device
- **🎲 Strong password generator** - Customizable length, character sets, and look-alike exclusion
- **📱 Clean vault interface** - View, edit, delete, and search your saved passwords
- **📋 Auto-clear clipboard** - Passwords are automatically cleared from clipboard after 12 seconds
- **🔍 Smart search** - Filter across titles, usernames, URLs, and notes
- **🌐 URL support** - Save and access website URLs directly from vault items
- **📝 Notes** - Add additional notes to your password entries

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/password-vault.git
   cd password-vault/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the `web` directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/password_vault?retryWrites=true&w=majority
   JWT_SECRET=your-long-random-string-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

   You can also access the deployed version here:
👉 https://password-vault-4ynh.vercel.app/vault

## 🔧 Configuration

### MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create a database user with read/write permissions
3. Add your IP address to the network access list (or use `0.0.0.0/0` for development)
4. Get your connection string and add it to `.env.local`

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-here` |

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔐 Security Features

- **Client-side encryption** using Web Crypto API (AES-GCM)
- **PBKDF2 key derivation** with 150,000 iterations
- **Per-user encryption keys** derived from password + server salt
- **JWT authentication** with 1-hour expiration
- **No plaintext storage** - only encrypted ciphertext on server

## 📱 Usage

1. **Sign up** with your email and password
2. **Log in** to access your vault
3. **Generate passwords** using the built-in generator
4. **Save entries** with title, username, password, URL, and notes
5. **Search and filter** your saved passwords
6. **Copy passwords** to clipboard (auto-clears after 12 seconds)
7. **Edit or delete** entries as needed

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens
- **Encryption**: Web Crypto API (AES-GCM, PBKDF2)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
