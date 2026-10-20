import numpy as np, wave
SR=44100; BPM=100.0; beat=60/BPM; bar=4*beat
DUR=28.8; N=int(SR*DUR); rng=np.random.default_rng(21)
def midi(n): return 440.0*2**((n-69)/12)
master=np.zeros(N)
# I-V-vi-IV in A major, 3 cycles = 12 bars
prog=[[69,73,76,80],[64,68,71,76],[66,69,73,76],[62,66,69,74]]*3  # A E/.. F#m D (rootish)
roots=[45,40,42,38]*3  # A2 E2 F#2 D2
def adsr(n,a,d,s,r,sl=0.75):
    env=np.zeros(n); ai=int(a*SR);di=int(d*SR);ri=int(r*SR); si=max(0,n-ai-di-ri); idx=0
    if ai>0: env[:ai]=np.linspace(0,1,ai); idx=ai
    if di>0: env[idx:idx+di]=np.linspace(1,sl,di); idx+=di
    if si>0: env[idx:idx+si]=sl; idx+=si
    if ri>0: env[idx:idx+ri]=np.linspace(sl,0,ri)
    return env[:n]
# airy pad
pad=np.zeros(N)
for bi in range(12):
    s=int(bi*bar*SR); e=int(min((bi+1)*bar,DUR)*SR); n=e-s
    if n<=0: continue
    tt=np.arange(n)/SR; env=adsr(n,0.3,0.2,0,0.5,0.85); v=np.zeros(n)
    for m in prog[bi]:
        f=midi(m-12)
        for det in (-0.1,0,0.1): v+=np.sin(2*np.pi*(f+det)*tt)
        v+=0.4*np.sin(2*np.pi*f*2*tt)
    pad[s:e]+=v*env
pad/= (np.abs(pad).max()+1e-9); pad*=0.26
# bright pluck arpeggio (16th-ish music box), bounce up the chord
arp=np.zeros(N)
def pluck(f,dur,pos,amp=1.0):
    nd=int(dur*SR)
    if pos+nd>N: nd=N-pos
    if nd<=0: return
    tt=np.arange(nd)/SR; env=np.exp(-tt*6.5)
    s=(np.sin(2*np.pi*f*tt)+0.5*np.sin(2*np.pi*f*2*tt)+0.22*np.sin(2*np.pi*f*3.01*tt))*env*amp
    at=int(0.003*SR); s[:at]*=np.linspace(0,1,at); arp[pos:pos+nd]+=s
for bi in range(12):
    ch=prog[bi]; notes=[ch[0]+12,ch[1]+12,ch[2]+12,ch[3]+12,ch[2]+12,ch[1]+12]
    for k in range(8):
        pos=int((bi*bar+k*beat*0.5)*SR)
        m=notes[k%len(notes)]
        pluck(midi(m),0.42,pos,0.9 if k%2==0 else 0.6)
arp/=(np.abs(arp).max()+1e-9); arp*=0.28
# sub bass
bass=np.zeros(N)
for bi in range(12):
    s=int(bi*bar*SR); e=int(min((bi+1)*bar,DUR)*SR); n=e-s
    if n<=0: continue
    tt=np.arange(n)/SR; env=adsr(n,0.03,0.1,0,0.25,0.8); f=midi(roots[bi])
    bass[s:e]+=(np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*f*2*tt))*env
bass/=(np.abs(bass).max()+1e-9); bass*=0.3
# soft percussion
perc=np.zeros(N)
def kick(pos):
    nd=int(0.16*SR); tt=np.arange(nd)/SR; fsw=np.linspace(120,48,nd)
    s=np.sin(2*np.pi*np.cumsum(fsw)/SR)*np.exp(-tt*20)
    if pos+nd<=N: perc[pos:pos+nd]+=s*0.45
def hat(pos,a=0.1):
    nd=int(0.04*SR); s=(rng.random(nd)*2-1)*np.exp(-np.arange(nd)/SR*110)
    if pos+nd<=N: perc[pos:pos+nd]+=s*a
def shaker(pos,a=0.07):
    nd=int(0.06*SR); s=(rng.random(nd)*2-1)*np.exp(-np.arange(nd)/SR*70)
    if pos+nd<=N: perc[pos:pos+nd]+=s*a
for bi in range(12):
    for b in range(4):
        tb=bi*bar+b*beat
        if b in (0,2): kick(int(tb*SR))
        hat(int((tb+beat*0.5)*SR)); shaker(int(tb*SR),0.05)
# master
mix=pad+arp+bass+perc
mix=np.convolve(mix,np.ones(3)/3,mode='same'); mix=np.tanh(mix*1.1)*0.92
fi=int(0.5*SR); fo=int(1.3*SR); mix[:fi]*=np.linspace(0,1,fi); mix[-fo:]*=np.linspace(1,0,fo)
mix/=(np.abs(mix).max()+1e-9); mix*=0.9
L=mix.copy(); R=mix.copy(); d=int(0.009*SR); R[d:]=0.5*R[d:]+0.5*mix[:-d]
st=np.clip(np.stack([L,R],1),-1,1); out=(st*32767).astype('<i2')
with wave.open('/tmp/claude-0/-home-user-EDITOR-DE-VIDEOS/3dd4d83e-bd54-53ac-9c3f-393f465923ad/scratchpad/music_ag.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print('music_ag written', DUR)
