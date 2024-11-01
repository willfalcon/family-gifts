import { auth } from "@/auth";
import SignIn from "@/components/SignIn";
import {  getInvitedMember } from "@/prisma/queries";
import { redirect } from "next/navigation";
import JoinButton from "./JoinButton";

type PageProps = {
  params: { slug: string },
  searchParams: { [key: string]: string | undefined }
}

export default async function JoinPage({searchParams}: PageProps) {
  const {token} = searchParams;

  if (!token) {
    redirect('/');
  }

  const session = await auth();

  if (!session?.user) {
    return (
      <div>
        <h2>Sign in to join.</h2>
        <SignIn />
      </div>
    );
  }

  const { familyMember, success, message } = await getInvitedMember(token);

  return (
    <div>
      {!success ? (
        <p>{message}</p>
      ) : (
        <JoinButton name={familyMember?.family.name || ''} token={token} />
      )}
    </div>
  )
}