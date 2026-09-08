import type { SVGProps } from "react";

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconPackage(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M21 8.5v7c0 .35-.19.67-.5.84l-8 4.5a1 1 0 0 1-1 0l-8-4.5a.96.96 0 0 1-.5-.84v-7c0-.35.19-.67.5-.84l8-4.5a1 1 0 0 1 1 0l8 4.5c.31.17.5.49.5.84Z" />
      <path d="M3.27 7.96 12 12.75l8.73-4.79" />
      <path d="M12 21.5v-8.76" />
      <path d="M7.5 4.63 16.5 9.63" />
    </svg>
  );
}

export function IconMapPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M20 10.5c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.75" />
    </svg>
  );
}

export function IconTruck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 6.5h11v10h-11z" />
      <path d="M13.5 10h4l3.5 3.5v3h-7.5" />
      <circle cx="6" cy="18" r="1.75" />
      <circle cx="16.5" cy="18" r="1.75" />
    </svg>
  );
}

export function IconMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  );
}

export function IconClock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.6 2.1" />
    </svg>
  );
}

export function IconShieldCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.75 20 6v6c0 5-3.4 8.4-8 9.25C7.4 20.4 4 17 4 12V6l8-3.25Z" />
      <path d="m8.75 12.25 2.25 2.25 4.25-4.5" />
    </svg>
  );
}
