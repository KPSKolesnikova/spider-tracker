'use strict';

const meals = [
  ['breakfast','Завтрак','Овсянка с молоком и бананом',390,13,12,57,'Хлопья 45 г, молоко 2,5% 180 мл, банан 100 г, арахисовая паста 7 г. Свари хлопья в молоке, добавь банан и пасту.','Дикси или Магнит: хлопья, молоко, банан. В Яндекс Лавке ищи готовую молочную кашу, добавь банан и пасту до нужной порции.'],
  ['snack1','Перекус','Греческий йогурт и яблоко',170,14,3,22,'Натуральный греческий йогурт 150 г и яблоко 125 г без сердцевины.','ВкусВилл: греческий йогурт без добавленного сахара. Яблоко можно взять в любой из сетей.'],
  ['lunch','Обед','Курица с гречкой и салатом',465,49,9,43,'Куриная грудка 140 г, гречка 160 г, огурцы и помидоры 150 г, масло 3 г. Грудку запеки или отвари, масло добавь в салат.','Магнит или Дикси: грудка, крупа и овощи. В Самокате или Яндекс Лавке попробуй поискать курицу с гречкой и салат без заправки.'],
  ['snack2','Перекус','Творог с ягодами',205,24,8,11,'Творог 5% 150 г, ягоды 50 г. Замороженные ягоды заранее разморозь.','Самокат или ВкусВилл: творог 5% и замороженные ягоды.'],
  ['dinner','Ужин','Лосось с картофелем и фасолью',470,38,18,40,'Запечённый лосось 140 г, отварной картофель 170 г и стручковая фасоль 130 г. Запекай рыбу с лимоном; масло не включено в расчёт.','Яндекс Лавка или ВкусВилл: ищи запечённую рыбу и овощной гарнир. В Магните можно собрать блюдо из замороженной рыбы и фасоли.'],
];

const drinks = [
  {key:'water', title:'Вода', labels:['Утром','К завтраку','К обеду','Днём','К ужину']},
  {key:'tea', title:'Чай без сахара', labels:['1 чашка']},
  {key:'cola', title:'Кола без сахара · по желанию', labels:['1 стакан']},
];
const exercises = {
  press: ['Жим ногами','минимум тренажёра','Прижми таз и спину к спинке. Поставь стопы на ширине плеч, колени веди по направлению носков. Опускай платформу до комфортной глубины, не отрывая таз. Не выпрямляй колени рывком.'],
  pulldown: ['Тяга верхнего блока','минимум тренажёра','Сядь устойчиво, слегка отклони корпус. Веди локти вниз, рукоять — к верхней части груди. Поднимай рукоять подконтрольно.'],
  chest: ['Жим от груди в тренажёре','минимум тренажёра','Выставь рукояти на уровне середины груди. Держи спину на опоре, кисти ровно. Выжимай на выдохе и плавно возвращайся.'],
  hinge: ['Ягодичный мост','0 кг','Ляг на спину и согни колени. Упрись стопами и подними таз, сжав ягодицы. Остановись, когда бёдра и корпус образуют линию. Опускайся медленно.'],
  row: ['Горизонтальная тяга блока','минимум тренажёра','Сядь прямо и держи плечи свободно. Веди локти назад к корпусу. Не раскачивайся, возвращай рукоять медленно.'],
  squat: ['Приседание к скамье','0 кг','Встань перед устойчивой скамьёй. Отведи таз назад, держи стопы на полу. Слегка коснись скамьи и встань, направляя колени вдоль носков.'],
  shoulder: ['Жим гантелей сидя','лёгкие гантели, кг за штуку','Сядь с опорой спины. Начни с кистями над локтями. Выжимай гантели вверх без прогиба в пояснице и медленно верни к уровню плеч.'],
  legcurl: ['Сгибание ног в тренажёре','минимум тренажёра','Совмести колено с осью тренажёра. Упрись в спинку или скамью. Согни колени плавно, затем верни вес с контролем.'],
  core: ['Dead bug','0 кг','Ляг на спину, подними руки и согнутые ноги. На выдохе медленно опусти противоположные руку и ногу. Сократи амплитуду, если поясница отрывается от пола.'],
  calf: ['Подъём на носки с опорой','0 кг','Встань устойчиво и возьмись за опору. Поднимись на носки, задержись на секунду и медленно опусти пятки.'],
};
const variants = {
  A: ['press','pulldown','chest','hinge','core'],
  B: ['squat','row','shoulder','legcurl','calf'],
};
const phases = [
  {weeks:4,title:'Освоение техники',note:'1–4 недели · 2 подхода по 8–10 повторений. Подбирай нагрузку и привыкай к движениям.',sets:2,reps:'8–10'},
  {weeks:12,title:'Базовая нагрузка',note:'5–12 недели · 2 подхода по 8–12 повторений. Сначала добавляй повторения.',sets:2,reps:'8–12'},
  {weeks:24,title:'Плавная прогрессия',note:'13–24 недели · 3 подхода по 8–12 повторений. Каждая четвёртая неделя легче.',sets:3,reps:'8–12'},
  {weeks:40,title:'Закрепление',note:'25–40 недели · 3 подхода по 8–12 повторений. Сохраняй диапазон движения при росте нагрузки.',sets:3,reps:'8–12'},
  {weeks:52,title:'Поддержание',note:'41–52 недели · 2 подхода по 8–12 повторений. Оцени комфорт и регулярность за год.',sets:2,reps:'8–12'},
];

