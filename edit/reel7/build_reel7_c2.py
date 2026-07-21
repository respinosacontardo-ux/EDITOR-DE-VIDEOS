from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os, json

W,H,FPS = 1080,1920,30
FB='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
BLUE=(47,123,246); RED=(239,68,68); WHITE=(255,255,255); GLASS=(12,16,22,215)
def eo(t): return 1-(1-t)**3
def c01(t): return max(0.0,min(1.0,t))
BASE='/home/user/EDITOR-DE-VIDEOS/edit/animations'

def glass_card(d, box, r=36, alpha=215, outline=None):
    d.rounded_rectangle(box, radius=r, fill=(12,16,22,alpha), outline=outline, width=3)

def strike_slot(name, text, dur, strike_at):
    out=f'{BASE}/{name}/frames'; os.makedirs(out, exist_ok=True)
    f_txt = ImageFont.truetype(FB, 72)
    N=int(dur*FPS)
    tmp=ImageDraw.Draw(Image.new('RGBA',(10,10)))
    tw=tmp.textlength(text,font=f_txt)
    cw, ch = tw+140, 150
    cx, cy = W/2, 470
    for i in range(N):
        t=i/FPS
        im=Image.new('RGBA',(W,H),(0,0,0,0))
        d=ImageDraw.Draw(im)
        p=eo(c01(t/0.28))
        if p>0:
            s=0.8+0.2*p; a=p
            w2,h2=cw*s/2,ch*s/2
            glass_card(d,[cx-w2,cy-h2,cx+w2,cy+h2],alpha=int(215*a),outline=(70,80,95,int(255*a)))
            ft=ImageFont.truetype(FB,int(72*s))
            twx=d.textlength(text,font=ft)
            d.text((cx-twx/2, cy-int(72*s)*0.58), text, font=ft, fill=(255,255,255,int(255*a)))
            ps=eo(c01((t-strike_at)/0.30))
            if ps>0:
                x0,y0 = cx-w2+30, cy+h2-24
                x1 = x0 + (cw*s-60)*ps
                y1 = cy-h2+24 + (1-ps)*(ch*s-48)
                d.line([(x0,cy+ch*s*0.28),(x1, cy-ch*s*0.28*ps+ch*s*0.28*(1-ps))],
                       fill=(239,68,68,255), width=14)
                # X badge
                if ps>=1.0:
                    bx=cx+w2-8; by=cy-h2-8
                    d.ellipse([bx-34,by-34,bx+34,by+34],fill=(239,68,68,255))
                    d.line([(bx-14,by-14),(bx+14,by+14)],fill=(255,255,255,255),width=9)
                    d.line([(bx-14,by+14),(bx+14,by-14)],fill=(255,255,255,255),width=9)
        im.save(f'{out}/{i:04d}.png')
    return N

def counter_slot(dur, count_start, count_end):
    out=f'{BASE}/slot_counter/frames'; os.makedirs(out, exist_ok=True)
    N=int(dur*FPS)
    f_num=ImageFont.truetype(FB,150); f_lab=ImageFont.truetype(FB,56)
    cx,cy=W/2,520
    for i in range(N):
        t=i/FPS
        im=Image.new('RGBA',(W,H),(0,0,0,0))
        d=ImageDraw.Draw(im)
        p=eo(c01(t/0.3))
        if p>0:
            a=p; w2,h2=430*p+40,170
            glass_card(d,[cx-460,cy-190,cx+460,cy+190],alpha=int(220*a),outline=(70,80,95,int(255*a)))
            q=c01((t-count_start)/(count_end-count_start))
            val=int(1000+2000*eo(q))
            land = q>=1.0
            pulse = 1.0+0.06*math.exp(-4*max(0,t-count_end))*(1 if land else 0)
            fn=ImageFont.truetype(FB,int(150*pulse))
            s=f'{val:,}'.replace(',','.')
            col=(74,158,255,int(255*a)) if not land else (74,158,255,255)
            nw=d.textlength(s,font=fn)
            d.text((cx-nw/2, cy-40-int(150*pulse)*0.58), s, font=fn, fill=col)
            lab='CLIENTES POR DÍA'
            lw=d.textlength(lab,font=f_lab)
            d.text((cx-lw/2, cy+55), lab, font=f_lab, fill=(255,255,255,int(255*a)))
        im.save(f'{out}/{i:04d}.png')
    return N

def info_slot(dur):
    out=f'{BASE}/slot_info/frames'; os.makedirs(out, exist_ok=True)
    N=int(dur*FPS)
    f1=ImageFont.truetype(FB,58); f2=ImageFont.truetype(FB,86)
    cx,cy=W/2,500
    for i in range(N):
        t=i/FPS
        im=Image.new('RGBA',(W,H),(0,0,0,0))
        d=ImageDraw.Draw(im)
        p=eo(c01(t/0.3))
        if p>0:
            a=p; bob=6*math.sin(t*2*math.pi/1.3)
            y=cy+bob
            glass_card(d,[cx-420,y-150,cx+420,y+150],alpha=int(220*a),outline=(70,80,95,int(255*a)))
            s1='ESCRIBIME LA PALABRA'
            w1=d.textlength(s1,font=f1)
            d.text((cx-w1/2,y-108),s1,font=f1,fill=(255,255,255,int(255*a)))
            pb=eo(c01((t-0.25)/0.3))
            if pb>0:
                bw,bh=290*pb,105*pb
                d.rounded_rectangle([cx-bw/2,y+30-bh/2+35,cx+bw/2,y+30+bh/2+35],radius=int(28*pb),fill=(47,123,246,int(255*pb)))
                fi=ImageFont.truetype(FB,int(86*pb)) if pb>0.2 else f2
                iw=d.textlength('INFO',font=fi)
                d.text((cx-iw/2, y+65-int(86*pb)*0.58), 'INFO', font=fi, fill=(255,255,255,int(255*pb)))
        im.save(f'{out}/{i:04d}.png')
    return N

print('publicidad', strike_slot('slot_pub','PUBLICIDAD',2.2,0.35))
print('agencia', strike_slot('slot_agency','AGENCIA DE MARKETING',2.45,0.35))
#print('counter', counter_slot(4.5, 0.15, 1.39))
#print('info', info_slot(2.45))
