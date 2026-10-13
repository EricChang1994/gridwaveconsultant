'use strict';
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav?.classList.contains('open')){closeMenu();menu.focus();}});
document.addEventListener('click',event=>{if(nav?.classList.contains('open')&&!event.target.closest('.site-header'))closeMenu();});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
const search=document.querySelector('#project-search');
if(search){
 document.querySelector('.filter-toolbar').hidden=false;
 const cards=[...document.querySelectorAll('.project-card')];
 const filters=[...document.querySelectorAll('[data-filter]')];
 let current='all';
 function applyFilters(){
  const term=search.value.trim().toLocaleLowerCase();let count=0;
  cards.forEach(card=>{const show=(current==='all'||card.dataset.category===current)&&card.dataset.search.toLocaleLowerCase().includes(term);card.hidden=!show;if(show)count++;});
  document.querySelector('#project-count').textContent=`${count} ${count===1?'project':'projects'}`;
  document.querySelector('#no-results').hidden=count!==0;
 }
 filters.forEach(button=>button.addEventListener('click',()=>{current=button.dataset.filter;filters.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});applyFilters();}));
 search.addEventListener('input',applyFilters);
 document.querySelector('#reset-filters').addEventListener('click',()=>{search.value='';filters[0].click();search.focus();});
}
const copy=document.querySelector('#copy-email');
if(copy){copy.hidden=false;copy.addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{if(!navigator.clipboard)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(copy.dataset.email);status.textContent='Email address copied.';}catch{status.textContent='Please select and copy the email address above.';}});}
const enquiry=document.querySelector('#enquiry-form');
if(enquiry){
 enquiry.hidden=false;
 const params=new URLSearchParams(location.search);
 const serviceNames={'owners-engineering':'Owner’s engineering','package-management':'HV package management','commissioning':'Commissioning & energization','interface-advisory':'Interface & delivery advisory'};
 const projectNames={'fengmiao':'Fengmiao I','coastal-virginia':'Coastal Virginia Offshore Wind','formosa-4':'Formosa 4','greater-changhua-2b-4':'Greater Changhua 2b & 4','greater-changhua-1-2a':'Greater Changhua 1 & 2a','mailiao':'Mailiao Power Plant'};
 if(serviceNames[params.get('service')])enquiry.elements.service.value=serviceNames[params.get('service')];
 if(projectNames[params.get('project')])enquiry.elements.message.value=`I would like to discuss a scope similar to the experience described in ${projectNames[params.get('project')]}.\n\nProject location:\nCurrent stage:\nSupport needed:\nTarget timing:`;
 enquiry.addEventListener('submit',event=>{
  event.preventDefault();if(!enquiry.reportValidity())return;
  const data=new FormData(enquiry);
  const subject=`GridWave enquiry — ${data.get('service')}`;
  const body=`Hello Eric,\n\n${data.get('message')}\n\nName: ${data.get('name')}\nCompany: ${data.get('company')||'Not specified'}\nSupport: ${data.get('service')}\n`;
  document.querySelector('#email-draft').value=`To: ericchangpe@gmail.com\nSubject: ${subject}\n\n${body}`;
  document.querySelector('#draft-fallback').hidden=false;
  document.querySelector('#email-status').textContent='Your draft is ready. Review and send it from your email application, or copy the text below.';
  location.href=`mailto:ericchangpe@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 });
}
