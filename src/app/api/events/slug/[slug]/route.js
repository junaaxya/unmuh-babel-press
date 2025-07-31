import { prisma } from "@/lib/db";

export async function GET(request, context) {
  const { slug } = context.params;

  const event = await prisma.event.findUnique({ where: { slug } });

  if (!event) {
    return Response.json({ status: "error", message: "event dengan slug ini tidak ditemukan" }, { status: 404 });
  }

  return Response.json({ status: "success", data: event });
}
