'use client';
import { Suspense } from "react";
import WeeklyCheckInPage from "./WeeklyCheckInPage";

export default function WeeklyCheckIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WeeklyCheckInPage />
    </Suspense>
  );
}
