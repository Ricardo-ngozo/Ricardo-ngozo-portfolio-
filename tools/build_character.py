"""Ricardo v2: original procedural mesh source. No external human assets/textures.
Requires Python 3, numpy and Pillow. glTF skinning + facial morphs, Y-up, +Z front.
The supplied rigid prototype is the design reference; all final surfaces are rebuilt.
"""
import json, math, struct, pathlib, io
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/"assets"/"character"; OUT.mkdir(parents=True,exist_ok=True)
B=bytearray(); views=[]; access=[]; nodes=[]; meshes=[]; mats=[]; images=[]; textures=[]
def view(data,target=None):
    while len(B)%4:B.append(0)
    d={"buffer":0,"byteOffset":len(B),"byteLength":len(data)}
    if target:d["target"]=target
    B.extend(data);views.append(d);return len(views)-1
def acc(data,typ,kind=5126):
    dtype={5126:"<f4",5123:"<u2",5125:"<u4"}[kind]; a=np.asarray(data,dtype=dtype)
    v=view(a.tobytes()); entry={"bufferView":v,"componentType":kind,"count":len(a),"type":typ}
    if typ in ("VEC3","SCALAR"):
        entry["min"]=np.atleast_1d(a.min(axis=0)).astype(float).tolist();entry["max"]=np.atleast_1d(a.max(axis=0)).astype(float).tolist()
    access.append(entry);return len(access)-1
def texture(im):
    bio=io.BytesIO();im.save(bio,format="PNG",optimize=True)
    images.append({"bufferView":view(bio.getvalue()),"mimeType":"image/png"})
    textures.append({"source":len(images)-1,"sampler":0});return len(textures)-1
