/**
 * Hand-written slug -> GM program-number tables for the 128 General MIDI
 * melodic instruments and the 8 GS-standard drum kits, both exposed on the
 * `gakki` sampler.
 *
 * The slug is the kebab-cased DAW display name for each preset. The program
 * number follows the MIDI 1.0 spec and is 0-indexed (hardware commonly
 * displays 1-128).
 *
 * The tables themselves are the source of truth for the public slug types;
 * `GmInstrumentSlug` / `GmInstrumentProgram` (and the drum equivalents) are
 * derived via `keyof typeof` / indexed-access.
 */

export const gmInstrumentProgramBySlug = {
  "acoustic-piano": 0,
  "bright-grand-2": 1,
  "piano-2": 2,
  "honky-tonk-piano": 3,
  "electronic-piano-1": 4,
  "electronic-piano-2": 5,
  harpsichord: 6,
  clavinet: 7,
  celesta: 8,
  glockenspiel: 9,
  "music-box": 10,
  vibraphone: 11,
  marimba: 12,
  xylophone: 13,
  "tubular-bells": 14,
  dulcimer: 15,
  "jazz-organ": 16,
  "hammond-organ": 17,
  "rock-organ": 18,
  "church-organ": 19,
  "reed-organ": 20,
  accordion: 21,
  harmonica: 22,
  bandoneon: 23,
  "nylon-guitar": 24,
  "dark-steel-guitar": 25,
  "jazz-guitar": 26,
  "clean-guitar": 27,
  "muted-guitar": 28,
  "overdriven-guitar": 29,
  "distortion-guitar": 30,
  "guitar-harmonics": 31,
  "acoustic-bass": 32,
  "fingered-bass": 33,
  "picked-bass": 34,
  "fretless-bass": 35,
  "slap-bass-1": 36,
  "slap-bass-2": 37,
  "synth-bass-1": 38,
  "synth-bass-2": 39,
  violin: 40,
  viola: 41,
  cello: 42,
  contrabass: 43,
  "tremolo-strings": 44,
  "pizzicato-strings": 45,
  harp: 46,
  timpani: 47,
  "string-section": 48,
  "string-ensemble": 49,
  "synth-strings-1": 50,
  "synth-strings-2": 51,
  "choir-aahs": 52,
  "choir-oohs": 53,
  "synth-voice": 54,
  "orchestra-hit": 55,
  trumpet: 56,
  trombone: 57,
  tuba: 58,
  "muted-trumpet": 59,
  "french-horn": 60,
  "brass-section": 61,
  "synth-brass-1": 62,
  "synth-brass-2": 63,
  "soprano-sax": 64,
  "alto-sax": 65,
  "tenor-sax": 66,
  "baritone-sax": 67,
  oboe: 68,
  "english-horn": 69,
  bassoon: 70,
  clarinet: 71,
  piccolo: 72,
  flute: 73,
  recorder: 74,
  "pan-flute": 75,
  "blown-bottle": 76,
  shakuhachi: 77,
  whistle: 78,
  ocarina: 79,
  "square-lead": 80,
  "saw-lead": 81,
  "calliope-lead": 82,
  "chiffer-lead": 83,
  charang: 84,
  "solo-voice": 85,
  "fifth-sawtooth": 86,
  "bass-lead": 87,
  "fantasia-pad": 88,
  "warm-pad": 89,
  polysynth: 90,
  "space-voice": 91,
  "bowed-glass": 92,
  metal: 93,
  halo: 94,
  sweep: 95,
  rain: 96,
  soundtrack: 97,
  crystal: 98,
  atmosphere: 99,
  brightness: 100,
  goblins: 101,
  "echo-drops": 102,
  "sci-fi": 103,
  sitar: 104,
  banjo: 105,
  shamisen: 106,
  koto: 107,
  kalimba: 108,
  bagpipe: 109,
  fiddle: 110,
  shanai: 111,
  "tinkle-bells": 112,
  agogo: 113,
  "steel-drums": 114,
  woodblock: 115,
  "taiko-drum": 116,
  "melodic-drum": 117,
  "synth-tom": 118,
  "reverse-cymbal": 119,
  "guitar-fret-noise": 120,
  "breath-noise": 121,
  seashore: 122,
  "bird-tweet": 123,
  "telephone-ring": 124,
  helicopter: 125,
  applause: 126,
  gunshot: 127,
} as const satisfies Record<string, number>

