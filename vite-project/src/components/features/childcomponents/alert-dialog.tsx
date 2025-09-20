"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "./utils";
import { buttonVariants } from "./button";

interface AlertDialogProps extends React.ComponentProps<typeof AlertDialogPrimitive.Root> {}
interface AlertDialogTriggerProps extends React.ComponentProps<typeof AlertDialogPrimitive.Trigger> {}
interface AlertDialogPortalProps extends React.ComponentProps<typeof AlertDialogPrimitive.Portal> {}
interface AlertDialogOverlayProps extends React.ComponentProps<typeof AlertDialogPrimitive.Overlay> {
  className?: string;
}
interface AlertDialogContentProps extends React.ComponentProps<typeof AlertDialogPrimitive.Content> {
  className?: string;
}
interface AlertDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
interface AlertDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
interface AlertDialogTitleProps extends React.ComponentProps<typeof AlertDialogPrimitive.Title> {
  className?: string;
}
interface AlertDialogDescriptionProps extends React.ComponentProps<typeof AlertDialogPrimitive.Description> {
  className?: string;
}
interface AlertDialogActionProps extends React.ComponentProps<typeof AlertDialogPrimitive.Action> {
  className?: string;
}
interface AlertDialogCancelProps extends React.ComponentProps<typeof AlertDialogPrimitive.Cancel> {
  className?: string;
}

/* Root */
export const AlertDialog: React.FC<AlertDialogProps> = (props) => {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
};

/* Trigger */
export const AlertDialogTrigger: React.FC<AlertDialogTriggerProps> = (props) => {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
};

/* Portal */
export const AlertDialogPortal: React.FC<AlertDialogPortalProps> = (props) => {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
};

/* Overlay */
export const AlertDialogOverlay: React.FC<AlertDialogOverlayProps> = ({ className, ...props }) => {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
};

/* Content */
export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ className, ...props }) => {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
};

/* Header & Footer */
export const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({ className, ...props }) => {
  return (
    <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />
  );
};

export const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ className, ...props }) => {
  return (
    <div data-slot="alert-dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
  );
};

/* Title & Description */
export const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ className, ...props }) => {
  return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={cn("text-lg font-semibold", className)} {...props} />;
};

export const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ className, ...props }) => {
  return <AlertDialogPrimitive.Description data-slot="alert-dialog-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
};

/* Action Buttons */
export const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ className, ...props }) => {
  return <AlertDialogPrimitive.Action className={cn(buttonVariants(), className)} {...props} />;
};

export const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ className, ...props }) => {
  return <AlertDialogPrimitive.Cancel className={cn(buttonVariants({ variant: "outline" }), className)} {...props} />;
};
