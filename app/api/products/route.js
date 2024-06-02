import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prismadb.product.findMany();

    await prismadb.$disconnect();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log(error);
    await prismadb.$disconnect();
    return new NextResponse("Something went wrong", { status: 400 });
  }
}
