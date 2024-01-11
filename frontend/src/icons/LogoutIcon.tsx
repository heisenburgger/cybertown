import { IconProps } from "./types";

export function LogoutIcon(props: IconProps) {
  const { stroke } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke={stroke}
        strokeWidth="1.5"
        d="M9.333 2.063A6.876 6.876 0 008.4 2C4.865 2 2 4.686 2 8s2.865 6 6.4 6c.317 0 .629-.022.933-.063M14 8H7.333M14 8l-2-2m2 2l-2 2"
      ></path>
    </svg>
  );
}
