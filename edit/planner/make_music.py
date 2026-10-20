import numpy as np, wave, struct

SR = 44100
DUR = 11.2
N = int(SR*DUR)
t = np.arange(N)/SR
master = np.zeros(N)

def note(freq):
    return freq

# soft lo-fi: 82 BPM
BPM = 82.0
beat = 60.0/BPM
bar = 4*beat

def midi(n):  # midi number -> Hz
    return 440.0*2**((n-69)/12)

# chord progression (4 bars, warm/cozy): Cmaj7 - Am7 - Fmaj7 - G
chords = [
    [60,64,67,71],   # Cmaj7
    [57,60,64,67],   # Am7
    [53,57,60,64],   # Fmaj7
    [55,59,62,67],   # G (G B D + G)
]

def adsr(n, a, d, s, r, sus_level=0.7):
    env = np.zeros(n)
    ai=int(a*SR); di=int(d*SR); ri=int(r*SR)
    si = max(0, n-ai-di-ri)
    idx=0
    if ai>0: env[:ai]=np.linspace(0,1,ai); idx=ai
    if di>0: env[idx:idx+di]=np.linspace(1,sus_level,di); idx+=di
    if si>0: env[idx:idx+si]=sus_level; idx+=si
    if ri>0: env[idx:idx+ri]=np.linspace(sus_level,0,ri)
    return env[:n]

# ---- warm pad (stacked detuned sines through softclip) ----
pad = np.zeros(N)
for bi in range(4):
    start = bi*bar
    si = int(start*SR); ei = int(min((start+bar)*SR, N))
    seg_n = ei-si
    if seg_n<=0: continue
    tt = np.arange(seg_n)/SR
    env = adsr(seg_n, 0.25, 0.2, 0.0, 0.5, 0.85)
    voice = np.zeros(seg_n)
    for nmid in chords[bi]:
        f = midi(nmid-12)  # one octave down for pad warmth
        for det in (-0.12, 0.0, 0.12):
            voice += np.sin(2*np.pi*(f+det)*tt)
        voice += 0.5*np.sin(2*np.pi*f*2*tt)  # soft octave
    voice *= env
    pad[si:ei] += voice
pad /= (np.max(np.abs(pad))+1e-9)
pad *= 0.32

# ---- music-box / marimba melody (pentatonic C major) ----
pent = [72,74,76,79,81,84]  # C D E G A C (high)
mel_pattern = [  # (beat_offset_in_bars_grid, midi, dur_beats)
]
# build a gentle melody, 2 notes per bar + pickups
rng = np.random.default_rng(7)
melody = np.zeros(N)
step = beat/2  # eighth notes grid
events = []
# a simple singable motif per bar landing on chord tones
motif_by_bar = [
    [(0,72),(1.5,76),(3,79)],
    [(0,69+0),(1.5,72),(2.5,76)],
    [(0,77),(1.5,72),(3,69)],
    [(0,74),(1,79),(2,76),(3,67)],
]
# map above midis into higher register nicely
def pluck(freq, dur, n_total, pos):
    nd = int(dur*SR)
    if pos+nd> n_total: nd = n_total-pos
    if nd<=0: return None,pos
    tt=np.arange(nd)/SR
    # music box: fundamental + inharmonic partials, fast decay
    env=np.exp(-tt*5.5)
    s = (np.sin(2*np.pi*freq*tt)
         +0.5*np.sin(2*np.pi*freq*2*tt)
         +0.25*np.sin(2*np.pi*freq*3.01*tt)
         +0.12*np.sin(2*np.pi*freq*4.2*tt))
    s*=env
    # soft attack
    at=int(0.004*SR); s[:at]*=np.linspace(0,1,at)
    return s,nd

for bi in range(4):
    for (boff,mnote) in motif_by_bar[bi]:
        start = bi*bar + boff*beat
        pos=int(start*SR)
        if pos>=N: continue
        s,nd = pluck(midi(mnote), 0.9, N, pos)
        if s is None: continue
        melody[pos:pos+nd]+=s
melody /= (np.max(np.abs(melody))+1e-9)
melody *= 0.30

# ---- soft sub bass (root of each chord) ----
bass = np.zeros(N)
roots=[48,45,41,43]  # C2 A1 F1 G1
for bi in range(4):
    start=bi*bar
    si=int(start*SR); ei=int(min((start+bar)*SR,N)); seg=ei-si
    if seg<=0: continue
    tt=np.arange(seg)/SR
    env=adsr(seg,0.03,0.1,0,0.3,0.8)
    f=midi(roots[bi])
    v=np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*f*2*tt)
    bass[si:ei]+=v*env
bass/=(np.max(np.abs(bass))+1e-9); bass*=0.33

# ---- gentle percussion: soft kick + closed hat (lofi) ----
perc=np.zeros(N)
def kick(pos):
    nd=int(0.18*SR); tt=np.arange(nd)/SR
    fsw=np.linspace(110,45,nd)
    s=np.sin(2*np.pi*np.cumsum(fsw)/SR)*np.exp(-tt*22)
    if pos+nd<=N: perc[pos:pos+nd]+=s*0.5
def hat(pos,amp=0.12):
    nd=int(0.05*SR)
    s=(rng.random(nd)*2-1)*np.exp(-np.arange(nd)/SR*90)
    if pos+nd<=N: perc[pos:pos+nd]+=s*amp
for bi in range(4):
    for b in range(4):
        tb=bi*bar+b*beat
        if b in (0,2): kick(int(tb*SR))
        hat(int((tb+beat*0.5)*SR))
# vinyl crackle (very soft) for lofi warmth
crackle=(rng.random(N)*2-1)
crackle*= (rng.random(N)>0.9985).astype(float)
crackle*=0.05

mix = pad+melody+bass+perc+crackle
# simple master: soft lowpass via moving average + gentle limit
from numpy import convolve
k=np.ones(3)/3; mix=np.convolve(mix,k,mode='same')
mix=np.tanh(mix*1.1)*0.9
# fade in/out
fi=int(0.4*SR); fo=int(1.2*SR)
mix[:fi]*=np.linspace(0,1,fi); mix[-fo:]*=np.linspace(1,0,fo)
mix/=(np.max(np.abs(mix))+1e-9); mix*=0.89

# stereo: slight width on pad/melody
left=mix.copy(); right=mix.copy()
# tiny haas on melody already mono; add subtle stereo via delay on a copy
d=int(0.008*SR)
right[d:]=0.5*right[d:]+0.5*mix[:-d]
stereo=np.stack([left,right],axis=1)
stereo=np.clip(stereo,-1,1)

out=(stereo*32767).astype('<i2')
with wave.open('/tmp/claude-0/-home-user-EDITOR-DE-VIDEOS/3dd4d83e-bd54-53ac-9c3f-393f465923ad/scratchpad/music_lofi.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(out.tobytes())
print("music written", DUR, "s")
