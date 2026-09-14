import { ItemType, colors } from "@/types";
import Displayer from "./displayer";
import ReactLenis from "lenis/react";
import { useSelectionContext } from "@/contexts/selectionContext";
import { useState } from "react";

function ItempageIframe({src, mobile}: {src: string, mobile: boolean}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const style = {
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.2s ease, transform 0.5s ease",
        aspectRatio: mobile ? '9/19.5' : 'auto',
        width: mobile ? 'auto' : '100%',
        height: mobile ? 'auto' : '75vh'
    };
    return (
        <div style={{display: 'flex', alignItems: "center"}}>
            
            {!isLoaded ? <div style={{width: '100%', height: '75vh'}}> 
                loading...
            </div>
            : <iframe src={src} onLoad={() => setIsLoaded(true)} style={style}/>}
        </div>
    )
}

export default function ItemPage({ item, onHome }: { item: ItemType; onHome: () => void }) {
    const { setCurrColor } = useSelectionContext();
    const [viewingMobile, setViewingMobile] = useState(false);
    const isIframe = (item.src && item.src[0].includes('iframe'))?? false;
    return (
        <>
            <div className="itempage-header">
                <button className="itempage-home-btn" onClick={onHome}>← Home</button>
                <a className="itempage-home-btn" href="/case-studies">Case studies</a>
            </div>

            <ReactLenis root={false} className="itempage-col" options={{ lerp: 0.5 }}>
                <div className="itempage-mainrow">
                    <div className="itempage-date">
                        <a className="itempage-title" href={item.link} target="_blank">
                            <span style={{marginRight: '5px'}}>{item.title}</span>
                            <img src="linkout.svg"/>
                        </a>
                        <br/>
                        {item.date && item.date.slice(0, -2)}
                        <br/><br/>
                        
                        {item.description && 
                            <>
                                <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                <br/>
                            </>
                        }
                        
                        {(!isIframe && item.tags?.includes('Web')) && <div onClick={() => setViewingMobile(!viewingMobile)}>
                            <a style={{textDecoration: viewingMobile ? 'auto' : 'underline'}}>
                                Desktop
                            </a>{` / `} 
                            <a style={{textDecoration: viewingMobile ? 'underline' : 'auto'}}>
                                Mobile
                            </a>
                            <br/>
                            <br/>
                        </div>}

                        {item.tags && item.tags.length > 0 && 
                            <>
                                <div>Categories: <i>{item.tags.join(', ')}</i></div>                                
                            </>
                        }
                        {item.client &&
                            <>
                                <div>
                                    Client: {item.clientLink ? 
                                        <a href={item.clientLink} target="_blank">
                                            <>{item.client}</>
                                        </a> :
                                        <>{item.client}</>
                                    }
                                    {item.clientLink && <img src="linkout.svg" style={{height: "1em"}}/>}
                                </div>                                
                            </>
                        }
                    </div>

                    <div className="itempage-desc">
                        {item.src && (isIframe ? 
                            <div style={{margin: "auto"}} dangerouslySetInnerHTML={{__html: item.src[0]}}/>
                            : item.link && <ItempageIframe src={item.link} mobile={viewingMobile}/> )
                        }
                    </div>

                </div>
                <Displayer srcs={item.src ?? []} type="image" />
            </ReactLenis>
            <div className="footer">
                {colors.map((val, index) => (
                    <div
                        className="color-block"
                        style={{ backgroundColor: val }}
                        key={index}
                        onClick={() => setCurrColor(val)}
                    />
                ))}
            </div>
        </>
    );
}