'use client';

import Link from 'next/link';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState, useEffect, useCallback, useRef, Fragment } from 'react';

export interface Breadcrumb {
  name: string;
  href: string;
}

interface BreadcrumbsContextType {
  items: Breadcrumb[];
  setItems: Dispatch<SetStateAction<Breadcrumb[]>>;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextType>({
  items: [],
  setItems: () => undefined,
});

export function BreadcrumbsProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<Breadcrumb[]>([]);
  return <BreadcrumbsContext.Provider value={{ items, setItems }}>{children}</BreadcrumbsContext.Provider>;
}

export function useBreadcrumbs() {
  const context = useContext(BreadcrumbsContext);
  const breadcrumbsRef = useRef<Breadcrumb[]>([]);

  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider');
  }

  // Update the ref immediately but use effect for state updates
  const setBreadcrumbs = useCallback((items: Breadcrumb[] | (() => Breadcrumb[])) => {
    breadcrumbsRef.current = typeof items === 'function' ? items() : items;
  }, []);

  // Handle the actual state update in an effect
  useEffect(() => {
    context.setItems(breadcrumbsRef.current);

    return () => {
      context.setItems([]);
    };
  }, []);

  return setBreadcrumbs;
}

export default function HeaderBreadcrumbs() {
  const context = useContext(BreadcrumbsContext);

  if (!context) {
    throw new Error('HeaderBreadcrumbs must be used within a BreadcrumbsProvider');
  }

  const { items } = context;

  if (!items.length) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item: Breadcrumb, index: number) => (
          <Fragment key={`${item.href}-${index}`}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href={item.href}>{item.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
