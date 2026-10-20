from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os
W,H,FPS=1080,1920,30
FB='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
FR='/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
PINK=(236,111,166); ORANGE=(246,167,101); PLUM=(70,33,63); MUT=(122,96,112); WHITE=(255,255,255)
B='/tmp/claude-0/-home-user-EDITOR-DE-VIDEOS/3dd4d83e-bd54-53ac-9c3f-393f465923ad/scratchpad/ovl'
def eo(t): return 1-(1-t)**3
def eob(t):
    c1=1.70158;c3=c1+1;t-=1;return 1+c3*t**3+c1*t*t
def c01(x): return max(0.0,min(1.0,x))

def grad_pill(draw_img, x0,y0,x1,y1,r):
    w=int(x1-x0); h=int(y1-y0)
    g=Image.new('RGB',(w,1))
    for i in range(w):
        f=i/max(1,w-1)
        c=tuple(int(PINK[j]+(ORANGE[j]-PINK[j])*f) for j in range(3))
        g.putpixel((i,0),c)
    g=g.resize((w,h))
    mask=Image.new('L',(w,h),0); ImageDraw.Draw(mask).rounded_rectangle([0,0,w-1,h-1],radius=r,fill=255)
    draw_img.paste(g,(int(x0),int(y0)),mask)

def card(eyebrow, title, sub, big=False, cta=False, price=None):
    f_eye=ImageFont.truetype(FB, 40)
    f_title=ImageFont.truetype(FB, 78 if not big else 92)
    f_sub=ImageFont.truetype(FR, 44)
    f_price=ImageFont.truetype(FB, 150)
    tmp=ImageDraw.Draw(Image.new('RGBA',(10,10)))
    # measure title (wrap to max width)
    maxw=840
    def wrap(txt,font):
        words=txt.split(); lines=[]; cur=''
        for w_ in words:
            t=(cur+' '+w_).strip()
            if tmp.textlength(t,font=font)<=maxw: cur=t
            else: lines.append(cur); cur=w_
        if cur: lines.append(cur)
        return lines
    tlines=wrap(title,f_title)
    pad=52
    cw=940
    # compute height
    y=pad
    y+= (52 if eyebrow else 0)
    y+= len(tlines)*(f_title.size+8)
    if sub: y+= 20+f_sub.size
    if cta and price: y+= 24+ f_price.size
    ch=y+pad
    card_im=Image.new('RGBA',(cw,ch),(0,0,0,0))
    d=ImageDraw.Draw(card_im)
    # white rounded card
    d.rounded_rectangle([0,0,cw-1,ch-1],radius=46,fill=(255,255,255,240))
    # top gradient accent bar
    grad_pill(card_im, 52, 34, 52+120, 34+12, 6)
    d=ImageDraw.Draw(card_im)
    yy=pad
    if eyebrow:
        d.text((54,yy),eyebrow.upper(),font=f_eye,fill=(*PINK,255))
        yy+=52
    for ln in tlines:
        d.text((52,yy),ln,font=f_title,fill=(*PLUM,255)); yy+=f_title.size+8
    if sub:
        yy+=12; d.text((54,yy),sub,font=f_sub,fill=(*MUT,255)); yy+=f_sub.size
    if cta and price:
        yy+=18
        pw=d.textlength(price,font=f_price)
        # price with gradient
        grad_pill(card_im, 52, yy+28, 52+pw+40, yy+f_price.size+10, 30)
        d=ImageDraw.Draw(card_im)
        d.text((72,yy),price,font=f_price,fill=(255,255,255,255))
    return card_im

def render_slot(name, dur, card_im, y_center=1360):
    out=f'{B}/{name}'; os.makedirs(out,exist_ok=True)
    Nf=int(dur*FPS)
    cw,chh=card_im.size
    for i in range(Nf):
        t=i/FPS
        fr=Image.new('RGBA',(W,H),(0,0,0,0))
        pin=eob(c01(t/0.32))
        pout=1.0
        if t> dur-0.3: pout=c01((dur-t)/0.3)
        a=min(pin,pout)
        if a<=0.01:
            fr.save(f'{out}/{i:04d}.png'); continue
        dy=(1-eo(c01(t/0.32)))*46
        # shadow
        sh=Image.new('RGBA',(W,H),(0,0,0,0))
        sd=ImageDraw.Draw(sh)
        x0=(W-cw)//2; y0=int(y_center-chh/2+dy)
        sd.rounded_rectangle([x0,y0+10,x0+cw,y0+chh+10],radius=46,fill=(40,20,35,int(90*a)))
        sh=sh.filter(ImageFilter.GaussianBlur(22))
        fr=Image.alpha_composite(fr,sh)
        ci=card_im.copy()
        if a<1:
            al=ci.getchannel('A').point(lambda v:int(v*a)); ci.putalpha(al)
        fr.alpha_composite(ci,(x0,y0))
        fr.save(f'{out}/{i:04d}.png')
    return Nf

cards=[
 ('s0', 3.20, card('2027 · Ya disponibles','Agendas digitales','Planificá tu año en tu tablet')),
 ('s1', 3.30, card('Incluye','Vista anual 2027','Todo el año de un vistazo')),
 ('s2', 2.50, card('Sección','Vision Board + Metas', None)),
 ('s3', 2.60, card('Sección','Trackers de hábitos','Y rueda de la vida')),
 ('s4', 3.60, card('12 meses','12 portadas mensuales', None)),
 ('s5', 3.70, card('Estética','Diseños tipo aura','Un diseño único cada mes')),
 ('s6', 3.00, card('Organizá','Calendarios mensuales', None)),
 ('s7', 3.20, card('Y mucho más','Plan de ahorros · Journaling','Book journal y más secciones')),
 ('s8', 3.60, card('Agendas Digitales 2027','Conseguí la tuya', None, cta=True, price='$6.990')),
]
for name,dur,ci in cards:
    n=render_slot(name,dur,ci, y_center=1330 if name!='s8' else 1300)
    print(name, n, ci.size)
