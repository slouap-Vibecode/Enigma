# Enigma - Next.js Version

A modern Next.js implementation of the Enigma riddle platform, originally created as a PHP application.

## Features

- 🧩 Create and solve interactive riddles
- 🔐 Secure admin interface for riddle management
- 📱 Responsive design (mobile and desktop)
- ⚡ Modern React/Next.js architecture
- 🚀 Ready for Vercel deployment
- 🎨 Dark theme matching the original design

## Quick Start

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and set your ADMIN_TOKEN
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Visit the application**
   - Main site: http://localhost:3000
   - Test riddle: http://localhost:3000?id=test
   - Admin interface: http://localhost:3000/admin

### Production Deployment on Vercel

1. **Deploy to Vercel**
   ```bash
   npx vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - `ADMIN_TOKEN`: Your secure admin token

3. **Access your deployed app**
   - Main site: `https://your-app.vercel.app`
   - Admin: `https://your-app.vercel.app/admin`

## Usage

### Creating Riddles

1. Go to `/admin`
2. Enter your admin token
3. Create a new riddle by entering a name
4. Add password fields and a reward message
5. Save the riddle

### Solving Riddles

1. Visit `/?id=riddle-name` where `riddle-name` is the name of your riddle
2. Fill in the answer fields
3. Correct answers turn green, incorrect ones turn red
4. When all answers are correct, the reward is displayed

## Project Structure

```
src/
├── app/
│   ├── admin/              # Admin interface pages
│   ├── api/                # API routes for riddles and admin
│   ├── globals.css         # Global styles (ported from original)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main riddle page
├── components/
│   ├── AdminDashboard.tsx  # Admin management interface
│   ├── AdminLogin.tsx      # Admin authentication
│   └── EnigmaForm.tsx      # Riddle solving form
├── lib/
│   ├── config.ts           # Configuration settings
│   └── fileUtils.ts        # File system operations
└── types/
    └── enigma.ts           # TypeScript type definitions

data/                       # Riddle JSON files
public/                     # Static assets
```

## API Endpoints

### Public Endpoints
- `GET /api/enigma/[id]` - Get riddle data
- `GET /api/enigma` - List all riddles

### Admin Endpoints (require Authorization header)
- `POST /api/admin/auth` - Authenticate admin token
- `GET /api/admin/enigma` - List riddles (admin)
- `POST /api/admin/enigma` - Create new riddle
- `DELETE /api/admin/enigma?id=[id]` - Delete riddle

## Data Format

Riddles are stored as JSON files in the `data/` directory:

```json
{
  "passwords": ["answer1", "answer2", "answer3"],
  "reward": "Congratulations! You solved the riddle!"
}
```

## Security Features

- Admin token authentication
- Input sanitization
- Protected data directory
- No direct file access from web

## Migration from Original PHP Version

This Next.js version maintains 100% feature compatibility with the original PHP Enigma application:

- Same URL structure (`?id=riddle-name`)
- Identical UI and styling
- Same admin functionality
- Compatible JSON file format

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_TOKEN` | Secret token for admin access | Yes |

## License

This project maintains the same open-source nature as the original Enigma PHP application.