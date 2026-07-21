import json, subprocess
m=json.load(open('reel7_map.json'))
words=m['words']  # src-ordered, with 'os','oe' output times

# display mapping
def disp(w):
    return {'mil':'1.000','tres mil':'3.000'}.get(w, w).upper()

# chunk sizes per the 91-word sequence
sizes=[3,2,2,2,1,3, 2,1,2, 2,1,2,1,2,3,1, 3,1,3,1,2,1,3,2, 2,2,1,2,2,2,3,2,1, 1,2,1, 2,1,2,2,1,2,1,3, 2,1,2,3,1,1]
assert sum(sizes)==91, sum(sizes)
chunks=[]; i=0
for n in sizes:
    chunks.append(words[i:i+n]); i+=n

WHITE=r'\c&HFFFFFF&'; BLUE=r'\c&HFF9E4A&'
def ass_t(sec):
    cs=int(round(sec*100)); h,r=divmod(cs,360000); mn,r=divmod(r,6000); s,cs=divmod(r,100)
    return f'{h}:{mn:02d}:{s:02d}.{cs:02d}'

events=[]
for ci,ch in enumerate(chunks):
    end_hold=ch[-1]['oe']+0.12
    if ci+1<len(chunks): end_hold=min(end_hold, chunks[ci+1][0]['os'])
    for wi,w in enumerate(ch):
        t0 = w['os'] if wi>0 else ch[0]['os']
        t1 = ch[wi+1]['os'] if wi+1<len(ch) else end_hold
        if t1<=t0: t1=t0+0.05
        parts=[]
        for wj,w2 in enumerate(ch):
            txt=disp(w2['w'])
            if wj==wi: parts.append(r'{\fscx112\fscy112'+BLUE+'}'+txt+r'{\fscx100\fscy100'+WHITE+'}')
            else: parts.append(txt)
        events.append((t0,t1,' '.join(parts)))

hdr="""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Liberation Sans,88,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,5,2,2,60,60,470,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
lines=[hdr]
for a,b,t in events:
    lines.append(f'Dialogue: 0,{ass_t(a)},{ass_t(b)},Sub,,0,0,0,,{t}\n')
open('subs_reel7.ass','w').write(''.join(lines))
print('ass events:', len(events))

# ---- composite: overlays (PTS shift + enable) then subtitles LAST ----
B='/home/user/EDITOR-DE-VIDEOS/edit/animations'
CLIPS='/home/user/EDITOR-DE-VIDEOS/edit/clips_reel7'
ovs=[(f'{B}/slot_pub/frames/%04d.png',    15.45, 2.2),
     (f'{B}/slot_agency/frames/%04d.png', 17.70, 2.43),
     (f'{B}/slot_counter/frames/%04d.png',23.75, 4.5),
     (f'{B}/slot_info/frames/%04d.png',   28.55, 2.43)]
inputs=['-i', f'{CLIPS}/base.mp4']
for p,_,_ in ovs: inputs += ['-framerate','30','-i',p]
fp=[]
cur='[0:v]'
for i,(p,t0,du) in enumerate(ovs, start=1):
    fp.append(f'[{i}:v]setpts=PTS-STARTPTS+{t0}/TB[a{i}]')
    fp.append(f"{cur}[a{i}]overlay=enable='between(t,{t0},{t0+du})'[v{i}]")
    cur=f'[v{i}]'
fp.append(f"{cur}ass=subs_reel7.ass[outv]")
cmd=['ffmpeg','-y','-v','error',*inputs,'-filter_complex',';'.join(fp),
     '-map','[outv]','-map','0:a','-c:v','libx264','-preset','fast','-crf','18',
     '-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart','prenorm_reel7.mp4']
subprocess.run(cmd,check=True)
print('composite ok')
