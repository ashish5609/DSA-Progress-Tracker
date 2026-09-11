const api='http://localhost:3001/api';
const slug=href=>new URL(href).pathname.split('/')[2];
let initialized=false;

const addLabels=map=>document.querySelectorAll('a[href*="leetcode.com/problems/"]').forEach(link=>{
  if(link.parentElement.querySelector('.leetcode-number'))return;
  const number=map.get(slug(link.href));
  if(!number)return;
  const label=document.createElement('small');
  label.className='leetcode-number';
  label.textContent=`LeetCode #${number}`;
  link.after(label);
});

const initialize=async()=>{
  if(initialized||!localStorage.token)return;
  try{
    const response=await fetch(`${api}/questions`,{headers:{Authorization:`Bearer ${localStorage.token}`}});
    if(!response.ok)return;
    const questions=await response.json();
    const map=new Map(questions.map(q=>[slug(q.link),q.leetcode_number]));
    initialized=true;
    addLabels(map);
    new MutationObserver(()=>addLabels(map)).observe(document.getElementById('root'),{childList:true,subtree:true});
    // React may replace a whole table without emitting a usable child mutation in some dev-server refreshes.
    // Keep the label pass lightweight and repeat it while the tracker is open.
    setInterval(()=>addLabels(map),500);
    clearInterval(waitForLogin);
  }catch{}
};

const waitForLogin=setInterval(initialize,400);
initialize();
