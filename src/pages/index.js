import Image from "next/image";
import { Inter } from "next/font/google";
import { Component } from "@/components/component";
import { cn } from '@/lib/utils'; // Ensure this utility function is correctly imported to handle class concatenations
import { Bricolage_Grotesque } from 'next/font/google'
import { Space_Mono } from 'next/font/google'

const SPC = Space_Mono({
  weight: '400',
  subsets: ['latin'],
})

export default function Home() {
  return (
    <main
      className={cn(
        'flex min-h-screen flex-col items-center justify-between px-24',
        SPC.className
      )}
    >
      <Component />
    </main>
  );
}