/**
 * One of the 128 General MIDI melodic preset slugs on the `gakki` sampler.
 *
 * The tables below are auto-synced from `presets.csv` by `npm run gen:presets`
 * -- do not edit by hand between the `gm-instrument-table` markers.
 *
 * <!-- gm-instrument-table:start -->
 * | GM (program) | Slug | Short description |
 * | ---: | :--- | :--- |
 * | 0 | `acoustic-piano` | Classic full-bodied piano sound |
 * | 1 | `bright-grand-2` | Brighter, harder attack |
 * | 2 | `piano-2` | Classic piano |
 * | 3 | `honky-tonk-piano` | Detuned barroom piano |
 * | 4 | `electronic-piano-1` | Rhodes-style smooth tone |
 * | 5 | `electronic-piano-2` | FM-type bell piano |
 * | 6 | `harpsichord` | Plucked baroque keyboard |
 * | 7 | `clavinet` | Funky percussive electronic keyboard |
 * | 8 | `celesta` | Bell-like piano |
 * | 9 | `glockenspiel` | High metallic chime |
 * | 10 | `music-box` | Wind-up toy box tone |
 * | 11 | `vibraphone` | Jazz mallet instrument |
 * | 12 | `marimba` | Wooden mallet percussion |
 * | 13 | `xylophone` | Bright wooden percussion |
 * | 14 | `tubular-bells` | Church bell tone |
 * | 15 | `dulcimer` | Hammered string tone |
 * | 16 | `jazz-organ` | Hammond-style tonewheel |
 * | 17 | `hammond-organ` | Hammond-style tonewheel |
 * | 18 | `rock-organ` | Hammond-style tonewheel |
 * | 19 | `church-organ` | Grand cathedral sound |
 * | 20 | `reed-organ` | Harmonium / pump organ |
 * | 21 | `accordion` | Traditional accordion tone |
 * | 22 | `harmonica` | Breath-based reed tone |
 * | 23 | `bandoneon` | Reed-based button accordion |
 * | 24 | `nylon-guitar` | Classical guitar tone |
 * | 25 | `dark-steel-guitar` | Bright steel-string sound |
 * | 26 | `jazz-guitar` | Smooth hollow-body tone |
 * | 27 | `clean-guitar` | Balanced clean tone |
 * | 28 | `muted-guitar` | Palm-muted pluck |
 * | 29 | `overdriven-guitar` | Crunchy rock tone |
 * | 30 | `distortion-guitar` | Heavy metal tone |
 * | 31 | `guitar-harmonics` | Bell-like guitar harmonics |
 * | 32 | `acoustic-bass` | Upright double bass |
 * | 33 | `fingered-bass` | Smooth electronic bass |
 * | 34 | `picked-bass` | Sharper bass tone |
 * | 35 | `fretless-bass` | Slides and glides |
 * | 36 | `slap-bass-1` | Funky thumb slap |
 * | 37 | `slap-bass-2` | Heavier slap sound |
 * | 38 | `synth-bass-1` | Analog-style bass bright |
 * | 39 | `synth-bass-2` | Analog-style bass dark |
 * | 40 | `violin` | Solo bowed string |
 * | 41 | `viola` | Warm mid-range string |
 * | 42 | `cello` | Deep, emotional tone |
 * | 43 | `contrabass` | Orchestral bass |
 * | 44 | `tremolo-strings` | Fast repeated bowing |
 * | 45 | `pizzicato-strings` | Plucked orchestral strings |
 * | 46 | `harp` | Sweeping harp sound |
 * | 47 | `timpani` | Tuned orchestral drum |
 * | 48 | `string-section` | Full string section |
 * | 49 | `string-ensemble` | Full string section with low attack |
 * | 50 | `synth-strings-1` | Classic analog pad |
 * | 51 | `synth-strings-2` | Bright digital pad |
 * | 52 | `choir-aahs` | Vocal ensemble "Aah" |
 * | 53 | `choir-oohs` | Softer vocal "Ooh" |
 * | 54 | `synth-voice` | Vocal-like synth tone |
 * | 55 | `orchestra-hit` | Classic staccato hit |
 * | 56 | `trumpet` | Bright brass solo |
 * | 57 | `trombone` | Warm low brass |
 * | 58 | `tuba` | Deep orchestral brass |
 * | 59 | `muted-trumpet` | Jazz trumpet with mute |
 * | 60 | `french-horn` | Smooth orchestral horn |
 * | 61 | `brass-section` | Powerful ensemble |
 * | 62 | `synth-brass-1` | Digital brass synth |
 * | 63 | `synth-brass-2` | Analog brass synth |
 * | 64 | `soprano-sax` | Bright, high sax |
 * | 65 | `alto-sax` | Smooth middle sax |
 * | 66 | `tenor-sax` | Deep expressive sax |
 * | 67 | `baritone-sax` | Fat low sax sound |
 * | 68 | `oboe` | Nasal woodwind tone |
 * | 69 | `english-horn` | Mellow oboe variant |
 * | 70 | `bassoon` | Deep reed woodwind |
 * | 71 | `clarinet` | Smooth woodwind |
 * | 72 | `piccolo` | Bright, high flute |
 * | 73 | `flute` | Clear breathy tone |
 * | 74 | `recorder` | Sweet folk flute |
 * | 75 | `pan-flute` | Airy bamboo pipes |
 * | 76 | `blown-bottle` | Airy whistle tone |
 * | 77 | `shakuhachi` | Japanese bamboo flute |
 * | 78 | `whistle` | Clear sharp whistle |
 * | 79 | `ocarina` | Soft clay flute |
 * | 80 | `square-lead` | Basic square wave lead |
 * | 81 | `saw-lead` | Classic saw lead |
 * | 82 | `calliope-lead` | Organ-like synth |
 * | 83 | `chiffer-lead` | Breath noise synth |
 * | 84 | `charang` | Guitar-like synth |
 * | 85 | `solo-voice` | Vocal-ish lead tone |
 * | 86 | `fifth-sawtooth` | Dual oscillator lead |
 * | 87 | `bass-lead` | Hybrid lead/bass |
 * | 88 | `fantasia-pad` | Soft evolving pad |
 * | 89 | `warm-pad` | Gentle analog pad |
 * | 90 | `polysynth` | Rich layered pad |
 * | 91 | `space-voice` | Vocal-like pad |
 * | 92 | `bowed-glass` | Bowed string pad |
 * | 93 | `metal` | Bell-like pad |
 * | 94 | `halo` | Airy shimmering pad |
 * | 95 | `sweep` | Filter-sweep pad |
 * | 96 | `rain` | Nature-like pad |
 * | 97 | `soundtrack` | Cinematic pad |
 * | 98 | `crystal` | Glassy sparkle |
 * | 99 | `atmosphere` | Evolving space pad |
 * | 100 | `brightness` | High resonant pad |
 * | 101 | `goblins` | Weird sound effect |
 * | 102 | `echo-drops` | Delayed texture |
 * | 103 | `sci-fi` | Sci-fi-style pad |
 * | 104 | `sitar` | Indian plucked string |
 * | 105 | `banjo` | Bright folk string |
 * | 106 | `shamisen` | Japanese 3-string lute |
 * | 107 | `koto` | Japanese zither |
 * | 108 | `kalimba` | Thumb piano |
 * | 109 | `bagpipe` | Drone pipe sound |
 * | 110 | `fiddle` | Folk violin |
 * | 111 | `shanai` | Indian reed pipe |
 * | 112 | `tinkle-bells` | Bright chime |
 * | 113 | `agogo` | Twin cowbell tones |
 * | 114 | `steel-drums` | Caribbean tone |
 * | 115 | `woodblock` | Percussive wood click |
 * | 116 | `taiko-drum` | Deep Japanese drum |
 * | 117 | `melodic-drum` | Tuned toms |
 * | 118 | `synth-tom` | Electronic tom hit |
 * | 119 | `reverse-cymbal` | Reversed swell |
 * | 120 | `guitar-fret-noise` | Sliding fret sound |
 * | 121 | `breath-noise` | Inhale/exhale effect |
 * | 122 | `seashore` | Ocean wave sound |
 * | 123 | `bird-tweet` | Bird chirping |
 * | 124 | `telephone-ring` | Old-style ring |
 * | 125 | `helicopter` | Rotor blade sound |
 * | 126 | `applause` | Audience clapping |
 * | 127 | `gunshot` | Pistol/bang sound |
 * <!-- gm-instrument-table:end -->
 */
