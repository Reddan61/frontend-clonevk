import React from "react"
import IProps from "./SvgInterface"

const Search:React.FC<IProps> = ({height,width,color}) => {
    return <svg xmlns="http://www.w3.org/2000/svg" height={`${height}`} viewBox="0 0 24 24" width={`${width}`} >
        <g fill="none" fillRule="evenodd"><path d="m0 0h24v24h-24z"/>
        <path d="m16.7602287 14.6529231 2.8964446 2.649819c.3906074.357348.4073389.9469542.0332853 1.3210078l-.0662697.0662697c-.3722244.3722244-.9659303.3548319-1.320999-.0332942l-2.6497846-2.896483c-1.0116996.7775182-2.2783216 1.2397576-3.6529053 1.2397576-3.3137085 0-6-2.6862915-6-6s2.6862915-6 6-6 6 2.6862915 6 6c0 1.3745918-.4622448 2.6412205-1.2397713 3.6529231zm-4.7602287.3470769c2.209139 0 4-1.790861 4-4s-1.790861-4-4-4-4 1.790861-4 4 1.790861 4 4 4z" fill="#93a3bc"/>
        </g>
    </svg>
}

export default Search