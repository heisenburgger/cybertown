import { IconProps } from "./types";

export function ShoeIcon(props: IconProps) {
  const { stroke, height, width } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 22 14"
    >
      <g stroke={stroke} strokeLinejoin="round" strokeWidth="1">
        <path d="M18.101 13H6.963c-2.934 0-4.4 0-5.295-1.117-1.697-2.12.237-7.76 1.408-9.883.397 2.4 4.486 2.333 5.975 2-.992-1.999.332-2.666.994-3h.002C13 4.5 19.315 6.404 20.861 10.219c.669 1.648-1.236 2.781-2.76 2.781z"></path>
        <path d="M21 10H1"></path>
        <path d="M12 5l3-3"></path>
        <path d="M14 7l3-3"></path>
      </g>
    </svg>
  );
}
