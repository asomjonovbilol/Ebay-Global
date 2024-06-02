import prismadb from "@/libs/prismadb";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const supabase = createServerComponentClient({ cookies });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw Error();

    const body = await req.json();

    const res = await prismadb.address.update({
      where: { id: Number(body.addressId) },
      data: {
        name: body.name,
        address: body.address,
        zipcode: body.zipcode,
        city: body.city,
        country: body.country,
      },
    });

    await prismadb.$disconnect();
    return NextResponse.json(res);
  } catch (error) {
    console.log(error);
    await prismadb.$disconnect();
    return new NextResponse("Something went wrong", { status: 400 });
  }
}
