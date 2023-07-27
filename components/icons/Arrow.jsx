import { memo } from "react";
import { Directions } from "../../constants/directions";

const Arrow = ({ fill, degrees = Directions.up }) => (
    <svg width="40" height="40" viewBox="0 0 10 10" transform={`rotate(${degrees})`}>
        <path d="M5 1L1 9H9L5 1z" fill={fill} />
    </svg>
);

export default memo(Arrow);