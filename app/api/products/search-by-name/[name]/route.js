import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const { name } = context.params;

    const items = await prismadb.product.findMany({
      take: 5,
      where: {
        title: {
          contains: name,
          mode: "insensitive",
        },
      },
    });

    await prismadb.$disconnect();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.log(error);
    await prismadb.$disconnect();
    return new NextResponse("Something went wrong", { status: 400 });
  }
}
