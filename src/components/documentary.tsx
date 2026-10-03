import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type TouchEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { EagleMark } from "@/components/eagle";
import { createScore, type ScoreHandle } from "@/lib/audio";
import {
  CLASS_NAME,
  PROJECT_TITLE,
  PROJECT_YEARS,
  SCHOOL,
  TIMELINE,
  slides,
  type MorphKind,
  type Slide,
} from "@/lib/slides";
import { cn } from "@/lib/utils";

type Phase = "intro" | "toc" | "show" | "outro";

const MORPH_CLASS: Record<MorphKind, string> = {
  iris: "morph-iris",
  wipe: "morph-wipe",
  blade: "morph-blade",
  rise: "morph-rise",
  burn: "morph-burn",
};

export function Documentary() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const scoreRef = useRef<ScoreHandle | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    scoreRef.current = createScore();
    return () => scoreRef.current?.stop();
  }, []);

  useEffect(() => {
    scoreRef.current?.setMuted(muted);
  }, [muted]);

  const startAudio = useCallback(() => {
    void scoreRef.current?.start();
  }, []);

  const goShow = useCallback(
    (i: number) => {
      startAudio();
      setIndex(i);
      setPhase("show");
      setTocOpen(false);
      setAnimKey((k) => k + 1);
    },
    [startAudio],
  );

  const next = useCallback(() => {
    if (phase === "intro") {
      startAudio();
      setPhase("toc");
      return;
    }
    if (phase === "toc") {
      goShow(0);
      return;
    }
    if (phase === "outro") return;
    if (index >= slides.length - 1) {
      setPhase("outro");
      setAnimKey((k) => k + 1);
      return;
    }
    setIndex((i) => i + 1);
    setAnimKey((k) => k + 1);
  }, [phase, index, goShow, startAudio]);

  const prev = useCallback(() => {
    if (phase === "outro") {
      setPhase("show");
      setIndex(slides.length - 1);
      setAnimKey((k) => k + 1);
      return;
    }
    if (phase !== "show") return;
    if (index <= 0) {
      setPhase("toc");
      return;
    }
    setIndex((i) => i - 1);
    setAnimKey((k) => k + 1);
  }, [phase, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") {
        setTocOpen(false);
      } else if (e.key === "Home") {
        setPhase("toc");
      } else if (e.key === "End") {
        setPhase("outro");
      } else if (e.key === "m" || e.key === "M") {
        setMuted((m) => !m);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    if (!autoplay || phase !== "show") return;
    const id = window.setInterval(() => next(), 16000);
    return () => window.clearInterval(id);
  }, [autoplay, phase, next]);

  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.changedTouches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchX.current;
    const end = e.changedTouches[0]?.clientX;
    touchX.current = null;
    if (start == null || end == null) return;
    const dx = end - start;
    if (dx < -56) next();
    if (dx > 56) prev();
  };

  const slide = slides[index]!;
  const progress =
    phase === "show" ? (index + 1) / slides.length : phase === "outro" ? 1 : 0;

  return (
    <main
      className="film-grain relative min-h-dvh overflow-x-hidden bg-ink text-parchment"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="vignette pointer-events-none absolute inset-0 z-10" />

      {phase === "intro" && <Intro onEnter={next} />}
      {phase === "toc" && <TableOfContents onOpen={goShow} onBegin={() => goShow(0)} />}
      {phase === "show" && (
        <SlideStage key={animKey} slide={slide} index={index} />
      )}
      {phase === "outro" && (
        <Outro
          onReplay={() => {
            setPhase("intro");
            setIndex(0);
            setAutoplay(false);
          }}
        />
      )}

      <Chrome
        phase={phase}
        index={index}
        progress={progress}
        muted={muted}
        autoplay={autoplay}
        onMute={() => setMuted((m) => !m)}
        onAutoplay={() => setAutoplay((a) => !a)}
        onPrev={prev}
        onNext={next}
        onToc={() => {
          if (phase === "show") setTocOpen(true);
          else setPhase("toc");
        }}
      />

      {tocOpen && phase === "show" && (
        <TocOverlay
          current={index}
          onClose={() => setTocOpen(false)}
          onPick={(i) => goShow(i)}
        />
      )}
    </main>
  );
}

