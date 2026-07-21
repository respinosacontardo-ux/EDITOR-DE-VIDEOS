from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os, random, json
random.seed(8)
W,H,FPS=1080,1920,30
FB='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
EMF='/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf'
BLUE=(47,123,246); LBLUE=(74,158,255); YEL=(255,221,51); RED=(239,68,68)
B='/home/user/EDITOR-DE-VIDEOS/edit/animations'
def eo(t): return 1-(1-t)**3
def eob(t):  # ease_out_back (overshoot)
    c1=1.70158; c3=c1+1; t-=1; return 1+c3*t**3+c1*t*t
def c01(t): return max(0.0,min(1.0,t))

_em_cache={}
def emoji(ch, size):
    key=(ch,size)
    if key not in _em_cache:
        f=ImageFont.truetype(EMF,109)
        tile=Image.new('RGBA',(140,140),(0,0,0,0))
        ImageDraw.Draw(tile).text((10,10),ch,font=f,embedded_color=True)
        bbox=tile.getbbox()
        tile=tile.crop(bbox) if bbox else tile
        _em_cache[key]=tile.resize((size,int(size*tile.height/tile.width)))
    return _em_cache[key]

def glass(d,box,r=40,a=225,ol=(80,92,108)):
    d.rounded_rectangle(box,radius=r,fill=(10,14,20,a),outline=(*ol,a),width=3)

def save_seq(name, frames):
    out=f'{B}/{name}/frames'; os.makedirs(out,exist_ok=True)
    for i,im in enumerate(frames): im.save(f'{out}/{i:04d}.png')
    print(name, len(frames))

def canvas(): return Image.new('RGBA',(W,H),(0,0,0,0))

# ---- A: hook title ----
def hook_title(dur=2.7):
    N=int(dur*FPS); frames=[]
    f1=ImageFont.truetype(FB,86); f2=ImageFont.truetype(FB,96)
    for i in range(N):
        t=i/FPS; im=canvas(); d=ImageDraw.Draw(im)
        p=eob(c01(t/0.45)); a=eo(c01(t/0.3))
        if a>0:
            rot=1.5*math.sin(t*2.6)
            card=Image.new('RGBA',(980,330),(0,0,0,0)); cd=ImageDraw.Draw(card)
            glass(cd,[10,10,970,320],r=46,a=235)
            w1=cd.textlength('EL SISTEMA QUE',font=f1)
            cd.text(((980-w1)/2,45),'EL SISTEMA QUE',font=f1,fill=(255,255,255,255))
            txt2='TRABAJA POR VOS'
            w2=cd.textlength(txt2,font=f2)+120
            cd.text(((980-w2)/2,160),txt2,font=f2,fill=(*YEL,255))
            card.alpha_composite(emoji('🤖',104),(int((980-w2)/2+cd.textlength(txt2,font=f2))+16,160))
            card=card.rotate(rot,expand=True,resample=Image.BICUBIC)
            s=0.7+0.3*p
            cw,chh=int(card.width*s),int(card.height*s)
            card=card.resize((cw,chh))
            if a<1:
                al=card.getchannel('A').point(lambda x:int(x*a)); card.putalpha(al)
            im.alpha_composite(card,(int(W/2-cw/2),int(300-chh/2)))
        frames.append(im)
    save_seq('slot_hook',frames)

# ---- B: phone chat ----
def phone_chat(dur=4.0):
    N=int(dur*FPS); frames=[]
    fmsg=ImageFont.truetype(FB,34); fbad=ImageFont.truetype(FB,44)
    msgs=['Hola! Quiero info 👋','Me interesa tu servicio','¿Cómo lo compro?']
    for i in range(N):
        t=i/FPS; im=canvas(); d=ImageDraw.Draw(im)
        p=eob(c01(t/0.4))
        if p>0:
            ph=Image.new('RGBA',(430,760),(0,0,0,0)); pd=ImageDraw.Draw(ph)
            pd.rounded_rectangle([0,0,420,750],radius=56,fill=(16,20,26,245),outline=(90,100,115,255),width=4)
            pd.rounded_rectangle([16,16,404,734],radius=44,fill=(24,30,38,255))
            pd.rounded_rectangle([150,28,270,44],radius=8,fill=(10,12,16,255))
            nvis=0
            for k in range(3):
                pk=eob(c01((t-0.5-k*0.55)/0.35))
                if pk>0:
                    nvis=k+1
                    bw,bh=330*pk,92*pk
                    y0=90+k*120
                    col=(47,123,246,255) if k%2==0 else (52,60,72,255)
                    pd.rounded_rectangle([36,y0,36+bw,y0+bh],radius=int(26*pk),fill=col)
                    if pk>0.85:
                        pd.text((58,y0+26),msgs[k],font=fmsg,fill=(255,255,255,255))
            s=0.75+0.25*p
            pw,phh=int(430*s),int(760*s)
            ph2=ph.resize((pw,phh))
            al=ph2.getchannel('A').point(lambda x:int(x*min(1,p*1.2))); ph2.putalpha(al)
            im.alpha_composite(ph2,(int(618),int(360)))
            if nvis>0:
                bx,by=640+int(430*s)-70, 380
                d.ellipse([bx-42,by-42,bx+42,by+42],fill=(239,68,68,255))
                tw=d.textlength(str(nvis),font=fbad)
                d.text((bx-tw/2,by-26),str(nvis),font=fbad,fill=(255,255,255,255))
            im.alpha_composite(emoji('💬',86),(560,400+int(6*math.sin(t*4))))
        frames.append(im)
    save_seq('slot_phone',frames)

