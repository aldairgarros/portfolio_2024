function L({ anim, bs, bg, dark }: { anim: string; bs: string; bg: string; dark: string }) {
  return (
    <>
      <div className="absolute inset-0 dark:hidden" style={{ animation: anim, backgroundImage: bg, backgroundSize: bs }} />
      <div className="absolute inset-0 hidden dark:block" style={{ animation: anim, backgroundImage: dark, backgroundSize: bs }} />
    </>
  );
}

export function BackgroundDecoration() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

      {/* === Horizontal stripes (scanning vertically) === */}

      {/* H1 — closest: thick (7px), dense */}
      <L
        anim="h1 3s linear infinite"
        bs="100% 35px"
        bg="repeating-linear-gradient(transparent 0px, transparent 28px, rgb(0 0 0 / 0.2) 28px, rgb(0 0 0 / 0.2) 35px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 28px, rgb(255 255 255 / 0.15) 28px, rgb(255 255 255 / 0.15) 35px)"
      />

      {/* H2 */}
      <L
        anim="h2 5s linear infinite"
        bs="100% 45px"
        bg="repeating-linear-gradient(transparent 0px, transparent 37px, rgb(0 0 0 / 0.12) 37px, rgb(0 0 0 / 0.12) 45px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 37px, rgb(255 255 255 / 0.08) 37px, rgb(255 255 255 / 0.08) 45px)"
      />

      {/* H3 */}
      <L
        anim="h3 8s linear infinite"
        bs="100% 55px"
        bg="repeating-linear-gradient(transparent 0px, transparent 50px, rgb(0 0 0 / 0.06) 50px, rgb(0 0 0 / 0.06) 55px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 50px, rgb(255 255 255 / 0.04) 50px, rgb(255 255 255 / 0.04) 55px)"
      />

      {/* H4 — deepest: thin, sparse */}
      <L
        anim="h4 14s linear infinite"
        bs="100% 70px"
        bg="repeating-linear-gradient(transparent 0px, transparent 67px, rgb(0 0 0 / 0.03) 67px, rgb(0 0 0 / 0.03) 70px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 67px, rgb(255 255 255 / 0.02) 67px, rgb(255 255 255 / 0.02) 70px)"
      />

      {/* === Vertical stripes (scanning horizontally) === */}

      {/* V1 — closest */}
      <L
        anim="v1 3s linear infinite"
        bs="30px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 24px, rgb(0 0 0 / 0.2) 24px, rgb(0 0 0 / 0.2) 30px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 24px, rgb(255 255 255 / 0.15) 24px, rgb(255 255 255 / 0.15) 30px)"
      />

      {/* V2 */}
      <L
        anim="v2 5s linear infinite"
        bs="40px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 33px, rgb(0 0 0 / 0.12) 33px, rgb(0 0 0 / 0.12) 40px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 33px, rgb(255 255 255 / 0.08) 33px, rgb(255 255 255 / 0.08) 40px)"
      />

      {/* V3 */}
      <L
        anim="v3 8s linear infinite"
        bs="50px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 45px, rgb(0 0 0 / 0.06) 45px, rgb(0 0 0 / 0.06) 50px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 45px, rgb(255 255 255 / 0.04) 45px, rgb(255 255 255 / 0.04) 50px)"
      />

      {/* V4 — deepest */}
      <L
        anim="v4 14s linear infinite"
        bs="60px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 57px, rgb(0 0 0 / 0.03) 57px, rgb(0 0 0 / 0.03) 60px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 57px, rgb(255 255 255 / 0.02) 57px, rgb(255 255 255 / 0.02) 60px)"
      />
    </div>
  );
}
