function Banner({
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
      className="banner_top fixed left-0 right-0 top-0 z-50 w-full p-2"
      style={{
        backgroundColor: backgroundColor || "#fecaca",
        height: height || "150px",
        maxHeight: maxHeight || "350px",
      }}
    >
      <div className="flex h-full flex-row items-baseline justify-center">
        <div className="flex h-full flex-col items-center justify-center md:flex-row">
          <div className="flex flex-col items-center  sm:mr-5 sm:flex-row">
            <h4 className="my-0 uppercase sm:mr-5">{headline}</h4>
            <div
              className="prose my-0 text-center uppercase"
              dangerouslySetInnerHTML={{ __html: text }}
            ></div>
          </div>
          <a
            className="my-1 block p-1"
            href={buttonLink}
            style={{
              backgroundColor: buttonBackgroundColor || "transparent",
            }}
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Banner;
