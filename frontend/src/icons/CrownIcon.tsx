import { IconProps } from "./types";

export function CrownIcon(props: IconProps) {
  const { stroke, height, width } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? "20"}
      height={height ?? "22"}
      fill="none"
      viewBox="0 0 20 22"
    >
      <g stroke={stroke}>
        <path
          strokeWidth="1.5"
          d="M1.518 9.306c-.388-1.074-.582-1.611-.5-1.955.091-.377.359-.67.701-.768.313-.09.8.127 1.773.56.86.382 1.29.573 1.695.563.446-.012.874-.19 1.215-.507.31-.287.517-.744.932-1.658l.915-2.016C9.013 1.842 9.395 1 10 1s.987.842 1.751 2.525l.915 2.016c.415.914.623 1.371.932 1.658.341.316.77.495 1.215.507.404.01.835-.181 1.695-.564.974-.432 1.46-.649 1.773-.559.342.098.61.391.7.768.083.344-.111.88-.5 1.955l-1.667 4.616c-.714 1.975-1.07 2.962-1.817 3.52-.747.558-1.712.558-3.641.558H8.644c-1.93 0-2.894 0-3.64-.558-.747-.558-1.104-1.545-1.818-3.52L1.518 9.306z"
        ></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 13h.009"
        ></path>
        <path strokeLinecap="round" strokeWidth="1.5" d="M5 21h10"></path>
      </g>
    </svg>
  );
}
