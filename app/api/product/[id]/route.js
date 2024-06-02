import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const { id } = context.params;

    const product = await prismadb.product.findFirst({
      where: { id: Number(id) },
    });

    await prismadb.$disconnect();
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log(error);
    await prismadb.$disconnect();
    return new NextResponse("Something went wrong", { status: 400 });
  }
}
