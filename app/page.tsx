const juegos = [
  { slug: "bricks", nombre: "Bloque Fugaz", desc: "Rompe ladrillos, encadena combos.", cover: "cover-bricks" },
  { slug: "tetro", nombre: "Tetrominó", desc: "Encaja piezas antes de que suba el nivel.", cover: "cover-tetro" },
  { slug: "snake", nombre: "Sierpe", desc: "Crece sin morder tu propia cola.", cover: "cover-snake" },
  { slug: "glot", nombre: "Glotón", desc: "Devora puntos, esquiva fantasmas.", cover: "cover-glot" },
  { slug: "invaders", nombre: "Invasores", desc: "Defiende la última línea.", cover: "cover-invaders" },
  { slug: "rocas", nombre: "Rocas", desc: "Sobrevive al campo de asteroides.", cover: "cover-rocas" },
];

export default function Home() {
  return (
    <>
      <section className="av-hero">
        <h1 className="pixel">Arcade Vault</h1>
        <p className="sub">
          Compite por puntuación<span className="blink">_</span>
        </p>
      </section>

      <div className="av-grid">
        {juegos.map((juego) => (
          <article key={juego.slug} className="card">
            <div className="cover">
              <div className={`cover-bg ${juego.cover}`} />
              <span className="label">{juego.slug}</span>
            </div>
            <div className="meta">
              <h2 className="title">{juego.nombre}</h2>
              <p className="desc">{juego.desc}</p>
              <div className="row">
                <div className="score-badge">
                  Récord
                  <b>—</b>
                </div>
                <button type="button" className="btn">
                  Jugar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