const number = value => Number(value)||0;
const localDate = value => value ? new Date(value+'T12:00:00') : new Date();
const dateKey = value => [value.getFullYear(),String(value.getMonth()+1).padStart(2,'0'),String(value.getDate()).padStart(2,'0')].join('-');
const addDays = (value,amount) => { const d=localDate(value);d.setDate(d.getDate()+amount);return dateKey(d); };
const shortDate = value => localDate(value).toLocaleDateString('ru-RU',{day:'numeric',month:'short'});

function planStart() {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(state.planStart??'') || !Number.isFinite(localDate(state.planStart).getTime())) {
    const now=new Date();
    state.planStart=addDays(date(),(8-now.getDay())%7);
  }
  return state.planStart;
}
function sessionsFor(week) {
  const monday=addDays(planStart(),(week-1)*7);
  return [{key:monday,type:'A'},{key:addDays(monday,3),type:'B'}];
}
function currentWeek() {
  const count=Math.round((Date.parse(date())-Date.parse(planStart()))/86400000);
  return Math.max(1,Math.min(52,Math.floor(count/7)+1));
}
function statusFor(week) {
  const phase=phases.find(item=>week<=item.weeks);
  return {phase, sets:week%4===0?Math.max(1,phase.sets-1):phase.sets, easy:week%4===0};
}
function requiredChecks(week,type) {
  const {sets}=statusFor(week);
  return ['warmup',...variants[type].flatMap(id=>Array.from({length:sets},(_,i)=>id+'-'+(i+1)))];
}
function detailsFor(key) {
  return state.sessions?.[key]??{checks:{},weights:{}};
}
function completedChecks(week,session) {
  const checks=detailsFor(session.key).checks;
  return requiredChecks(week,session.type).filter(id=>checks?.[id]===true).length;
}
function isComplete(week,session) {
  return completedChecks(week,session)===requiredChecks(week,session.type).length;
}
function lastWeight(exercise,key) {
  return Object.entries(state.sessions??{}).filter(([d,entry])=>d<key&&Number.isFinite(entry.weights?.[exercise])&&Object.keys(entry.checks??{}).some(check=>check.startsWith(exercise+'-')&&entry.checks[check]===true)).sort(([a],[b])=>b.localeCompare(a))[0]?.[1].weights[exercise];
}

let selectedWeek=currentWeek();
let selectedSession=date()>planStart()&&new Date().getDay()>=4&&new Date().getDay()<=6?1:0;
const checkHtml=(id,label,on,attr)=>'<label class="checkline"><input type="checkbox" '+attr+'="'+id+'"'+(on?' checked':'')+'><span>'+label+'</span></label>';

