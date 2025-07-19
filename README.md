# Social Accountability Tracker

A modern web application for tracking habits and goals with social accountability, built with Next.js, Clerk authentication, and Convex database.

## 🚀 Features

- **User Authentication** - Secure login/signup with Clerk
- **Challenge Creation** - Create and join accountability challenges
- **Progress Tracking** - Log daily progress and view statistics
- **Social Features** - See other participants' progress
- **Template System** - Pre-built challenge templates
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Authentication**: Clerk
- **Database**: Convex
- **Styling**: Tailwind CSS, Radix UI
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Clerk account (free)
- Convex account (free)

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Convex Database
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url_here
```

### Getting Your Keys:

1. **Clerk Keys**: 
   - Sign up at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy the publishable key and secret key from your dashboard

2. **Convex URL**:
   - Sign up at [convex.dev](https://convex.dev)
   - Create a new project
   - Copy the deployment URL

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd web-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your actual keys

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables in Vercel:
- Go to your project settings
- Add the same environment variables from your `.env.local`
- Redeploy after adding variables

## 🔒 Security Notes

- ✅ Environment variables are properly configured
- ✅ No secrets are committed to the repository
- ✅ Authentication is handled securely by Clerk
- ✅ Database access is controlled by Convex

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
