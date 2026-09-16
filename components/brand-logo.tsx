import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/myupline-logo.jpg"
        alt="MyUpline logo"
        width={44}
        height={44}
        className="rounded-lg"
        priority
      />
      <span className="text-lg font-bold tracking-normal">MyUpline</span>
    </div>
  );
}