function Intro({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 size-full object-cover kenburns"
        src="/media/intro.mp4"
        poster="/media/bunkers.jpg"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/55 to-ink" />
      <div className="absolute inset-0 bg-crimson-deep/20 mix-blend-multiply" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-16 text-center">
        <EagleMark className="mb-6 size-20 animate-[eagle-in_1.2s_cubic-bezier(0.22,1,0.36,1)_both] text-gold sm:size-24" />
        <p className="font-display text-[0.7rem] tracking-[0.38em] text-gold uppercase stagger-in">
          <span>{SCHOOL}</span>
        </p>
        <p className="mt-2 font-display text-[0.65rem] tracking-[0.32em] text-muted uppercase">
          {CLASS_NAME} · Projekt historik
        </p>
        <span className="mt-6 block h-px w-28 origin-center bg-gold animate-[draw-line_1s_0.4s_cubic-bezier(0.22,1,0.36,1)_both]" />
        <h1 className="mt-6 font-display text-4xl leading-[1.05] font-semibold text-parchment sm:text-6xl md:text-7xl">
          {PROJECT_TITLE}
        </h1>
        <p className="mt-4 font-display text-lg tracking-[0.28em] text-gold sm:text-2xl">
          {PROJECT_YEARS}
        </p>
        <p className="mt-6 max-w-md font-body text-sm leading-relaxed text-muted italic sm:text-base">
          Një kujtesë kolektive e njëzet nxënësve mbi diktaturën, izolimin dhe
          ditën kur Shqipëria kërkoi Europën.
        </p>
        <button
          type="button"
          onClick={onEnter}
          className="mt-10 border border-gold/50 bg-crimson/80 px-8 py-3.5 font-display text-xs tracking-[0.28em] text-parchment uppercase transition-transform duration-150 ease-out hover:bg-crimson hover:text-gold-soft active:scale-[0.96]"
        >
          Hyni në kujtesë
        </button>
        <p className="mt-5 text-[0.7rem] tracking-widest text-muted uppercase">
          Shtypni për kolonën zanore · shigjetat për rrëfimin
        </p>
      </div>
    </section>
  );
}

