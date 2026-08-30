'use client';

import React from 'react';
import { useVimCommands } from '../hooks/useVimCommands';

export default function VimCommandsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useVimCommands(150);

  return <>{children}</>;
}
