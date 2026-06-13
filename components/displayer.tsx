import Image from "next/image";

export default function Displayer({srcs, type}: {srcs: string[], type: "iframe" | "image"}) {
    return (
        <div>
            {srcs && 
                <div className="slice1">
                    {srcs.length > 0 && 
                        <Image 
                            src={srcs[0]} 
                            alt={type} 
                            width={600} 
                            height={600}
                        />
                    }
                    <div className="slice2">
                        <Image 
                            src={srcs[0]} 
                            alt={type} 
                            width={600} 
                            height={600}
                        />
                        <Image 
                            src={srcs[0]} 
                            alt={type} 
                            width={600} 
                            height={600}
                        />
                    </div>
                </div>
            }
        </div>
    );
}