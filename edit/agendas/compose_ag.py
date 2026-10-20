import subprocess, json
SCR='/tmp/claude-0/-home-user-EDITOR-DE-VIDEOS/3dd4d83e-bd54-53ac-9c3f-393f465923ad/scratchpad'
B=f'{SCR}/segs/base.mp4'; OVL=f'{SCR}/ovl'; MUS=f'{SCR}/music_ag.wav'
total=28.70
offs=[0.0,3.2,6.5,9.0,11.6,15.2,18.9,21.9,25.1]
durs=[3.20,3.30,2.50,2.60,3.60,3.70,3.00,3.20,3.60]
names=[f's{i}' for i in range(9)]
inputs=['-i',B]
for n in names: inputs+=['-framerate','30','-i',f'{OVL}/{n}/%04d.png']
# progress bar color input
inputs+=['-f','lavfi','-i',f'color=c=0xEC6FA6:s=1080x10:r=30:d={total+0.1:.2f}']
fp=[]; cur='[0:v]'
for i,n in enumerate(names):
    idx=i+1; t0=offs[i]
    fp.append(f'[{idx}:v]setpts=PTS-STARTPTS+{t0}/TB[o{i}]')
    fp.append(f"{cur}[o{i}]overlay=enable='between(t,{t0},{t0+durs[i]})'[v{i}]")
    cur=f'[v{i}]'
bi=len(names)+1
fp.append(f"{cur}[{bi}:v]overlay=x='-1080+1080*(t/{total:.2f})':y=1906:eof_action=pass[outv]")
cmd=['ffmpeg','-y','-v','error',*inputs,'-i',MUS,
     '-filter_complex',';'.join(fp),
     '-map','[outv]','-map',f'{bi+1}:a',
     '-t',f'{total}',
     '-c:v','libx264','-preset','slow','-crf','19','-pix_fmt','yuv420p','-r','30',
     '-af',f'afade=t=in:st=0:d=0.4,afade=t=out:st={total-1.0:.2f}:d=1.0',
     '-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',f'{SCR}/prenorm_ag.mp4']
subprocess.run(cmd,check=True)
# loudnorm 2-pass
meas=subprocess.run(['ffmpeg','-y','-hide_banner','-nostats','-i',f'{SCR}/prenorm_ag.mp4',
  '-af','loudnorm=I=-14:TP=-1:LRA=11:print_format=json','-vn','-f','null','-'],capture_output=True,text=True).stderr
d=json.loads(meas[meas.rfind('{'):meas.rfind('}')+1])
f=(f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={d['input_i']}:measured_TP={d['input_tp']}"
   f":measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}:linear=true")
subprocess.run(['ffmpeg','-y','-v','error','-i',f'{SCR}/prenorm_ag.mp4','-c:v','copy','-af',f,
  '-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',
  '/home/user/EDITOR-DE-VIDEOS/entregas/AGENDAS-2027-META.mp4'],check=True)
print('final ok | medido I=',d['input_i'])
