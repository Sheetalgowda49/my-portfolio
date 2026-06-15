const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const year = document.getElementById('year');
const filter = document.getElementById('filter');
const search = document.getElementById('searchProjects');
const projectsList = document.getElementById('projectsList');
const downloadResume = document.getElementById('downloadResume');
const printResume = document.getElementById('printResume');
const contactForm = document.getElementById('contactForm');
const mailtoBtn = document.getElementById('mailtoBtn');

// Init
year.textContent = new Date().getFullYear();
if(localStorage.getItem('theme') === 'light') document.documentElement.classList.add('light');

themeToggle.addEventListener('click', ()=>{
  const isLight = document.documentElement.classList.toggle('light');
  themeToggle.setAttribute('aria-pressed', String(isLight));
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Simple project filter and search
function matchProject(el, q){
  if(!q) return true;
  const text = (el.textContent || '').toLowerCase();
  return text.includes(q.toLowerCase());
}

function applyFilter(){
  const tag = filter.value; const q = search.value.trim();
  [...projectsList.children].forEach(p=>{
    const tags = (p.getAttribute('data-tags')||'').split(' ');
    const tagMatch = tag === 'all' || tags.includes(tag);
    const textMatch = matchProject(p, q);
    p.style.display = (tagMatch && textMatch) ? '' : 'none';
  });
}
filter.addEventListener('change', applyFilter);
search.addEventListener('input', applyFilter);

// Resume download — example uses generated blob (simple textual resume)
downloadResume.addEventListener('click', ()=>{
  const resumeText = `Alex Student\nComputer Science Student\n\nSkills:\n- JavaScript, Python\n- React, CSS\n\nEducation:\nB.Sc. Computer Science\n`;
  const blob = new Blob([resumeText], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'Alex-Student-Resume.txt';
  a.click();
  URL.revokeObjectURL(url);
});

printResume.addEventListener('click', ()=>{
  window.print();
});

// Contact form handling — client-side validation and mailto fallback
contactForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  const status = document.getElementById('formStatus');
  if(!name||!email||!message){ status.textContent='Please complete all fields.'; return; }
  status.textContent = 'Preparing message…';
  // Prefer server endpoint; fallback to mailto
  // Here we simply open a mailto link to let the user send via their mail client
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  const mailto = `mailto:alex.student@example.com?subject=${subject}&body=${body}`;
  window.location.href = mailto;
  status.textContent = 'Opened mail client.';
});

mailtoBtn.addEventListener('click', ()=>{
  const subject = encodeURIComponent('Inquiry from portfolio');
  window.location.href = `mailto:alex.student@example.com?subject=${subject}`;
});

// accessibility: make projects keyboard-activatable
projectsList.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' && e.target.classList.contains('project')){
    const link = e.target.querySelector('a');
    if(link) link.click();
  }
});

// small progressive enhancement: prefer reduced motion
if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.documentElement.classList.add('reduced-motion');
}
