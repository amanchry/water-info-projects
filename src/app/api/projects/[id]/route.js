import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

async function uploadToCloudinary(file, folder = "water-info/projects") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  return cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });
}

export async function PUT(req, ctx) {
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.admin) {
  //   return NextResponse.json(
  //     { success: false, message: "Unauthorized" },
  //     { status: 401 }
  //   );
  // }

  try {
    const { id } = await ctx.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing project id" },
        { status: 400 }
      );
    }

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

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

    let thumbnailUrl = existing.project_thumbnail;
    let thumbnailPublicId = existing.project_thumb_pid;

    if (thumbnailFile && typeof thumbnailFile === "object" && thumbnailFile.size > 0) {
      const uploaded = await uploadToCloudinary(thumbnailFile);
      if (existing.project_thumb_pid) {
        await cloudinary.uploader.destroy(existing.project_thumb_pid);
      }
      thumbnailUrl = uploaded.secure_url;
      thumbnailPublicId = uploaded.public_id;
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        project_name: name,
        project_desc: desc,
        project_keywords: keywords,
        project_url: url,
        project_thumbnail: thumbnailUrl,
        project_thumb_pid: thumbnailPublicId,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (err) {
    console.error("Update project error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, ctx) {
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.admin) {
  //   return NextResponse.json(
  //     { success: false, message: "Unauthorized" },
  //     { status: 401 }
  //   );
  // }

  try {
    // ✅ Next 16 / Turbopack: params may be a Promise
    const { id } = await ctx.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing project id" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // ✅ delete from cloudinary first
    if (project.project_thumb_pid) {
      await cloudinary.uploader.destroy(project.project_thumb_pid);
    }

    // ✅ delete from mongodb
    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete project error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
