import { memo } from "react";
import { Directions } from "../../constants/directions";

const Arrow2 = ({ width = 15, degrees = Directions.up }) => (<svg width={width + 'px'} height={width + 'px'} viewBox="0 0 32 32" version="1.1" transform={`rotate(${degrees})`} style={{ WebkitTransform: `rotate(${degrees}deg)`}}>
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" type="MSPage">
        <g id="Icon-Set" type="MSLayerGroup" transform="translate(-360.000000, -1087.000000)" fill="#000000">
            <path d="M376,1117 C368.268,1117 362,1110.73 362,1103 C362,1095.27 368.268,1089 376,1089 C383.732,1089 390,1095.27 390,1103 C390,1110.73 383.732,1117 376,1117 L376,1117 Z M376,1087 C367.163,1087 360,1094.16 360,1103 C360,1111.84 367.163,1119 376,1119 C384.837,1119 392,1111.84 392,1103 C392,1094.16 384.837,1087 376,1087 L376,1087 Z M376.879,1096.46 C376.639,1096.22 376.311,1096.15 376,1096.21 C375.689,1096.15 375.361,1096.22 375.121,1096.46 L369.465,1102.12 C369.074,1102.51 369.074,1103.14 369.465,1103.54 C369.854,1103.93 370.488,1103.93 370.879,1103.54 L375,1099.41 L375,1110 C375,1110.55 375.447,1111 376,1111 C376.553,1111 377,1110.55 377,1110 L377,1099.41 L381.121,1103.54 C381.512,1103.93 382.145,1103.93 382.535,1103.54 C382.926,1103.14 382.926,1102.51 382.535,1102.12 L376.879,1096.46 L376.879,1096.46 Z" id="arrow-up-circle" type="MSShapeGroup">
            </path>
        </g>
    </g>
</svg>)

export default memo(Arrow2);