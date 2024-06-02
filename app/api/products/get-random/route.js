import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const productsCount = await prismadb.product.count();
    const skip = Math.floor(Math.random() * productsCount);

    const products = await prismadb.product.findMany({
      take: 5,
      skip: skip,
      orderBy: { id: "asc" },
    });

    await prismadb.$disconnect();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log(error);
    await prismadb.$disconnect();
    return new NextResponse("Something went wrong", { status: 400 });
  }
}
