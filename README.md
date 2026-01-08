npm install


.env
# MongoDB
DATABASE_URL="mongodb+srv://user:pass@cluster/dbname"

# NextAuth
NEXTAUTH_SECRET="super-secret"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="xxx"
CLOUDINARY_API_KEY="xxx"
CLOUDINARY_API_SECRET="xxx"



npm run dev

npm run build


npx prisma generate
node prisma/seed.js

