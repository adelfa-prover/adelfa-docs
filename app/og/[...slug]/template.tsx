export function OgTemplate({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "60px 80px",
        backgroundColor: "#050505",
        backgroundImage:
          "linear-gradient(135deg, rgba(0, 174, 239, 0.25), transparent 60%)",
        fontFamily: "Geist, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 40,
              color: "#a0a0a0",
              lineHeight: 1.3,
              maxHeight: "104px",
              overflow: "hidden",
            }}
          >
            {description}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <img
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmlld0JveD0iMCAwIDYxLjU0NzA3MiA2Mi41NDg2MzEiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzExIgogICB3aWR0aD0iNjEuNTQ3MDciCiAgIGhlaWdodD0iNjIuNTQ4NjM0IgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIj4KICAgIDxzdHlsZQogICAgICAgaWQ9InN0eWxlMSI+LmNscy0xe2lzb2xhdGlvbjppc29sYXRlO30uY2xzLTJ7ZmlsbDojMDBhZWVmO30uY2xzLTN7bWl4LWJsZW5kLW1vZGU6bXVsdGlwbHk7fTwvc3R5bGU+CiAgPC9kZWZzPgogIDxnCiAgICAgY2xhc3M9ImNscy0xIgogICAgIGlkPSJnMTEiCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC44NjMxMDc0NiwwLDAsMC44NjMxMDc0NiwtNzkuMTA4Mjk5LDIyLjk0NDI3NSkiPgogICAgPGcKICAgICAgIGlkPSJMYXllcl8yIj4KICAgICAgPGcKICAgICAgICAgaWQ9IkxheWVyXzEtMiIKICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoNC45NjAyNDA1LDAsMCw0Ljk2MDI0MDUsLTUxMC41MDI5NiwtMjYuNTgzMzM1KSI+CiAgICAgICAgPGcKICAgICAgICAgICBjbGFzcz0iY2xzLTMiCiAgICAgICAgICAgaWQ9ImcxIiAvPgogICAgICAgIDxnCiAgICAgICAgICAgY2xhc3M9ImNscy0zIgogICAgICAgICAgIGlkPSJnNSIgLz4KICAgICAgICA8ZwogICAgICAgICAgIGNsYXNzPSJjbHMtMyIKICAgICAgICAgICBpZD0iZzYiIC8+CiAgICAgICAgPGcKICAgICAgICAgICBjbGFzcz0iY2xzLTMiCiAgICAgICAgICAgaWQ9Imc3IiAvPgogICAgICAgIDxnCiAgICAgICAgICAgY2xhc3M9ImNscy0zIgogICAgICAgICAgIGlkPSJnOCI+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgY2xhc3M9ImNscy0yIgogICAgICAgICAgICAgZD0ibSAxMzEuNzQsMTQuMDIgYyAwLDAgMC4xNSwtMy4zNCAtMy40NywtNi45NiAtMy42MiwtMy42MiAtNi44NiwtMy4zNyAtNi44NiwtMy4zNyAwLDAgLTAuNDEsMy4wOCAzLjM3LDYuODYgMy41NywzLjU3IDYuOTYsMy40NyA2Ljk2LDMuNDcgeiIKICAgICAgICAgICAgIGlkPSJwYXRoOCIgLz4KICAgICAgICA8L2c+CiAgICAgICAgPGcKICAgICAgICAgICBjbGFzcz0iY2xzLTMiCiAgICAgICAgICAgaWQ9Imc5Ij4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBjbGFzcz0iY2xzLTIiCiAgICAgICAgICAgICBkPSJtIDEyNS40MywxNC4wMiBjIDAsMCAzLjM0LDAuMTUgNi45NiwtMy40NyAzLjc4LC0zLjc4IDMuMzcsLTYuODYgMy4zNywtNi44NiAwLDAgLTMuMDgsLTAuNDEgLTYuODYsMy4zNyAtMy41NywzLjU3IC0zLjQ3LDYuOTYgLTMuNDcsNi45NiB6IgogICAgICAgICAgICAgaWQ9InBhdGg5IiAvPgogICAgICAgIDwvZz4KICAgICAgICA8ZwogICAgICAgICAgIGNsYXNzPSJjbHMtMyIKICAgICAgICAgICBpZD0iZzEwIj4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBjbGFzcz0iY2xzLTIiCiAgICAgICAgICAgICBkPSJtIDEyOC41OSwxNC42MSBjIDAsMCAyLjQ2LC0yLjI2IDIuNDYsLTcuMzggMCwtNS4zNCAtMi40NiwtNy4yMyAtMi40NiwtNy4yMyAwLDAgLTIuNDYsMS44OSAtMi40Niw3LjIzIDAsNS4wNCAyLjQ2LDcuMzggMi40Niw3LjM4IHoiCiAgICAgICAgICAgICBpZD0icGF0aDEwIiAvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg=="
          width={56}
          height={56}
        />
        <div style={{ fontSize: 42, color: "#ffffff", fontWeight: 600 }}>
          Adelfa
        </div>
      </div>
    </div>
  );
}