function TableOfContents({
  onOpen,
  onBegin,
}: {
  onOpen: (i: number) => void;
  onBegin: () => void;
}) {
  return (
    <section className="relative min-h-dvh overflow-y-auto">
      <img
        src="/media/bunkers.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover opacity-35 kenburns"
      />
      <div className="absolute inset-0 bg-ink/80" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20">
        <header className="stagger-in mb-8 text-center">
          <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
            {SCHOOL} · {CLASS_NAME}
          </p>
          <h2 className="mt-3 font-display text-3xl text-parchment sm:text-5xl">
            Njëzet zëra, një kujtesë
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Secili nxënës mban një kapitull të Shqipërisë 1944–1991. Zgjidhni
            pjesën, ose nisini rrëfimin nga e para.
          </p>
          <button
            type="button"
            onClick={onBegin}
            className="mt-6 border border-gold bg-crimson px-8 py-3 font-display text-xs tracking-[0.28em] text-parchment uppercase transition-transform duration-150 hover:bg-crimson-deep active:scale-[0.96]"
          >
            Nisi rrëfimin
          </button>
        </header>

        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2">
          {slides.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onOpen(i)}
                className="group flex w-full items-center gap-4 border border-border/70 bg-surface/70 px-4 py-3 text-left backdrop-blur-sm transition-colors duration-200 hover:border-gold/50 hover:bg-raised"
              >
                <span className="font-display text-sm text-gold tabular-nums">
                  {String(s.studentNo).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm text-parchment group-hover:text-gold-soft">
                    {s.title}
                  </span>
                  <span className="block truncate text-xs text-muted">
                    {s.student} · {s.years}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex justify-center pb-16">
          <button
            type="button"
            onClick={onBegin}
            className="border border-gold bg-crimson px-8 py-3 font-display text-xs tracking-[0.28em] text-parchment uppercase transition-transform duration-150 hover:bg-crimson-deep active:scale-[0.96]"
          >
            Nisi rrëfimin
          </button>
        </div>
      </div>
    </section>
  );
}

function SlideStage({ slide, index }: { slide: Slide; index: number }) {
  const morph = MORPH_CLASS[slide.morph];
  return (
    <article className={cn("relative min-h-dvh", morph)}>
      <img
        src={slide.image}
        alt=""
        className="absolute inset-0 size-full object-cover kenburns"
      />
      <div className="absolute inset-0 bg-linear-to-r from-ink from-5% via-ink/90 to-ink/35" />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-ink/55" />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col justify-end px-4 pb-28 pt-20 sm:justify-center sm:px-8 sm:pt-16">
        <div
          className={cn(
            "stagger-in grid gap-8",
            slide.layout === "facts"
              ? "lg:grid-cols-[1.1fr_0.9fr]"
              : "lg:grid-cols-[1.25fr_0.75fr]",
          )}
        >
          <div>
            <p className="font-display text-[0.68rem] tracking-[0.28em] text-gold uppercase">
              Pjesa {String(slide.studentNo).padStart(2, "0")} · {slide.student}
            </p>
            <p className="mt-2 text-[0.7rem] tracking-[0.22em] text-muted uppercase">
              {slide.kicker} · {slide.years}
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl leading-tight font-semibold text-parchment sm:text-5xl">
              {slide.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-parchment/90 sm:text-lg">
              {slide.lead}
            </p>
            <div className="mt-5 max-h-64 space-y-3 overflow-y-auto pr-1 text-sm leading-relaxed text-parchment/85 sm:max-h-none sm:text-base">
              {slide.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            {slide.quote && (
              <blockquote className="mt-6 max-w-xl border-l-2 border-gold pl-4">
                <p className="font-body text-base text-parchment italic sm:text-lg">
                  “{slide.quote.text}”
                </p>
                <footer className="mt-2 text-xs tracking-wide text-muted uppercase">
                  {slide.quote.attrib}
                </footer>
              </blockquote>
            )}
          </div>

          <aside className="self-end border border-border/80 bg-surface/75 p-5 backdrop-blur-md sm:self-center">
            <p className="font-display text-[0.65rem] tracking-[0.28em] text-gold uppercase">
              Datat & shifrat
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              {slide.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[0.65rem] tracking-wide text-muted uppercase">
                    {f.label}
                  </dt>
                  <dd className="mt-1 font-display text-sm text-parchment sm:text-base">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
            {index === 0 && (
              <ol className="mt-6 hidden space-y-1.5 border-t border-border pt-4 lg:block">
                {TIMELINE.slice(0, 6).map((t) => (
                  <li
                    key={t.year}
                    className="flex gap-3 text-xs text-muted"
                  >
                    <span className="font-display text-gold">{t.year}</span>
                    <span>{t.text}</span>
                  </li>
                ))}
              </ol>
            )}
          </aside>
        </div>
      </div>
    </article>
  );
}

function Outro({ onReplay }: { onReplay: () => void }) {
  const names = useMemo(() => slides, []);
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden">
      <img
        src="/media/protest.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover kenburns"
      />
      <div className="absolute inset-0 bg-ink/85" />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-20 text-center sm:px-8">
        <EagleMark className="mx-auto mb-5 size-16 text-gold animate-[eagle-in_1.2s_both]" />
        <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
          {SCHOOL} · {CLASS_NAME}
        </p>
        <h2 className="mt-4 font-display text-3xl text-parchment sm:text-5xl">
          Kujtesa është liria
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Ky projekt u ndërtua nga njëzet nxënës. Secili mbajti një pjesë të
          së vërtetës, që e vërteta e plotë të mos harrohet. 1944–1991 nuk është
          vetëm datë: është paralajmërim.
        </p>

        <ul className="stagger-in mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-2 text-left sm:grid-cols-2">
          {names.map((s) => (
            <li
              key={s.id}
              className="flex items-baseline justify-between gap-3 border-b border-border/50 py-1.5"
            >
              <span className="truncate font-display text-sm text-parchment">
                {s.student}
              </span>
              <span className="shrink-0 font-display text-[0.65rem] text-gold">
                {String(s.studentNo).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ul>

        <blockquote className="mx-auto mt-10 max-w-xl">
          <p className="font-body text-lg text-parchment italic sm:text-xl">
            “E duam Shqipërinë si gjithë Europa.”
          </p>
          <footer className="mt-2 text-xs tracking-widest text-muted uppercase">
            Studentët e dhjetorit 1990
          </footer>
        </blockquote>

        <button
          type="button"
          onClick={onReplay}
          className="mt-10 inline-flex items-center gap-2 border border-gold/60 px-6 py-3 font-display text-xs tracking-[0.24em] text-gold uppercase transition-transform duration-150 hover:bg-crimson/40 active:scale-[0.96]"
        >
          <RotateCcw className="size-4" />
          Rifillo udhëtimin
        </button>
      </div>
    </section>
  );
}

function Chrome({
  phase,
  index,
  progress,
  muted,
  autoplay,
  onMute,
  onAutoplay,
  onPrev,
  onNext,
  onToc,
}: {
  phase: Phase;
  index: number;
  progress: number;
  muted: boolean;
  autoplay: boolean;
  onMute: () => void;
  onAutoplay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToc: () => void;
}) {
  const label =
    phase === "show"
      ? `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`
      : phase === "toc"
        ? "Kujtesa"
        : phase === "outro"
          ? "Fundi"
          : "Hyrja";

  return (
    <>
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-40 h-1 bg-border/40">
        <div
          className="h-full bg-gold transition-[width] duration-500 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <header className="absolute top-4 right-4 left-4 z-40 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-[0.65rem] tracking-[0.22em] text-gold uppercase">
            {SCHOOL}
          </p>
          <p className="truncate text-[0.65rem] text-muted">
            {CLASS_NAME} · {label}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn label={muted ? "Ndize zërin" : "Hesht zërin"} onClick={onMute}>
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </IconBtn>
          {phase === "show" && (
            <IconBtn
              label={autoplay ? "Ndale" : "Luaj vetvetiu"}
              onClick={onAutoplay}
            >
              {autoplay ? <Pause className="size-4" /> : <Play className="size-4" />}
            </IconBtn>
          )}
          <IconBtn label="Përmbajtja" onClick={onToc}>
            <List className="size-4" />
          </IconBtn>
        </div>
      </header>

      {phase !== "intro" && (
        <div className="absolute right-4 bottom-5 z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1 border border-border bg-surface/90 px-3 text-parchment backdrop-blur-sm transition-transform duration-150 hover:border-gold/50 active:scale-[0.96]"
            aria-label="Prapa"
          >
            <ChevronLeft className="size-5" />
            <span className="hidden font-display text-[0.65rem] tracking-widest uppercase sm:inline">
              Prapa
            </span>
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1 border border-gold/40 bg-crimson/90 px-3 text-parchment transition-transform duration-150 hover:bg-crimson active:scale-[0.96]"
            aria-label="Para"
          >
            <span className="hidden font-display text-[0.65rem] tracking-widest uppercase sm:inline">
              {phase === "outro" ? "Fundi" : "Para"}
            </span>
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </>
  );
}

function TocOverlay({
  current,
  onClose,
  onPick,
}: {
  current: number;
  onClose: () => void;
  onPick: (i: number) => void;
}) {
  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-ink/92 backdrop-blur-md">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-xl text-parchment">Përmbajtja</h3>
          <IconBtn label="Mbyll" onClick={onClose}>
            <X className="size-4" />
          </IconBtn>
        </div>
        <ol className="space-y-1">
          {slides.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onPick(i)}
                className={cn(
                  "flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors",
                  i === current
                    ? "border-gold bg-crimson/40"
                    : "border-transparent hover:border-border hover:bg-surface",
                )}
              >
                <span className="font-display text-gold tabular-nums">
                  {String(s.studentNo).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-parchment">
                  {s.title}
                </span>
                <span className="hidden text-xs text-muted sm:inline">
                  {s.student}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center border border-border/80 bg-surface/70 text-parchment backdrop-blur-sm transition-transform duration-150 hover:border-gold/50 hover:text-gold active:scale-[0.96]"
    >
      {children}
    </button>
  );
}
