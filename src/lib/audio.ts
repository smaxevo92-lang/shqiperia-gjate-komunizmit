/** Documentary ambient score — low drone, wind, sparse bells. Client-only. */

export type ScoreHandle = {
  start: () => Promise<void>;
  stop: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (v: number) => void;
};

export function createScore(): ScoreHandle {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let muted = false;
  let volume = 0.22;
  const nodes: AudioNode[] = [];
  const timers: number[] = [];

  function applyGain() {
    if (!master || !ctx) return;
    master.gain.setTargetAtTime(muted ? 0 : volume, ctx.currentTime, 0.08);
  }

  async function start() {
    if (ctx) {
      if (ctx.state === "suspended") await ctx.resume();
      applyGain();
      return;
    }

    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    filter.Q.value = 0.7;
    filter.connect(master);

    const drone = (freq: number, type: OscillatorType, gain: number) => {
      const osc = ctx!.createOscillator();
      const g = ctx!.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.value = gain;
      osc.connect(g);
      g.connect(filter);
      osc.start();
      nodes.push(osc, g);
    };

    drone(55, "sine", 0.38);
    drone(82.4, "triangle", 0.12);
    drone(110, "sine", 0.09);
    drone(164.8, "sine", 0.04);

    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const wind = ctx.createBufferSource();
    wind.buffer = noiseBuf;
    wind.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.value = 680;
    windFilter.Q.value = 0.6;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.045;
    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(master);
    wind.start();
    nodes.push(wind, windFilter, windGain);

    const pulse = ctx.createOscillator();
    const pulseGain = ctx.createGain();
    pulse.type = "sine";
    pulse.frequency.value = 49;
    pulseGain.gain.value = 0.0001;
    pulse.connect(pulseGain);
    pulseGain.connect(filter);
    pulse.start();
    nodes.push(pulse, pulseGain);

    const beat = () => {
      if (!ctx || !pulseGain) return;
      const t = ctx.currentTime;
      pulseGain.gain.cancelScheduledValues(t);
      pulseGain.gain.setValueAtTime(0.0001, t);
      pulseGain.gain.linearRampToValueAtTime(0.09, t + 0.04);
      pulseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    };
    beat();
    timers.push(window.setInterval(beat, 2100));

    const bell = () => {
      if (!ctx || !master) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 196 + Math.random() * 40;
      g.gain.value = 0.0001;
      osc.connect(g);
      g.connect(master);
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.035, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);
      osc.start(t);
      osc.stop(t + 4);
    };
    timers.push(window.setInterval(bell, 7800));
    window.setTimeout(bell, 1400);

    applyGain();
  }

  function stop() {
    timers.forEach((id) => window.clearInterval(id));
    timers.length = 0;
    nodes.forEach((n) => {
      try {
        if ("stop" in n && typeof n.stop === "function") n.stop();
      } catch {
        /* already stopped */
      }
      try {
        n.disconnect();
      } catch {
        /* already disconnected */
      }
    });
    nodes.length = 0;
    void ctx?.close();
    ctx = null;
    master = null;
  }

  return {
    start,
    stop,
    setMuted(next) {
      muted = next;
      applyGain();
    },
    setVolume(v) {
      volume = v;
      applyGain();
    },
  };
}
