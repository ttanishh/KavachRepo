

# Kavach - Crime Reporting System

Kavach is a comprehensive crime reporting and management system that enables citizens to report crimes, allows police stations to manage cases, and provides super admins with system-wide analytics and control.

## Demo Video
[Click here to watch the demo video](https://drive.google.com/drive/folders/1uY3xP98sihjHD2VmgtS2jzS0zf2wi5iI?usp=sharing

## Features

- **User Features**
  - Report crimes with location, description, and evidence
  - Track report status
  - View crime map
  - Receive notifications
  - Anonymous reporting option

- **Admin Features**
  - Manage crime reports
  - Assign cases to officers
  - Update case status
  - Add case notes
  - View station analytics
  - Manage station officers

- **Super Admin Features**
  - Manage police stations
  - Manage system users
  - View system-wide analytics
  - Generate reports
  - Configure system settings

## Tech Stack

- **Frontend**
  - Next.js 14
  - React 18
  - Tailwind CSS
  - Shadcn UI
  - Leaflet Maps
  - Recharts

- **Backend**
  - Next.js API Routes
  - MongoDB
  - Mongoose
  - JWT Authentication
  - AWS S3 (for file storage)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kavach.git
   cd kavach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_s3_bucket_name
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [Leaflet](https://leafletjs.com/)
- [Recharts](https://recharts.org/)

