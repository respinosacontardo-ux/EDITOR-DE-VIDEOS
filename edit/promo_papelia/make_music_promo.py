import numpy as np, wave
SR=44100; BPM=112.0; beat=60/BPM; bar=4*beat
DUR=19.6; N=int(SR*DUR); rng=np.random.default_rng(33)
def midi(n): return 440.0*2**((n-69)/12)
# bright bouncy: C major I-V-vi-IV, bars
prog=[[60,64,67,72],[55,59,62,67],[57,60,64,69],[53,57,60,65]]
roots=[48,43,45,41]
nbars=int(DUR/bar)+1
def adsr(n,a,d,s,r,sl=0.75):
    env=np.zeros(n); ai=int(a*SR);di=int(d*SR);ri=int(r*SR); idx=0
    def put(seg):
        nonlocal idx
        k=min(len(seg), n-idx)
        if k>0: env[idx:idx+k]=seg[:k]; idx+=k
    put(np.linspace(0,1,ai) if ai>0 else np.array([]))
    put(np.linspace(1,sl,di) if di>0 else np.array([]))
    si=max(0,n-idx-ri)
    put(np.full(si,sl))
    put(np.linspace(sl,0,ri) if ri>0 else np.array([]))
    if idx<n: env[idx:]=0.0
    return env[:n]
pad=np.zeros(N); arp=np.zeros(N); bass=np.zeros(N); perc=np.zeros(N)
def pluck(buf,f,dur,pos,amp,decay=7.0,bright=1.0):
    nd=int(dur*SR)
    if pos+nd>N: nd=N-pos
    if nd<=0: return
    tt=np.arange(nd)/SR; env=np.exp(-tt*decay)
    s=(np.sin(2*np.pi*f*tt)+0.5*np.sin(2*np.pi*f*2*tt)+0.28*bright*np.sin(2*np.pi*f*3.01*tt)+0.12*bright*np.sin(2*np.pi*f*4*tt))*env*amp
    at=int(0.003*SR); s[:at]*=np.linspace(0,1,at); buf[pos:pos+nd]+=s
for bi in range(nbars):
    ch=prog[bi%4]
    s=int(bi*bar*SR); e=int(min((bi+1)*bar,DUR)*SR); n=e-s
    if n>0:
        tt=np.arange(n)/SR; env=adsr(n,0.15,0.2,0,0.4,0.85); v=np.zeros(n)
        for m in ch:
            f=midi(m-12)
            for det in (-0.1,0,0.1): v+=np.sin(2*np.pi*(f+det)*tt)
            v+=0.4*np.sin(2*np.pi*f*2*tt)
        pad[s:e]+=v*env
        # bass with light bounce (root on 1 and 3)
        for b in (0,2):
            bp=int((bi*bar+b*beat)*SR); nd=int(beat*0.9*SR)
            if bp+nd<=N:
                ttb=np.arange(nd)/SR; eb=np.exp(-ttb*4)
                bass[bp:bp+nd]+=(np.sin(2*np.pi*midi(roots[bi%4])*ttb)+0.3*np.sin(2*np.pi*midi(roots[bi%4])*2*ttb))*eb
    # bright 16th arp bouncing chord tones
    notes=[ch[0]+12,ch[2]+12,ch[1]+12,ch[3]+12,ch[2]+12,ch[1]+12,ch[0]+24,ch[2]+12]
    for k in range(8):
        pos=int((bi*bar+k*beat*0.5)*SR)
        pluck(arp,midi(notes[k%len(notes)]),0.34,pos,0.9 if k%2==0 else 0.6)
pad/=(np.abs(pad).max()+1e-9); pad*=0.24
arp/=(np.abs(arp).max()+1e-9); arp*=0.30
bass/=(np.abs(bass).max()+1e-9); bass*=0.30
# perc: kick 4-floor-ish (1&3 strong), clap on 2&4, hats 8ths, shaker
def kick(pos):
    nd=int(0.16*SR); tt=np.arange(nd)/SR; fsw=np.linspace(130,50,nd)
    s=np.sin(2*np.pi*np.cumsum(fsw)/SR)*np.exp(-tt*18)
    if pos+nd<=N: perc[pos:pos+nd]+=s*0.5
def clap(pos):
    nd=int(0.09*SR); s=(rng.random(nd)*2-1)*np.exp(-np.arange(nd)/SR*55)
    if pos+nd<=N: perc[pos:pos+nd]+=s*0.22
def hat(pos,a=0.1):
    nd=int(0.035*SR); s=(rng.random(nd)*2-1)*np.exp(-np.arange(nd)/SR*130)
    if pos+nd<=N: perc[pos:pos+nd]+=s*a
for bi in range(nbars):
    for b in range(4):
        tb=bi*bar+b*beat
        if b in (0,2): kick(int(tb*SR))
        if b in (1,3): clap(int(tb*SR))
        hat(int(tb*SR),0.08); hat(int((tb+beat*0.5)*SR),0.11)
mix=pad+arp+bass+perc
mix=np.convolve(mix,np.ones(3)/3,mode='same'); mix=np.tanh(mix*1.15)*0.92
fi=int(0.25*SR); fo=int(1.0*SR); mix[:fi]*=np.linspace(0,1,fi); mix[-fo:]*=np.linspace(1,0,fo)
mix/=(np.abs(mix).max()+1e-9); mix*=0.9
L=mix.copy(); R=mix.copy(); d=int(0.008*SR); R[d:]=0.5*R[d:]+0.5*mix[:-d]
st=np.clip(np.stack([L,R],1),-1,1); out=(st*32767).astype('<i2')
with wave.open('/tmp/claude-0/-home-user-EDITOR-DE-VIDEOS/3dd4d83e-bd54-53ac-9c3f-393f465923ad/scratchpad/music_promo.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())
print('music_promo written', DUR)
