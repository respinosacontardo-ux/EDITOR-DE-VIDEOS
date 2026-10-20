import subprocess, os, json
SRC='/home/user/EDITOR-DE-VIDEOS/VIDEO-AGENDAS-2027.mp4'
OUT='/tmp/claude-0/-home-user-EDITOR-DE-VIDEOS/3dd4d83e-bd54-53ac-9c3f-393f465923ad/scratchpad/segs'
os.makedirs(OUT, exist_ok=True)
BASE='scale=1080:1920:flags=lanczos,eq=contrast=1.05:saturation=1.10:brightness=0.012,unsharp=5:5:0.3'
segs=[
 (0.30,3.50,'HOOK'),
 (3.60,6.90,'ANUAL'),
 (14.80,17.30,'VISION'),
 (17.40,20.00,'RUEDA'),
 (23.40,27.00,'PORTADAS'),
 (29.70,33.40,'AURA'),
 (35.60,38.60,'CALEND'),
 (44.40,47.60,'JOURNAL'),
 (53.40,57.00,'CTA'),
]
paths=[]; offs=[]; t=0.0
for i,(a,b,lab) in enumerate(segs):
    dur=round(b-a,3); p=f'{OUT}/s{i:02d}.mp4'
    subprocess.run(['ffmpeg','-y','-v','error','-ss',f'{a:.3f}','-i',SRC,'-t',f'{dur:.3f}',
      '-vf',BASE,'-an','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-r','30',
      '-movflags','+faststart',p],check=True)
    paths.append(p); offs.append(round(t,3)); t=round(t+dur,3)
open(f'{OUT}/_c.txt','w').write(''.join(f"file '{p}'\n" for p in paths))
subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',f'{OUT}/_c.txt',
  '-c','copy','-movflags','+faststart',f'{OUT}/base.mp4'],check=True)
r=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',f'{OUT}/base.mp4'],capture_output=True,text=True)
meta={'segs':[(a,b,lab) for a,b,lab in segs],'offsets':offs,'total':t}
json.dump(meta, open(f'{OUT}/meta.json','w'))
print('base total:', r.stdout.strip(),'| offsets', offs)
