const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;
const htmlPath = path.join(__dirname, 'shinobiverse.html');
const safety = 'Keep the conversation age-appropriate, respectful and non-sexual. Avoid graphic violence, dangerous real-world instructions, manipulation, or requesting personal data. You are a fictional character in a fan-inspired interactive chat.';
const server = http.createServer(async (req, res) => {
  if (req.url === '/' || req.url === '/shinobiverse.html') {
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'}); return res.end(fs.readFileSync(htmlPath));
  }
  if (req.url === '/health') {res.writeHead(200, {'Content-Type':'application/json'});return res.end(JSON.stringify({ok:true}));}
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body=''; req.on('data', chunk=>{body+=chunk;if(body.length>200000){req.destroy();}});
    req.on('end', async()=>{
      try {
        const data=JSON.parse(body||'{}');
        if(!data.message || !data.character){res.writeHead(400);return res.end(JSON.stringify({error:'Missing message or character'}));}
        const endpoint=process.env.AI_API_URL, key=process.env.AI_API_KEY, model=process.env.AI_MODEL;
        if(!endpoint || !key || !model){res.writeHead(503,{'Content-Type':'application/json'});return res.end(JSON.stringify({reply:'الموقع منشور، لكن لم تُضبط خدمة الذكاء الاصطناعي بعد. يمكن إضافة إعدادات الخدمة في لوحة الاستضافة.'}));}
        const msgs=[{role:'system',content:`Roleplay as ${data.character}, ${data.title||''}, in Arabic as appropriate. ${safety}`} , ...(Array.isArray(data.history)?data.history.slice(-10):[])];
        const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify({model,messages:msgs}),signal:AbortSignal.timeout(45000)});
        if(!response.ok){res.writeHead(502,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'AI provider returned an error'}));}
        const result=await response.json();const reply=result.choices?.[0]?.message?.content || 'لم يصل رد.';
        res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({reply}));
      }catch(e){res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Server error'}));}
    });return;
  }
  res.writeHead(404);res.end('Not found');
});
server.listen(PORT,()=>console.log(`SHINOBIVERSE running on port ${PORT}`));