# ---- C: 24/7 badge ----
def badge247(dur=2.9):
    N=int(dur*FPS); frames=[]
    fb=ImageFont.truetype(FB,92); fc=ImageFont.truetype(FB,54)
    for i in range(N):
        t=i/FPS; im=canvas(); d=ImageDraw.Draw(im)
        p=eob(c01(t/0.4))
        if p>0:
            cx,cy=W/2,480; R=150*p
            for k in range(14):
                ang=t*1.8+k*math.pi/7
                x0,y0=cx+R*1.22*math.cos(ang),cy+R*1.22*math.sin(ang)
                x1,y1=cx+R*1.38*math.cos(ang),cy+R*1.38*math.sin(ang)
                d.line([(x0,y0),(x1,y1)],fill=(*LBLUE,220),width=8)
            d.ellipse([cx-R,cy-R,cx+R,cy+R],fill=(10,14,20,235),outline=(*BLUE,255),width=6)
            fbs=ImageFont.truetype(FB,max(8,int(92*p)))
            tw=d.textlength('24/7',font=fbs)
            d.text((cx-tw/2,cy-int(92*p)*0.58),'24/7',font=fbs,fill=(*YEL,255))
            pc=eo(c01((t-0.35)/0.3))
            if pc>0:
                txt='TRABAJANDO POR VOS'
                tw2=d.textlength(txt,font=fc)
                glass(d,[cx-tw2/2-36,cy+R+28,cx+tw2/2+36,cy+R+118],r=30,a=int(230*pc))
                d.text((cx-tw2/2,cy+R+48),txt,font=fc,fill=(255,255,255,int(255*pc)))
        frames.append(im)
    save_seq('slot_247',frames)

# ---- D: automatic chip + pulsing focus ----
def auto_chip(dur=2.9):
    N=int(dur*FPS); frames=[]
    fc=ImageFont.truetype(FB,58)
    for i in range(N):
        t=i/FPS; im=canvas(); d=ImageDraw.Draw(im)
        p=eob(c01(t/0.4))
        if p>0:
            pulse=0.5+0.5*math.sin(t*5)
            d.rounded_rectangle([90,640,990,1330],radius=40,outline=(*LBLUE,int(120+120*pulse)),width=8)
            txt='TODO EN AUTOMÁTICO'
            tw=d.textlength(txt,font=fc)
            cx,cy=W/2,540
            gw=tw+180
            glass(d,[cx-gw/2,cy-64,cx+gw/2,cy+64],r=36,a=int(235*p))
            g=emoji('⚙️',72)
            im.alpha_composite(g,(int(cx-gw/2+34),int(cy-36+4*math.sin(t*3))))
            d=ImageDraw.Draw(im)
            d.text((cx-gw/2+130,cy-33),txt,font=fc,fill=(255,255,255,int(255*p)))
        frames.append(im)
    save_seq('slot_auto',frames)

# ---- E/F: strikes v2 with shake + emoji ----
def strike2(name,text,dur,strike_at,emo):
    N=int(dur*FPS); frames=[]
    ft=ImageFont.truetype(FB,78)
    tmp=ImageDraw.Draw(Image.new('RGBA',(8,8)))
    tw=tmp.textlength(text,font=ft); cw,ch=tw+150,170
    for i in range(N):
        t=i/FPS; im=canvas(); d=ImageDraw.Draw(im)
        p=eob(c01(t/0.3))
        if p>0:
            dx=0
            dl=t-(strike_at+0.30)
            if 0<dl<0.5: dx=12*math.exp(-7*dl)*math.sin(45*dl)
            cx,cy=W/2+dx,470
            s=0.8+0.2*min(p,1.2)
            w2,h2=cw*s/2,ch*s/2
            glass(d,[cx-w2,cy-h2,cx+w2,cy+h2],a=235)
            fts=ImageFont.truetype(FB,max(8,int(78*s)))
            txw=d.textlength(text,font=fts)
            d.text((cx-txw/2,cy-int(78*s)*0.58),text,font=fts,fill=(255,255,255,255))
            ps=eo(c01((t-strike_at)/0.28))
            if ps>0:
                x0=cx-w2+26; x1=x0+(2*w2-52)*ps
                y0=cy+h2*0.45; y1=y0-(h2*0.9)*ps
                d.line([(x0,y0),(x1,y1)],fill=(*RED,255),width=16)
                if ps>=1:
                    bx,by=cx+w2-6,cy-h2-6
                    d.ellipse([bx-38,by-38,bx+38,by+38],fill=(*RED,255))
                    d.line([(bx-16,by-16),(bx+16,by+16)],fill=(255,255,255,255),width=10)
                    d.line([(bx-16,by+16),(bx+16,by-16)],fill=(255,255,255,255),width=10)
            pe=eo(c01((t-strike_at-0.2)/0.5))
            if 0<pe<1:
                em=emoji(emo,90)
                ex=int(cx+w2*0.55); ey=int(cy+h2+20+90*pe)
                al=em.getchannel('A').point(lambda x:int(x*(1-pe))); em=em.copy(); em.putalpha(al)
                im.alpha_composite(em,(ex,ey))
        frames.append(im)
    save_seq(name,frames)

