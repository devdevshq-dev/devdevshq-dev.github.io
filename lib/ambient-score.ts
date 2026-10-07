// Original ambient score synthesized locally; no recordings or third-party tracks.
export class AmbientScore {
  private context: AudioContext;
  private master: GainNode;
  private padBus: GainNode;
  private melodyBus: GainNode;
  private timer: number | null = null;
  private fadeTimer: number | null = null;
  private nextChord = 0;
  private nextNote = 0;
  private chordIndex = 0;
  private noteIndex = 0;
  private active = new Set<OscillatorNode>();
  private volume = .45;
  private disposed = false;

  constructor() {
    const AudioConstructor = window.AudioContext ?? (window as Window & {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!AudioConstructor) throw new Error("Audio is unavailable in this browser.");
    this.context = new AudioConstructor();
    this.master = this.context.createGain();
    this.master.gain.value = 0;
    const compressor = this.context.createDynamicsCompressor();
    compressor.threshold.value = -20;
    compressor.ratio.value = 3;
    compressor.connect(this.master);
    this.master.connect(this.context.destination);
    const filter = this.context.createBiquadFilter();
    filter.type = "lowpass"; filter.frequency.value = 1500; filter.Q.value = .4;
    this.padBus = this.context.createGain(); this.padBus.gain.value = .4;
    this.melodyBus = this.context.createGain(); this.melodyBus.gain.value = .25;
    this.padBus.connect(filter); this.melodyBus.connect(filter); filter.connect(compressor);
    const reverb = this.context.createConvolver();
    const impulse = this.context.createBuffer(2, Math.floor(this.context.sampleRate * 2.8), this.context.sampleRate);
    for (let channel=0;channel<2;channel++) {
      const samples = impulse.getChannelData(channel);
      for (let i=0;i<samples.length;i++) samples[i]=(Math.random()*2-1)*Math.pow(1-i/samples.length,3)*.35;
    }
    reverb.buffer=impulse;
    const wet = this.context.createGain(); wet.gain.value=.3;
    filter.connect(reverb);reverb.connect(wet);wet.connect(compressor);
  }

  private tone(midi:number,time:number,duration:number,amplitude:number,pan:number,bus:GainNode,pad=false) {
    const oscillator=this.context.createOscillator();
    oscillator.type=pad?"sine":"triangle";
    oscillator.frequency.value=440*Math.pow(2,(midi-69)/12);
    const envelope=this.context.createGain();
    const panner=this.context.createStereoPanner();panner.pan.value=pan;
    envelope.gain.setValueAtTime(0,time);
    envelope.gain.linearRampToValueAtTime(amplitude,time+(pad?1.8:.05));
    envelope.gain.setTargetAtTime(.0001,time+(pad?duration*.55:.15),pad?1.3:duration/3);
    oscillator.connect(envelope);envelope.connect(panner);panner.connect(bus);
    this.active.add(oscillator);
    oscillator.onended=()=>{this.active.delete(oscillator);oscillator.disconnect();envelope.disconnect();panner.disconnect();};
    oscillator.start(time);oscillator.stop(time+duration);
  }
  private schedule = () => {
    if(this.disposed||this.context.state!=="running") return;
    const horizon=this.context.currentTime+.3;
    const chords=[[50,57,62,66],[47,54,59,62],[43,50,55,59],[45,52,57,61]];
    const melody=[74,69,66,62,66,69,78,74,71,66,62,59,62,66,74,71];
    while(this.nextChord<horizon) {
      const chord=chords[this.chordIndex++%chords.length];
      chord.forEach((note,index)=>this.tone(note,this.nextChord,9,.13,(index-1.5)*.3,this.padBus,true));
      this.nextChord+=8;
    }
    while(this.nextNote<horizon) {
      this.tone(melody[this.noteIndex%melody.length],this.nextNote,3.8,.085,Math.sin(this.noteIndex*.7)*.4,this.melodyBus);
      this.noteIndex++;this.nextNote+=2;
    }
  };
  setVolume(value:number) {
    this.volume=Math.max(0,Math.min(1,value));
    if(this.context.state==="running") this.master.gain.setTargetAtTime(this.volume*this.volume*.65,this.context.currentTime,.15);
  }
  async play() {
    if(this.disposed) return;
    if(this.fadeTimer!==null) {clearTimeout(this.fadeTimer);this.fadeTimer=null;}
    await this.context.resume();
    if(this.disposed) return;
    this.master.gain.cancelScheduledValues(this.context.currentTime);
    this.master.gain.setTargetAtTime(this.volume*this.volume*.65,this.context.currentTime,.35);
    this.nextChord=Math.max(this.nextChord,this.context.currentTime+.05);
    this.nextNote=Math.max(this.nextNote,this.context.currentTime+.2);
    this.schedule();
    if(this.timer===null) this.timer=window.setInterval(this.schedule,200);
  }
  pause() {
    if(this.timer!==null) {clearInterval(this.timer);this.timer=null;}
    if(this.fadeTimer!==null) clearTimeout(this.fadeTimer);
    this.master.gain.cancelScheduledValues(this.context.currentTime);
    this.master.gain.setTargetAtTime(0,this.context.currentTime,.08);
    this.fadeTimer=window.setTimeout(()=>{this.fadeTimer=null;if(!this.disposed) void this.context.suspend();},350);
  }
  dispose() {
    this.disposed=true;
    if(this.timer!==null) clearInterval(this.timer);
    if(this.fadeTimer!==null) clearTimeout(this.fadeTimer);
    this.active.forEach(oscillator=>{try{oscillator.stop();}catch{/* Already stopped. */}});
    this.active.clear();
    void this.context.close();
  }
}
