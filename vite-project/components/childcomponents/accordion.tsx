"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "./utils";

interface AccordionProps extends React.ComponentProps<typeof AccordionPrimitive.Root> {}
interface AccordionItemProps extends React.ComponentProps<typeof AccordionPrimitive.Item> {
  className?: string;
}
interface AccordionTriggerProps extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {
  className?: string;
  children: React.ReactNode;
}
interface AccordionContentProps extends React.ComponentProps<typeof AccordionPrimitive.Content> {
  className?: string;
  children: React.ReactNode;
}

/* Root Accordion */
export const Accordion: React.FC<AccordionProps> = (props) => {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
};

/* Accordion Item */
export const AccordionItem: React.FC<AccordionItemProps> = ({ className, ...props }) => {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
};

/* Accordion Trigger */
export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ className, children, ...props }) => {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="size-4 h-4 w-4 text-muted-foreground pointer-events-none shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

/* Accordion Content */
export const AccordionContent: React.FC<AccordionContentProps> = ({ className, children, ...props }) => {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
        className
      )}
      {...props}
    >
      <div className="pt-0 pb-4">{children}</div>
    </AccordionPrimitive.Content>
  );
};
