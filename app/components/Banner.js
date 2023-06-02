export default function Banner({
    headline,
    text,
    buttonText,
    buttonLink,
    height,
    maxHeight,
    backgroundColor,
    buttonBackgroundColor,
}) {
    return (
        <div
            className="banner_top top-0 left-0 right-0 w-full z-50 fixed p-2"
            style={{
                backgroundColor: backgroundColor || "#fecaca",
                height: height || "150px",
                maxHeight: maxHeight || "350px",
            }}
        >
            <div className="flex flex-row justify-center items-baseline h-full">
                <div className="flex items-center h-full justify-center flex-col md:flex-row">
                    <div className="flex items-center sm:mr-5  flex-col sm:flex-row">
                        <h4 className="my-0 uppercase sm:mr-5">{headline}</h4>
                        <div
                            className="my-0 text-center uppercase prose"
                            dangerouslySetInnerHTML={{ __html: text }}
                        ></div>
                    </div>
                    <a
                        className="block p-1 my-1"
                        href={buttonLink}
                        style={{
                            backgroundColor:
                                buttonBackgroundColor || "transparent",
                        }}
                    >
                        {buttonText}
                    </a>
                </div>
            </div>
        </div>
    );
}