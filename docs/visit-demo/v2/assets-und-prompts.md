# Raster-Assets und Promptset · V2

28.10.2026. Erzeugung mit dem eingebauten **Imagegen-Tool** nach dem Imagegen-Skill, kein CLI-/API-Fallback. Prototypgrafik für die Besuchsdemo; keine Aussage über finale Produktionsmaße oder ein fertiges Animationsset.

## Gespeicherte Dateien

- `public/art/woodshop-v2/machines-v2.png`: neun getrennte Maschinen-/Möbelsprites. Ausgewählte bereinigte Atlasfassung.
- `public/art/woodshop-v2/characters.png`: Jonas und mintfarbener Spieler, transparent, statische Ganzkörper-Sprites.
- `public/art/woodshop-v2/extra.png`: Bandsäge, Tischbohrmaschine auf Schubladenschrank, Werkzeugleiste und obere Holzablage. Die Werkzeugleiste wird derzeit nicht frei schwebend an einer abgesenkten Wand gezeigt.
- `public/art/woodshop-v2/finish.png`: leerer Regalrahmen, einzelner Boden und zwei Kisten für den dynamischen Questabschluss.
- `public/art/woodshop-v2/materials.png`: vier Materialfelder für Boden und Putz.
- `content/art/woodshop-v2-frames.json`: Frame-Koordinaten für Phaser. Originalpixel der gewählten PNGs bleiben unverändert; nur Texture-Frames, Skalierung/Spiegelung und Materialprojektion im Renderer.

Originale der verworfenen Atlasvariante bleiben am Imagegen-Ausgabeort; sie sind kein Runtimeasset. Die Referenzfotos und Inspirationsbilder werden nicht ins öffentliche Repository kopiert.

## Referenzrollen

Die große Inspirationsgrafik bestimmt Materialwirkung, Detailgrad und warme Pixel-Art-Anmutung, **nicht** den Raumgrundriss. Jonas’ Referenz bestimmt Kleidung, Cap, Brille und Gesichtsstil. Fotos C/D/G/F/H bestimmen konkrete Geräteidentitäten; der Grundriss und die Wandreferenzen bestimmen Standorte und Öffnungen. Ein generiertes Sprite ist keine exakte technische Modellaufnahme der jeweiligen Maschine.

## Verwendetes Promptset

Die Generierung erfolgte in diesen getrennten Aufträgen (inhaltlich dokumentiert; keine geheimen Parameter oder API-Schlüssel):

1. **Neun Maschinen, transparentes 3×3-Atlas:** detailed warm handcrafted pixel-art isometric workshop adventure, crisp pixel clusters, textured wood and used metal, orthographic 2:1 view from southeast, consistent upper-left light. Reference 1 only art style; workshop photos object identity. Row 1 CNC router on bench with black gantry, orange cylindrical head and ribbed extraction hose; enclosed blue/light-gray laser; open black diode laser on table. Row 2 green mitre saw on bench; compact gray table saw with black adjustment wheel and red vacuum underneath; thick oak joiner’s bench with vise and dog holes. Row 3 cylindrical beige-gray extractor; full timber rack; glass-front wood tool cabinet. Separate complete objects, true alpha, no text/labels/ground tiles, no flat-vector or low-poly rendering.
2. **Gezielte Atlas-Korrektur:** preserve all nine exact objects, their colors, identity, rendering and isometric angle; change only spacing into regular 3×3 equal cells with generous fully transparent padding. No neighboring pixels or cropped hoses/feet, no new objects or text. Diese Fassung ersetzt die zuerst generierte Variante mit überlappenden Frame-Rechtecken.
3. **Zwei Figuren, transparent:** two full-body pixel-art adventure sprites side by side, Jonas left with brown hair, rectangular glasses, blue/yellow cap, worn blue jacket, charcoal shirt/trousers and brown boots; distinct brown-haired mint-jacket player right without cap/glasses. Equal height, aligned feet, three-quarter high-angle adventure stance, detailed faces/fabric/pockets/boots matching the supplied Jonas reference. No scenery, panels, text or portraits. Dies ist noch kein Laufanimations-Atlas.
4. **Materialatlas, opak 2×2:** flat top-down rich crisp pixel-art material swatches, no perspective/objects/borders/labels. Upper left warm worn narrow oak boards with grain, knots and staggered joints; upper right aged off-white lime plaster with subtle mottling/cracks; lower left darker desaturated wood boards; lower right scuffed warm gray concrete. Die verwendeten Felder werden im Spiel auf Boden-/Wandflächen projiziert.
5. **Vier Ergänzungen, transparent 2×2:** match detailed warm workshop pixel-art style; actual F/H/G photos as identity reference. Olive-green upright bandsaw on metal stand; dark-green tabletop drill press on cream drawer cabinet; wooden tool rail with hand tools/clamps/hearing protection; overhead timber shelf with brackets/planks. Entire detached sprites, same isometric camera/light, no background walls/floor/text. Die Holzablage wird an B verankert, nicht frei in den Raum gesetzt.

6. **Regalbauteile, transparent 2×2:** preserve the same warm detailed pixel-art wood style, isometric 2:1 camera/light. Empty shelf frame with uprights/top rail/rear brace and NO shelves or boxes inside; separate thick shelf board; small open wood crate (24 cm) and taller matching crate (34 cm). Generous alpha spacing, complete uncropped shapes, no floor/text/glow. Das Spiel setzt Böden und Kisten anhand der tatsächlichen Planung zusammen; kein statisches fertiges Regalbild.

## Weiterer Produktionsbedarf

Figurenrichtungen und echte Laufanimationen, einheitliche Assetraster/Exportmaße, feinerer Abgleich der realen Maschinen und die vollständige Stockwerksaufnahme bleiben spätere Arbeit. Die vorläufige Maßstabszuordnung soll im Raumreview geprüft werden.
