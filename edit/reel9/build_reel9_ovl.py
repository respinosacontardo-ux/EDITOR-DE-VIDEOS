from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os, random
random.seed(9)
W,H,FPS=1080,1920,30
FB='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
EMF='/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf'
BLUE=(47,123,246); LBLUE=(74,158,255); YEL=(255,221,51); RED=(239,68,68); GRN=(52,199,89)
B='/home/user/EDITOR-DE-VIDEOS/edit/animations'
def eo(t): return 1-(1-t)**3
def eob(t):
    c1=1.70158; c3=c1+1; t-=1; return 1+c3*t**3+c1*t*t
def c01(t): return max(0.0,min(1.0,t))
_ec={}
def emoji(ch,size):
    k=(ch,size)
    if k not in _ec:
        f=ImageFont.truetype(EMF,109)
        t=Image.new('RGBA',(140,140),(0,0,0,0))
        ImageDraw.Draw(t).text((10,10),ch,font=f,embedded_color=True)
        bb=t.getbbox(); t=t.crop(bb) if bb else t
        _ec[k]=t.resize((size,max(1,int(size*t.height/t.width))))
    return _ec[k]
def glass(d,box,r=40,a=232,ol=(80,92,108)):
    d.rounded_rectangle(box,radius=r,fill=(10,14,20,a),outline=(*ol,a),width=3)
def save_seq(name,frames):
    out=f'{B}/{name}/frames'; os.makedirs(out,exist_ok=True)
    for i,im in enumerate(frames): im.save(f'{out}/{i:04d}.png')
    print(name,len(frames))
def canvas(): return Image.new('RGBA',(W,H),(0,0,0,0))

# ---- hook v2: glowing border + underline sweep ----
def hook2(dur=2.7):
    N=int(dur*FPS); frames=[]
    f1=ImageFont.truetype(FB,84); f2=ImageFont.truetype(FB,94)
    for i in range(N):
        t=i/FPS; im=canvas()
        p=eob(c01(t/0.45)); a=eo(c01(t/0.3))
        if a>0:
            card=Image.new('RGBA',(1000,360),(0,0,0,0)); cd=ImageDraw.Draw(card)
            # glow border
            glow=Image.new('RGBA',(1000,360),(0,0,0,0))
            gd=ImageDraw.Draw(glow)
            pulse=0.6+0.4*math.sin(t*4)
            gd.rounded_rectangle([14,14,986,346],radius=48,outline=(74,158,255,int(200*pulse)),width=10)
            glow=glow.filter(ImageFilter.GaussianBlur(14))
            card.alpha_composite(glow)
            glass(cd,[14,14,986,346],r=48,a=238)
            cd.rounded_rectangle([14,14,986,346],radius=48,outline=(*LBLUE,255),width=4)
            w1=cd.textlength('EL SISTEMA QUE',font=f1)
            cd.text(((1000-w1)/2,52),'EL SISTEMA QUE',font=f1,fill=(255,255,255,255))
            txt2='TRABAJA POR VOS'
            tw2=cd.textlength(txt2,font=f2)
            x2=(1000-tw2-116)/2
            cd.text((x2,168),txt2,font=f2,fill=(*YEL,255))
            card.alpha_composite(emoji('🤖',100),(int(x2+tw2+18),168))
            # underline sweep
            ps=eo(c01((t-0.5)/0.4))
            if ps>0:
                cd2=ImageDraw.Draw(card)
                cd2.rounded_rectangle([x2,286,x2+tw2*ps,302],radius=8,fill=(*YEL,255))
            rot=1.2*math.sin(t*2.4)
            card=card.rotate(rot,expand=True,resample=Image.BICUBIC)
            s=0.72+0.28*p
            cw,chh=int(card.width*s),int(card.height*s)
            card=card.resize((cw,chh))
            if a<1:
                al=card.getchannel('A').point(lambda x:int(x*a)); card.putalpha(al)
            im.alpha_composite(card,(int(W/2-cw/2),int(265-chh/2)))
        frames.append(im)
    save_seq('slot_hook9',frames)