export type GmInstrumentSlug = keyof typeof gmInstrumentProgramBySlug
export type GmInstrumentProgram =
  (typeof gmInstrumentProgramBySlug)[GmInstrumentSlug]

export const gmDrumProgramBySlug = {
  "standard-kit": 0,
  "room-kit": 8,
  "power-kit": 16,
  "electronic-kit": 24,
  "analog-kit": 25,
  "jazz-kit": 32,
  "brush-kit": 40,
  "orchestra-kit": 48,
} as const satisfies Record<string, number>

/**
 * One of the 8 GS-standard drum-kit preset slugs on the `gakki` sampler.
 *
 * GM reserves channel 10 for percussion; kit programs are sparse -- only the
 * values in the table below resolve to presets. The table is auto-synced from
 * `presets.csv` by `npm run gen:presets` -- do not edit by hand between the
 * `gm-drum-table` markers.
 *
 * <!-- gm-drum-table:start -->
 * | GM (program) | Slug | Short description |
 * | ---: | :--- | :--- |
 * | 0 | `standard-kit` | Standard Drum Kit |
 * | 8 | `room-kit` | Room Drum Kit |
 * | 16 | `power-kit` | Power Drum Kit |
 * | 24 | `electronic-kit` | Electronic Drum Kit |
 * | 25 | `analog-kit` | Analog Drum Kit |
 * | 32 | `jazz-kit` | Jazz Drum Kit |
 * | 40 | `brush-kit` | Brush Drum Kit |
 * | 48 | `orchestra-kit` | Orchestra Drum Kit |
 * <!-- gm-drum-table:end -->
 */
