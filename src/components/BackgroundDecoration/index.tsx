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

      {/* ===== Horizontal stripes (scanning vertically) ===== */}

      {/* H1a — closest, lines at 70/150 every 200px */}
      <L
        anim="h1a 7s linear infinite" bs="100% 200px"
        bg="repeating-linear-gradient(transparent 0px, transparent 70px, rgb(0 0 0 / 0.05) 70px, rgb(0 0 0 / 0.05) 72px, transparent 72px, transparent 150px, rgb(0 0 0 / 0.04) 150px, rgb(0 0 0 / 0.04) 152px, transparent 152px, transparent 200px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 70px, rgb(255 255 255 / 0.035) 70px, rgb(255 255 255 / 0.035) 72px, transparent 72px, transparent 150px, rgb(255 255 255 / 0.028) 150px, rgb(255 255 255 / 0.028) 152px, transparent 152px, transparent 200px)"
      />
      {/* H1b — lines at 90/180 every 240px */}
      <L
        anim="h1b 5s linear infinite" bs="100% 240px"
        bg="repeating-linear-gradient(transparent 0px, transparent 90px, rgb(0 0 0 / 0.04) 90px, rgb(0 0 0 / 0.04) 92px, transparent 92px, transparent 180px, rgb(0 0 0 / 0.035) 180px, rgb(0 0 0 / 0.035) 181px, transparent 181px, transparent 240px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 90px, rgb(255 255 255 / 0.028) 90px, rgb(255 255 255 / 0.028) 92px, transparent 92px, transparent 180px, rgb(255 255 255 / 0.024) 180px, rgb(255 255 255 / 0.024) 181px, transparent 181px, transparent 240px)"
      />

      {/* H2a — mid, lines at 85/200 every 280px */}
      <L
        anim="h2a 10s linear infinite" bs="100% 280px"
        bg="repeating-linear-gradient(transparent 0px, transparent 85px, rgb(0 0 0 / 0.03) 85px, rgb(0 0 0 / 0.03) 87px, transparent 87px, transparent 200px, rgb(0 0 0 / 0.025) 200px, rgb(0 0 0 / 0.025) 201px, transparent 201px, transparent 280px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 85px, rgb(255 255 255 / 0.021) 85px, rgb(255 255 255 / 0.021) 87px, transparent 87px, transparent 200px, rgb(255 255 255 / 0.017) 200px, rgb(255 255 255 / 0.017) 201px, transparent 201px, transparent 280px)"
      />
      {/* H2b — lines at 110/240 every 320px */}
      <L
        anim="h2b 7s linear infinite" bs="100% 320px"
        bg="repeating-linear-gradient(transparent 0px, transparent 110px, rgb(0 0 0 / 0.025) 110px, rgb(0 0 0 / 0.025) 111px, transparent 111px, transparent 240px, rgb(0 0 0 / 0.02) 240px, rgb(0 0 0 / 0.02) 241px, transparent 241px, transparent 320px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 110px, rgb(255 255 255 / 0.017) 110px, rgb(255 255 255 / 0.017) 111px, transparent 111px, transparent 240px, rgb(255 255 255 / 0.014) 240px, rgb(255 255 255 / 0.014) 241px, transparent 241px, transparent 320px)"
      />

      {/* H3a — lines at 100/250 every 360px */}
      <L
        anim="h3a 15s linear infinite" bs="100% 360px"
        bg="repeating-linear-gradient(transparent 0px, transparent 100px, rgb(0 0 0 / 0.015) 100px, rgb(0 0 0 / 0.015) 101px, transparent 101px, transparent 250px, rgb(0 0 0 / 0.012) 250px, rgb(0 0 0 / 0.012) 251px, transparent 251px, transparent 360px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 100px, rgb(255 255 255 / 0.01) 100px, rgb(255 255 255 / 0.01) 101px, transparent 101px, transparent 250px, rgb(255 255 255 / 0.008) 250px, rgb(255 255 255 / 0.008) 251px, transparent 251px, transparent 360px)"
      />
      {/* H3b — lines at 120/300 every 400px */}
      <L
        anim="h3b 11s linear infinite" bs="100% 400px"
        bg="repeating-linear-gradient(transparent 0px, transparent 120px, rgb(0 0 0 / 0.012) 120px, rgb(0 0 0 / 0.012) 121px, transparent 121px, transparent 300px, rgb(0 0 0 / 0.01) 300px, rgb(0 0 0 / 0.01) 301px, transparent 301px, transparent 400px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 120px, rgb(255 255 255 / 0.008) 120px, rgb(255 255 255 / 0.008) 121px, transparent 121px, transparent 300px, rgb(255 255 255 / 0.007) 300px, rgb(255 255 255 / 0.007) 301px, transparent 301px, transparent 400px)"
      />

      {/* H4a — deepest, lines at 140/320 every 450px */}
      <L
        anim="h4a 22s linear infinite" bs="100% 450px"
        bg="repeating-linear-gradient(transparent 0px, transparent 140px, rgb(0 0 0 / 0.008) 140px, rgb(0 0 0 / 0.008) 141px, transparent 141px, transparent 320px, rgb(0 0 0 / 0.006) 320px, rgb(0 0 0 / 0.006) 321px, transparent 321px, transparent 450px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 140px, rgb(255 255 255 / 0.0055) 140px, rgb(255 255 255 / 0.0055) 141px, transparent 141px, transparent 320px, rgb(255 255 255 / 0.004) 320px, rgb(255 255 255 / 0.004) 321px, transparent 321px, transparent 450px)"
      />
      {/* H4b — lines at 160/360 every 500px */}
      <L
        anim="h4b 18s linear infinite" bs="100% 500px"
        bg="repeating-linear-gradient(transparent 0px, transparent 160px, rgb(0 0 0 / 0.006) 160px, rgb(0 0 0 / 0.006) 161px, transparent 161px, transparent 360px, rgb(0 0 0 / 0.004) 360px, rgb(0 0 0 / 0.004) 361px, transparent 361px, transparent 500px)"
        dark="repeating-linear-gradient(transparent 0px, transparent 160px, rgb(255 255 255 / 0.004) 160px, rgb(255 255 255 / 0.004) 161px, transparent 161px, transparent 360px, rgb(255 255 255 / 0.003) 360px, rgb(255 255 255 / 0.003) 361px, transparent 361px, transparent 500px)"
      />

      {/* ===== Vertical stripes (scanning horizontally) ===== */}

      {/* V1a — lines at 60/130 every 180px */}
      <L
        anim="v1a 7s linear infinite" bs="180px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 60px, rgb(0 0 0 / 0.05) 60px, rgb(0 0 0 / 0.05) 62px, transparent 62px, transparent 130px, rgb(0 0 0 / 0.04) 130px, rgb(0 0 0 / 0.04) 132px, transparent 132px, transparent 180px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 60px, rgb(255 255 255 / 0.035) 60px, rgb(255 255 255 / 0.035) 62px, transparent 62px, transparent 130px, rgb(255 255 255 / 0.028) 130px, rgb(255 255 255 / 0.028) 132px, transparent 132px, transparent 180px)"
      />
      {/* V1b — lines at 75/160 every 220px */}
      <L
        anim="v1b 5s linear infinite" bs="220px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 75px, rgb(0 0 0 / 0.04) 75px, rgb(0 0 0 / 0.04) 76px, transparent 76px, transparent 160px, rgb(0 0 0 / 0.035) 160px, rgb(0 0 0 / 0.035) 161px, transparent 161px, transparent 220px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 75px, rgb(255 255 255 / 0.028) 75px, rgb(255 255 255 / 0.028) 76px, transparent 76px, transparent 160px, rgb(255 255 255 / 0.024) 160px, rgb(255 255 255 / 0.024) 161px, transparent 161px, transparent 220px)"
      />

      {/* V2a — lines at 75/180 every 260px */}
      <L
        anim="v2a 10s linear infinite" bs="260px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 75px, rgb(0 0 0 / 0.03) 75px, rgb(0 0 0 / 0.03) 76px, transparent 76px, transparent 180px, rgb(0 0 0 / 0.025) 180px, rgb(0 0 0 / 0.025) 181px, transparent 181px, transparent 260px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 75px, rgb(255 255 255 / 0.021) 75px, rgb(255 255 255 / 0.021) 76px, transparent 76px, transparent 180px, rgb(255 255 255 / 0.017) 180px, rgb(255 255 255 / 0.017) 181px, transparent 181px, transparent 260px)"
      />
      {/* V2b — lines at 90/220 every 300px */}
      <L
        anim="v2b 7s linear infinite" bs="300px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 90px, rgb(0 0 0 / 0.025) 90px, rgb(0 0 0 / 0.025) 91px, transparent 91px, transparent 220px, rgb(0 0 0 / 0.02) 220px, rgb(0 0 0 / 0.02) 221px, transparent 221px, transparent 300px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 90px, rgb(255 255 255 / 0.017) 90px, rgb(255 255 255 / 0.017) 91px, transparent 91px, transparent 220px, rgb(255 255 255 / 0.014) 220px, rgb(255 255 255 / 0.014) 221px, transparent 221px, transparent 300px)"
      />

      {/* V3a — lines at 100/240 every 340px */}
      <L
        anim="v3a 15s linear infinite" bs="340px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 100px, rgb(0 0 0 / 0.015) 100px, rgb(0 0 0 / 0.015) 101px, transparent 101px, transparent 240px, rgb(0 0 0 / 0.012) 240px, rgb(0 0 0 / 0.012) 241px, transparent 241px, transparent 340px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 100px, rgb(255 255 255 / 0.01) 100px, rgb(255 255 255 / 0.01) 101px, transparent 101px, transparent 240px, rgb(255 255 255 / 0.008) 240px, rgb(255 255 255 / 0.008) 241px, transparent 241px, transparent 340px)"
      />
      {/* V3b — lines at 110/270 every 380px */}
      <L
        anim="v3b 11s linear infinite" bs="380px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 110px, rgb(0 0 0 / 0.012) 110px, rgb(0 0 0 / 0.012) 111px, transparent 111px, transparent 270px, rgb(0 0 0 / 0.01) 270px, rgb(0 0 0 / 0.01) 271px, transparent 271px, transparent 380px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 110px, rgb(255 255 255 / 0.008) 110px, rgb(255 255 255 / 0.008) 111px, transparent 111px, transparent 270px, rgb(255 255 255 / 0.007) 270px, rgb(255 255 255 / 0.007) 271px, transparent 271px, transparent 380px)"
      />

      {/* V4a — deepest, lines at 120/300 every 420px */}
      <L
        anim="v4a 22s linear infinite" bs="420px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 120px, rgb(0 0 0 / 0.008) 120px, rgb(0 0 0 / 0.008) 121px, transparent 121px, transparent 300px, rgb(0 0 0 / 0.006) 300px, rgb(0 0 0 / 0.006) 301px, transparent 301px, transparent 420px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 120px, rgb(255 255 255 / 0.0055) 120px, rgb(255 255 255 / 0.0055) 121px, transparent 121px, transparent 300px, rgb(255 255 255 / 0.004) 300px, rgb(255 255 255 / 0.004) 301px, transparent 301px, transparent 420px)"
      />
      {/* V4b — lines at 130/330 every 460px */}
      <L
        anim="v4b 18s linear infinite" bs="460px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0px, transparent 130px, rgb(0 0 0 / 0.006) 130px, rgb(0 0 0 / 0.006) 131px, transparent 131px, transparent 330px, rgb(0 0 0 / 0.004) 330px, rgb(0 0 0 / 0.004) 331px, transparent 331px, transparent 460px)"
        dark="repeating-linear-gradient(90deg, transparent 0px, transparent 130px, rgb(255 255 255 / 0.004) 130px, rgb(255 255 255 / 0.004) 131px, transparent 131px, transparent 330px, rgb(255 255 255 / 0.003) 330px, rgb(255 255 255 / 0.003) 331px, transparent 331px, transparent 460px)"
      />
    </div>
  );
}
