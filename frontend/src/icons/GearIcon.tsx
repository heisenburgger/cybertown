import { IconProps } from "./types";

export function GearIcon(props: IconProps) {
  const { stroke } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 22 22"
    >
      <g stroke={stroke}>
        <path
          strokeWidth="1.5"
          d="M15.308 3.384c-.59 0-.886 0-1.155-.1a1.61 1.61 0 01-.111-.046c-.261-.12-.47-.328-.888-.746-.962-.962-1.443-1.443-2.034-1.488a1.6 1.6 0 00-.24 0c-.591.045-1.072.526-2.034 1.488-.418.418-.627.627-.888.746a1.602 1.602 0 01-.11.046c-.27.1-.565.1-1.156.1h-.11c-1.507 0-2.261 0-2.73.468-.468.469-.468 1.223-.468 2.73v.11c0 .59 0 .886-.1 1.155-.014.038-.03.075-.046.111-.12.261-.328.47-.746.888-.962.962-1.443 1.443-1.488 2.034a1.6 1.6 0 000 .24c.045.591.526 1.072 1.488 2.034.418.418.627.627.746.888.017.036.032.073.046.11.1.27.1.565.1 1.156v.11c0 1.507 0 2.261.468 2.73.469.468 1.223.468 2.73.468h.11c.59 0 .886 0 1.155.1.038.014.075.03.111.046.261.12.47.328.888.746.962.962 1.443 1.443 2.034 1.488.08.006.16.006.24 0 .591-.045 1.072-.526 2.034-1.488.418-.418.627-.627.888-.746.036-.017.073-.032.11-.046.27-.1.565-.1 1.156-.1h.11c1.507 0 2.261 0 2.73-.468.468-.469.468-1.223.468-2.73v-.11c0-.59 0-.886.1-1.155.014-.038.03-.075.046-.111.12-.261.328-.47.746-.888.962-.962 1.443-1.443 1.488-2.034.006-.08.006-.16 0-.24-.045-.591-.526-1.072-1.488-2.034-.418-.418-.627-.627-.746-.888a1.628 1.628 0 01-.046-.11c-.1-.27-.1-.565-.1-1.156v-.11c0-1.507 0-2.261-.468-2.73-.469-.468-1.223-.468-2.73-.468h-.11z"
        ></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M11.242 15v-4c0-.471 0-.707-.146-.854-.147-.146-.382-.146-.854-.146"
        ></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10.992 7h.009"
        ></path>
      </g>
    </svg>
  );
}