function renderTraining() {
  const start=planStart();
  const optionsStamp=$('weekSelect').dataset.start;
  if (optionsStamp!==start) {
    $('weekSelect').innerHTML=Array.from({length:52},(_,i)=>{
      const sessions=sessionsFor(i+1);
      return '<option value="'+(i+1)+'">Неделя '+(i+1)+' · '+shortDate(sessions[0].key)+' – '+shortDate(sessions[1].key)+'</option>';
    }).join('');
    $('weekSelect').dataset.start=start;
  }
  $('weekSelect').value=selectedWeek;
  $('previousWeek').disabled=selectedWeek===1;
  $('nextWeek').disabled=selectedWeek===52;
  let completed=0;
  for(let week=1;week<=52;week++) completed+=sessionsFor(week).filter(session=>isComplete(week,session)).length;
  $('yearProgress').textContent=completed+' / 104';
  const available=sessionsFor(selectedWeek);
  const session=available[selectedSession];
  const entry=detailsFor(session.key);
  const {phase,sets,easy}=statusFor(selectedWeek);
  $('phaseNote').textContent=phase.note+(easy?' Облегчённая неделя: на один подход меньше.':'');
  $('sessionSelect').innerHTML=available.map((item,i)=>'<button class="pill-button" data-session="'+i+'" aria-pressed="'+(i===selectedSession)+'">'+(i===0?'Пн':'Чт')+' · '+shortDate(item.key)+' · '+item.type+(isComplete(selectedWeek,item)?' ✓':'')+'</button>').join('');
  const total=requiredChecks(selectedWeek,session.type).length;
  const done=completedChecks(selectedWeek,session);
  const body=$('sessionBody');
  const open=body.dataset.session===session.key ? [...body.querySelectorAll('details[open]')].map(x=>x.dataset.exercise) : [];
  body.dataset.session=session.key;
  body.innerHTML='<div class="row"><h3>Тренировка '+session.type+'</h3><span class="status-good" role="status">'+(done===total?'Выполнена':done+' / '+total+' пунктов')+'</span></div><div class="bar" role="progressbar" aria-label="Выполнение тренировки" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+done+'"><span style="width:'+done/total*100+'%"></span></div>'+
    checkHtml('warmup','Разминка · 5–8 мин ходьбы и лёгких движений',entry.checks?.warmup,'data-workout-check')+
    variants[session.type].map(id=>{
      const [title,starting,technique]=exercises[id];
      const previous=lastWeight(id,session.key);
      const actual=entry.weights?.[id];
      const reps=id==='core'?'6–10 на сторону':phase.reps;
      return '<article class="exercise"><div class="row"><div><h3>'+title+'</h3><p class="help">'+sets+' × '+reps+' · '+(previous!=null?'Прошлый вес '+previous+' кг':starting)+'</p></div><label class="field">Вес, кг<input type="number" min="0" max="1000" step="0.1" inputmode="decimal" data-exercise-weight="'+id+'" aria-label="Вес: '+title+'" value="'+(Number.isFinite(actual)?actual:'')+'" placeholder="'+(previous??'')+'"></label></div><details data-exercise="'+id+'"'+(open.includes(id)?' open':'')+'><summary>Техника</summary><p>'+technique+'</p></details><div class="sets">'+Array.from({length:sets},(_,i)=>checkHtml(id+'-'+(i+1),'Подход '+(i+1),entry.checks?.[id+'-'+(i+1)],'data-workout-check')).join('')+'</div></article>';
    }).join('');
}

function activeSessionData() {
  const key=sessionsFor(selectedWeek)[selectedSession].key;
  state.sessions??={};
  const entry=state.sessions[key]??={};
  entry.checks??={};
  entry.weights??={};
  return entry;
}
$('sessionBody').addEventListener('change',event=>{
  const {workoutCheck,exerciseWeight}=event.target.dataset;
  if (workoutCheck) {
    activeSessionData().checks[workoutCheck]=event.target.checked;
    save();
    $('sessionBody').querySelector('[data-workout-check="'+workoutCheck+'"]')?.focus();
  } else if (exerciseWeight && event.target.reportValidity()) {
    const weights=activeSessionData().weights;
    if (event.target.value==='') delete weights[exerciseWeight];
    else weights[exerciseWeight]=event.target.valueAsNumber;
    persistLocal();
  }
});
$('sessionSelect').addEventListener('click',event=>{
  const button=event.target.closest('[data-session]');
  if (!button) return;
  selectedSession=Number(button.dataset.session);
  renderTraining();
  $('sessionSelect').querySelector('[aria-pressed=true]')?.focus();
});
function changeWeek(week) {
  selectedWeek=week;
  selectedSession=0;
  renderTraining();
}
$('weekSelect').onchange=event=>changeWeek(Number(event.target.value));
$('previousWeek').onclick=()=>changeWeek(selectedWeek-1);
$('nextWeek').onclick=()=>changeWeek(selectedWeek+1);

