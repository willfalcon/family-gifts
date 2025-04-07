import { PropsWithChildren } from 'react';

export default function Title({ children }: PropsWithChildren) {
  return <h1 className="text-3xl font-bold tracking-tight">{children}</h1>;
}
export function SubTitle({ children }: PropsWithChildren) {
  return <p className="text-muted-foreground">{children}</p>;
}
