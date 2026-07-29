export function BackgroundDecoration() {
  return (
    <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {/* Layer 1 — Foreground: thick, fast */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          animation: "l1 3s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(transparent 0px, transparent 30px, rgb(0 0 0 / 0.5) 30px, rgb(0 0 0 / 0.5) 35px)",
          backgroundSize: "100% 35px",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          animation: "l1 3s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(transparent 0px, transparent 30px, rgb(255 255 255 / 0.4) 30px, rgb(255 255 255 / 0.4) 35px)",
          backgroundSize: "100% 35px",
        }}
      />

      {/* Layer 2 — Mid-close */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          animation: "l2 5s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(transparent 0px, transparent 43px, rgb(0 0 0 / 0.3) 43px, rgb(0 0 0 / 0.3) 50px)",
          backgroundSize: "100% 50px",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          animation: "l2 5s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(transparent 0px, transparent 43px, rgb(255 255 255 / 0.2) 43px, rgb(255 255 255 / 0.2) 50px)",
          backgroundSize: "100% 50px",
        }}
      />

      {/* Layer 3 — Mid-deep */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          animation: "l3 8s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(transparent 0px, transparent 63px, rgb(0 0 0 / 0.2) 63px, rgb(0 0 0 / 0.2) 70px)",
          backgroundSize: "100% 70px",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          animation: "l3 8s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(transparent 0px, transparent 63px, rgb(255 255 255 / 0.12) 63px, rgb(255 255 255 / 0.12) 70px)",
          backgroundSize: "100% 70px",
        }}
      />

      {/* Layer 4 — Deepest: thin, sparse, slow */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          animation: "l4 14s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(transparent 0px, transparent 90px, rgb(0 0 0 / 0.1) 90px, rgb(0 0 0 / 0.1) 95px)",
          backgroundSize: "100% 95px",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          animation: "l4 14s linear infinite",
          backgroundImage:
            "repeating-linear-gradient(transparent 0px, transparent 90px, rgb(255 255 255 / 0.06) 90px, rgb(255 255 255 / 0.06) 95px)",
          backgroundSize: "100% 95px",
        }}
      />
    </div>
  );
}
