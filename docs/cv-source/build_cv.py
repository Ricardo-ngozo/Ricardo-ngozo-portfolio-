from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader
import shutil
root=Path(__file__).resolve().parent
out=root/'output/pdf'; out.mkdir(parents=True,exist_ok=True)
for name,file in [('Body','calibri.ttf'),('Bold','calibrib.ttf'),('Display','georgia.ttf')]:
    pdfmetrics.registerFont(TTFont(name, 'C:/Windows/Fonts/'+file))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold')
path=out/'Ricardo_Ngozo_CV.pdf'
c=canvas.Canvas(str(path),pagesize=(595.28,841.89))
c.setTitle('Ricardo Ngozo | Junior Full-Stack Developer'); c.setAuthor('Ricardo Ngozo')
ink='#191919'; muted='#4c4c4c'; red='#a52d20'
c.setFillColor(HexColor('#f5f0e8')); c.rect(0,665,595.28,177,fill=1,stroke=0)
c.setFillColor(HexColor(red)); c.rect(42,799,38,3,fill=1,stroke=0)
y=783
text=[]
def para(s,size=10.5,font='Body',color=ink,after=5,leading=None):
    global y
    p=Paragraph(s,ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.28,textColor=HexColor(color)))
    w,h=p.wrap(511,800); p.drawOn(c,42,y-h); y-=h+after
    text.append(s)
def section(s):
    global y
    y-=10
    para(s.upper(),10,'Bold',red,7)
def bullet(s):
    para('- '+s,10.5,after=5)
def project(title,tech,bullets):
    para(title,12,'Bold',after=2)
    para(tech,9.5,color=muted,after=5)
    for b in bullets: bullet(b)
    global y
    y-=3
para('Ricardo Ngozo',32,'Display',after=4)
para('JUNIOR FULL-STACK DEVELOPER',11,'Bold',red,after=8)
para('South Africa | +27 67 254 7731 | <link href="mailto:ricardongozo75@gmail.com">ricardongozo75@gmail.com</link>',10,after=4)
para('<link href="https://ricardo-ngozo-portfolio.vercel.app/">ricardo-ngozo-portfolio.vercel.app</link> | <link href="https://github.com/Ricardo-ngozo">github.com/Ricardo-ngozo</link>',9.5,after=3)
para('<link href="https://www.linkedin.com/in/ricardongozo75/">linkedin.com/in/ricardongozo75</link>',9.5,after=6)
section('Profile')
para('I build web applications with JavaScript, React and Firebase, connecting interfaces to authentication, stored data and APIs. My project work covers an online clothing store, a browser game and a React portfolio with interactive 3D content. I am seeking a junior full-stack role where I can implement features across the interface and data layer.',10.5,after=4)
section('Technical skills')
para('<b>Frontend:</b> JavaScript (ES6+), React, HTML5, CSS3, responsive layouts, CSS Grid, Flexbox',after=3)
para('<b>Backend and data:</b> Firebase Authentication, Cloud Firestore, REST API integration',after=3)
para('<b>Tools:</b> Git, GitHub, Chrome DevTools, VS Code, Figma, Vite, Vercel, Netlify',after=3)
section('Project experience')
project('Urban Threads | E-commerce application','HTML, CSS, JavaScript, Firebase Authentication, Cloud Firestore',[
'Connected account sign-in with Firebase Authentication and used Firestore to store product and user data.',
'Built cart and checkout flows, bringing product selection and order steps into a responsive shopping interface.'
])
project('Personal Portfolio | React application','React, JavaScript, Three.js, Vite, CSS',[
'Organised Home, Personal and Python Lab into separate routes, with project case studies, source links and live previews.',
'Integrated a 3D character with cursor tracking and reduced-motion support; used lazy loading and rendering cleanup to control resource use.',
'Documented project context and implementation choices in case studies so readers can assess the work alongside the source code.'
])
project('Tic-Tac-Toe | Browser game','HTML, CSS, JavaScript',[
'Implemented turn handling, winner detection and replay, keeping game state and the visible board in sync.'
])
section('Education')
para('Full Stack Web Development Programme | iHub Africa',11,'Bold',after=3)
para('Coursework: frontend development, JavaScript, Firebase, Git, responsive web design and software development practices.',10.5,after=4)
if y<35: raise ValueError(f'Content exceeds page: {y}')
c.save()
r=PdfReader(path); extracted='\n'.join(p.extract_text() for p in r.pages)
assert len(r.pages)==1
for s in ['Ricardo Ngozo','ricardongozo75@gmail.com','Technical','Urban Threads','iHub Africa']:
    assert s.lower() in extracted.lower(),s
(out/'Ricardo_Ngozo_CV.txt').write_text(extracted,encoding='utf-8')
import pypdfium2 as pdfium
pdf=pdfium.PdfDocument(str(path)); pdf[0].render(scale=1.5).to_pil().save(str(out/'cv-review.png'))
print(f'Created one-page CV. Bottom margin: {y:.1f}pt. {path}')


