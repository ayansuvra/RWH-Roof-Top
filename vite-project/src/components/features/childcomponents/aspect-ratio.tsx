"use client";

import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

/* AspectRatio Root Component */
interface AspectRatioProps
  extends React.ComponentProps<typeof AspectRatioPrimitive.Root> {}

export const AspectRatio: React.FC<AspectRatioProps> = ({ ...props }) => {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
};
