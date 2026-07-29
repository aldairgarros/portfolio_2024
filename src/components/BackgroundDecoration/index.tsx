export function BackgroundDecoration() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Layer 1 — Foreground: thick, dense, fast */}
      <div
        className="absolute inset-0 text-primary-950 dark:text-primary-50"
        style={{
          opacity: 0.2,
          animation: "l1 3s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(" +
            "transparent 0, transparent 10, currentColor 10, currentColor 14, " +
            "transparent 14, transparent 38, currentColor 38, currentColor 43, " +
            "transparent 43, transparent 80, currentColor 80, currentColor 83, " +
            "transparent 83, transparent 130, currentColor 130, currentColor 135, " +
            "transparent 135, transparent 215, currentColor 215, currentColor 218, " +
            "transparent 218, transparent 250)",
          backgroundSize: "100% 250px",
        }}
      />

      {/* Layer 2 — Mid-close */}
      <div
        className="absolute inset-0 text-primary-950 dark:text-primary-50"
        style={{
          opacity: 0.12,
          animation: "l2 5s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(" +
            "transparent 0, transparent 16, currentColor 16, currentColor 19, " +
            "transparent 19, transparent 55, currentColor 55, currentColor 58, " +
            "transparent 58, transparent 102, currentColor 102, currentColor 105, " +
            "transparent 105, transparent 158, currentColor 158, currentColor 160, " +
            "transparent 160, transparent 220, currentColor 220, currentColor 223, " +
            "transparent 223, transparent 300)",
          backgroundSize: "100% 300px",
        }}
      />

      {/* Layer 3 — Mid-deep */}
      <div
        className="absolute inset-0 text-primary-950 dark:text-primary-50"
        style={{
          opacity: 0.07,
          animation: "l3 8s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(" +
            "transparent 0, transparent 25, currentColor 25, currentColor 27, " +
            "transparent 27, transparent 78, currentColor 78, currentColor 80, " +
            "transparent 80, transparent 145, currentColor 145, currentColor 148, " +
            "transparent 148, transparent 210, currentColor 210, currentColor 212, " +
            "transparent 212, transparent 295, currentColor 295, currentColor 297, " +
            "transparent 297, transparent 400)",
          backgroundSize: "100% 400px",
        }}
      />

      {/* Layer 4 — Deepest: thin, sparse, slow */}
      <div
        className="absolute inset-0 text-primary-950 dark:text-primary-50"
        style={{
          opacity: 0.035,
          animation: "l4 14s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(" +
            "transparent 0, transparent 42, currentColor 42, currentColor 44, " +
            "transparent 44, transparent 120, currentColor 120, currentColor 121, " +
            "transparent 121, transparent 248, currentColor 248, currentColor 250, " +
            "transparent 250, transparent 390, currentColor 390, currentColor 392, " +
            "transparent 392, transparent 500)",
          backgroundSize: "100% 500px",
        }}
      />
    </div>
  );
}