# ---- phone v2: avatars + typing dots ----
def phone2(dur=3.85):
    N=int(dur*FPS); frames=[]
    fmsg=ImageFont.truetype(FB,33); fbad=ImageFont.truetype(FB,42); fhdr=ImageFont.truetype(FB,36)
    msgs=[('Hola! Quiero info 👋',(240,90,140)),('Me interesa tu servicio',(150,200,120)),('¿Cómo lo compro? 🤑',(255,170,60))]
    T0=[0.45,1.45,2.45]  # message schedule: typing 0.45s then bubble
    for i in range(N):
        t=i/FPS; im=canvas(); d=ImageDraw.Draw(im)
        p=eob(c01(t/0.4))
        if p>0:
            ph=Image.new('RGBA',(440,800),(0,0,0,0)); pd=ImageDraw.Draw(ph)
            pd.rounded_rectangle([0,0,430,790],radius=58,fill=(16,20,26,248),outline=(100,110,125,255),width=4)
            pd.rounded_rectangle([16,16,414,774],radius=46,fill=(24,30,38,255))
            pd.rounded_rectangle([28,26,402,110],radius=34,fill=(32,40,50,255))
            pd.ellipse([44,42,100,98],fill=(47,123,246,255))
            pd.text((60,52),'C',font=fhdr,fill=(255,255,255,255))
            pd.text((116,44),'Clientes',font=fhdr,fill=(255,255,255,255))
            pd.ellipse([116+pd.textlength('Clientes',font=fhdr)+14,62,116+pd.textlength('Clientes',font=fhdr)+34,82],fill=(*GRN,255))
            nvis=0
            for k,(msg,avc) in enumerate(msgs):
                ts=T0[k]
                y0=140+k*120
                if ts-0.45<=t<ts:  # typing dots
                    pd.ellipse([44,y0+10,92,y0+58],fill=(*avc,255))
                    pd.rounded_rectangle([104,y0+8,220,y0+62],radius=24,fill=(52,60,72,255))
                    for dot in range(3):
                        ph_=(t*6-dot*0.6)%3
                        r=5+2*math.sin(ph_*2)
                        pd.ellipse([130+dot*30-r,y0+35-r,130+dot*30+r,y0+35+r],fill=(180,190,200,255))
                pk=eob(c01((t-ts)/0.32))
                if pk>0:
                    nvis=k+1
                    pd.ellipse([44,y0+10,92,y0+58],fill=(*avc,255))
                    bw=max(60,330*pk)
                    pd.rounded_rectangle([104,y0+4,104+bw,y0+68],radius=24,fill=(47,123,246,255) if k%2==0 else (52,60,72,255))
                    if pk>0.85: pd.text((124,y0+20),msg,font=fmsg,fill=(255,255,255,255))
            s=0.75+0.25*p
            pw,phh=int(440*s),int(800*s)
            ph2=ph.resize((pw,phh))
            al=ph2.getchannel('A').point(lambda x:int(x*min(1,p*1.2))); ph2.putalpha(al)
            im.alpha_composite(ph2,(608,340))
            if nvis>0:
                bx,by=608+pw-56,362
                d.ellipse([bx-40,by-40,bx+40,by+40],fill=(*RED,255))
                tw=d.textlength(str(nvis),font=fbad)
                d.text((bx-tw/2,by-25),str(nvis),font=fbad,fill=(255,255,255,255))
            im.alpha_composite(emoji('💬',82),(548,392+int(6*math.sin(t*4))))
        frames.append(im)
    save_seq('slot_phone9',frames)

# ---- chart: rising bars ----
def chart(dur=2.2):
    N=int(dur*FPS); frames=[]
    fl=ImageFont.truetype(FB,50)
    hs=[0.30,0.45,0.62,0.80,1.0]
    for i in range(N):
        t=i/FPS; im=canvas(); d=ImageDraw.Draw(im)
        p=eob(c01(t/0.35))
        if p>0:
            cx,cy=W/2,560
            glass(d,[cx-430,cy-250,cx+430,cy+210],r=46,a=235)
            lab='CLIENTES POR DÍA'
            lw=d.textlength(lab,font=fl)
            d.text((cx-lw/2,cy-215),lab,font=fl,fill=(255,255,255,255))
            base_y=cy+150; bw=110; gap=42; x0=cx-((bw*5+gap*4)/2)
            for k,hmax in enumerate(hs):
                pk=eob(c01((t-0.25-k*0.18)/0.35))
                if pk>0:
                    hh=280*hmax*pk
                    col=(74,158,255,255) if k<4 else (255,221,51,255)
                    d.rounded_rectangle([x0+k*(bw+gap),base_y-hh,x0+k*(bw+gap)+bw,base_y],radius=16,fill=col)
            pe=eo(c01((t-1.15)/0.3))
            if pe>0:
                em=emoji('📈',96)
                im.alpha_composite(em,(int(cx+430-70),int(cy-250-40)))
        frames.append(im)
    save_seq('slot_chart',frames)

# ---- sofa/relax float ----
def sofa(dur=1.1):
    N=int(dur*FPS); frames=[]
    for i in range(N):
        t=i/FPS; im=canvas()
        for k,(ch,x0) in enumerate([('🛋️',170),('😎',330)]):
            pk=eo(c01((t-k*0.15)/0.3))
            if pk>0:
                fade=eo(c01((t-k*0.15-0.4)/0.55))
                em=emoji(ch,100).copy()
                al=em.getchannel('A').point(lambda v:int(v*pk*(1-fade))); em.putalpha(al)
                im.alpha_composite(em,(x0,int(760-70*pk-40*fade)))
        frames.append(im)
    save_seq('slot_sofa',frames)

# ---- soft flash (3 frames) ----
def flash9():
    out=f'{B}/slot_flash9/frames'; os.makedirs(out,exist_ok=True)
    for i,a in enumerate([0.5,0.28,0.10]):
        im=Image.new('L',(W,H),0)
        ImageDraw.Draw(im).ellipse([-300,200,W+300,H-200],fill=int(255*a))
        im=im.filter(ImageFilter.GaussianBlur(160))
        rgba=Image.new('RGBA',(W,H),(255,255,255,0)); rgba.putalpha(im)
        rgba.save(f'{out}/{i:04d}.png')
    print('flash9 3')

hook2(); phone2(); chart(); sofa(); flash9()
