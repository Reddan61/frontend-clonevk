import React from "react"
import IProps from "./SvgInterface"

const ArrowUp:React.FC<IProps> = ({height,width,color}) => {
    return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width={`${width}`} height={`${height}`} viewBox="0 0 124.138 124.138">
        <path fill={`${color}`} d="M50.569,124.138h23.1c4.7,0,9-3.8,9-8.601V81.138c0-4.7,3.5-9,8.2-9h14.699c7.2,0,11.2-8.101,6.801-13.8l-44.101-55   c-3.5-4.5-10.2-4.4-13.6,0l-42.9,55c-4.4,5.699-0.4,13.8,6.8,13.8h14.8c4.7,0,8.3,4.2,8.3,9v34.399   C41.669,120.338,45.769,124.138,50.569,124.138z"/>
    </svg>
}

export default ArrowUp