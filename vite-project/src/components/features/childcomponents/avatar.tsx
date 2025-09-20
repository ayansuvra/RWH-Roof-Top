"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "./utils";

/* Avatar Root Component */
interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {}

export const Avatar: React.FC<AvatarProps> = ({ className, ...props }) => {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
};

/* Avatar Image Component */
interface AvatarImageProps extends React.ComponentProps<typeof AvatarPrimitive.Image> {}

export const AvatarImage: React.FC<AvatarImageProps> = ({ className, ...props }) => {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
};

/* Avatar Fallback Component */
interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ className, ...props }) => {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
};
