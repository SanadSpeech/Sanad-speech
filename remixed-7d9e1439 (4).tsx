<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>لعبة القصص</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{
    min-height:100vh;
    background:#1b5e20;
    display:flex;flex-direction:column;align-items:center;
    padding:20px 16px 40px;
    font-family:Arial,sans-serif;
    color:white;
  }
  h1{
    font-size:1.8rem;font-weight:900;color:#FFD700;
    text-align:center;margin-bottom:4px;margin-top:10px;
  }
  .subtitle{color:rgba(255,255,255,.85);font-size:.95rem;text-align:center;margin-bottom:12px}
  .dots{display:flex;gap:10px;margin-bottom:16px;justify-content:center}
  .dot{
    width:38px;height:38px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;font-size:1.3rem;
    background:rgba(255,255,255,.2);
  }
  .dot.done{background:#FFD700;color:#1b5e20;font-weight:900;font-size:1rem}
  .dot.active{background:white;border:3px solid #FFD700}

  .card{
    background:rgba(0,0,0,.45);
    border:1px solid rgba(255,255,255,.25);border-radius:20px;
    padding:22px;max-width:540px;width:100%;margin-bottom:10px;
  }
  .card.gold{border:2px solid #FFD700}

  .story-header{text-align:center;margin-bottom:14px}
  .big-emoji{font-size:3rem;display:block;margin-bottom:6px}
  .story-title{font-size:1.4rem;font-weight:900;color:#FFD700}
  .story-hint{color:rgba(255,255,255,.6);font-size:.85rem;margin-top:4px}

  .story-text{
    background:rgba(255,255,255,.1);border-radius:12px;
    padding:14px;margin-bottom:18px;
  }
  .story-line{
    font-size:1rem;line-height:2;padding-right:12px;
  }
  .story-line.hi{border-right:3px solid #FFD700}

  .btn{
    display:block;width:100%;
    background:linear-gradient(135deg,#FFD700,#FF8C00);
    border:none;border-radius:50px;padding:13px;
    font-size:1.1rem;font-weight:900;cursor:pointer;color:#1b5e20;
    font-family:Arial,sans-serif;
  }
  .btn:active{opacity:.85}

  .prog-labels{display:flex;justify-content:space-between;font-size:.85rem;color:rgba(255,255,255,.8);margin-bottom:5px}
  .prog-wrap{background:rgba(255,255,255,.15);border-radius:50px;height:7px;overflow:hidden;margin-bottom:16px}
  .prog-fill{height:100%;background:linear-gradient(90deg,#FFD700,#FF8C00);border-radius:50px;transition:width .4s}

  .q-label{font-size:1.1rem;font-weight:700;color:#FFD700;margin-bottom:16px;text-align:center}
  .options{display:flex;flex-direction:column;gap:9px}
  .opt{
    background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);
    color:white;border-radius:12px;padding:13px 16px;
    font-size:1rem;font-weight:700;cursor:pointer;text-align:right;
    font-family:Arial,sans-serif;width:100%;
  }
  .opt.correct{background:rgba(76,175,80,.45);border:2px solid #4CAF50;color:#a5d6a7}
  .opt.wrong{background:rgba(231,76,60,.45);border:2px solid #e74c3c;color:#ff8a80}

  .feedback{
    margin-top:12px;text-align:center;
    font-size:1.05rem;font-weight:700;
  }
  .feedback.ok{color:#69f0ae}
  .feedback.no{color:#ff8a80}

  .score-big{font-size:2.8rem;font-weight:900;text-align:center;margin:8px 0}
  .pct{font-size:1.3rem;font-weight:700;text-align:center;margin-bottom:18px}
  .pct.good{color:#69f0ae}
  .pct.avg{color:#FFD700}

  .hidden{display:none!important}

  .confetti-piece{
    position:fixed;pointer-events:none;z-index:999;
    animation:fall linear forwards;
  }
  @keyframes fall{
    0%{top:-30px;opacity:1}
    100%{top:110vh;opacity:0}
  }
</style>
</head>
<body>

<div id="conf"></div>

<h1>📖 لعبة القصص</h1>
<p class="subtitle" id="lbl">القصة 1 من 3 | النقاط: 0/0</p>
<div class="dots" id="dots"></div>

<!-- قراءة -->
<div class="card" id="sRead">
  <div class="story-header">
    <span class="big-emoji" id="rEmoji"></span>
    <div class="story-title" id="rTitle"></div>
    <div class="story-hint">اقرأ القصة ثم أجب على الأسئلة</div>
  </div>
  <div class="story-text" id="rText"></div>
  <button class="btn" onclick="goQ()">جاهز للأسئلة! ←</button>
</div>

<!-- أسئلة -->
<div class="card hidden" id="sQ">
  <div class="prog-labels">
    <span id="qNum">السؤال 1 من 5</span>
    <span id="qStory"></span>
  </div>
  <div class="prog-wrap"><div class="prog-fill" id="qBar" style="width:0%"></div></div>
  <div class="q-label" id="qLabel"></div>
  <div class="options" id="opts"></div>
  <div class="feedback hidden" id="fb"></div>
</div>

<!-- نتيجة قصة -->
<div class="card gold hidden" id="sRes">
  <div class="big-emoji" style="text-align:center" id="resEmoji"></div>
  <div class="story-title" style="text-align:center;margin-bottom:6px" id="resTitle"></div>
  <div style="text-align:center;color:rgba(255,255,255,.75);margin-bottom:8px">نتيجة هذه القصة</div>
  <div class="score-big" id="resScore"></div>
  <div class="pct" id="resPct"></div>
  <button class="btn" id="btnNext" onclick="nextStory()"></button>
</div>

<!-- النهاية -->
<div class="card gold hidden" id="sDone">
  <div style="font-size:4rem;text-align:center">🏆</div>
  <div style="font-size:1.7rem;font-weight:900;color:#FFD700;text-align:center;margin:8px 0">انتهيت من كل القصص!</div>
  <div style="text-align:center;color:rgba(255,255,255,.75);margin-bottom:8px" id="doneSub"></div>
  <div class="score-big" id="doneScore"></div>
  <div class="pct" id="donePct"></div>
  <button class="btn" onclick="restart()">🔄 العب مرة ثانية</button>
</div>

<script>
var stories=[
  {title:"الأسد والفأر",emoji:"🦁",
   text:["في يومٍ من الأيام، كان أسدٌ كبير نائمًا في الغابة.","جاء فأرٌ صغير وبدأ يلعب فوق ظهر الأسد.","استيقظ الأسد غاضبًا وأمسك الفأر بمخلبه.","طلب الفأر من الأسد أن يطلق سراحه، ووعده بأن يساعده يومًا ما.","ضحك الأسد وأطلق سراح الفأر.","بعد أيام، وقع الأسد في شبكة الصيادين وبدأ يزأر.","سمع الفأر صوت الأسد وركض إليه بسرعة.","قضم الفأر الشبكة بأسنانه وأنقذ الأسد."],
   questions:[
     {label:"👤 من هي الشخصيات؟",opts:["الأسد والفأر","الأسد والصياد","الفأر والأرنب","الصياد والغابة"],c:0},
     {label:"🕐 متى تجري القصة؟",opts:["في الليل","في يوم من الأيام","في الصباح الباكر","في الشتاء"],c:1},
     {label:"📍 أين تجري القصة؟",opts:["في البحر","في المدينة","في الغابة","في الجبل"],c:2},
     {label:"⚡ ما هو الحدث الرئيسي؟",opts:["الأسد يأكل الفأر","الفأر يُنقذ الأسد من الشبكة","الأسد يساعد الفأر","الصيادون يمسكون الفأر"],c:1},
     {label:"🏁 كيف انتهت القصة؟",opts:["مات الأسد في الشبكة","هرب الفأر","أنقذ الفأر الأسد وأصبحا أصدقاء","جاء الصياد وأمسك الاثنين"],c:2}
   ]},
  {title:"الولد والذئب",emoji:"🐺",
   text:["كان هناك ولدٌ صغير يرعى الغنم في الجبل.","في يومٍ صيفي، شعر الولد بالملل فقرر أن يمزح.","صرخ بصوتٍ عالٍ: الذئب! الذئب! جاء الذئب!","ركض أهل القرية مسرعين ليساعدوه، لكنهم لم يجدوا ذئبًا.","ضحك الولد وعاد الناس إلى بيوتهم غاضبين.","في اليوم التالي، جاء ذئبٌ حقيقي إلى الغنم.","صرخ الولد مجددًا لكن أحدًا لم يصدقه هذه المرة.","أكل الذئب الغنم، وعرف الولد أن الكذب له عاقبة."],
   questions:[
     {label:"👤 من هي الشخصيات؟",opts:["الولد والأسد","الولد والذئب وأهل القرية","الذئب والغنم فقط","الولد وأمه"],c:1},
     {label:"🕐 في أي وقت تجري القصة؟",opts:["في الشتاء ليلًا","في يوم صيفي","في الربيع صباحًا","في عيد الميلاد"],c:1},
     {label:"📍 أين كان الولد؟",opts:["في الغابة","في المدرسة","في الجبل","في البيت"],c:2},
     {label:"⚡ ما هو الحدث الرئيسي؟",opts:["الولد يساعد أهل القرية","الذئب يساعد الولد","الولد كذب على الناس ثم جاء ذئب حقيقي","أهل القرية يمسكون الذئب"],c:2},
     {label:"🏁 ماذا تعلم الولد؟",opts:["أن الذئاب خطيرة","أن الكذب له عاقبة","أن رعي الغنم صعب","أن أهل القرية طيبون"],c:1}
   ]},
  {title:"سلمى والكعكة",emoji:"🎂",
   text:["في صباح يومٍ جميل، أرادت سلمى أن تفاجئ أمها بعيد ميلادها.","ذهبت إلى المطبخ وبدأت تصنع كعكة بنفسها.","خلطت الدقيق والسكر والبيض في وعاء كبير.","وضعت العجين في الفرن وانتظرت نصف ساعة.","لكنها نسيت أن تضيف الزبدة، فخرجت الكعكة جافة.","حزنت سلمى كثيرًا وجلست تبكي في المطبخ.","سمعت أمها البكاء ودخلت المطبخ فرأت ما فعلته ابنتها.","ضحكت الأم وحضنت سلمى وقالت: هذه أجمل هدية في حياتي!"],
   questions:[
     {label:"👤 من هي الشخصيات؟",opts:["سلمى وأبوها","سلمى وأمها","سلمى وصديقتها","الأم والخباز"],c:1},
     {label:"🕐 متى تجري القصة؟",opts:["في المساء","في الليل","في صباح يوم جميل","في عطلة الصيف"],c:2},
     {label:"📍 أين صنعت سلمى الكعكة؟",opts:["في الحديقة","في المطبخ","في المدرسة","في السوق"],c:1},
     {label:"⚡ ما هو الحدث الرئيسي؟",opts:["سلمى اشترت كعكة من الدكان","سلمى صنعت كعكة لأمها لكنها لم تنجح","الأم صنعت كعكة لسلمى","سلمى وأمها ذهبتا إلى المطعم"],c:1},
     {label:"🏁 كيف شعرت الأم في النهاية؟",opts:["غضبت من سلمى","حزنت على الكعكة","سعدت وشكرت سلمى","طلبت منها أن تعيد الكعكة"],c:2}
   ]}
];

var si=0,qi=0,tot=0,totQ=0,busy=false;

function g(id){return document.getElementById(id);}
function show(id){g(id).classList.remove('hidden');}
function hide(id){g(id).classList.add('hidden');}

function dots(){
  var d=g('dots');d.innerHTML='';
  stories.forEach(function(s,i){
    var el=document.createElement('div');
    el.className='dot'+(i<si?' done':i===si?' active':'');
    el.textContent=i<si?'✓':s.emoji;
    d.appendChild(el);
  });
}

function lbl(){
  g('lbl').textContent='القصة '+(si+1)+' من '+stories.length+' | النقاط: '+tot+'/'+totQ;
}

function loadStory(){
  var s=stories[si];
  g('rEmoji').textContent=s.emoji;
  g('rTitle').textContent=s.title;
  var t=g('rText');t.innerHTML='';
  s.text.forEach(function(line,i){
    var d=document.createElement('div');
    d.className='story-line'+(i===0||i===s.text.length-1?' hi':'');
    d.textContent=line;t.appendChild(d);
  });
  hide('sQ');hide('sRes');hide('sDone');
  show('sRead');dots();lbl();
}

function goQ(){
  qi=0;busy=false;
  hide('sRead');show('sQ');
  renderQ();
}

function renderQ(){
  var s=stories[si],q=s.questions[qi];
  g('qNum').textContent='السؤال '+(qi+1)+' من '+s.questions.length;
  g('qStory').textContent=s.emoji+' '+s.title;
  g('qBar').style.width=Math.round(qi/s.questions.length*100)+'%';
  g('qLabel').textContent=q.label;
  var o=g('opts');o.innerHTML='';
  q.opts.forEach(function(opt,i){
    var b=document.createElement('button');
    b.className='opt';b.textContent=opt;
    (function(idx){b.onclick=function(){answer(idx);};})(i);
    o.appendChild(b);
  });
  var fb=g('fb');fb.className='feedback hidden';fb.textContent='';
}

function answer(i){
  if(busy)return;busy=true;
  var q=stories[si].questions[qi];
  var ok=i===q.c;
  if(ok)tot++;totQ++;
  var btns=g('opts').querySelectorAll('.opt');
  btns.forEach(function(b,idx){
    if(idx===q.c)b.classList.add('correct');
    else if(idx===i&&!ok)b.classList.add('wrong');
    b.onclick=null;
  });
  var fb=g('fb');
  fb.className='feedback '+(ok?'ok':'no');
  fb.textContent=ok?'🌟 إجابة صحيحة!':'الجواب الصح: '+q.opts[q.c];
  fb.classList.remove('hidden');
  lbl();
  setTimeout(function(){
    busy=false;
    if(qi+1<stories[si].questions.length){qi++;renderQ();}
    else showRes();
  },1200);
}

function showRes(){
  hide('sQ');
  var s=stories[si];
  g('resEmoji').textContent=s.emoji;
  g('resTitle').textContent=s.title;
  g('resScore').textContent=tot+'/'+totQ+' ⭐';
  var p=totQ>0?Math.round(tot/totQ*100):0;
  var pe=g('resPct');
  pe.textContent=p+'% '+(p>=80?'✅ ممتاز!':'(الهدف 80%)');
  pe.className='pct '+(p>=80?'good':'avg');
  g('btnNext').textContent=si+1<stories.length?'القصة التالية ←':'النتيجة النهائية 🏆';
  show('sRes');
}

function nextStory(){
  hide('sRes');
  if(si+1<stories.length){si++;loadStory();}
  else showDone();
}

function showDone(){
  confetti();
  var p=totQ>0?Math.round(tot/totQ*100):0;
  g('doneSub').textContent='أجبت على '+totQ+' سؤال';
  g('doneScore').textContent='⭐ '+tot+'/'+totQ;
  var dp=g('donePct');
  dp.textContent=p+'% '+(p>=80?'✅ ممتاز!':'(الهدف 80%)');
  dp.className='pct '+(p>=80?'good':'avg');
  show('sDone');
}

function restart(){
  si=0;qi=0;tot=0;totQ=0;busy=false;
  hide('sDone');loadStory();
}

function confetti(){
  var c=g('conf');c.innerHTML='';
  var cols=["#FFD700","#4CAF50","#2196F3","#FF6B6B","#9C27B0"];
  for(var i=0;i<60;i++){
    var p=document.createElement('div');
    p.className='confetti-piece';
    var dur=2+Math.random()*2, delay=Math.random()*.8, sz=6+Math.random()*10;
    p.style.cssText='left:'+Math.random()*100+'vw;width:'+sz+'px;height:'+sz+'px;background:'+cols[Math.floor(Math.random()*5)]+';border-radius:'+(Math.random()>.5?'50%':'3px')+';animation:fall '+dur+'s '+delay+'s linear forwards';
    c.appendChild(p);
  }
  setTimeout(function(){c.innerHTML='';},5000);
}

loadStory();
</script>
</body>
</html>