# ---- G: counter v2 with rocket + confetti ----
def counter2(dur=4.5, cs=0.15, ce=1.44):
    N=int(dur*FPS); frames=[]
    fl=ImageFont.truetype(FB,58)
    parts=[(random.uniform(0,2*math.pi), random.uniform(180,420), random.choice([BLUE,LBLUE,YEL,(255,255,255)])) for _ in range(26)]
    for i in range(N):
        t=i/FPS; im=canvas(); d=ImageDraw.Draw(im)
        p=eob(c01(t/0.35))
        if p>0:
            cx,cy=W/2,540
            s=0.85+0.15*min(p,1.15)
            glass(d,[cx-470*s,cy-200*s,cx+470*s,cy+200*s],r=48,a=235)
            q=c01((t-cs)/(ce-cs)); val=int(1000+2000*eo(q)); land=q>=1
            pulse=1.0+(0.12*math.exp(-3.5*(t-ce)) if land else 0)
            fn=ImageFont.truetype(FB,max(8,int(165*pulse)))
            sv=f'{val:,}'.replace(',','.')
            nw=d.textlength(sv,font=fn)
            rk=emoji('🚀',96)
            d.text((cx-(nw+110)/2,cy-52-int(165*pulse)*0.58),sv,font=fn,fill=(*LBLUE,255))
            im.alpha_composite(rk,(int(cx+(nw+110)/2-88),int(cy-135-8*t)))
            d=ImageDraw.Draw(im)
            lab='CLIENTES POR DÍA'
            lw=d.textlength(lab,font=fl)
            d.text((cx-lw/2,cy+66),lab,font=fl,fill=(255,255,255,255))
            if land:
                dl=t-ce
                if dl<0.7:
                    for ang,vel,col in parts:
                        r=vel*eo(c01(dl/0.7))
                        px,py=cx+r*math.cos(ang),cy-40+r*math.sin(ang)+260*dl*dl
                        rad=max(3,9*(1-dl/0.7))
                        d.ellipse([px-rad,py-rad,px+rad,py+rad],fill=(*col,int(255*(1-dl/0.7))))
        frames.append(im)
    save_seq('slot_counter8',frames)

# ---- H: info v2 ----
def info2(dur=2.45):
    N=int(dur*FPS); frames=[]
    f1=ImageFont.truetype(FB,56); f2=ImageFont.truetype(FB,88)
    for i in range(N):
        t=i/FPS; im=canvas(); d=ImageDraw.Draw(im)
        p=eob(c01(t/0.35))
        if p>0:
            cx=W/2; cy=500+6*math.sin(t*4.8)
            s=0.85+0.15*min(p,1.1)
            glass(d,[cx-440*s,cy-160*s,cx+440*s,cy+160*s],r=44,a=235)
            s1='ESCRIBIME LA PALABRA'
            w1=d.textlength(s1,font=f1)
            d.text((cx-w1/2,cy-118),s1,font=f1,fill=(255,255,255,255))
            pb=eob(c01((t-0.22)/0.32))
            if pb>0:
                bw,bh=300*pb,110*pb
                d.rounded_rectangle([cx-bw/2,cy+62-bh/2,cx+bw/2,cy+62+bh/2],radius=int(30*pb),fill=(*BLUE,255))
                fi=ImageFont.truetype(FB,max(8,int(88*pb)))
                iw=d.textlength('INFO',font=fi)
                d.text((cx-iw/2,cy+62-int(88*pb)*0.58),'INFO',font=fi,fill=(255,255,255,255))
            em=emoji('📩',84)
            im.alpha_composite(em,(int(cx+440*s-40),int(cy-160*s-40+7*math.sin(t*4))))
        frames.append(im)
    save_seq('slot_info8',frames)

# ---- flash ----
def flash():
    out=f'{B}/slot_flash/frames'; os.makedirs(out,exist_ok=True)
    for i in range(5):
        a=[0.75,0.55,0.35,0.18,0.06][i]
        im=Image.new('L',(W,H),0)
        d=ImageDraw.Draw(im)
        d.ellipse([-300,200,W+300,H-200],fill=int(255*a))
        im=im.filter(ImageFilter.GaussianBlur(160))
        rgba=Image.new('RGBA',(W,H),(255,255,255,0)); rgba.putalpha(im)
        rgba.save(f'{out}/{i:04d}.png')
    print('flash 5')

badge247(); auto_chip()
strike2('slot_pub8','PUBLICIDAD',2.2,0.35,'💸')
strike2('slot_agency8','AGENCIA DE MARKETING',2.43,0.35,'❌')
counter2(); info2(); flash()