export type GmDrumSlug = keyof typeof gmDrumProgramBySlug
export type GmDrumProgram = (typeof gmDrumProgramBySlug)[GmDrumSlug]

/**
 * Catalog entry describing a single General MIDI melodic preset.
 *
 * One entry per GM program number (0-127). Useful for populating preset
 * pickers and search UIs without having to fetch the full preset payload
 * from the backend first.
 */
export type GmInstrument = {
  /** GM program number, 0-127. Pass to {@link PresetUtil.getInstrument}. */
  program: GmInstrumentProgram
  /** Stable kebab-case slug, also accepted by {@link PresetUtil.getInstrument}. */
  slug: GmInstrumentSlug
  /** User-facing name as shown in the DAW preset browser. */
  displayName: string
  /** High-level Audiotool category, e.g. `"Keys"`, `"Mallets"`, `"Wind"`. */
  category: string
  /** Search tags as shown in the DAW preset browser. */
  tags: readonly string[]
  /** Short human-readable description, when available. */
  description?: string
  /** Backend preset id (`presets/<uuid>`); also usable with {@link PresetUtil.get}. */
  id: string
}

/**
 * Catalog entry describing a single General MIDI drum kit.
 *
 * One entry per GS-standard kit slot (8 total: programs 0, 8, 16, 24, 25,
 * 32, 40, 48).
 */
export type GmDrum = {
  /** GM program number. Pass to {@link PresetUtil.getDrums}. */
  program: GmDrumProgram
  /** Stable kebab-case slug, also accepted by {@link PresetUtil.getDrums}. */
  slug: GmDrumSlug
  /** User-facing name as shown in the DAW preset browser. */
  displayName: string
  /** Always `"Drums"` for GM drum kits; kept for parity with {@link GmInstrument}. */
  category: string
  /** Search tags as shown in the DAW preset browser. */
  tags: readonly string[]
  /** Short human-readable description, when available. */
  description?: string
  /** Backend preset id (`presets/<uuid>`); also usable with {@link PresetUtil.get}. */
  id: string
}