const drinkTotal=entry=>drinks.reduce((total,{key})=>total+number(entry[key]),0);
function drinkLog(entry,key) {
  entry.drinkLog??={};
  if (!entry.drinkLog[key]) {
    const count=drinks.find(item=>item.key===key).labels.length;
    const previous=number(entry[key]);
    const checks=Array.from({length:count},(_,i)=>previous>=(i+1)*250);
    entry.drinkLog[key]={checks,extra:previous-checks.filter(Boolean).length*250};
  }
  return entry.drinkLog[key];
}
function syncDrink(entry,key) {
  const {checks,extra}=drinkLog(entry,key);
  entry[key]=checks.filter(Boolean).length*250+extra;
}
function renderDrinks() {
  const entry=day();
  $('drinkTotal').textContent=drinkTotal(entry).toLocaleString('ru-RU')+' мл';
  $('drinkChecks').innerHTML=drinks.map(({key,title,labels})=>
    '<div><h3>'+title+'</h3><div class="cups">'+labels.map((label,i)=>checkHtml(key+'-'+i,label,drinkLog(entry,key).checks[i],'data-drink')).join('')+'</div>'+(drinkLog(entry,key).extra?'<p class="help">Дополнительно '+drinkLog(entry,key).extra+' мл</p>':'')+'</div>'
  ).join('');
}
$('drinkChecks').addEventListener('change',event=>{
  const token=event.target.dataset.drink;
  if (!token) return;
  const [key,part]=token.split('-');
  const entry=day();
  drinkLog(entry,key).checks[Number(part)]=event.target.checked;
  syncDrink(entry,key);
  save();
  $('drinkChecks').querySelector('[data-drink="'+token+'"]')?.focus();
});
$('quickWater').onclick=()=>{
  const entry=day(), log=drinkLog(entry,'water');
  const next=log.checks.indexOf(false);
  if(next<0) log.extra+=250;
  else log.checks[next]=true;
  syncDrink(entry,'water');
  save();
};

function renderMeals() {
  const logged=new Set(day().foods.map(item=>item.meal));
  $('mealPlan').innerHTML=meals.map(([id,slot,title,cal,,,,recipe,shopping])=>
    '<article class="meal"><div class="row"><div><p class="help">'+slot+'</p><h3>'+title+'</h3></div><span class="kcal">'+cal+' ккал</span></div><p>'+recipe+'</p><p class="help">'+shopping+'</p><button class="btn alt" data-meal="'+id+'"'+(logged.has(id)?' disabled':'')+'>'+(logged.has(id)?'Добавлено':'+ В дневник')+'</button></article>'
  ).join('');
}
$('mealPlan').addEventListener('click',event=>{
  const id=event.target.closest('[data-meal]')?.dataset.meal;
  const meal=meals.find(item=>item[0]===id);
  if(!meal||day().foods.some(item=>item.meal===id)) return;
  const [key,,name,cal,p,f,c]=meal;
  day().foods.push({meal:key,name,cal,p,f,c});
  save();
});
$('useMealGoal').onclick=()=>{
  state.goal=1700;
  save();
};

