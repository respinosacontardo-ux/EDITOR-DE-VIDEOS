import json, os
from PIL import Image, ImageDraw, ImageFont
W,H,FPS=1080,1920,30
FB='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
OUT='/tmp/claude-0/-home-user-EDITOR-DE-VIDEOS/3dd4d83e-bd54-53ac-9c3f-393f465923ad/scratchpad/subsS'
os.makedirs(OUT,exist_ok=True)
frs=json.load(open('alignS.json'))['fragments']
words=[(float(f['begin']),float(f['end']),f['lines'][0]) for f in frs if f['lines'][0].strip()]
DUR=words[-1][1]
def strong(w): return w[-1] in '.?!:'
def soft(w): return w[-1] in ','
cues=[]; cur=[]
for w in words:
    cur.append(w)
    if len(cur)>=3 or strong(w[2]) or soft(w[2]):
        cues.append(cur); cur=[]
if cur: cues.append(cur)
C=[]
for ce in cues: C.append({'s':ce[0][0],'e':ce[-1][1],'words':ce})
# small hold to next, but allow gaps (hide card when no speech)
for i in range(len(C)-1):
    gap=C[i+1]['s']-C[i]['e']
    if gap<0.35: C[i]['e']=C[i+1]['s']   # close tiny gaps
    else: C[i]['e']=C[i]['e']+0.25
C[-1]['e']=C[-1]['e']+0.3

WHITE=(255,255,255); YEL=(255,214,0); DARK=(18,18,24)
f_main=ImageFont.truetype(FB,74)
tmp=ImageDraw.Draw(Image.new('RGBA',(8,8)))
CARD_CY=1560; CARD_W=900
def disp(w): return w.rstrip('.,:;?!').upper()
def wrap(cw):
    maxw=CARD_W-120; lines=[[]]; curw=0
    for idx,(_,_,txt) in enumerate(cw):
        t=disp(txt); tw=tmp.textlength(t+' ',font=f_main)
        if curw+tw>maxw and lines[-1]: lines.append([]); curw=0
        lines[-1].append((idx,t)); curw+=tw
    return lines
Nf=int((DUR+0.4)*FPS)
for fi in range(Nf):
    t=fi/FPS
    im=Image.new('RGBA',(W,H),(0,0,0,0))
    cue=None
    for c in C:
        if c['s']<=t<c['e']: cue=c; break
    if cue is None:
        im.save(f'{OUT}/{fi:04d}.png'); continue
    d=ImageDraw.Draw(im)
    lines=wrap(cue['words'])
    aidx=0
    for j,(ws,we,_) in enumerate(cue['words']):
        if t>=ws: aidx=j
    lh=f_main.size+16; total_h=len(lines)*lh
    # card sized to content
    maxlw=max(sum(tmp.textlength(t_+' ',font=f_main) for _,t_ in ln)-tmp.textlength(' ',font=f_main) for ln in lines)
    cw=min(CARD_W, maxlw+90); ch=total_h+54
    x0=(W-cw)//2; y0=CARD_CY-ch//2
    d.rounded_rectangle([x0,y0,x0+cw,y0+ch],radius=30,fill=(18,18,24,205))
    sy=CARD_CY-total_h//2
    for li,line in enumerate(lines):
        lw=sum(tmp.textlength(t_+' ',font=f_main) for _,t_ in line)-tmp.textlength(' ',font=f_main)
        x=(W-lw)//2; yy=sy+li*lh
        for (idx,t_) in line:
            tw=tmp.textlength(t_,font=f_main)
            col=YEL if idx==aidx else WHITE
            # outline
            for dx,dy in [(-2,0),(2,0),(0,-2),(0,2)]:
                d.text((x+dx,yy+dy),t_,font=f_main,fill=(0,0,0,220))
            d.text((x,yy),t_,font=f_main,fill=(*col,255))
            x+=tw+tmp.textlength(' ',font=f_main)
    im.save(f'{OUT}/{fi:04d}.png')
print('subsS frames',Nf,'cues',len(C),'dur',round(DUR,2))
