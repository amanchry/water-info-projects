import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    return NextResponse.json(
      { success: false, message: "Error fetching projects" },
      { status: 500 }
    );
  }
}

async function uploadToCloudinary(file, folder = "water-info/projects") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  return cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });
}

export async function POST(req) {
  // ✅ admin check
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.admin) {
  //   return NextResponse.json(
  //     { success: false, message: "Unauthorized" },
  //     { status: 401 }
  //   );
  // }

  try {
    const form = await req.formData();

    const name = form.get("project_name")?.toString()?.trim();
    const desc = form.get("project_desc")?.toString() || "";
    const keywords = form.get("project_keywords")?.toString() || "";
    const url = form.get("project_url")?.toString() || "";
    const thumbnailFile = form.get("project_thumbnail");

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Project name is required" },
        { status: 400 }
      );
    }

    let thumbnailUrl = null;
    let thumbnailPublicId = null;

    if (thumbnailFile && typeof thumbnailFile === "object" && thumbnailFile.size > 0) {
      const uploaded = await uploadToCloudinary(thumbnailFile);
      thumbnailUrl = uploaded.secure_url;
      thumbnailPublicId = uploaded.public_id;
    }

    const project = await prisma.project.create({
      data: {
        project_name: name,
        project_desc: desc,
        project_keywords: keywords,
        project_url: url,
        project_thumbnail: thumbnailUrl,
        project_thumb_pid: thumbnailPublicId, // ✅ store public id
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (err) {
    console.error("Error creating project:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create project" },
      { status: 500 }
    );
  }
}
