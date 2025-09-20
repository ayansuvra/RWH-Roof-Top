"use client";

import * as React from "react";
import { cn } from "./utils";

// Table wrapper
interface TableProps extends React.ComponentProps<"table"> {}
const Table: React.FC<TableProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
};

// Table Header
interface TableHeaderProps extends React.ComponentProps<"thead"> {}
const TableHeader: React.FC<TableHeaderProps> = ({ className, ...props }) => {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
};

// Table Body
interface TableBodyProps extends React.ComponentProps<"tbody"> {}
const TableBody: React.FC<TableBodyProps> = ({ className, ...props }) => {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
};

// Table Footer
interface TableFooterProps extends React.ComponentProps<"tfoot"> {}
const TableFooter: React.FC<TableFooterProps> = ({ className, ...props }) => {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
};

// Table Row
interface TableRowProps extends React.ComponentProps<"tr"> {}
const TableRow: React.FC<TableRowProps> = ({ className, ...props }) => {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  );
};

// Table Head Cell
interface TableHeadProps extends React.ComponentProps<"th"> {}
const TableHead: React.FC<TableHeadProps> = ({ className, ...props }) => {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
};

// Table Cell
interface TableCellProps extends React.ComponentProps<"td"> {}
const TableCell: React.FC<TableCellProps> = ({ className, ...props }) => {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
};

// Table Caption
interface TableCaptionProps extends React.ComponentProps<"caption"> {}
const TableCaption: React.FC<TableCaptionProps> = ({ className, ...props }) => {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
