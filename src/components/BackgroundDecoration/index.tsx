export function BackgroundDecoration() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Layer 1 — Foreground: thick, fast, dense */}
      <div
        className="absolute inset-0"
        style={{
          animation: "l1 3s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(" +
            "transparent 0, transparent 12, rgb(115 115 115 / 0.10) 12, rgb(115 115 115 / 0.10) 14, " +
            "transparent 14, transparent 43, rgb(115 115 115 / 0.10) 43, rgb(115 115 115 / 0.10) 46, " +
            "transparent 46, transparent 85, rgb(115 115 115 / 0.10) 85, rgb(115 115 115 / 0.10) 87, " +
            "transparent 87, transparent 136, rgb(115 115 115 / 0.10) 136, rgb(115 115 115 / 0.10) 140, " +
            "transparent 140, transparent 217, rgb(115 115 115 / 0.10) 217, rgb(115 115 115 / 0.10) 219, " +
            "transparent 219, transparent 250)",
          backgroundSize: "100% 250px",
        }}
      />

      {/* Layer 2 — Mid-close: medium */}
      <div
        className="absolute inset-0"
        style={{
          animation: "l2 5s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(" +
            "transparent 0, transparent 18, rgb(115 115 115 / 0.06) 18, rgb(115 115 115 / 0.06) 20, " +
            "transparent 20, transparent 58, rgb(115 115 115 / 0.06) 58, rgb(115 115 115 / 0.06) 61, " +
            "transparent 61, transparent 108, rgb(115 115 115 / 0.06) 108, rgb(115 115 115 / 0.06) 110, " +
            "transparent 110, transparent 164, rgb(115 115 115 / 0.06) 164, rgb(115 115 115 / 0.06) 166, " +
            "transparent 166, transparent 225, rgb(115 115 115 / 0.06) 225, rgb(115 115 115 / 0.06) 228, " +
            "transparent 228, transparent 300)",
          backgroundSize: "100% 300px",
        }}
      />

      {/* Layer 3 — Mid-deep: thinner, slower */}
      <div
        className="absolute inset-0"
        style={{
          animation: "l3 8s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(" +
            "transparent 0, transparent 28, rgb(115 115 115 / 0.03) 28, rgb(115 115 115 / 0.03) 30, " +
            "transparent 30, transparent 82, rgb(115 115 115 / 0.03) 82, rgb(115 115 115 / 0.03) 83, " +
            "transparent 83, transparent 152, rgb(115 115 115 / 0.03) 152, rgb(115 115 115 / 0.03) 154, " +
            "transparent 154, transparent 218, rgb(115 115 115 / 0.03) 218, rgb(115 115 115 / 0.03) 219, " +
            "transparent 219, transparent 302, rgb(115 115 115 / 0.03) 302, rgb(115 115 115 / 0.03) 304, " +
            "transparent 304, transparent 400)",
          backgroundSize: "100% 400px",
        }}
      />

      {/* Layer 4 — Background: thinnest, slowest, faintest */}
      <div
        className="absolute inset-0"
        style={{
          animation: "l4 14s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(" +
            "transparent 0, transparent 45, rgb(115 115 115 / 0.015) 45, rgb(115 115 115 / 0.015) 46, " +
            "transparent 46, transparent 128, rgb(115 115 115 / 0.015) 128, rgb(115 115 115 / 0.015) 129, " +
            "transparent 129, transparent 254, rgb(115 115 115 / 0.015) 254, rgb(115 115 115 / 0.015) 255, " +
            "transparent 255, transparent 396, rgb(115 115 115 / 0.015) 396, rgb(115 115 115 / 0.015) 397, " +
            "transparent 397, transparent 500)",
          backgroundSize: "100% 500px",
        }}
      />
    </div>
  );
}
