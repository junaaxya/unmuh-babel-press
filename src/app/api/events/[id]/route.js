import { prisma } from "@/lib/db";
import { eventSchema } from "@/lib/validation";
import { authorize } from "@/lib/authorize";

export async function GET(request, { params }) {
  const id = parseInt(params.id);
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    return Response.json({ status: "error", message: "Event tidak ditemukan" }, { status: 404 });
  }

  return Response.json({ status: "success", data: event });
}

export async function PUT(request, context) {
  const authError = await authorize(request);
  if (authError) return authError;
  try {
    const id = parseInt(context.params.id);
    const body = await request.json();
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ status: "error", errors: parsed.error.flatten() }, { status: 400 });
    }

    const { title, ...rest } = parsed.data;
    const slug =
      title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") + `-${Date.now()}`;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...rest,
        title,
        slug,
        date: new Date(parsed.data.date),
        registrationDeadline: parsed.data.registrationDeadline ? new Date(parsed.data.registrationDeadline) : null,
      },
    });

    return Response.json({ status: "success", data: updatedEvent });
  } catch (error) {
    return Response.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const authError = await authorize(request);
  if (authError) return authError;

  const id = parseInt(context.params.id);

  await prisma.event.delete({ where: { id } });

  return Response.json({
    status: "success",
    message: "Event berhasil dihapus",
  });
}
