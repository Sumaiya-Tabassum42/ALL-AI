import { MarkdownRenderer } from "./markdown-renderer";

interface Props {
  role: "user" | "assistant" | "system";
  message: string;
}

export default function ChatMessage({ role, message }: Props) {
  const isUser = role === "user";

  let parsed: any = null;

  try {
    parsed = JSON.parse(message);
  } catch {
    parsed = null;
  }

  const isDocument = parsed?.type === "document" && parsed?.url;

  const isPresentation = parsed?.type === "presentation" && parsed?.url;

  const isImage =
    parsed?.type === "image" &&
    (Array.isArray(parsed?.urls) || typeof parsed?.url === "string");

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-2xl rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-[#006A4E] text-white"
            : "bg-slate-100 text-slate-900"
        }`}
      >
        {isDocument ? (
          <div className="space-y-3">
            {parsed.message && (
              <MarkdownRenderer content={parsed.message} />
            )}

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <span className="text-2xl">📄</span>

              <div className="flex-1">
                <p className="font-medium">
                  {parsed.filename || "document.docx"}
                </p>
              </div>

              <a
                href={parsed.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${
                  isUser ? "text-white" : "text-sky-600"
                }`}
              >
                Download
              </a>
            </div>
          </div>
        ) : isPresentation ? (
          <div className="space-y-3">
            {parsed.message && (
              <MarkdownRenderer content={parsed.message} />
            )}

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <span className="text-2xl">📊</span>

              <div className="flex-1">
                <p className="font-medium">
                  {parsed.filename || "presentation.pptx"}
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href={parsed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline ${
                    isUser ? "text-white" : "text-sky-600"
                  }`}
                >
                  Download
                </a>

                {parsed.editUrl && (
                  <a
                    href={parsed.editUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`underline ${
                      isUser ? "text-white" : "text-emerald-600"
                    }`}
                  >
                    Edit
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : isImage ? (
          <div className="space-y-4">
            {parsed.message && (
              <MarkdownRenderer content={parsed.message} />
            )}

            {(Array.isArray(parsed.urls)
              ? parsed.urls
              : [parsed.url]
            ).map((url: string, idx: number) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={url}
                  alt={`image-${idx}`}
                  className="max-w-full rounded-lg"
                />
              </a>
            ))}
          </div>
        ) : (
          <MarkdownRenderer content={message} />
        )}
      </div>
    </div>
  );
}