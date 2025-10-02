"use client";

import { useModalStore } from '../../../../hooks/use-modal';
import { useEffect } from 'react';

export default function SetupPage() {
  const isOpen = useModalStore((state) => state.isOpen);
  const onOpen = useModalStore((state) => state.onOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [onOpen]);

  return null;
}
