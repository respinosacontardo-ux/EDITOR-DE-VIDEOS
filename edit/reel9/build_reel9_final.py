import json, subprocess, random
random.seed(99)
m=json.load(open('reel7_map.json'))
words=m['words']; total=m['total']
def disp(w): return {'mil':'1.000','tres mil':'3.000'}.get(w,w).upper()
KEY={'SISTEMA','CLIENTES','HERRAMIENTA','AUTOMÁTICO','SOFTWARE','1.000','3.000','INFO','MENSAJE','PUBLICIDAD'}
sizes=[3,2,2,2,1,3, 2,1,2, 2,1,2,1,2,3,1, 3,1,3,1,2,1,3,2, 2,2,1,2,2,2,3,2,1, 1,2,1, 2,1,2,2,1,2,1,3, 2,1,2,3,1,1]
s2=[]
for n in sizes:
    while n>2: s2.append(2); n-=2
    s2.append(n)
chunks=[]; i=0
for n in s2: chunks.append(words[i:i+n]); i+=n
WHITE=r'\c&HFFFFFF&'; YELA=r'\c&H33DDFF&'; BLUEA=r'\c&HFF9E4A&'
def ass_t(s):
    cs=int(round(s*100)); h,r=divmod(cs,360000); mn,r=divmod(r,6000); sec,cs=divmod(r,100)
    return f'{h}:{mn:02d}:{sec:02d}.{cs:02d}'
events=[]
for ci,ch in enumerate(chunks):
    ang=random.uniform(-2.0,2.0)
    end_hold=ch[-1]['oe']+0.12
    if ci+1<len(chunks): end_hold=min(end_hold, chunks[ci+1][0]['os'])
    for wi,w in enumerate(ch):
        t0=ch[0]['os'] if wi==0 else w['os']
        t1=ch[wi+1]['os'] if wi+1<len(ch) else end_hold
        if t1<=t0: t1=t0+0.05
        parts=[]
        for wj,w2 in enumerate(ch):
            dw=disp(w2['w'])
            if wj==wi:
                parts.append(r'{\fscx104\fscy104\t(0,90,\fscx120\fscy120)'+YELA+'}'+dw+r'{\fscx100\fscy100\t()}')
            else:
                c=BLUEA if dw in KEY else WHITE
                parts.append(r'{\fscx100\fscy100'+c+'}'+dw)
        pre=r'{\frz%.1f}'%ang
        if wi==0: pre+=r'{\fad(70,0)}'
        events.append((t0,t1,pre+' '.join(parts)))
hdr="""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Liberation Sans,104,&H00FFFFFF,&H00FFFFFF,&H00000000,&H60000000,-1,0,0,0,100,100,1,0,1,7,3,2,50,50,470,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
open('subs_reel9.ass','w').write(hdr+''.join(f'Dialogue: 0,{ass_t(a)},{ass_t(b)},Sub,,0,0,0,,{t}\n' for a,b,t in events))
print('ass v3:',len(events))

B='/home/user/EDITOR-DE-VIDEOS/edit/animations'
CL='/home/user/EDITOR-DE-VIDEOS/edit/clips_reel9'
slots=[('slot_hook9',0.12,2.70),('slot_phone9',2.45,3.83),('slot_sofa',5.30,1.06),
       ('slot_247',6.55,2.90),('slot_auto',10.15,2.75),('slot_chart',13.15,2.20),
       ('slot_pub8',15.40,2.20),('slot_agency8',17.70,2.40),
       ('slot_counter8',23.70,4.50),('slot_info8',28.50,2.43)]
cuts=[3.94,6.36,9.64,20.54,22.11,28.37,31.04]
inputs=['-i',f'{CL}/base.mp4']
for s,_,_ in slots: inputs+=['-framerate','30','-i',f'{B}/{s}/frames/%04d.png']
inputs+=['-framerate','30','-i',f'{B}/slot_flash9/frames/%04d.png']
inputs+=['-f','lavfi','-i',f'color=c=0x2F7BF6:s=1080x12:r=30:d={total+0.1:.2f}']
fp=[]; cur='[0:v]'
for i,(s,t0,du) in enumerate(slots,start=1):
    fp.append(f'[{i}:v]setpts=PTS-STARTPTS+{t0}/TB[a{i}]')
    fp.append(f"{cur}[a{i}]overlay=enable='between(t,{t0},{t0+du})'[v{i}]")
    cur=f'[v{i}]'
fi=len(slots)+1
fp.append(f'[{fi}:v]split={len(cuts)}'+''.join(f'[f{k}]' for k in range(len(cuts))))
for k,tc in enumerate(cuts):
    fp.append(f'[f{k}]setpts=PTS-STARTPTS+{tc}/TB[ff{k}]')
    fp.append(f"{cur}[ff{k}]overlay=enable='between(t,{tc},{tc+0.11})'[vf{k}]")
    cur=f'[vf{k}]'
bi=fi+1
fp.append(f"{cur}[{bi}:v]overlay=x='-1080+1080*(t/{total:.2f})':y=1908:eof_action=pass[vb]")
fp.append("[vb]ass=subs_reel9.ass[outv]")
subprocess.run(['ffmpeg','-y','-v','error',*inputs,'-filter_complex',';'.join(fp),
  '-map','[outv]','-map','0:a','-c:v','libx264','-preset','fast','-crf','18',
  '-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart','prenorm_reel9.mp4'],check=True)
print('composite9 ok')
meas=subprocess.run(['ffmpeg','-y','-hide_banner','-nostats','-i','prenorm_reel9.mp4',
  '-af','loudnorm=I=-14:TP=-1:LRA=11:print_format=json','-vn','-f','null','-'],capture_output=True,text=True).stderr
d=json.loads(meas[meas.rfind('{'):meas.rfind('}')+1])
f=(f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={d['input_i']}:measured_TP={d['input_tp']}"
   f":measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}:linear=true")
subprocess.run(['ffmpeg','-y','-v','error','-i','prenorm_reel9.mp4','-c:v','copy','-af',f,
  '-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',
  '/home/user/EDITOR-DE-VIDEOS/entregas/REEL-9-SISTEMA-CLIENTES-PRO.mp4'],check=True)
print('final9 ok')
