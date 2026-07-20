from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os

W,H,FPS,DUR = 1080,1920,30,4.5
N = int(FPS*DUR)
OUT='/home/user/EDITOR-DE-VIDEOS/edit/animations/slot_cta_reel6/frames'
FB='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
f_head = ImageFont.truetype(FB, 118)
f_sub  = ImageFont.truetype(FB, 54)
f_btn  = ImageFont.truetype(FB, 96)

def ease_out_cubic(t): return 1-(1-t)**3
def clamp01(t): return max(0.0,min(1.0,t))

# static background with subtle glow
bg = Image.new('RGB',(W,H),(8,11,14))
glow = Image.new('L',(W,H),0)
gd = ImageDraw.Draw(glow)
gd.ellipse([W/2-500,H/2-600,W/2+500,H/2+300], fill=40)
glow = glow.filter(ImageFilter.GaussianBlur(220))
bg = Image.composite(Image.new('RGB',(W,H),(20,26,32)), bg, glow)

HEAD = ["¿QUIERES ESTE","SISTEMA PARA","TU NEGOCIO?"]
SUB = "Envíame un mensaje con la palabra"
CY = 720  # headline block top

def draw_text_center(d, y, txt, font, fill):
    w = d.textlength(txt, font=font)
    d.text(((W-w)/2, y), txt, font=font, fill=fill)

for i in range(N):
    t = i/FPS
    im = bg.copy()
    d = ImageDraw.Draw(im, 'RGBA')
    # headline: fade + rise 0.0-0.8
    p = ease_out_cubic(clamp01(t/0.8))
    if p>0:
        dy = (1-p)*60
        a = int(255*p)
        for li,line in enumerate(HEAD):
            draw_text_center(d, CY+li*140 + dy, line, f_head, (255,255,255,a))
    # sub: fade 0.6-1.2
    p = ease_out_cubic(clamp01((t-0.6)/0.6))
    if p>0:
        draw_text_center(d, CY+3*140+70, SUB, f_sub, (154,163,173,int(255*p)))
    # button: pop 1.0-1.5
    p = ease_out_cubic(clamp01((t-1.0)/0.5))
    if p>0:
        bw,bh = 400,150
        s = 0.85+0.15*p
        bw2,bh2 = bw*s, bh*s
        bx,by = W/2, CY+3*140+70+54+60+bh/2
        # glow
        gl = Image.new('RGBA',(W,H),(0,0,0,0))
        gld = ImageDraw.Draw(gl)
        gld.rounded_rectangle([bx-bw2/2-15,by-bh2/2-15,bx+bw2/2+15,by+bh2/2+15], radius=45, fill=(47,123,246,int(90*p)))
        gl = gl.filter(ImageFilter.GaussianBlur(25))
        im = Image.alpha_composite(im.convert('RGBA'), gl).convert('RGB')
        d = ImageDraw.Draw(im,'RGBA')
        d.rounded_rectangle([bx-bw2/2,by-bh2/2,bx+bw2/2,by+bh2/2], radius=38, fill=(47,123,246,int(255*p)))
        fb = ImageFont.truetype(FB, int(96*s))
        tw = d.textlength("INFO", font=fb)
        d.text((bx-tw/2, by-int(96*s)*0.58), "INFO", font=fb, fill=(255,255,255,int(255*p)))
        # arrow: fade 1.5-1.9 + bob
        pa = ease_out_cubic(clamp01((t-1.5)/0.4))
        if pa>0:
            bob = 8*math.sin((t-1.5)*2*math.pi/1.4)
            ay = by+bh2/2+55+bob
            aw=22
            d.line([(W/2, ay),(W/2, ay+52)], fill=(230,232,235,int(255*pa)), width=14)
            d.polygon([(W/2-aw,ay+44),(W/2+aw,ay+44),(W/2,ay+78)], fill=(230,232,235,int(255*pa)))
    im.save(f'{OUT}/f_{i:04d}.png')
print('frames done', N)
