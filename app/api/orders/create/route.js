import prismadb from "@/libs/prismadb";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = createServerComponentClient({ cookies });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw Error();

    const body = await req.json();

    const order = await prismadb.order.create({
      data: {
        user_id: user?.id,
        stripe_id: body.stripe_id,
        name: body.name,
        address: body.address,
        zipcode: body.zipcode,
        city: body.city,
        country: body.country,
        total: Number(body.total),
      },
    });

    body.products.forEach(async (prod) => {
      await prismadb.orderItem.create({
        data: {
          order_id: order.id,
          product_id: Number(prod.id),
        },
      });
    });

    await prismadb.$disconnect();
    // return NextResponse.json("Order complete", { status: 200 });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.log(error);
    await prismadb.$disconnect();
    return new NextResponse("Something went wrong", { status: 400 });
  }
}
