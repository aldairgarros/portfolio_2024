export function BackgroundDecoration() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* === Horizontal stripes (scanning vertically) === */}

      {/* H1 — closest, thick */}
      <L
        anim="h1 3s linear infinite"
        bs="100% 130px"
        bg="repeating-linear-gradient(transparent 0, transparent 12, rgb(0 0 0 / 0.2) 12, rgb(0 0 0 / 0.2) 16, transparent 16, transparent 47, rgb(0 0 0 / 0.2) 47, rgb(0 0 0 / 0.2) 54, transparent 54, transparent 78, rgb(0 0 0 / 0.2) 78, rgb(0 0 0 / 0.2) 81, transparent 81, transparent 108, rgb(0 0 0 / 0.2) 108, rgb(0 0 0 / 0.2) 113, transparent 113, transparent 130)"
        dark="repeating-linear-gradient(transparent 0, transparent 12, rgb(255 255 255 / 0.15) 12, rgb(255 255 255 / 0.15) 16, transparent 16, transparent 47, rgb(255 255 255 / 0.15) 47, rgb(255 255 255 / 0.15) 54, transparent 54, transparent 78, rgb(255 255 255 / 0.15) 78, rgb(255 255 255 / 0.15) 81, transparent 81, transparent 108, rgb(255 255 255 / 0.15) 108, rgb(255 255 255 / 0.15) 113, transparent 113, transparent 130)"
      />
      {/* H2 */}
      <L
        anim="h2 5s linear infinite"
        bs="100% 180px"
        bg="repeating-linear-gradient(transparent 0, transparent 18, rgb(0 0 0 / 0.12) 18, rgb(0 0 0 / 0.12) 21, transparent 21, transparent 68, rgb(0 0 0 / 0.12) 68, rgb(0 0 0 / 0.12) 73, transparent 73, transparent 108, rgb(0 0 0 / 0.12) 108, rgb(0 0 0 / 0.12) 110, transparent 110, transparent 148, rgb(0 0 0 / 0.12) 148, rgb(0 0 0 / 0.12) 152, transparent 152, transparent 180)"
        dark="repeating-linear-gradient(transparent 0, transparent 18, rgb(255 255 255 / 0.08) 18, rgb(255 255 255 / 0.08) 21, transparent 21, transparent 68, rgb(255 255 255 / 0.08) 68, rgb(255 255 255 / 0.08) 73, transparent 73, transparent 108, rgb(255 255 255 / 0.08) 108, rgb(255 255 255 / 0.08) 110, transparent 110, transparent 148, rgb(255 255 255 / 0.08) 148, rgb(255 255 255 / 0.08) 152, transparent 152, transparent 180)"
      />
      {/* H3 */}
      <L
        anim="h3 8s linear infinite"
        bs="100% 230px"
        bg="repeating-linear-gradient(transparent 0, transparent 25, rgb(0 0 0 / 0.06) 25, rgb(0 0 0 / 0.06) 27, transparent 27, transparent 88, rgb(0 0 0 / 0.06) 88, rgb(0 0 0 / 0.06) 91, transparent 91, transparent 148, rgb(0 0 0 / 0.06) 148, rgb(0 0 0 / 0.06) 152, transparent 152, transparent 198, rgb(0 0 0 / 0.06) 198, rgb(0 0 0 / 0.06) 200, transparent 200, transparent 230)"
        dark="repeating-linear-gradient(transparent 0, transparent 25, rgb(255 255 255 / 0.04) 25, rgb(255 255 255 / 0.04) 27, transparent 27, transparent 88, rgb(255 255 255 / 0.04) 88, rgb(255 255 255 / 0.04) 91, transparent 91, transparent 148, rgb(255 255 255 / 0.04) 148, rgb(255 255 255 / 0.04) 152, transparent 152, transparent 198, rgb(255 255 255 / 0.04) 198, rgb(255 255 255 / 0.04) 200, transparent 200, transparent 230)"
      />
      {/* H4 — deepest, thinnest */}
      <L
        anim="h4 14s linear infinite"
        bs="100% 300px"
        bg="repeating-linear-gradient(transparent 0, transparent 35, rgb(0 0 0 / 0.03) 35, rgb(0 0 0 / 0.03) 36, transparent 36, transparent 120, rgb(0 0 0 / 0.03) 120, rgb(0 0 0 / 0.03) 122, transparent 122, transparent 210, rgb(0 0 0 / 0.03) 210, rgb(0 0 0 / 0.03) 211, transparent 211, transparent 275, rgb(0 0 0 / 0.03) 275, rgb(0 0 0 / 0.03) 277, transparent 277, transparent 300)"
        dark="repeating-linear-gradient(transparent 0, transparent 35, rgb(255 255 255 / 0.02) 35, rgb(255 255 255 / 0.02) 36, transparent 36, transparent 120, rgb(255 255 255 / 0.02) 120, rgb(255 255 255 / 0.02) 122, transparent 122, transparent 210, rgb(255 255 255 / 0.02) 210, rgb(255 255 255 / 0.02) 211, transparent 211, transparent 275, rgb(255 255 255 / 0.02) 275, rgb(255 255 255 / 0.02) 277, transparent 277, transparent 300)"
      />

      {/* === Vertical stripes (scanning horizontally) === */}

      {/* V1 — closest, thick */}
      <L
        anim="v1 3s linear infinite"
        bs="115px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0, transparent 10, rgb(0 0 0 / 0.2) 10, rgb(0 0 0 / 0.2) 14, transparent 14, transparent 42, rgb(0 0 0 / 0.2) 42, rgb(0 0 0 / 0.2) 48, transparent 48, transparent 70, rgb(0 0 0 / 0.2) 70, rgb(0 0 0 / 0.2) 72, transparent 72, transparent 97, rgb(0 0 0 / 0.2) 97, rgb(0 0 0 / 0.2) 101, transparent 101, transparent 115)"
        dark="repeating-linear-gradient(90deg, transparent 0, transparent 10, rgb(255 255 255 / 0.15) 10, rgb(255 255 255 / 0.15) 14, transparent 14, transparent 42, rgb(255 255 255 / 0.15) 42, rgb(255 255 255 / 0.15) 48, transparent 48, transparent 70, rgb(255 255 255 / 0.15) 70, rgb(255 255 255 / 0.15) 72, transparent 72, transparent 97, rgb(255 255 255 / 0.15) 97, rgb(255 255 255 / 0.15) 101, transparent 101, transparent 115)"
      />
      {/* V2 */}
      <L
        anim="v2 5s linear infinite"
        bs="165px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0, transparent 16, rgb(0 0 0 / 0.12) 16, rgb(0 0 0 / 0.12) 19, transparent 19, transparent 62, rgb(0 0 0 / 0.12) 62, rgb(0 0 0 / 0.12) 66, transparent 66, transparent 100, rgb(0 0 0 / 0.12) 100, rgb(0 0 0 / 0.12) 102, transparent 102, transparent 135, rgb(0 0 0 / 0.12) 135, rgb(0 0 0 / 0.12) 139, transparent 139, transparent 165)"
        dark="repeating-linear-gradient(90deg, transparent 0, transparent 16, rgb(255 255 255 / 0.08) 16, rgb(255 255 255 / 0.08) 19, transparent 19, transparent 62, rgb(255 255 255 / 0.08) 62, rgb(255 255 255 / 0.08) 66, transparent 66, transparent 100, rgb(255 255 255 / 0.08) 100, rgb(255 255 255 / 0.08) 102, transparent 102, transparent 135, rgb(255 255 255 / 0.08) 135, rgb(255 255 255 / 0.08) 139, transparent 139, transparent 165)"
      />
      {/* V3 */}
      <L
        anim="v3 8s linear infinite"
        bs="215px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0, transparent 23, rgb(0 0 0 / 0.06) 23, rgb(0 0 0 / 0.06) 25, transparent 25, transparent 82, rgb(0 0 0 / 0.06) 82, rgb(0 0 0 / 0.06) 85, transparent 85, transparent 138, rgb(0 0 0 / 0.06) 138, rgb(0 0 0 / 0.06) 141, transparent 141, transparent 185, rgb(0 0 0 / 0.06) 185, rgb(0 0 0 / 0.06) 187, transparent 187, transparent 215)"
        dark="repeating-linear-gradient(90deg, transparent 0, transparent 23, rgb(255 255 255 / 0.04) 23, rgb(255 255 255 / 0.04) 25, transparent 25, transparent 82, rgb(255 255 255 / 0.04) 82, rgb(255 255 255 / 0.04) 85, transparent 85, transparent 138, rgb(255 255 255 / 0.04) 138, rgb(255 255 255 / 0.04) 141, transparent 141, transparent 185, rgb(255 255 255 / 0.04) 185, rgb(255 255 255 / 0.04) 187, transparent 187, transparent 215)"
      />
      {/* V4 — deepest */}
      <L
        anim="v4 14s linear infinite"
        bs="285px 100%"
        bg="repeating-linear-gradient(90deg, transparent 0, transparent 32, rgb(0 0 0 / 0.03) 32, rgb(0 0 0 / 0.03) 33, transparent 33, transparent 114, rgb(0 0 0 / 0.03) 114, rgb(0 0 0 / 0.03) 116, transparent 116, transparent 200, rgb(0 0 0 / 0.03) 200, rgb(0 0 0 / 0.03) 201, transparent 201, transparent 260, rgb(0 0 0 / 0.03) 260, rgb(0 0 0 / 0.03) 262, transparent 262, transparent 285)"
        dark="repeating-linear-gradient(90deg, transparent 0, transparent 32, rgb(255 255 255 / 0.02) 32, rgb(255 255 255 / 0.02) 33, transparent 33, transparent 114, rgb(255 255 255 / 0.02) 114, rgb(255 255 255 / 0.02) 116, transparent 116, transparent 200, rgb(255 255 255 / 0.02) 200, rgb(255 255 255 / 0.02) 201, transparent 201, transparent 260, rgb(255 255 255 / 0.02) 260, rgb(255 255 255 / 0.02) 262, transparent 262, transparent 285)"
      />
    </div>
  );
}

function L({ anim, bs, bg, dark }: { anim: string; bs: string; bg: string; dark: string }) {
  return (
    <>
      <div className="absolute inset-0 dark:hidden" style={{ animation: anim, backgroundImage: bg, backgroundSize: bs }} />
      <div className="absolute inset-0 hidden dark:block" style={{ animation: anim, backgroundImage: dark, backgroundSize: bs }} />
    </>
  );
}