# All cloth/skin detail is generated here. No stock texture licence dependencies.
rng=np.random.default_rng(75); n=256; yy,xx=np.mgrid[:n,:n]
base=np.zeros((n,n,3),dtype=float)+[49,52,54]
base+=((xx//48+yy//48)%2)[...,None]*9
for axis in (xx,yy):
    base+=((axis%64)<5)[...,None]*26
    base+=((axis%64)==10)[...,None]*12
weave=((xx%2)*2-1)*2+((yy%2)*2-1)*2+rng.normal(0,1.3,(n,n))
base+=weave[...,None]
plaid=texture(Image.fromarray(np.clip(base,0,255).astype("uint8")))
normal=np.zeros((n,n,3),dtype=np.uint8);normal[:,:,0]=128+(np.sin(xx*np.pi/2)*9).astype("int16");normal[:,:,1]=128+(np.sin(yy*np.pi/2)*9).astype("int16");normal[:,:,2]=254
woven=texture(Image.fromarray(normal))
pores=np.zeros((n,n,3),dtype=np.uint8);pores[:,:,:2]=np.clip(128+rng.normal(0,3,(n,n,2)),118,138);pores[:,:,2]=254
skin_normal=texture(Image.fromarray(pores))
def mat(name,rgb,rough=.7,metal=0,tex=None,norm=None):
    # glTF factors are linear values; colour choices stay warm under neutral light.
    d={"name":name,"pbrMetallicRoughness":{"baseColorFactor":[*rgb,1],"roughnessFactor":rough,"metallicFactor":metal}}
    if tex is not None:d["pbrMetallicRoughness"]["baseColorTexture"]={"index":tex}
    if norm is not None:d["normalTexture"]={"index":norm,"scale":.22 if norm==skin_normal else .3}
    mats.append(d);return len(mats)-1
skin=mat("Brown skin · subtle pores",(.30,.135,.071),.58,norm=skin_normal)
lip=mat("Natural warm lips",(.23,.071,.052),.6)
shadow=mat("Lid folds and nostrils",(.055,.016,.01),.8)
black=mat("Matte black twill",(.012,.014,.018),.82,norm=woven)
hair=mat("Brows and short facial hair",(.025,.016,.013),.9)
cloth=mat("Charcoal woven check",(.8,.8,.8),.88,tex=plaid,norm=woven)
cream=mat("Cream brushed cotton",(.74,.65,.50),.92,norm=woven)
rubber=mat("Off-white rubber",(.67,.65,.59),.82)
shoe=mat("Sneaker suede",(.06,.069,.075),.88,norm=woven)
metal=mat("Brushed headphone alloy",(.12,.14,.16),.32,.75)
earpad=mat("Headphone cushions",(.015,.013,.013),.95)
sclera=mat("Warm sclera",(.67,.63,.53),.38)
iris=mat("Brown iris",(.07,.028,.012),.28)
pupil=mat("Pupil",(.002,.001,.001),.2)
seam=mat("Charcoal stitches",(.21,.21,.19),.9)
label=mat("Ivory cap embroidery",(.74,.68,.54),.85)
def node(name,pos=(0,0,0),parent=None,**kw):
    nodes.append({"name":name,"translation":list(pos),"children":[],**kw});i=len(nodes)-1
    if parent is not None:nodes[parent]["children"].append(i)
    return i
root=node("Ricardo")
bone_nodes=[];bone_pos=[];bone_names={}; parents=[]
def joint(name,pos,parent=None):
    pos=np.array(pos,float);p=bone_pos[parent] if parent is not None else np.zeros(3)
    idx=node(name,pos-p,bone_nodes[parent] if parent is not None else root)
    bone_names[name]=len(bone_nodes);bone_nodes.append(idx);bone_pos.append(pos);parents.append(parent)
    return len(bone_nodes)-1
hip=joint("Hips",(0,.95,0));spine=joint("Spine",(0,1.13,0),hip);chest=joint("Chest",(0,1.37,0),spine)
neck=joint("Neck",(0,1.51,0),chest);head=joint("Head",(0,1.58,0),neck)
for s,side in [(-1,"L"),(1,"R")]:
    arm=joint("UpperArm"+side,(s*.215,1.435,0),chest)
    fore=joint("Forearm"+side,(s*.273,1.165,.017),arm)
    hand=joint("Hand"+side,(s*.293,.935,.038),fore)
    for f,xoff in enumerate([-.025,-.009,.009,.025]):
        joint("Finger"+side+str(f),(s*.293+xoff,.885,.048),hand)
    joint("Thumb"+side,(s*.261,.91,.054),hand)
    thigh=joint("Thigh"+side,(s*.098,.94,0),hip);shin=joint("Shin"+side,(s*.101,.515,.025),thigh)
    joint("Foot"+side,(s*.104,.12,.027),shin)
def weights(p,bone,other=None,mix=None):
    if other is None:return [bone,0,0,0],[1,0,0,0]
    t=float(np.clip(mix(p),0,1));return [bone,other,0,0],[1-t,t,0,0]
def normals(v,idx):
    v=np.array(v);f=np.array(idx);ns=np.zeros_like(v);a=np.cross(v[f[:,1]]-v[f[:,0]],v[f[:,2]]-v[f[:,0]])
    for k in range(3):np.add.at(ns,f[:,k],a)
    return ns/np.maximum(np.linalg.norm(ns,axis=1,keepdims=True),1e-9)
groups={}
def mesh(name,v,idx,material,uv=None,bone=None,other=None,mix=None,morphs=None,parent=None):
    v=np.asarray(v,float);idx=np.asarray(idx);ns=normals(v,idx)
    key=(material,bone is not None,tuple(morphs or {}),parent)
    group=groups.setdefault(key,{"name":name,"v":[],"n":[],"uv":[],"idx":[],"j":[],"w":[],"m":{},"count":0})
    group["v"].append(v);group["n"].append(ns);group["uv"].append(np.array(uv) if uv is not None else np.zeros((len(v),2)))
    group["idx"].append(idx+group["count"]);group["count"]+=len(v)
    if bone is not None:
        jw=[weights(p,bone,other,mix) for p in v];group["j"].extend(x[0] for x in jw);group["w"].extend(x[1] for x in jw)
    for target,delta in (morphs or {}).items():
        d=np.array(delta);group["m"].setdefault(target,[]).append((d,normals(v+d,idx)-ns))
def flush_meshes():
    for (material,skinned,targets,parent),g in groups.items():
        attrs={"POSITION":acc(np.concatenate(g["v"]),"VEC3"),"NORMAL":acc(np.concatenate(g["n"]),"VEC3"),"TEXCOORD_0":acc(np.concatenate(g["uv"]),"VEC2")}
        if skinned:attrs.update(JOINTS_0=acc(g["j"],"VEC4",5123),WEIGHTS_0=acc(g["w"],"VEC4"))
        prim={"attributes":attrs,"indices":acc(np.concatenate(g["idx"]).flatten(),"SCALAR",5123 if g["count"]<65536 else 5125),"material":material}
        m={"name":g["name"],"primitives":[prim]}
        if targets:
            prim["targets"]=[{"POSITION":acc(np.concatenate([x[0] for x in g["m"][t]]),"VEC3"),"NORMAL":acc(np.concatenate([x[1] for x in g["m"][t]]),"VEC3")} for t in targets]
            m["weights"]=[0]*len(targets);m["extras"]={"targetNames":list(targets)}
        meshes.append(m);kw={"mesh":len(meshes)-1}
        if skinned:kw["skin"]=0
        node(g["name"],parent=root if parent is None else parent,**kw)
def grid(fn,rows=18,cols=32):
    v=[];uv=[];idx=[]
    for i in range(rows+1):
        for j in range(cols+1):v.append(fn(i/rows,j/cols));uv.append([j/cols,i/rows])
    for i in range(rows):
        for j in range(cols):
            a=i*(cols+1)+j;b=a+cols+1;idx.extend([[a,a+1,b],[a+1,b+1,b]])
    return v,idx,uv
def ellipsoid(name,center,size,material,bone=None,parent=None,rows=16,cols=24):
    c=np.array(center);s=np.array(size)
    def f(u,v):
        a=math.pi*u;b=2*math.pi*v
        return c+s*np.array([math.sin(a)*math.cos(b),math.cos(a),math.sin(a)*math.sin(b)])
    v,idx,uv=grid(f,rows,cols);return mesh(name,v,idx,material,uv,bone,parent=parent)
def tube(name,points,radii,material,bone=None,other=None,mix=None,sides=12):
    pts=np.array(points);v=[];uv=[]
    for i,p in enumerate(pts):
        tangent=pts[min(i+1,len(pts)-1)]-pts[max(0,i-1)]
        tangent/=max(np.linalg.norm(tangent),1e-8);ref=np.array([0,0,1]) if abs(tangent[2])<.9 else np.array([0,1,0])
        x=np.cross(tangent,ref);x/=np.linalg.norm(x);y=np.cross(tangent,x)
        rx,ry=(radii[i] if isinstance(radii[i],(list,tuple)) else (radii[i],radii[i]))
        for j in range(sides+1):
            a=j/sides*2*math.pi;v.append(p+x*math.cos(a)*rx+y*math.sin(a)*ry);uv.append([j/sides*2,i/max(1,len(pts)-1)*3])
    idx=[]
    for i in range(len(pts)-1):
        for j in range(sides):
            a=i*(sides+1)+j;b=a+sides+1;idx.extend([[a,a+1,b],[a+1,b+1,b]])
    return mesh(name,v,idx,material,uv,bone,other,mix)
def curve(name,points,r,material,bone):
    return tube(name,points,[r]*len(points),material,bone,sides=6)
# Continuous garments: softly varying cross-sections produce real folds, not boxes.
def torso_shape(u,v):
    y=1.01+u*.46;a=math.pi/2+.36+v*(2*math.pi-.72)
    width=np.interp(u,[0,.25,.7,.92,1],[.178,.181,.211,.205,.165])
    depth=np.interp(u,[0,.3,.75,1],[.098,.113,.104,.09])
    wrinkle=.0025*math.sin(u*32+a*5)*math.sin(math.pi*u)
    return [math.cos(a)*(width+wrinkle),y,math.sin(a)*(depth+wrinkle)]
v,idx,uv=grid(torso_shape,26,48)
idx=[[a,c,b] for a,b,c in idx]
# Jacket has a narrow front opening exposing the cream layer.
keep=[]
for face in idx:
    p=np.mean(np.array(v)[face],axis=0)
    keep.append(face)
mesh("Jacket tailored shell",v,keep,cloth,[[u*2,v*2] for u,v in uv],spine,chest,lambda p:(p[1]-1.20)/.20)
ellipsoid("Hoodie body",(0,1.225,.008),(.156,.25,.098),cream,spine,rows=20,cols=32)
# Hood ring, folded collar, seams, pockets and drawstrings.
for s in [-1,1]:
    tube("Folded hood",[(s*.095*math.cos(a),1.478+.026*math.sin(a),-.018-.065*math.sin(a)) for a in np.linspace(-.3,math.pi/2,22)],[(.026,.035)]*22,cream,chest,sides=16)
    curve("Front placket",[(s*.071,1.035,.095),(s*.069,1.19,.116),(s*.076,1.36,.106),(s*.09,1.44,.10)],.007,cloth,spine)
    curve("Cotton drawstring",[(s*.036,1.475,.082),(s*.04,1.385,.116),(s*.047,1.32,.118)],.0032,cream,chest)
    ellipsoid("Drawstring aglet",(s*.047,1.309,.118),(.004,.013,.004),metal,chest,rows=8,cols=8)
    # Shaped pocket panel follows chest, outlined with stitching.
    pv=[(s*x,y,z) for x,y,z in [(.093,1.37,.110),(.166,1.367,.081),(.163,1.285,.091),(.1,1.284,.12)]]
    mesh("Chest pocket",pv,[[0,2,1],[0,3,2]] if s<0 else [[0,1,2],[0,2,3]],cloth,[[0,0],[.7,0],[.7,.8],[0,.8]],chest)
    curve("Pocket stitching",pv+[pv[0]],.0014,seam,chest)
    ellipsoid("Pocket snap",(s*.131,1.35,.106),(.004,.004,.003),metal,chest,rows=8,cols=8)
curve("Hoodie lower hem",[(-.13,1.015,.06),(0,1.008,.107),(.13,1.015,.06)],.007,cream,spine)
# Limbs: shared vertices weighted across shoulder/elbow and knee joints.
for s,side in [(-1,"L"),(1,"R")]:
    upper=bone_names["UpperArm"+side];fore=bone_names["Forearm"+side];hand=bone_names["Hand"+side]
    ys=np.linspace(1.44,.962,27)
    pts=[(s*(.216+(1.44-y)*.16),y,.012+(1.44-y)*.035) for y in ys]
    radii=[(.073-(1.44-y)*.066+(.003*math.sin(y*87) if y<1.23 else 0),.073-(1.44-y)*.066) for y in ys]
    pts=[(s*.216,1.49,0),(s*.216,1.477,0),(s*.216,1.457,0)]+pts
    radii=[(.006,.006),(.04,.04),(.066,.066)]+radii
    tube("Sleeve "+side,pts,radii,cloth,upper,fore,lambda p:(1.22-p[1])/.10,sides=24)
    tube("Ribbed cuff "+side,pts[-3:],[.045,.044,.042],cloth,fore,sides=24)
    ellipsoid("Palm "+side,(s*.297,.91,.033),(.037,.059,.021),skin,hand,rows=16,cols=20)
    for f,off in enumerate([-.025,-.009,.009,.025]):
        length=[.051,.065,.061,.044][f]
        b=bone_names["Finger"+side+str(f)];x=s*.297+off
        tube("Finger "+side+str(f),[(x,.89,.038),(x,.87,.043),(x,.89-length,.052),(x,.882-length,.049)],[.010,.009,.008,.001],skin,hand,b,lambda p:(.895-p[1])/.025,sides=10)
        ellipsoid("Fingernail "+side+str(f),(x,.886-length,.058),(.006,.009,.0015),lip,b,rows=6,cols=10)
    b=bone_names["Thumb"+side]
    tube("Thumb "+side,[(s*.269,.923,.042),(s*.250,.902,.06),(s*.254,.882,.066)],[.015,.013,.005],skin,hand,b,lambda p:(.92-p[1])/.035,sides=12)
    thigh=bone_names["Thigh"+side];shin=bone_names["Shin"+side];foot=bone_names["Foot"+side]
    ys=np.linspace(.997,.155,34);pts=[(s*(.099+.004*math.sin((1-y)*3)),y,.014+math.sin((1-y)*4)*.008) for y in ys]
    rr=[]
    for y in ys:
        r=np.interp(y,[.155,.29,.50,.70,.997],[.059,.060,.071,.091,.102])
        fold=.0035*math.sin(y*85)*math.exp(-((y-.5)/.12)**2)+.002*math.sin(y*110)*math.exp(-((y-.20)/.07)**2)
        rr.append((r+fold,r*.85+fold))
    tube("Trousers "+side,pts,rr,cloth,thigh,shin,lambda p:(.59-p[1])/.15,sides=28)
    ellipsoid("Sneaker outsole "+side,(s*.104,.046,.072),(.078,.025,.145),rubber,foot,rows=12,cols=28)
    ellipsoid("Sneaker upper "+side,(s*.104,.09,.059),(.071,.049,.133),shoe,foot,rows=14,cols=28)
    ellipsoid("Sneaker tongue "+side,(s*.104,.128,.050),(.043,.016,.061),cream,foot,rows=10,cols=18)
    for j in range(5):
        z=.022+j*.019;y=.14-j*.003
        curve("Lace "+side+str(j),[(s*.104-.037,y,z),(s*.104,y+.005,z+.009),(s*.104+.037,y,z)],.0028,cream,foot)
    curve("Shoe stitching "+side,[(s*.104-.06,.085,.05),(s*.104-.051,.08,.15),(s*.104,.075,.185),(s*.104+.051,.08,.15),(s*.104+.06,.085,.05)],.0016,seam,foot)
ellipsoid("Neck",(0,1.53,0),(.054,.092,.052),skin,neck,rows=14,cols=24)
# Facial surface: jaw taper, cheekbones, recessed sockets, nose bridge, muzzle.
def gauss(x,y,cx,cy,wx,wy):return math.exp(-((x-cx)/wx)**2-((y-cy)/wy)**2)
def face(u,v):
    a=math.pi*u;b=2*math.pi*v;y=1.68+.137*math.cos(a)
    x=.095*math.sin(a)*math.cos(b);z=.080*math.sin(a)*math.sin(b)
    if y<1.655:x*=np.interp(y,[1.543,1.60,1.655],[.78,.88,1])
    if z>0:
        front=max(0,math.sin(b))**4
        delta=.014*gauss(x,y,0,1.608,.050,.028) # muzzle/chin
        delta+=.034*gauss(x,y,0,1.670,.017,.035) # nose bridge
        delta+=.013*gauss(x,y,0,1.652,.026,.015) # nasal tip
        for s in [-1,1]:
            delta+=.009*gauss(x,y,s*.048,1.66,.036,.03)
            delta-=.009*gauss(x,y,s*.042,1.698,.029,.015)
        z+=delta*front
    return [x,y,z]
v,idx,uv=grid(face,64,80);va=np.array(v)
morphs={}
for mood in ["happy","curious","surprised","annoyed"]:
    d=np.zeros_like(va)
    for i,(x,y,z) in enumerate(va):
        if z<.02:continue
        if mood=="happy":
            g=gauss(abs(x),y,.035,1.616,.03,.025);d[i,1]+=.004*g;d[i,2]+=.003*g
        if mood=="surprised":d[i,1]-=.006*gauss(x,y,0,1.595,.05,.035)
        if mood=="curious":d[i,1]+=.006*gauss(x,y,-.045,1.722,.035,.015)
        if mood=="annoyed":d[i,1]-=.004*gauss(x,y,0,1.724,.045,.02)
    morphs[mood]=d
mesh("Face",v,idx,skin,uv,head,morphs=morphs)
def face_z(x,y):
    a=math.acos(np.clip((y-1.68)/.137,-.999,.999))
    jaw=np.interp(y,[1.543,1.60,1.655],[.78,.88,1]) if y<1.655 else 1
    b=math.acos(np.clip(x/(.095*math.sin(a)*jaw),-.999,.999))
    return face(a/math.pi,b/(2*math.pi))[2]
# Ears have raised helix rims and a darker concha, partially covered by headphones.
for s,side in [(-1,"L"),(1,"R")]:
    ellipsoid("Ear "+side,(s*.094,1.675,-.002),(.020,.032,.018),skin,head,rows=16,cols=20)
    ellipsoid("Concha "+side,(s*.102,1.677,.012),(.010,.017,.006),lip,head,rows=12,cols=16)
    pts=[(s*(.103+.01*math.cos(a)),1.677+.025*math.sin(a),.013) for a in np.linspace(-1.5,4.3,24)]
    curve("Helix "+side,pts,.0036,skin,head)
# Eyes: bounded almond sockets, independent eyeballs/pupils and morphable eyelids.
for s,side in [(-1,"L"),(1,"R")]:
    cx=s*.041;cy=1.698;cz=.061
    eyebone=node("Eye"+side,(cx,cy,cz)-bone_pos[head],bone_nodes[head])
    def white_eye(u,v):
        x=(u-.5)*.048;arch=math.sin(math.pi*u)
        y=(-.006+v*.0135)*arch
        z=.016*math.sqrt(max(0,1-(x/.025)**2-(y/.014)**2))
        return [x,y,z]
    ev,ei,eu=grid(white_eye,24,8);ei=[[a,c,b] for a,b,c in ei]
    mesh("Sclera "+side,ev,ei,sclera,eu,parent=eyebone)
    ellipsoid("Iris "+side,(0,0,.016),(.008,.0065,.0015),iris,parent=eyebone,rows=14,cols=24)
    ellipsoid("Pupil "+side,(0,0,.0175),(.0032,.0045,.0006),pupil,parent=eyebone,rows=10,cols=16)
    ellipsoid("Corneal catchlight "+side,(-.0027,.0035,.0181),(.0013,.0015,.0006),sclera,parent=eyebone,rows=6,cols=8)
    for top in [True,False]:
        vv=[];uv=[];inds=[]
        for i in range(25):
            t=i/24;xx=cx+(t-.5)*.051;arch=math.sin(math.pi*t)
            inner=cy+(.0075 if top else -.006)*arch
            for k in range(9):
                q=k/8;y=inner+(1 if top else -1)*q*.010*arch
                eyefront=cz+.016*math.sqrt(max(0,1-((xx-cx)/.024)**2-((inner-cy)/.014)**2))+.001
                blend=q*q*(3-2*q)
                z=eyefront*(1-blend)+(face_z(xx,y)+.0004)*blend
                vv.append([xx,y,z]);uv.append([t,q])
        for i in range(24):
            for k in range(8):
                a=i*9+k;inds.extend([[a,a+9,a+1],[a+1,a+9,a+10]] if top else [[a,a+1,a+9],[a+1,a+10,a+9]])
        vv=np.array(vv);m={}
        for mood in ["blink","happy","curious","surprised","annoyed"]:
            d=np.zeros_like(vv)
            for i,(x,y,z) in enumerate(vv):
                t=(x-cx)/.048+.5;arch=math.sin(math.pi*t);q=(i%9)/8
                if mood=="blink":
                    d[i,1]=(cy-y)*(1-q)
                    newy=y+d[i,1]
                    front=cz+.016*math.sqrt(max(0,1-((x-cx)/.024)**2-((newy-cy)/.014)**2))+.0013
                    d[i,2]=(front-z)*(1-q)
                if mood=="happy":d[i,1]=(.0015 if top else .003)*arch
                if mood=="surprised":d[i,1]=(.004 if top else -.0015)*arch
                if mood=="curious" and s<0:d[i,1]=.0025*arch
                if mood=="annoyed" and top:d[i,1]=-.004*arch*(1+.35*s*(t-.5))
            m[mood]=d
        mesh(("UpperLid" if top else "LowerLid")+side,vv,inds,skin,uv,head,morphs=m)
    # Soft brow strip, not a floating rectangular block.
    v=[];inds=[]
    for j in range(17):
        t=j/16;x=cx+(t-.5)*.052;y=1.723+.003*math.sin(t*math.pi);z=.077+.003*math.sin(t*math.pi)
        for k in range(3):v.append([x,y+(k-1)*.0025*math.sin(math.pi*t)**.4,z+.0006*(k==1)])
    for j in range(16):
        for k in range(2):
            a=j*3+k;inds.extend([[a,a+3,a+1],[a+1,a+3,a+4]])
    va=np.array(v);m={}
    for mood in ["happy","curious","surprised","annoyed"]:
        d=np.zeros_like(va)
        for i,(x,y,z) in enumerate(va):
            d[i,1]={"happy":.002,"curious":.008 if s<0 else -.001,"surprised":.01,"annoyed":-.004+s*(x-cx)*.13}[mood]
        m[mood]=d
    mesh("Brow"+side,v,inds,hair,bone=head,morphs=m)
# Nostrils and a joined lip topology with genuine shape targets.
for s in [-1,1]:
    ellipsoid("Nostril",(s*.012,1.650,.108),(.006,.003,.003),shadow,head,rows=8,cols=14)
    ellipsoid("Nasal ala",(s*.017,1.656,.101),(.009,.008,.006),skin,head,rows=12,cols=16)
for upper in [True,False]:
    vv=[];uv=[];inds=[]
    for j in range(33):
        t=j/32;x=(t-.5)*.069;arch=math.sin(math.pi*t)
        center=1.614+.0015*math.cos(t*math.pi*2)
        for k in range(5):
            q=k/4;thick=(.0035 if upper else .0045)*arch
            if upper:thick*=.8+.3*math.sin(t*math.pi*3)**2
            vv.append([x,center+(1 if upper else -1)*q*thick,.086+.006*arch+.0015*math.sin(q*math.pi)])
            uv.append([t,q])
    for j in range(32):
        for k in range(4):
            a=j*5+k;inds.extend([[a,a+5,a+1],[a+1,a+5,a+6]] if upper else [[a,a+1,a+5],[a+1,a+6,a+5]])
    va=np.array(vv);mm={}
    for mood in ["happy","curious","surprised","annoyed"]:
        d=np.zeros_like(va)
        for i,(x,y,z) in enumerate(va):
            t=x/.069+.5;edge=abs(t-.5)*2
            if mood=="happy":d[i,1]=.0035*edge**1.8;d[i,0]=x*.10
            if mood=="curious":d[i,1]=-.0015*t
            if mood=="surprised":d[i,0]=-x*.40;d[i,1]=(.005 if upper else -.009)*math.sin(t*math.pi);d[i,2]=.002
            if mood=="annoyed":d[i,1]=-.003*edge;d[i,0]=x*.04
        mm[mood]=d
    mesh("UpperLip" if upper else "LowerLip",vv,inds,lip,uv,head,morphs=mm)
def inner_mouth(u,v):
    a=math.pi*u;b=2*math.pi*v
    return [.026*math.sin(a)*math.cos(b),1.614+.0018*math.cos(a),.086+.0007*math.sin(a)*math.sin(b)]
v,idx,uv=grid(inner_mouth,10,20)
d=np.zeros_like(v)
for i,(x,y,z) in enumerate(v):d[i,0]=-x*.4;d[i,1]=(y-1.614)*3.2-.002;d[i,2]=.001
mesh("Mouth interior",v,idx,shadow,uv,head,morphs={"surprised":d})
# Cap: smooth panelled crown, rear-facing brim, stitched seam curves and front label.
def cap(u,v):
    a=u*math.pi*.51;b=v*math.pi*2
    return [.101*math.sin(a)*math.cos(b),1.779+.067*math.cos(a),-.005+.085*math.sin(a)*math.sin(b)]
v,idx,uv=grid(cap,16,40);mesh("Black cap crown",v,idx,black,uv,head)
for b in np.linspace(0,2*math.pi,6,endpoint=False):
    pts=[cap(a,b/(2*math.pi)) for a in np.linspace(.06,.94,18)]
    pts=[(x*1.003,y+.0004,z*1.003) for x,y,z in pts];curve("Cap panel seam",pts,.0007,seam,head)
ellipsoid("Rear cap brim",(0,1.778,-.1),(.108,.006,.071),black,head,rows=10,cols=32)
ellipsoid("Cap top button",(0,1.847,-.005),(.008,.003,.008),black,head,rows=8,cols=12)
# Embroidery tag intentionally unbranded.
mesh("Cap label",[[-.019,1.791,.079],[.019,1.791,.079],[.019,1.814,.07],[-.019,1.814,.07]],[[0,1,2],[0,2,3]],label,bone=head)
curve("Cap mark",[(-.008,1.796,.080),(-.008,1.809,.077),(.004,1.809,.077),(.008,1.805,.078),(-.006,1.803,.079),(.009,1.796,.080)],.0016,black,head)
# Headphones: separate soft pads, machined rings, ear cups, yokes and continuous band.
for s,side in [(-1,"L"),(1,"R")]:
    ellipsoid("Headphone cushion "+side,(s*.108,1.695,-.009),(.022,.051,.037),earpad,head,rows=20,cols=28)
    ellipsoid("Headphone ring "+side,(s*.126,1.695,-.01),(.016,.047,.034),metal,head,rows=18,cols=28)
    ellipsoid("Headphone cup "+side,(s*.139,1.695,-.01),(.012,.040,.03),black,head,rows=18,cols=24)
    curve("Headphone yoke "+side,[(s*.126,1.653,-.011),(s*.146,1.675,-.017),(s*.144,1.722,-.02),(s*.108,1.751,-.018)],.004,metal,head)
    for j in range(4):
        ellipsoid("Cup vent",(s*.15,1.687+j*.005,-.009),(.001,.001,.012),metal,head,rows=6,cols=8)
pts=[(.119*math.cos(a),1.722+.139*math.sin(a),-.02) for a in np.linspace(0,math.pi,35)]
tube("Headphone padded band",pts,[(.009,.014)]*len(pts),black,head,sides=10)
flush_meshes()
# True inverse bind matrices; vertices are authored in model space.
ib=[]
for p in bone_pos:
    m=np.eye(4);m[:3,3]=-p;ib.append(m.T.flatten())
skin_doc={"name":"Ricardo deform rig","inverseBindMatrices":acc(ib,"MAT4"),"skeleton":bone_nodes[hip],"joints":bone_nodes}
def quat(z):return [0,0,math.sin(z/2),math.cos(z/2)]
times=[0,.35,.65,.95,1.25,1.55,1.9,2.25]
tacc=acc(times,"SCALAR");anims=[]
channels=[];samplers=[]
for name,values in [("UpperArmR",[0,1.7,1.8,1.7,1.8,1.7,1.6,0]),("ForearmR",[0,.45,.7,.35,.7,.35,.5,0]),("HandR",[0,0,.18,-.18,.18,-.18,0,0])]:
    a=acc([quat(v) for v in values],"VEC4");samplers.append({"input":tacc,"output":a,"interpolation":"LINEAR"});channels.append({"sampler":len(samplers)-1,"target":{"node":bone_nodes[bone_names[name]],"path":"rotation"}})
anims.append({"name":"Wave","samplers":samplers,"channels":channels})
doc={"asset":{"version":"2.0","generator":"Ricardo Character Studio v2","extras":{"quality":"Procedural stylized character; not a scanned or photoreal human","source":"tools/build_character.py","licensing":"Original generated geometry and textures; user-supplied prototype used as design reference"}},"scene":0,"scenes":[{"nodes":[root]}],"nodes":nodes,"meshes":meshes,"materials":mats,"skins":[skin_doc],"animations":anims,"accessors":access,"bufferViews":views,"buffers":[{"byteLength":len(B)}],"images":images,"textures":textures,"samplers":[{"magFilter":9729,"minFilter":9987,"wrapS":10497,"wrapT":10497}]}
j=json.dumps(doc,separators=(",",":")).encode();j+=b" "*((-len(j))%4);B+=b"\0"*((-len(B))%4)
out=OUT/"ricardo-v2.glb";out.write_bytes(struct.pack("<III",0x46546c67,2,12+8+len(j)+8+len(B))+struct.pack("<II",len(j),0x4e4f534a)+j+struct.pack("<II",len(B),0x004e4942)+B)
stats={"bytes":out.stat().st_size,"triangles":sum(access[p["indices"]]["count"]//3 for m in meshes for p in m["primitives"]),"meshes":len(meshes),"joints":len(bone_nodes),"morphMeshes":sum("weights" in m for m in meshes),"textures":len(textures)}
(OUT/"model-stats.json").write_text(json.dumps(stats,indent=2));print(json.dumps(stats))

