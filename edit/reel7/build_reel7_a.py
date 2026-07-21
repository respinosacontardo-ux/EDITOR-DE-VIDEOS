import json

frs = json.load(open('align.json'))['fragments']
words = [(float(f['begin']), float(f['end']), f['lines'][0]) for f in frs]

# ---- re-anchor aeneas blocks to silence-verified boundaries (source time) ----
# blocks: (first_word_idx, last_word_idx, true_start, true_end)
idx = {w[2]+f'#{i}': i for i,w in enumerate(words)}
texts = [w[2] for w in words]
def find(word, nth=0):
    c=-1
    for i,t in enumerate(texts):
        if t==word:
            c+=1
            if c==nth: return i
    raise KeyError(word)

blocks = [
    (0, find('día',0), 0.35, 4.02),                      # Mirá ... todo el día
    (find('mientras'), find('cosa'), 4.35, 6.50),         # mientras ... cosa
    (find('Tengo'), find('trabajo'), 6.86, 20.75),        # Tengo ... trabajo (continuo, corte escena 10.0 dentro)
    (find('Solamente'), find('software'), 21.09, 22.45),  # Solamente con este software
    (find('podés'), find('negocio'), 23.01, 28.99),       # podés ... negocio
    (find('Dejame'), find('instalarlo'), 29.42, 31.86),   # Dejame ... instalarlo
]
rw = [None]*len(words)
for i0,i1,ts,te in blocks:
    a = words[i0][0]; b = words[i1][1]
    k = (te-ts)/(b-a)
    for i in range(i0,i1+1):
        s,e,t = words[i]
        rw[i] = (round(ts+(s-a)*k,3), round(ts+(e-a)*k,3), t)
assert all(rw), [i for i,x in enumerate(rw) if not x]

# ---- EDL segments (source in/out) ----
segs = [  # (src_start, src_end)
    (0.22, 4.16), (4.24, 6.66), (6.72, 20.90),
    (20.98, 22.55), (22.92, 29.18), (29.28, 31.95),
]
off=[]; t=0.0
for a,b in segs:
    off.append(round(t,3)); t=round(t+(b-a),3)
card_start=t; total=t+4.5
def to_out(src):
    for (a,b),o in zip(segs,off):
        if a-0.001 <= src <= b+0.001:
            return round(src-a+o,3)
    return None

json.dump({'segments':segs,'offsets':off,'card_start':card_start,'total':total,
           'words':[{'s':s,'e':e,'w':t,'os':to_out(min(max(s,segs[0][0]),31.94)),'oe':to_out(min(e,31.94))} for s,e,t in rw]},
          open('reel7_map.json','w'), ensure_ascii=False, indent=1)
print('total salida:', total, 's | card @', card_start)
for s,e,t in rw:
    if t in ('publicidad','agencia','marketing','mil','tres mil','Dejame','mensaje','software','cosa','mirá'):
        print(f'  {t:12s} src {s:6.2f}-{e:6.2f} → out {to_out(s)}-{to_out(e)}')
