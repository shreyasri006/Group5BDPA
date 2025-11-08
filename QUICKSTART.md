# Quick Start Guide

## Running the Application

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up API Key (Optional)
1. Open the `.env` file in the project root
2. Replace `YOUR_OPENAI_API_KEY_HERE` with your actual OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
3. Get your API key from: https://platform.openai.com/api-keys

**Note:** The app works perfectly without the API key - it will just use fallback project suggestions.

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
- The app will automatically open at `http://localhost:5173`
- Or manually navigate to that URL

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port (5174, 5175, etc.)

### API Key Not Working
- Make sure the `.env` file is in the project root (same folder as `package.json`)
- Restart the development server after changing the `.env` file
- Check that the variable name is exactly `VITE_OPENAI_API_KEY`
- Verify your API key is valid at https://platform.openai.com/api-keys

### Module Not Found Errors
Run `npm install` again to ensure all dependencies are installed.

## Features Overview

1. **Skills & Resources Tab**: View your skills, missing skills, and recommended learning resources
2. **Learning Timeline Tab**: See a personalized timeline for learning missing skills
3. **Job Statistics Tab**: View job market statistics for your target role
4. **Suggested Projects Tab**: Get AI-powered project suggestions (requires API key)

## Need Help?

- Check the `README.md` for detailed documentation
- Check the `FEATURES.md` for feature documentation
- Make sure all dependencies are installed: `npm install`

