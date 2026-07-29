export function BackgroundDecoration() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Layer 1 — Foreground: thick, dense, fast */}

      <div
        className="absolute inset-0 dark:hidden"
        style={{
          animation: "l1 3s linear infinite",
          backgroundImage: "repeating-linear-gradient(" +
            "transparent 0, transparent 10, rgb(0 0 0 / 0.25) 10, rgb(0 0 0 / 0.25) 14, " +
            "transparent 14, transparent 38, rgb(0 0 0 / 0.25) 38, rgb(0 0 0 / 0.25) 43, " +
            "transparent 43, transparent 80, rgb(0 0 0 / 0.25) 80, rgb(0 0 0 / 0.25) 83, " +
            "transparent 83, transparent 130, rgb(0 0 0 / 0.25) 130, rgb(0 0 0 / 0.25) 135, " +
            "transparent 135, transparent 215, rgb(0 0 0 / 0.25) 215, rgb(0 0 0 / 0.25) 218, " +
            "transparent 218, transparent 250)",
          backgroundSize: "100% 250px",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          animation: "l1 3s linear infinite",
          backgroundImage: "repeating-linear-gradient(" +
            "transparent 0, transparent 10, rgb(255 255 255 / 0.18) 10, rgb(255 255 255 / 0.18) 14, " +
            "transparent 14, transparent 38, rgb(255 255 255 / 0.18) 38, rgb(255 255 255 / 0.18) 43, " +
            "transparent 43, transparent 80, rgb(255 255 255 / 0.18) 80, rgb(255 255 255 / 0.18) 83, " +
            "transparent 83, transparent 130, rgb(255 255 255 / 0.18) 130, rgb(255 255 255 / 0.18) 135, " +
            "transparent 135, transparent 215, rgb(255 255 255 / 0.18) 215, rgb(255 255 255 / 0.18) 218, " +
            "transparent 218, transparent 250)",
          backgroundSize: "100% 250px",
        }}
      />

      {/* Layer 2 — Mid-close */}

      <div
        className="absolute inset-0 dark:hidden"
        style={{
          animation: "l2 5s linear infinite",
          backgroundImage: "repeating-linear-gradient(" +
            "transparent 0, transparent 16, rgb(0 0 0 / 0.14) 16, rgb(0 0 0 / 0.14) 19, " +
            "transparent 19, transparent 55, rgb(0 0 0 / 0.14) 55, rgb(0 0 0 / 0.14) 58, " +
            "transparent 58, transparent 102, rgb(0 0 0 / 0.14) 102, rgb(0 0 0 / 0.14) 105, " +
            "transparent 105, transparent 158, rgb(0 0 0 / 0.14) 158, rgb(0 0 0 / 0.14) 160, " +
            "transparent 160, transparent 220, rgb(0 0 0 / 0.14) 220, rgb(0 0 0 / 0.14) 223, " +
            "transparent 223, transparent 300)",
          backgroundSize: "100% 300px",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          animation: "l2 5s linear infinite",
          backgroundImage: "repeating-linear-gradient(" +
            "transparent 0, transparent 16, rgb(255 255 255 / 0.10) 16, rgb(255 255 255 / 0.10) 19, " +
            "transparent 19, transparent 55, rgb(255 255 255 / 0.10) 55, rgb(255 255 255 / 0.10) 58, " +
            "transparent 58, transparent 102, rgb(255 255 255 / 0.10) 102, rgb(255 255 255 / 0.10) 105, " +
            "transparent 105, transparent 158, rgb(255 255 255 / 0.10) 158, rgb(255 255 255 / 0.10) 160, " +
            "transparent 160, transparent 220, rgb(255 255 255 / 0.10) 220, rgb(255 255 255 / 0.10) 223, " +
            "transparent 223, transparent 300)",
          backgroundSize: "100% 300px",
        }}
      />

      {/* Layer 3 — Mid-deep */}

      <div
        className="absolute inset-0 dark:hidden"
        style={{
          animation: "l3 8s linear infinite",
          backgroundImage: "repeating-linear-gradient(" +
            "transparent 0, transparent 25, rgb(0 0 0 / 0.07) 25, rgb(0 0 0 / 0.07) 27, " +
            "transparent 27, transparent 78, rgb(0 0 0 / 0.07) 78, rgb(0 0 0 / 0.07) 80, " +
            "transparent 80, transparent 145, rgb(0 0 0 / 0.07) 145, rgb(0 0 0 / 0.07) 148, " +
            "transparent 148, transparent 210, rgb(0 0 0 / 0.07) 210, rgb(0 0 0 / 0.07) 212, " +
            "transparent 212, transparent 295, rgb(0 0 0 / 0.07) 295, rgb(0 0 0 / 0.07) 297, " +
            "transparent 297, transparent 400)",
          backgroundSize: "100% 400px",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          animation: "l3 8s linear infinite",
          backgroundImage: "repeating-linear-gradient(" +
            "transparent 0, transparent 25, rgb(255 255 255 / 0.05) 25, rgb(255 255 255 / 0.05) 27, " +
            "transparent 27, transparent 78, rgb(255 255 255 / 0.05) 78, rgb(255 255 255 / 0.05) 80, " +
            "transparent 80, transparent 145, rgb(255 255 255 / 0.05) 145, rgb(255 255 255 / 0.05) 148, " +
            "transparent 148, transparent 210, rgb(255 255 255 / 0.05) 210, rgb(255 255 255 / 0.05) 212, " +
            "transparent 212, transparent 295, rgb(255 255 255 / 0.05) 295, rgb(255 255 255 / 0.05) 297, " +
            "transparent 297, transparent 400)",
          backgroundSize: "100% 400px",
        }}
      />

      {/* Layer 4 — Deepest: thin, sparse, slow */}

      <div
        className="absolute inset-0 dark:hidden"
        style={{
          animation: "l4 14s linear infinite",
          backgroundImage: "repeating-linear-gradient(" +
            "transparent 0, transparent 42, rgb(0 0 0 / 0.03) 42, rgb(0 0 0 / 0.03) 44, " +
            "transparent 44, transparent 120, rgb(0 0 0 / 0.03) 120, rgb(0 0 0 / 0.03) 121, " +
            "transparent 121, transparent 248, rgb(0 0 0 / 0.03) 248, rgb(0 0 0 / 0.03) 250, " +
            "transparent 250, transparent 390, rgb(0 0 0 / 0.03) 390, rgb(0 0 0 / 0.03) 392, " +
            "transparent 392, transparent 500)",
          backgroundSize: "100% 500px",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          animation: "l4 14s linear infinite",
          backgroundImage: "repeating-linear-gradient(" +
            "transparent 0, transparent 42, rgb(255 255 255 / 0.02) 42, rgb(255 255 255 / 0.02) 44, " +
            "transparent 44, transparent 120, rgb(255 255 255 / 0.02) 120, rgb(255 255 255 / 0.02) 121, " +
            "transparent 121, transparent 248, rgb(255 255 255 / 0.02) 248, rgb(255 255 255 / 0.02) 250, " +
            "transparent 250, transparent 390, rgb(255 255 255 / 0.02) 390, rgb(255 255 255 / 0.02) 392, " +
            "transparent 392, transparent 500)",
          backgroundSize: "100% 500px",
        }}
      />
    </div>
  );
}