function persistLocal() {
  try {localStorage.setItem(KEY,JSON.stringify(state));}
  catch {return false;}
  return true;
}
function renderSteps() {
  const entry=day();
  $('stepCount').textContent=$('stepsNow').textContent=number(entry.steps).toLocaleString('ru-RU');
  $('activityForm').elements.steps.placeholder=number(entry.steps).toLocaleString('ru-RU');
  $('stepsSource').textContent=({health:'Из «Здоровья» iPhone',sensor:'Оценка по датчику',manual:'Запись за день'})[entry.stepsSource]??'За сегодня';
}
let counting=false, motionTimer, previousSignal, previousTime=0, lastStep=0, pendingSteps=0, hadSample=false;
function resetMotion() {
  previousSignal=undefined;
  previousTime=0;
  lastStep=0;
  pendingSteps=0;
  hadSample=false;
}
function onMotion(event) {
  if (document.hidden || !counting || healthToken) return;
  const sensor=event.accelerationIncludingGravity;
  if (!sensor || ![sensor.x,sensor.y,sensor.z].every(Number.isFinite)) return;
  hadSample=true;
  const now=performance.now();
  const value=Math.hypot(sensor.x,sensor.y,sensor.z);
  if (previousSignal===undefined || now-previousTime>1100) {
    previousSignal=value;
    pendingSteps=0;
    lastStep=0;
  }
  const high=value>11.15 && previousSignal<=11.15;
  previousSignal=value;
  previousTime=now;
  if (!high || now-lastStep<280) return;
  if (now-lastStep>1050) pendingSteps=0;
  const previousSteps=pendingSteps++;
  lastStep=now;
  if (pendingSteps<3) return;
  const entry=day();
  entry.steps=Math.min(100000,number(entry.steps)+(previousSteps===2?3:1));
  entry.stepsSource='sensor';
  if(!persistLocal()) {
    setPedometer(false,'Не удалось сохранить шаги в браузере');
    return;
  }
  renderSteps();
}
function setPedometer(enabled,message) {
  counting=enabled;
  resetMotion();
  clearTimeout(motionTimer);
  window.removeEventListener('devicemotion',onMotion);
  if (enabled) {
    window.addEventListener('devicemotion',onMotion,{passive:true});
    motionTimer=setTimeout(()=>{
      if(!hadSample&&!document.hidden) setPedometer(false,'Датчик не передаёт данные. Попробуй на телефоне или внеси итог вручную.');
    },3500);
  }
  $('togglePedometer').textContent=enabled?'Остановить датчик браузера':'Включить датчик браузера';
  $('pedometerStatus').textContent=message;
}
$('togglePedometer').onclick=async()=>{
  if(counting) return setPedometer(false,'Датчик браузера выключен');
  if(!('DeviceMotionEvent' in window)) return setPedometer(false,'У этого браузера нет доступа к датчику движения.');
  try {
    if(typeof DeviceMotionEvent.requestPermission==='function' && await DeviceMotionEvent.requestPermission()!=='granted') return setPedometer(false,'Разрешение на датчик не предоставлено.');
    if(healthToken) return;
    setPedometer(true,'Считаю шаги, пока приложение открыто');
  } catch {
    setPedometer(false,'Датчик недоступен. Шаги можно записать вручную.');
  }
};
document.addEventListener('visibilitychange',()=>{
  if(!counting) return;
  resetMotion();
  $('pedometerStatus').textContent=document.hidden?'Шагомер приостановлен':'Считаю шаги, пока приложение открыто';
});

const healthTokenKey=KEY+'-health-token';
let healthToken=loadHealthToken();

function loadHealthToken() {
  try { return localStorage.getItem(healthTokenKey)??''; }
  catch { return ''; }
}
function renderHealthSetup() {
  const connected=Boolean(healthToken);
  $('healthSetup').hidden=!connected;
  $('connectHealth').hidden=connected;
  $('togglePedometer').disabled=connected;
  if (!connected) return;
  const url=new URL('./',location.href);
  url.hash='health='+healthToken+'&steps=';
  $('healthPrefix').value=url.href;
}
function healthMessage(message) {
  $('healthStatus').textContent=message;
}
$('connectHealth').onclick=()=>{
  try {
    const bytes=crypto.getRandomValues(new Uint8Array(16));
    const token=Array.from(bytes,byte=>byte.toString(16).padStart(2,'0')).join('');
    localStorage.setItem(healthTokenKey,token);
    healthToken=token;
  } catch {
    healthMessage('Браузер не смог сохранить настройку. Открой трекер в обычной вкладке Safari.');
    return;
  }
  if(counting) setPedometer(false,'Датчик браузера выключен');
  renderHealthSetup();
  $('healthInstructions').open=true;
  healthMessage('Создай команду на iPhone, чтобы обновлять шаги при открытии трекера.');
  $('healthInstructions').querySelector('summary')?.focus();
};
$('disconnectHealth').onclick=()=>{
  try { localStorage.removeItem(healthTokenKey); }
  catch {
    healthMessage('Не удалось отключить импорт в этом браузере.');
    return;
  }
  healthToken='';
  $('healthPrefix').value='';
  renderHealthSetup();
  healthMessage('Импорт отключён. Уже записанные шаги остались в дневнике.');
  $('connectHealth').focus();
};
$('copyHealthPrefix').onclick=async()=>{
  try {
    await navigator.clipboard.writeText($('healthPrefix').value);
    healthMessage('Префикс скопирован. Вставь его в действие URL в «Командах».');
  } catch {
    $('healthPrefix').select();
    healthMessage('Выделила префикс. Скопируй его через меню Safari.');
  }
};

