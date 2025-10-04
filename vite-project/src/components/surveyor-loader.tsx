// src/components/surveyor-loader.tsx
import { lazy, Suspense } from "react";

const SurveyorApp = lazy(() => import("./surveyor-app"));

export default function SurveyorLoader({ apiKey }: { apiKey: string }) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center text-sm text-muted-foreground">
          Loading surveyor...
        </div>
      }
    >
      <SurveyorApp apiKey={apiKey} />
    </Suspense>
  );
}
