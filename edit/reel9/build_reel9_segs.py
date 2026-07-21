import json, subprocess, os
m=json.load(open('reel7_map.json'))
SRC='/home/user/EDITOR-DE-VIDEOS/VIDEO-2026-07-18-02-04-17.mp4'
CARD='/home/user/EDITOR-DE-VIDEOS/edit/animations/slot_cta_reel6/render.mp4'
OUT='/home/user/EDITOR-DE-VIDEOS/edit/clips_reel9'; os.makedirs(OUT,exist_ok=True)
BASE='scale=-2:1920,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920'
GRADE='eq=contrast=1.06:saturation=1.12,unsharp=5:5:0.4,vignette=PI/6'
R=4  # ramp frames for whip transitions
segs=m['segments']; n=lambda a,b:int(round((b-a)*30)); d=[n(*s) for s in segs]
step=int(round((10.0-segs[2][0])*30))
drift=[f"1.00+0.06*on/{d[0]}", f"1.10+0.04*on/{d[1]}",
       f"if(lt(on,{step}),1.00+0.05*on/{step},1.09+0.06*(on-{step})/{d[2]-step})",
       f"1.10+0.03*on/{d[3]}", f"1.00+0.10*on/{d[4]}", f"1.10+0.04*on/{d[5]}"]
paths=[]
for i,((a,b),z) in enumerate(zip(segs,drift)):
    dur=b-a; N=d[i]
    zx=f"({z})"
    zx+=f"+0.30*max(0,on-{N-R})/{R}"            # whip-out at tail
    if i>0: zx+=f"+0.30*max(0,{R}-on)/{R}"      # whip-in at head
    # whip blur near the internal scene cut too for seg 2
    blur_windows=[f"lt(n,{R})" if i>0 else "0", f"gt(n,{N-R-1})"]
    if i==2: blur_windows.append(f"between(n,{step-2},{step+2})")
    vf=(f"{BASE},zoompan=z='{zx}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:fps=30:s=1080x1920,"
        f"boxblur=10:1:enable='{'+'.join(blur_windows)}',{GRADE}")
    if i==2:  # punch step for scene cut inside seg
        vf=vf.replace(f"if(lt(on,{step})","if(lt(on,{s})".format(s=step))
    p=f"{OUT}/seg_{i:02d}.mp4"
    subprocess.run(['ffmpeg','-y','-v','error','-ss',f'{a:.3f}','-i',SRC,'-t',f'{dur:.3f}',
      '-vf',vf,'-af',f"afade=t=in:st=0:d=0.03,afade=t=out:st={dur-0.03:.3f}:d=0.03",
      '-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-r','30',
      '-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',p],check=True)
    paths.append(p); print('seg',i,'ok')
p=f"{OUT}/seg_06.mp4"
subprocess.run(['ffmpeg','-y','-v','error','-i',CARD,'-t','4.5',
  '-af',"afade=t=in:st=0:d=0.03,afade=t=out:st=4.47:d=0.03",
  '-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-r','30',
  '-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',p],check=True)
paths.append(p)
open(f'{OUT}/_c.txt','w').write(''.join(f"file '{x}'\n" for x in paths))
subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',f'{OUT}/_c.txt','-c','copy',f'{OUT}/base.mp4'],check=True)
r=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',f'{OUT}/base.mp4'],capture_output=True,text=True)
print('base9:', r.stdout.strip())
