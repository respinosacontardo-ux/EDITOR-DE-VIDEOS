import json, subprocess, os
m = json.load(open('reel7_map.json'))
SRC='/home/user/EDITOR-DE-VIDEOS/VIDEO-2026-07-18-02-04-17.mp4'
CARD='/home/user/EDITOR-DE-VIDEOS/edit/animations/slot_cta_reel6/render.mp4'
OUT='/home/user/EDITOR-DE-VIDEOS/edit/clips_reel7'
os.makedirs(OUT, exist_ok=True)

BASE='scale=-2:1920,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920'
GRADE='eq=contrast=1.05:saturation=1.10,unsharp=5:5:0.35'
def zp(expr): return f"zoompan=z='{expr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:fps=30:s=1080x1920"

segs=m['segments']
plans=[]
n=lambda a,b:int(round((b-a)*30))
d0=n(*segs[0]); plans.append(f"1.00+0.05*on/{d0}")
d1=n(*segs[1]); plans.append(f"1.08+0.04*on/{d1}")
d2=n(*segs[2]); step=int(round((10.0-segs[2][0])*30))
plans.append(f"if(lt(on,{step}),1.00+0.04*on/{step},1.07+0.06*(on-{step})/{d2-step})")
d3=n(*segs[3]); plans.append(f"1.08+0.02*on/{d3}")
d4=n(*segs[4]); plans.append(f"1.00+0.08*on/{d4}")
d5=n(*segs[5]); plans.append(f"1.08+0.04*on/{d5}")

paths=[]
for i,((a,b),zexpr) in enumerate(zip(segs,plans)):
    dur=b-a
    vf=f"{BASE},{zp(zexpr)},{GRADE}"
    af=f"afade=t=in:st=0:d=0.03,afade=t=out:st={dur-0.03:.3f}:d=0.03"
    p=f"{OUT}/seg_{i:02d}.mp4"
    cmd=['ffmpeg','-y','-v','error','-ss',f'{a:.3f}','-i',SRC,'-t',f'{dur:.3f}',
         '-vf',vf,'-af',af,'-c:v','libx264','-preset','fast','-crf','20',
         '-pix_fmt','yuv420p','-r','30','-c:a','aac','-b:a','192k','-ar','48000',
         '-movflags','+faststart',p]
    subprocess.run(cmd,check=True)
    paths.append(p); print('seg',i,'ok',round(dur,2))
# card
p=f"{OUT}/seg_06.mp4"
af="afade=t=in:st=0:d=0.03,afade=t=out:st=4.47:d=0.03"
subprocess.run(['ffmpeg','-y','-v','error','-i',CARD,'-t','4.5','-vf',GRADE.split(',')[0].replace('1.05','1.0').replace('1.10','1.0'),
    '-af',af,'-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-r','30',
    '-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',p],check=True)
paths.append(p); print('card ok')
open(f'{OUT}/_concat.txt','w').write(''.join(f"file '{p}'\n" for p in paths))
subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',f'{OUT}/_concat.txt',
    '-c','copy','-movflags','+faststart',f'{OUT}/base.mp4'],check=True)
r=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',f'{OUT}/base.mp4'],capture_output=True,text=True)
print('base.mp4 dur:', r.stdout.strip(), '(esperado', m['total'],')')
