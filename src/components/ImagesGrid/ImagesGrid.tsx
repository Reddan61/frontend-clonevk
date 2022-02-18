import React, { SyntheticEvent, useEffect, useRef } from "react"
import classes from "./ImagesGrid.module.scss"

interface IProps {
    images:string[],
    deleteImage?:(index:number) => void,
    canBeDelete:boolean
}

const ImagesGrid:React.FC<IProps> = ({images, deleteImage,canBeDelete}) => {
    const imagesBlockRef = useRef<HTMLDivElement>(null)
    const imagesSideBlockRef = useRef<HTMLDivElement>(null)
    const imagesBottomBlockRef = useRef<HTMLDivElement>(null)


     //calculate side/bottom block
     useEffect(() => {
        if(!imagesBlockRef || !imagesBlockRef.current || !imagesBottomBlockRef || !imagesBottomBlockRef.current) {
            return
        }
        const sideImages:NodeListOf<HTMLDivElement> = imagesBlockRef.current.querySelectorAll(`.${classes.image_side}`)
        const bottomImages:NodeListOf<HTMLDivElement> = imagesBlockRef.current.querySelectorAll(`.${classes.image_bottom}`)
        const imageSideHeight = 340 / sideImages.length
        const bottomGap = 3 
        const imageBottomWidth = (Number(imagesBottomBlockRef.current.offsetWidth) - (bottomImages.length - 1) * bottomGap) / bottomImages.length

        sideImages.forEach((el) => {
            if(sideImages.length > 0 && imagesSideBlockRef.current) {
                imagesSideBlockRef.current.style.maxWidth = `35%`
            }
            el.style.maxHeight = imageSideHeight + "px"
        })

        bottomImages.forEach((el) => {
            el.style.maxWidth = imageBottomWidth + "px"
            el.style.width = imageBottomWidth + "px"
        })

    },[images])

    function deleteImageEvent(e:SyntheticEvent<HTMLDivElement>,position:number) {
        if(!canBeDelete || !deleteImage) {
            return
        }
        const target = e.target as HTMLTextAreaElement
        const parentDiv:HTMLDivElement | null = target.closest(`.${classes.image}`)
        if(!parentDiv) return
        parentDiv.style.transition = "all .3s linear 0s"
        parentDiv.style.width = "0"
        parentDiv.style.height = "0"
        setTimeout(() => {
            deleteImage(position)
        },300)
    }
    
    return <div ref= {imagesBlockRef} className={classes.grid}>
        <div className={classes.grid_top}>
            <div className={classes.grid_one}>
                {
                    images.slice(0,1).map((el,index) => {
                        return <div  key = {`${el} ${index}`} className={`${classes.image}`}>
                            <img 
                                src = {`${el}`}
                            />
                            {
                                canBeDelete && 
                                <div onClick={(e) => {
                                    deleteImageEvent(e,0)
                                }}>
                                    <div>
                                    </div>
                                </div>
                            }
                        </div>
                    })
                }
            </div>
            <div ref = {imagesSideBlockRef} className={classes.grid_side}>
                {
                    images.slice(1,4).map((el,index) => {
                        return <div  key = {`${el} ${index + 1}`} className={`${classes.image} ${classes.image_side}`}>
                            <img 
                                src = {`${el}`}
                            />
                            {
                                canBeDelete && 
                                <div onClick={(e) => {
                                deleteImageEvent(e,index+1)
                                }}>
                                    <div>
                                    </div>
                                </div>
                            }
                        </div>
                    })
                }
            </div>
        </div>
        <div ref = {imagesBottomBlockRef} className={classes.grid_bottom}>
            {
                    images.slice(4,images.length).map((el,index) => {
                        return <div  key = {`${el} ${index + 4}`} className={`${classes.image} ${classes.image_bottom}`}>
                            <img 
                                src = {`${el}`}
                            />
                            {
                                canBeDelete && 
                                <div onClick={(e) => {
                                    deleteImageEvent(e,index+4)
                                }}>
                                    <div>
                                    </div>
                                </div>
                            }
                        </div>
                    })
                }
        </div>
    </div>
}


export default ImagesGrid