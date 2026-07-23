import { adaptSlide } from "@/lib/presentation/adapter";
import { renderPresentation } from "@/lib/presentation/renderer/render-presentation";

export default function PresentationPreview() {

  const slide = adaptSlide(
    {
      id: "1",

      intent: "bullets",

      title: "AI in Healthcare",

      body:
        "Artificial Intelligence is transforming healthcare through faster diagnosis, automation and predictive analytics.",

      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200",
    },
    0
  );

  const html = renderPresentation([slide])[0].html;

  return (
    <div
      style={{
        background: "#efefef",
        padding: 40,
        minHeight: "100vh",
      }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </div>
  );
}