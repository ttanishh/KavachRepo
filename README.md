

# Kavach - Crime Reporting System

Kavach is a comprehensive crime reporting and management system that enables citizens to report crimes, allows police stations to manage cases, and provides super admins with system-wide analytics and control.

## Demo Video
[Click here to watch the demo video](https://drive.google.com/drive/folders/1uY3xP98sihjHD2VmgtS2jzS0zf2wi5iI?usp=sharing)
[Click here to access the ppt](https://www.canva.com/design/DAGj1Rn16MA/yBX94GOoEq8jueJPh0KciQ/edit?utm_content=DAGj1Rn16MA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

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
  --/ Manage system users
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

##Future Scope

1. Integrate Deepfake detection model (endpoints for this are already setup in mlserver/app.py) while uploading image from users end to make legitimate request get more priority from authorities.
2. Extend multilingual support to the chrome extension as well as web apps
3. Transition the application to a progressive web application
4. Scale the application to support nationwide data (Our current prototype assumes only Gujarats data)
5. Inculcate more intricate and complex hierarchy on authority end (currently we have assumed superadmin(head person of state) and admins(head people of districts) only)
6. Implement a mechanism for scheduling tasks by superadmin between admins
7. Set up some incentive mechanism to utilize the points earned by users via our web extension
8. Improve UI

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

## Team Kavach
- Aayudh Panchal - https://www.linkedin.com/in/aayudh-panchal/
- Misbah Shaikh - https://www.linkedin.com/in/misbahsrshaikh/
- Tanish Panchal - https://www.linkedin.com/in/tanish2311/

