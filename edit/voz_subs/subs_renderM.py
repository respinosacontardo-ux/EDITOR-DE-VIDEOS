import json, os, math
from PIL import Image, ImageDraw, ImageFont
W,H,FPS=1080,1920,30
FB='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
OUT='/tmp/claude-0/-home-user-EDITOR-DE-VIDEOS/3dd4d83e-bd54-53ac-9c3f-393f465923ad/scratchpad/subsM'
os.makedirs(OUT,exist_ok=True)
frs=json.load(open('alignM.json'))['fragments']
words=[(float(f['begin']),float(f['end']),f['lines'][0]) for f in frs if f['lines'][0].strip()]
DUR=words[-1][1]
# build cues: up to 3 words, break on strong punctuation
def strong(w): return w[-1] in '.?!:'
def soft(w): return w[-1] in ','
cues=[]; cur=[]
for w in words:
    cur.append(w)
    if len(cur)>=3 or strong(w[2]) or soft(w[2]):
        cues.append(cur); cur=[]
if cur: cues.append(cur)
# each cue: start=first word begin, end=last word end (extended to next cue start to avoid gaps)
C=[]
for i,ce in enumerate(cues):
    s=ce[0][0]; e=ce[-1][1]
    C.append({'s':s,'e':e,'words':ce})
for i in range(len(C)-1):
    C[i]['e']=max(C[i]['e'], C[i+1]['s'])  # no gaps
C[-1]['e']=DUR+0.3

PLUM=(26,18,36); WHITE=(255,255,255); PURPLE=(150,99,246); PINK=(236,111,166)
f_main=ImageFont.truetype(FB,78)
tmp=ImageDraw.Draw(Image.new('RGBA',(8,8)))
CARD_CY=1430; CARD_H=300; CARD_W=980
def disp(w):
    return w.rstrip('.,:;?!').upper()
def wrap_words(cw):
    # returns list of lines, each a list of (word_index_in_cue, text)
    maxw=CARD_W-120
    lines=[[]]; curw=0
    for idx,(_,_,txt) in enumerate(cw):
        t=disp(txt); tw=tmp.textlength(t+' ',font=f_main)
        if curw+tw>maxw and lines[-1]:
            lines.append([]); curw=0
        lines[-1].append((idx,t)); curw+=tw
    return lines

Nf=int((DUR+0.3)*FPS)
# find active cue per frame; persistent card from first word to end
t0_card=words[0][0]
for fi in range(Nf):
    t=fi/FPS
    im=Image.new('RGBA',(W,H),(0,0,0,0))
    if t<t0_card-0.05:
        im.save(f'{OUT}/{fi:04d}.png'); continue
    d=ImageDraw.Draw(im)
    # card (opaque) to cover old subs
    x0=(W-CARD_W)//2; y0=CARD_CY-CARD_H//2
    d.rounded_rectangle([x0,y0,x0+CARD_W,y0+CARD_H],radius=40,fill=(26,18,36,255),outline=(150,99,246,255),width=3)
    # current cue
    cue=None
    for c in C:
        if c['s']<=t<c['e']: cue=c; break
    if cue is None: cue=C[-1]
    lines=wrap_words(cue['words'])
    # active word index (karaoke)
    aidx=0
    for j,(ws,we,_) in enumerate(cue['words']):
        if t>=ws: aidx=j
    nlines=len(lines)
    lh=f_main.size+14
    total_h=nlines*lh
    sy=CARD_CY-total_h//2
    for li,line in enumerate(lines):
        lw=sum(tmp.textlength(t_+' ',font=f_main) for _,t_ in line)-tmp.textlength(' ',font=f_main)
        sx=(W-lw)//2
        x=sx; yy=sy+li*lh
        for (idx,t_) in line:
            tw=tmp.textlength(t_,font=f_main)
            if idx==aidx:
                pad=12
                d.rounded_rectangle([x-pad,yy-4,x+tw+pad,yy+f_main.size+10],radius=14,fill=(150,99,246,255))
                d.text((x,yy),t_,font=f_main,fill=(255,255,255,255))
            else:
                d.text((x,yy),t_,font=f_main,fill=(255,255,255,255))
            x+=tw+tmp.textlength(' ',font=f_main)
    im.save(f'{OUT}/{fi:04d}.png')
print('subs frames', Nf, '| cues', len(C), '| dur', round(DUR,2))
