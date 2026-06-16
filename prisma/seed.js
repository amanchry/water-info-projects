import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function mimeFromExt(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function uploadLocalImageToCloudinary(absPath, folder) {
  const file = fs.readFileSync(absPath);
  const mime = mimeFromExt(absPath);
  const dataUri = `data:${mime};base64,${file.toString("base64")}`;

  return cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });
}

async function main() {
  console.log("🌱 Starting seed...");

  const jsonPath = path.join(process.cwd(), "prisma/seed/projects.json");
  const mediaDir = path.join(process.cwd(), "prisma/seed/media");
  const projects = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // ⚠️ Only for initial setup
  await prisma.project.deleteMany();
  console.log("🗑️ Cleared existing projects.");

  for (const p of projects) {
    let thumbnailUrl = null;
    let thumbPid = null;

    // If project_thumbnail is a local filename => upload it
    if (p.project_thumbnail && !p.project_thumbnail.startsWith("http")) {
      const absImagePath = path.join(mediaDir, p.project_thumbnail);

      if (!fs.existsSync(absImagePath)) {
        throw new Error(`❌ Missing image file: ${absImagePath}`);
      }

      const uploaded = await uploadLocalImageToCloudinary(
        absImagePath,
        "water-info/projects" // cloudinary folder
      );

      thumbnailUrl = uploaded.secure_url;
      thumbPid = uploaded.public_id;
    } else if (p.project_thumbnail?.startsWith("http")) {
      // If already a cloud url (optional)
      thumbnailUrl = p.project_thumbnail;
    }

    await prisma.project.create({
      data: {
        project_name: p.project_name,
        project_url: p.project_url || "",
        project_desc: p.project_desc || "",
        project_keywords: p.project_keywords || "",
        project_thumbnail: thumbnailUrl,
        project_thumb_pid: thumbPid,
      },
    });

    console.log(`✅ Seeded: ${p.project_name}`);
  }

  console.log(`🎉 Done. Inserted ${projects.length} projects.`);

  const resourcesJsonPath = path.join(process.cwd(), "prisma/seed/resources.json");
  const resources = JSON.parse(fs.readFileSync(resourcesJsonPath, "utf-8"));

  // ⚠️ Only for initial setup
  await prisma.resource.deleteMany();
  console.log("🗑️ Cleared existing resources.");

  for (const r of resources) {
    let thumbnailUrl = null;
    let thumbPid = null;

    // If resource_thumbnail is a local filename => upload it
    if (r.resource_thumbnail && !r.resource_thumbnail.startsWith("http")) {
      const absImagePath = path.join(mediaDir, r.resource_thumbnail);

      if (!fs.existsSync(absImagePath)) {
        throw new Error(`❌ Missing image file: ${absImagePath}`);
      }

      const uploaded = await uploadLocalImageToCloudinary(
        absImagePath,
        "water-info/resources" // cloudinary folder
      );

      thumbnailUrl = uploaded.secure_url;
      thumbPid = uploaded.public_id;
    } else if (r.resource_thumbnail?.startsWith("http")) {
      // If already a cloud url (optional)
      thumbnailUrl = r.resource_thumbnail;
    }

    await prisma.resource.create({
      data: {
        resource_name: r.resource_name,
        resource_url: r.resource_url || "",
        resource_desc: r.resource_desc || "",
        resource_keywords: r.resource_keywords || "",
        resource_thumbnail: thumbnailUrl,
        resource_thumb_pid: thumbPid,
      },
    });

    console.log(`✅ Seeded: ${r.resource_name}`);
  }

  console.log(`🎉 Done. Inserted ${resources.length} resources.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
