"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";

import { useIsMobile } from "./use-mobile";
import { cn } from "./utils";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./sheet";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

// Sidebar context and hook
const SidebarContext = React.createContext<SidebarContextProps | null>(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

// Sidebar Provider
function SidebarProvider({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }: React.ComponentProps<"div"> & { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) setOpenProp(openState);
      else _setOpen(openState);
      document.cookie = `sidebar_state=${openState}; path=/; max-age=${60 * 60 * 24 * 7}`;
    },
    [setOpenProp, open]
  );

  const toggleSidebar = React.useCallback(() => isMobile ? setOpenMobile(open => !open) : setOpen(open => !open), [isMobile, setOpen, setOpenMobile]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(() => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }), [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]);

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem", ...style } as React.CSSProperties}
          className={cn("group/sidebar-wrapper flex min-h-svh w-full", className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

// Sidebar Component
function Sidebar({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }: React.ComponentProps<"div"> & { side?: "left" | "right"; variant?: "sidebar" | "floating" | "inset"; collapsible?: "offcanvas" | "icon" | "none"; }) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return <div data-slot="sidebar" className={cn("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col", className)} {...props}>{children}</div>;
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent data-slot="sidebar" className="bg-sidebar w-(--sidebar-width) p-0 [&>button]:hidden" side={side}>
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div data-slot="sidebar-desktop" data-state={state} data-collapsible={state === "collapsed" ? collapsible : ""} data-variant={variant} data-side={side} className="group peer text-sidebar-foreground hidden md:block">
      <div data-slot="sidebar-gap" className={cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", className)} />
      <div data-slot="sidebar-container" className={cn("fixed inset-y-0 z-10 hidden md:flex", side === "left" ? "left-0" : "right-0")}>
        <div data-slot="sidebar-inner" className="bg-sidebar flex h-full w-full flex-col">{children}</div>
      </div>
    </div>
  );
}

// Sidebar Trigger
function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button data-slot="sidebar-trigger" variant="ghost" size="icon" className={cn("size-7", className)} onClick={e => { onClick?.(e); toggleSidebar(); }} {...props}>
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

// Sidebar Rail
function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();
  return (
    <button data-slot="sidebar-rail" aria-label="Toggle Sidebar" onClick={toggleSidebar} className={cn("absolute inset-y-0 z-20 hidden w-4 sm:flex", className)} {...props} />
  );
}

// Sidebar Sections & Elements
function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return <main data-slot="sidebar-inset" className={cn("bg-background relative flex w-full flex-1 flex-col", className)} {...props} />;
}
function SidebarInput(props: React.ComponentProps<typeof Input>) { return <Input data-slot="sidebar-input" className={cn("bg-background h-8 w-full shadow-none", props.className)} {...props} />; }
function SidebarHeader(props: React.ComponentProps<"div">) { return <div data-slot="sidebar-header" className={cn("flex flex-col gap-2 p-2", props.className)} {...props} />; }
function SidebarFooter(props: React.ComponentProps<"div">) { return <div data-slot="sidebar-footer" className={cn("flex flex-col gap-2 p-2", props.className)} {...props} />; }
function SidebarSeparator(props: React.ComponentProps<typeof Separator>) { return <Separator data-slot="sidebar-separator" className={cn("bg-sidebar-border mx-2 w-auto", props.className)} {...props} />; }
function SidebarContent(props: React.ComponentProps<"div">) { return <div data-slot="sidebar-content" className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto", props.className)} {...props} />; }
function SidebarGroup(props: React.ComponentProps<"div">) { return <div data-slot="sidebar-group" className={cn("relative flex w-full min-w-0 flex-col p-2", props.className)} {...props} />; }
function SidebarGroupLabel({ asChild = false, ...props }: React.ComponentProps<"div"> & { asChild?: boolean }) { const Comp = asChild ? Slot : "div"; return <Comp data-slot="sidebar-group-label" className={cn("text-sidebar-foreground/70 flex h-8 items-center rounded-md px-2 text-xs font-medium", props.className)} {...props} />; }
function SidebarGroupAction({ asChild = false, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) { const Comp = asChild ? Slot : "button"; return <Comp data-slot="sidebar-group-action" className={cn("absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0", props.className)} {...props} />; }
function SidebarGroupContent(props: React.ComponentProps<"div">) { return <div data-slot="sidebar-group-content" className={cn("w-full text-sm", props.className)} {...props} />; }
function SidebarMenu(props: React.ComponentProps<"ul">) { return <ul data-slot="sidebar-menu" className={cn("flex w-full flex-col gap-1", props.className)} {...props} />; }
function SidebarMenuItem(props: React.ComponentProps<"li">) { return <li data-slot="sidebar-menu-item" className={cn("group/menu-item relative", props.className)} {...props} />; }
function SidebarMenuBadge(props: React.ComponentProps<"div">) { return <div data-slot="sidebar-menu-badge" className={cn("absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium", props.className)} {...props} />; }
function SidebarMenuSkeleton({ showIcon = false, ...props }: React.ComponentProps<"div"> & { showIcon?: boolean }) {
  const width = React.useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, []);
  return (
    <div data-slot="sidebar-menu-skeleton" className={cn("flex h-8 items-center gap-2 rounded-md px-2", props.className)} {...props}>
      {showIcon && <Skeleton className="size-4 rounded-md" />}
      <Skeleton className="h-4 flex-1" style={{ "--skeleton-width": width } as React.CSSProperties} />
    </div>
  );
}
function SidebarMenuSub(props: React.ComponentProps<"ul">) { return <ul data-slot="sidebar-menu-sub" className={cn("flex flex-col gap-1 border-l px-2.5 py-0.5", props.className)} {...props} />; }
function SidebarMenuSubItem(props: React.ComponentProps<"li">) { return <li data-slot="sidebar-menu-sub-item" className={cn("group/menu-sub-item relative", props.className)} {...props} />; }
function SidebarMenuSubButton({ asChild = false, ...props }: React.ComponentProps<"a"> & { asChild?: boolean }) { const Comp = asChild ? Slot : "a"; return <Comp data-slot="sidebar-menu-sub-button" className={cn("flex h-7 min-w-0 items-center gap-2 rounded-md px-2", props.className)} {...props} />; }
// Sidebar Menu Button
const sidebarMenuButtonVariants = cva(
  "peer/menu-button text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground aria-disabled:cursor-not-allowed aria-disabled:opacity-50 has-[[data-slot=sidebar-menu-action]]:pr-8",
  {
    variants: {
      variant: {
        default: "data-[active]:bg-sidebar-accent data-[active]:text-sidebar-accent-foreground",
        outline: "border border-sidebar-border bg-transparent shadow-xs hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function SidebarMenuButton({
  asChild = false,
  variant,
  size,
  tooltip,
  className,
  ...props
}: React.ComponentProps<"a"> & VariantProps<typeof sidebarMenuButtonVariants> & { asChild?: boolean; tooltip?: string }) {
  const Comp = asChild ? Slot : "a";
  const { state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-variant={variant}
      data-size={size}
      className={cn("flex w-full items-center gap-2 rounded-md px-2 py-1.5", sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (tooltip && state === "collapsed") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

// Sidebar Menu Action
function SidebarMenuAction({
  asChild = false,
  className,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="sidebar-menu-action"
      className={cn(
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-1 right-1 flex aspect-square size-6 items-center justify-center rounded-md",
        className
      )}
      {...props}
    />
  );
}


// Export everything
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
