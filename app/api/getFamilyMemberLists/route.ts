import { getFamilyMemberLists } from "@/prisma/queries";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await getFamilyMemberLists();
  return NextResponse.json(res);
}