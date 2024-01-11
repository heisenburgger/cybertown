import { IconProps } from "./types";

export function ShieldIcon(props: IconProps) {
  const { stroke } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.998 2c-2.85 0-4.697 2.019-6.882 2.755-.888.3-1.333.449-1.512.66-.18.21-.233.519-.338 1.135-1.127 6.596 1.336 12.694 7.209 15.068.631.255.947.382 1.526.382.58 0 .896-.128 1.527-.383 5.873-2.373 8.333-8.471 7.206-15.067-.106-.616-.158-.925-.338-1.136-.18-.21-.624-.36-1.512-.659C16.698 4.019 14.848 2 11.998 2z"
      ></path>
      <path
        fill="#141B34"
        d="M19.53 5.53a.75.75 0 00-1.06-1.06l1.06 1.06zM5.47 17.47a.75.75 0 101.06 1.06l-1.06-1.06zm13-13l-13 13 1.06 1.06 13-13-1.06-1.06z"
      ></path>
    </svg>
  );
}
