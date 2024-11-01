'use client';

import { Breadcrumb, useBreadcrumbs } from './HeaderBreadcrumbs';

export default function SetBreadcrumbs({ items }: { items: Breadcrumb[] }) {
  const setBreadcrumbs = useBreadcrumbs();
  if (items) {
    setBreadcrumbs(items);
  }

  return null;
}
