import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, resources });
  } catch (err) {
    console.error("Error fetching resources:", err);
    return NextResponse.json(
      { success: false, message: "Error fetching resources" },
      { status: 500 }
    );
  }
}

async function uploadToCloudinary(file, folder = "water-info/resources") {
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

    const name = form.get("resource_name")?.toString()?.trim();
    const desc = form.get("resource_desc")?.toString() || "";
    const keywords = form.get("resource_keywords")?.toString() || "";
    const url = form.get("resource_url")?.toString() || "";
    const thumbnailFile = form.get("resource_thumbnail");

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Resource name is required" },
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

    const resource = await prisma.resource.create({
      data: {
        resource_name: name,
        resource_desc: desc,
        resource_keywords: keywords,
        resource_url: url,
        resource_thumbnail: thumbnailUrl,
        resource_thumb_pid: thumbnailPublicId, // ✅ store public id
      },
    });

    return NextResponse.json({ success: true, data: resource });
  } catch (err) {
    console.error("Error creating resource:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create resource" },
      { status: 500 }
    );
  }
}
