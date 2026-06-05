function isHome(slugs: string[]): boolean {
  return slugs.length === 0;
}

function HomeOgImage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        position: "relative",
        width: 1200,
        height: 630,
        fontFamily: "SF Pro",
        margin: 0,
        padding: 0,
        backgroundColor: "#212121",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 16,
          height: 240,
          marginLeft: 70,
        }}
      >
        <img
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmlld0JveD0iMCAwIDYxLjU0NzA3MiA2Mi41NDg2MzEiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzExIgogICB3aWR0aD0iNjEuNTQ3MDciCiAgIGhlaWdodD0iNjIuNTQ4NjM0IgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIj4KICAgIDxzdHlsZQogICAgICAgaWQ9InN0eWxlMSI+LmNscy0xe2lzb2xhdGlvbjppc29sYXRlO30uY2xzLTJ7ZmlsbDojMDBhZWVmO30uY2xzLTN7bWl4LWJsZW5kLW1vZGU6bXVsdGlwbHk7fTwvc3R5bGU+CiAgPC9kZWZzPgogIDxnCiAgICAgY2xhc3M9ImNscy0xIgogICAgIGlkPSJnMTEiCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC44NjMxMDc0NiwwLDAsMC44NjMxMDc0NiwtNzkuMTA4Mjk5LDIyLjk0NDI3NSkiPgogICAgPGcKICAgICAgIGlkPSJMYXllcl8yIj4KICAgICAgPGcKICAgICAgICAgaWQ9IkxheWVyXzEtMiIKICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoNC45NjAyNDA1LDAsMCw0Ljk2MDI0MDUsLTUxMC41MDI5NiwtMjYuNTgzMzM1KSI+CiAgICAgICAgPGcKICAgICAgICAgICBjbGFzcz0iY2xzLTMiCiAgICAgICAgICAgaWQ9ImcxIiAvPgogICAgICAgIDxnCiAgICAgICAgICAgY2xhc3M9ImNscy0zIgogICAgICAgICAgIGlkPSJnNSIgLz4KICAgICAgICA8ZwogICAgICAgICAgIGNsYXNzPSJjbHMtMyIKICAgICAgICAgICBpZD0iZzYiIC8+CiAgICAgICAgPGcKICAgICAgICAgICBjbGFzcz0iY2xzLTMiCiAgICAgICAgICAgaWQ9Imc3IiAvPgogICAgICAgIDxnCiAgICAgICAgICAgY2xhc3M9ImNscy0zIgogICAgICAgICAgIGlkPSJnOCI+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgY2xhc3M9ImNscy0yIgogICAgICAgICAgICAgZD0ibSAxMzEuNzQsMTQuMDIgYyAwLDAgMC4xNSwtMy4zNCAtMy40NywtNi45NiAtMy42MiwtMy42MiAtNi44NiwtMy4zNyAtNi44NiwtMy4zNyAwLDAgLTAuNDEsMy4wOCAzLjM3LDYuODYgMy41NywzLjU3IDYuOTYsMy40NyA2Ljk2LDMuNDcgeiIKICAgICAgICAgICAgIGlkPSJwYXRoOCIgLz4KICAgICAgICA8L2c+CiAgICAgICAgPGcKICAgICAgICAgICBjbGFzcz0iY2xzLTMiCiAgICAgICAgICAgaWQ9Imc5Ij4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBjbGFzcz0iY2xzLTIiCiAgICAgICAgICAgICBkPSJtIDEyNS40MywxNC4wMiBjIDAsMCAzLjM0LDAuMTUgNi45NiwtMy40NyAzLjc4LC0zLjc4IDMuMzcsLTYuODYgMy4zNywtNi44NiAwLDAgLTMuMDgsLTAuNDEgLTYuODYsMy4zNyAtMy41NywzLjU3IC0zLjQ3LDYuOTYgLTMuNDcsNi45NiB6IgogICAgICAgICAgICAgaWQ9InBhdGg5IiAvPgogICAgICAgIDwvZz4KICAgICAgICA8ZwogICAgICAgICAgIGNsYXNzPSJjbHMtMyIKICAgICAgICAgICBpZD0iZzEwIj4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBjbGFzcz0iY2xzLTIiCiAgICAgICAgICAgICBkPSJtIDEyOC41OSwxNC42MSBjIDAsMCAyLjQ2LC0yLjI2IDIuNDYsLTcuMzggMCwtNS4zNCAtMi40NiwtNy4yMyAtMi40NiwtNy4yMyAwLDAgLTIuNDYsMS44OSAtMi40Niw3LjIzIDAsNS4wNCAyLjQ2LDcuMzggMi40Niw3LjM4IHoiCiAgICAgICAgICAgICBpZD0icGF0aDEwIiAvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg=="
          width={240}
          height={240}
        />
        <div
          style={{
            fontSize: 180,
            color: "white",
            fontWeight: "bold",
          }}
        >
          Adelfa
        </div>
      </div>
      <div
        style={{
          color: "white",
          fontSize: 54,
          fontWeight: 350,
          marginLeft: 120,
        }}
      >
        A proof assistant for LF Specifications
      </div>
    </div>
  );
}

