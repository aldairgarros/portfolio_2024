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
        anim="h1 5s linear infinite"
        bs="100% 72px"
        bg="repeating-linear-gradient(transparent 0px, transparent 70px, rgb(0 0 0 / 0.05) 70px, rgb(0 0 0 / 0.05) 72px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 70px, rgb(255 255 255 / 0.035) 70px, rgb(255 255 255 / 0.035) 72px)"
      />
      <L
        anim="h2 8s linear infinite"
        bs="100% 87px"
        bg="repeating-linear-gradient(transparent 0px, transparent 85px, rgb(0 0 0 / 0.03) 85px, rgb(0 0 0 / 0.03) 87px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 85px, rgb(255 255 255 / 0.02) 85px, rgb(255 255 255 / 0.02) 87px)"
      />
      <L
        anim="h3 12s linear infinite"
        bs="100% 111px"
        bg="repeating-linear-gradient(transparent 0px, transparent 110px, rgb(0 0 0 / 0.015) 110px, rgb(0 0 0 / 0.015) 111px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 110px, rgb(255 255 255 / 0.01) 110px, rgb(255 255 255 / 0.01) 111px)"
      />
      <L
        anim="h4 20s linear infinite"
        bs="100% 141px"
        bg="repeating-linear-gradient(transparent 0px, transparent 140px, rgb(0 0 0 / 0.008) 140px, rgb(0 0 0 / 0.008) 141px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 140px, rgb(255 255 255 / 0.005) 140px, rgb(255 255 255 / 0.005) 141px)"
      />

      {/* === Vertical stripes (scanning horizontally) === */}

      <L
        anim="v1 5s linear infinite"
        bs="62px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 60px, rgb(0 0 0 / 0.05) 60px, rgb(0 0 0 / 0.05) 62px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 60px, rgb(255 255 255 / 0.035) 60px, rgb(255 255 255 / 0.035) 62px)"
      />
      <L
        anim="v2 8s linear infinite"
        bs="76px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 75px, rgb(0 0 0 / 0.03) 75px, rgb(0 0 0 / 0.03) 76px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 75px, rgb(255 255 255 / 0.02) 75px, rgb(255 255 255 / 0.02) 76px)"
      />
      <L
        anim="v3 12s linear infinite"
        bs="101px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 100px, rgb(0 0 0 / 0.015) 100px, rgb(0 0 0 / 0.015) 101px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 100px, rgb(255 255 255 / 0.01) 100px, rgb(255 255 255 / 0.01) 101px)"
      />
      <L
        anim="v4 20s linear infinite"
        bs="121px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 120px, rgb(0 0 0 / 0.008) 120px, rgb(0 0 0 / 0.008) 121px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 120px, rgb(255 255 255 / 0.005) 120px, rgb(255 255 255 / 0.005) 121px)"
      />
    </div>
  );
}
