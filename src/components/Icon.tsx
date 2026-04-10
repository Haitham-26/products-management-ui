import type React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import type { ThemeType } from "../theme/theme";

type IconProps = {
  icon: IconProp;
  size?: SizeProp;
  className?: string;
  color?: keyof ThemeType["colors"];
};

export const Icon: React.FC<IconProps> = (props) => {
  return <FontAwesomeIcon {...props} />;
};
