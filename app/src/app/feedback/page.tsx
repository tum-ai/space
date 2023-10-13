import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import Script from "next/script";

export default function Feedback() {
  return (
    <ProtectedItem showNotFound>
      <Section>
        <div className="text-6xl font-thin">Feedback</div>
        <br />
        <div className="">
          <div
            style={{
              maxWidth: "800px",
            }}
          >
            <iframe
              data-tally-src="https://tally.so/embed/meDAQl?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
              loading="lazy"
              width="100%"
              height="427"
              title="TUM.ai space feedback"
            ></iframe>
            <Script id="tally-js" src="https://tally.so/widgets/embed.js" />
          </div>
        </div>
      </Section>
    </ProtectedItem>
  );
}