function healthUpdate(params,today) {
  if (!healthToken||params.getAll('health').length!==1||params.get('health')!==healthToken) {
    return {error:'Этот браузер не подключён к команде. Открой «Движение» и проверь префикс.'};
  }
  const raw=(params.get('steps')??'').trim();
  if (params.getAll('steps').length!==1||!/^\d{1,3}(?:[ \u00a0\u202f]\d{3})*$|^\d{1,6}$/.test(raw)) {
    return {error:'Команда не передала число шагов. Выбери свойство «Значение» в действии URL.'};
  }
  const steps=Number(raw.replace(/[ \u00a0\u202f]/g,''));
  const dayKey=params.get('date')??today;
  if (steps>100000||!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)||dayKey>today||dayKey<addDays(today,-30)||dateKey(localDate(dayKey))!==dayKey) {
    return {error:'Число шагов или дата вышли за допустимый диапазон.'};
  }
  return {steps,dayKey};
}
function receiveHealthLink() {
  const raw=location.hash.slice(1);
  if (!raw.startsWith('health=')) return false;
  const params=new URLSearchParams(raw);
  history.replaceState(null,'',location.pathname+location.search);
  const result=healthUpdate(params,date());
  if (result.error) {
    tab('activity');
    healthMessage(result.error);
    return true;
  }
  const {dayKey,steps}=result;
  const previous=state.days[dayKey];
  state.days[dayKey]={foods:[],water:0,minutes:0,mood:'',...previous,steps,stepsSource:'health',healthUpdatedAt:Date.now()};
  if (!persistLocal()) {
    if(previous) state.days[dayKey]=previous;
    else delete state.days[dayKey];
    tab('activity');
    healthMessage('Не удалось записать шаги в браузере.');
    return true;
  }
  render();
  renderDashboard();
  tab('activity');
  healthMessage('Из «Здоровья» записано '+steps.toLocaleString('ru-RU')+' шагов · '+shortDate(dayKey)+'.');
  return true;
}
window.addEventListener('hashchange',receiveHealthLink);

function renderDashboard() {
  const entry=day(), now=date(), week=currentWeek(), today=sessionsFor(week).find(item=>item.key===now);
  $('headerDate').dateTime=now;
  $('headerDate').textContent=localDate(now).toLocaleDateString('ru-RU',{day:'numeric',month:'long',weekday:'short'});
  $('waterNow').textContent=drinkTotal(entry).toLocaleString('ru-RU');
  if(today) {
    const total=requiredChecks(week,today.type).length;
    const done=completedChecks(week,today);
    $('todayPlan').textContent='Сегодня тренировка '+today.type+'. План и техника упражнений уже в календаре.';
    $('trainingNow').textContent=done+'/'+total;
    $('trainingToday').textContent=done===total?'Выполнена':'Пункты тренировки';
  } else {
    const nowWeek=sessionsFor(week);
    const upcoming=nowWeek.find(item=>item.key>now)??(week<52?sessionsFor(week+1)[0]:null);
    $('todayPlan').textContent=upcoming?'Следующая тренировка '+upcoming.type+' — '+shortDate(upcoming.key)+'.':'Годовой план завершён. Отметки доступны в календаре.';
    $('trainingNow').textContent='—';
    $('trainingToday').textContent='Сегодня без силовой';
  }
  $('useMealGoal').disabled=state.goal===1700;
  $('useMealGoal').textContent=state.goal===1700?'Цель 1700 ккал установлена':'Поставить цель 1700 ккал';
  renderSteps();
}
function renderFeatureTab() {
  if ($('training').classList.contains('active')) renderTraining();
  if ($('activity').classList.contains('active')) renderDrinks();
  if ($('food').classList.contains('active')) renderMeals();
}
window.addEventListener('tracker-change',()=>{
  renderDashboard();
  renderFeatureTab();
});
window.addEventListener('tracker-tab',()=>{
  renderFeatureTab();
  if($('activity').classList.contains('active')) {
    const form=$('activityForm');
    form.elements.steps.value='';
    form.elements.minutes.value=day().minutes??'';
  }
});
persistLocal();
renderDashboard();
renderFeatureTab();
renderHealthSetup();
if(!receiveHealthLink() && healthToken) {
  const last=Object.entries(state.days).filter(([,entry])=>entry.stepsSource==='health'&&entry.healthUpdatedAt).sort(([a],[b])=>b.localeCompare(a))[0];
  if(last) {
    healthMessage('Последний импорт · '+shortDate(last[0])+' · '+number(last[1].steps).toLocaleString('ru-RU')+' шагов. Для обновления открой трекер через команду.');
  } else {
    healthMessage('Префикс создан. Запусти команду на iPhone для первого импорта.');
  }
}
