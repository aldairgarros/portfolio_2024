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

      <L
        anim="h1 3s linear infinite"
        bs="100% 54px"
        bg="repeating-linear-gradient(transparent 0px, transparent 50px, rgb(0 0 0 / 0.10) 50px, rgb(0 0 0 / 0.10) 54px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 50px, rgb(255 255 255 / 0.07) 50px, rgb(255 255 255 / 0.07) 54px)"
      />
      <L
        anim="h2 5s linear infinite"
        bs="100% 69px"
        bg="repeating-linear-gradient(transparent 0px, transparent 65px, rgb(0 0 0 / 0.06) 65px, rgb(0 0 0 / 0.06) 69px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 65px, rgb(255 255 255 / 0.04) 65px, rgb(255 255 255 / 0.04) 69px)"
      />
      <L
        anim="h3 8s linear infinite"
        bs="100% 83px"
        bg="repeating-linear-gradient(transparent 0px, transparent 80px, rgb(0 0 0 / 0.03) 80px, rgb(0 0 0 / 0.03) 83px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 80px, rgb(255 255 255 / 0.02) 80px, rgb(255 255 255 / 0.02) 83px)"
      />
      <L
        anim="h4 14s linear infinite"
        bs="100% 102px"
        bg="repeating-linear-gradient(transparent 0px, transparent 100px, rgb(0 0 0 / 0.015) 100px, rgb(0 0 0 / 0.015) 102px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 100px, rgb(255 255 255 / 0.01) 100px, rgb(255 255 255 / 0.01) 102px)"
      />

      {/* === Vertical stripes (scanning horizontally) === */}

      <L
        anim="v1 3s linear infinite"
        bs="48px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 45px, rgb(0 0 0 / 0.10) 45px, rgb(0 0 0 / 0.10) 48px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 45px, rgb(255 255 255 / 0.07) 45px, rgb(255 255 255 / 0.07) 48px)"
      />
      <L
        anim="v2 5s linear infinite"
        bs="63px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 60px, rgb(0 0 0 / 0.06) 60px, rgb(0 0 0 / 0.06) 63px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 60px, rgb(255 255 255 / 0.04) 60px, rgb(255 255 255 / 0.04) 63px)"
      />
      <L
        anim="v3 8s linear infinite"
        bs="77px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 75px, rgb(0 0 0 / 0.03) 75px, rgb(0 0 0 / 0.03) 77px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 75px, rgb(255 255 255 / 0.02) 75px, rgb(255 255 255 / 0.02) 77px)"
      />
      <L
        anim="v4 14s linear infinite"
        bs="92px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 90px, rgb(0 0 0 / 0.015) 90px, rgb(0 0 0 / 0.015) 92px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 90px, rgb(255 255 255 / 0.01) 90px, rgb(255 255 255 / 0.01) 92px)"
      />
    </div>
  );
}
