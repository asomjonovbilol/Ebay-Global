import prismadb from "@/libs/prismadb";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerComponentClient({ cookies });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw Error();

    const orders = await prismadb.order.findMany({
      where: {
        user_id: user?.id,
      },
      orderBy: { id: "desc" },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    await prismadb.$disconnect();
    return NextResponse.json(orders);
  } catch (error) {
    console.log(error);
    await prismadb.$disconnect();
    return new NextResponse("Something went wrong", { status: 400 });
  }
}
