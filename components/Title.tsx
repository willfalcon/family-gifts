import { PropsWithChildren } from "react";

export default function Title({children}: PropsWithChildren) {
  return (
    <h1 className="text-3xl font-bold tracking-tight">{children}</h1>
  )
}