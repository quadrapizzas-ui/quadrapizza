"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function DeliveryRootPage() {
  const router = useRouter();
  const { activeUser } = useAuthStore();

  useEffect(() => {
    if (activeUser) {
      router.replace("/delivery/mis-viajes");
    } else {
      router.replace("/delivery/login");
    }
  }, [router, activeUser]);

  return null;
}
