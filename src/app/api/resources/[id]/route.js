import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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
        { success: false, message: "Missing resource id" },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.findUnique({ where: { id } });
    if (!resource) {
      return NextResponse.json(
        { success: false, message: "Resource not found" },
        { status: 404 }
      );
    }

    // ✅ delete from cloudinary first
    if (resource.resource_thumb_pid) {
      await cloudinary.uploader.destroy(resource.resource_thumb_pid);
    }

    // ✅ delete from mongodb
    await prisma.resource.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete resource error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