export function OgTemplate({
  slugs,
  title,
  description,
  backgroundImage,
}: {
  slugs: string[];
  title: string;
  description?: string;
  backgroundImage: string;
}) {
  console.log(title, slugs);
  return isHome(slugs) ? (
    HomeOgImage()
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignContent: "space-between",
        position: "relative",
        width: 1200,
        height: 630,
        fontFamily: "SF Pro",
        margin: 0,
        padding: 0,
      }}
    >
      <img
        src={backgroundImage}
        width={1200}
        height={630}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          marginLeft: 70,
          marginTop: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            gap: 38,
          }}
        >
          <div
            style={{
              width: 15,
              backgroundColor: "#4daae8",
              padding: 0,
              margin: 0,
            }}
          />
          <div
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "white",
              lineHeight: "80px",
              width: 830,
              maxHeight: 240,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </div>
        </div>
        {description ? (
          <div
            style={{
              color: "white",
              fontSize: 48,
              lineHeight: "58px",
              fontWeight: 350,
              width: 830,
            }}
          >
            {description}
          </div>
        ) : undefined}
      </div>
      <div
        style={{
          marginLeft: 70,
          marginBottom: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            height: 56,
          }}
        >
          <img
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmlld0JveD0iMCAwIDYxLjU0NzA3MiA2Mi41NDg2MzEiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzExIgogICB3aWR0aD0iNjEuNTQ3MDciCiAgIGhlaWdodD0iNjIuNTQ4NjM0IgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIj4KICAgIDxzdHlsZQogICAgICAgaWQ9InN0eWxlMSI+LmNscy0xe2lzb2xhdGlvbjppc29sYXRlO30uY2xzLTJ7ZmlsbDojMDBhZWVmO30uY2xzLTN7bWl4LWJsZW5kLW1vZGU6bXVsdGlwbHk7fTwvc3R5bGU+CiAgPC9kZWZzPgogIDxnCiAgICAgY2xhc3M9ImNscy0xIgogICAgIGlkPSJnMTEiCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC44NjMxMDc0NiwwLDAsMC44NjMxMDc0NiwtNzkuMTA4Mjk5LDIyLjk0NDI3NSkiPgogICAgPGcKICAgICAgIGlkPSJMYXllcl8yIj4KICAgICAgPGcKICAgICAgICAgaWQ9IkxheWVyXzEtMiIKICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoNC45NjAyNDA1LDAsMCw0Ljk2MDI0MDUsLTUxMC41MDI5NiwtMjYuNTgzMzM1KSI+CiAgICAgICAgPGcKICAgICAgICAgICBjbGFzcz0iY2xzLTMiCiAgICAgICAgICAgaWQ9ImcxIiAvPgogICAgICAgIDxnCiAgICAgICAgICAgY2xhc3M9ImNscy0zIgogICAgICAgICAgIGlkPSJnNSIgLz4KICAgICAgICA8ZwogICAgICAgICAgIGNsYXNzPSJjbHMtMyIKICAgICAgICAgICBpZD0iZzYiIC8+CiAgICAgICAgPGcKICAgICAgICAgICBjbGFzcz0iY2xzLTMiCiAgICAgICAgICAgaWQ9Imc3IiAvPgogICAgICAgIDxnCiAgICAgICAgICAgY2xhc3M9ImNscy0zIgogICAgICAgICAgIGlkPSJnOCI+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgY2xhc3M9ImNscy0yIgogICAgICAgICAgICAgZD0ibSAxMzEuNzQsMTQuMDIgYyAwLDAgMC4xNSwtMy4zNCAtMy40NywtNi45NiAtMy42MiwtMy42MiAtNi44NiwtMy4zNyAtNi44NiwtMy4zNyAwLDAgLTAuNDEsMy4wOCAzLjM3LDYuODYgMy41NywzLjU3IDYuOTYsMy40NyA2Ljk2LDMuNDcgeiIKICAgICAgICAgICAgIGlkPSJwYXRoOCIgLz4KICAgICAgICA8L2c+CiAgICAgICAgPGcKICAgICAgICAgICBjbGFzcz0iY2xzLTMiCiAgICAgICAgICAgaWQ9Imc5Ij4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBjbGFzcz0iY2xzLTIiCiAgICAgICAgICAgICBkPSJtIDEyNS40MywxNC4wMiBjIDAsMCAzLjM0LDAuMTUgNi45NiwtMy40NyAzLjc4LC0zLjc4IDMuMzcsLTYuODYgMy4zNywtNi44NiAwLDAgLTMuMDgsLTAuNDEgLTYuODYsMy4zNyAtMy41NywzLjU3IC0zLjQ3LDYuOTYgLTMuNDcsNi45NiB6IgogICAgICAgICAgICAgaWQ9InBhdGg5IiAvPgogICAgICAgIDwvZz4KICAgICAgICA8ZwogICAgICAgICAgIGNsYXNzPSJjbHMtMyIKICAgICAgICAgICBpZD0iZzEwIj4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBjbGFzcz0iY2xzLTIiCiAgICAgICAgICAgICBkPSJtIDEyOC41OSwxNC42MSBjIDAsMCAyLjQ2LC0yLjI2IDIuNDYsLTcuMzggMCwtNS4zNCAtMi40NiwtNy4yMyAtMi40NiwtNy4yMyAwLDAgLTIuNDYsMS44OSAtMi40Niw3LjIzIDAsNS4wNCAyLjQ2LDcuMzggMi40Niw3LjM4IHoiCiAgICAgICAgICAgICBpZD0icGF0aDEwIiAvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg=="
            width={56}
            height={56}
          />
          <div
            style={{
              fontSize: 42,
              color: "white",
              fontWeight: "bold",
            }}
          >
            Adelfa
          </div>
        </div>
      </div>
    </div>
  );
}
