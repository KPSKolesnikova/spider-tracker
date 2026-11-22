'use strict';

const meals = ['breakfast','snack1','lunch','snack2','dinner'].map(key=>[key]);

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
  return ['A','B'].map((type,i)=>({type,key:state.schedule?.[week+type]??addDays(monday,i*3)}));
}
function currentWeek() {
  const count=Math.round((Date.parse(date())-Date.parse(planStart()))/86400000);
  return Math.max(1,Math.min(52,Math.floor(count/7)+1));
}
function statusFor(week) {
  const phase=phases.find(item=>week<=item.weeks);
  return {phase, sets:week%4===0?Math.max(1,phase.sets-1):phase.sets, easy:week%4===0};
}
function sessionSets(week,type){
  const key=sessionsFor(week).find(s=>s.type===type).key;
  return key<date() && state.sessions?.[key] && !state.sessions[key].newPlan ? statusFor(week).sets : 3;
}
function requiredChecks(week,type) {
  const sets=sessionSets(week,type);
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
  const sets=sessionSets(selectedWeek,session.type); $('moveDate').value=session.key;
  $('phaseNote').textContent='DDX · около часа · разминка и 5 упражнений. Вес подбирай по технике и самочувствию.';
  $('sessionSelect').innerHTML=available.map((item,i)=>'<button class="pill-button" data-session="'+i+'" aria-pressed="'+(i===selectedSession)+'">'+localDate(item.key).toLocaleDateString('ru-RU',{weekday:'short'})+' · '+shortDate(item.key)+' · '+item.type+(isComplete(selectedWeek,item)?' ✓':'')+'</button>').join('');
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
      const reps=id==='core'?'15 попеременно':'15+';
      return '<article class="exercise"><div class="row"><div><h3>'+title+'</h3><p class="help">'+sets+' × '+reps+' · '+(previous!=null?'Прошлый вес '+previous+' кг':starting)+'</p></div><label class="field">Вес, кг<input type="number" min="0" max="1000" step="0.1" inputmode="decimal" data-exercise-weight="'+id+'" aria-label="Вес: '+title+'" value="'+(Number.isFinite(actual)?actual:'')+'" placeholder="'+(previous??'')+'"></label></div><details data-exercise="'+id+'"'+(open.includes(id)?' open':'')+'><summary>Техника</summary><p>'+technique+'</p></details><div class="sets">'+Array.from({length:sets},(_,i)=>checkHtml(id+'-'+(i+1),'Подход '+(i+1),entry.checks?.[id+'-'+(i+1)],'data-workout-check')+'<label class="field">Факт, повт.<input type="number" min="1" max="200" placeholder="15" data-reps="'+id+'-'+(i+1)+'" value="'+(Number(entry.reps?.[id+'-'+(i+1)])||'')+'"></label>').join('')+'</div></article>';
    }).join('');
}

function activeSessionData() {
  const key=sessionsFor(selectedWeek)[selectedSession].key;
  state.sessions??={};
  const entry=state.sessions[key]??={};
  if(key>=date())entry.newPlan=true;
  entry.checks??={};
  entry.weights??={};
  return entry;
}
$('sessionBody').addEventListener('change',event=>{
  const {workoutCheck,exerciseWeight,reps}=event.target.dataset;
  if(reps && event.target.reportValidity()){const entry=activeSessionData();(entry.reps??={})[reps]=event.target.valueAsNumber||null;persistLocal();return;}
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


const slots=['Завтрак','Первый перекус','Обед','Второй перекус','Ужин'];
function selectedRecipe(slot) {
  const choice=day().menu?.[slot];
  return Number.isInteger(choice)&&choice>=slot*10&&choice<slot*10+10?choice:slot*10;
}
function renderMeals() {
  const total=slots.reduce((sum,_,i)=>sum+recipes[selectedRecipe(i)][1],0);
  $('menuTotal').textContent=total+' ккал';
  const root=$('mealPlan');
  const expanded=root.querySelector('details[open]')?.dataset.slot;
  root.innerHTML=slots.map((label,i)=>{
    const choice=selectedRecipe(i),[name,cal,p,f,c,ingredients,method]=recipes[choice];
    const logged=day().foods.find(item=>item.meal===meals[i][0]);
    const options=recipes.slice(i*10,i*10+10).map(([title,kcal],j)=>'<option value="'+(i*10+j)+'"'+(choice===i*10+j?' selected':'')+'>'+title+' · '+kcal+' ккал</option>').join('');
    return '<details class="recipeSlot" name="cookbook" data-slot="'+i+'"'+(expanded===String(i)?' open':'')+'><summary><span><small>'+label+'</small><strong>'+name+'</strong></span><b>'+cal+' ккал</b></summary><div class="recipeInside"><label class="field">Выбрать из 10 блюд<select data-choice="'+i+'">'+options+'</select></label><p>'+ingredients+'</p><p>'+method+'</p><p class="help">Б '+p+' г · Ж '+f+' г · У '+c+' г</p><p class="help">Где искать: '+['Ozon fresh, Магнит, Яндекс Лавка','ВкусВилл, Самокат','Магнит, Яндекс Лавка','Дикси, Самокат','ВкусВилл, Магнит'][i]+'.</p><button class="btn alt" data-log="'+i+'" '+(logged?.name===name?'disabled':'')+'>'+(logged?.name===name?'В дневнике':logged?'Заменить запись в дневнике':'Добавить в дневник')+'</button></div></details>';
  }).join('');
}
$('mealPlan').onchange=e=>{
  if(!e.target.matches('[data-choice]'))return;
  (day().menu??={})[e.target.dataset.choice]=Number(e.target.value);
  save();
  $('mealPlan').querySelector('[data-choice="'+e.target.dataset.choice+'"]')?.focus();
};
$('mealPlan').onclick=e=>{
  const button=e.target.closest('[data-log]');
  if(!button)return;
  const i=Number(button.dataset.log),[name,cal,p,f,c]=recipes[selectedRecipe(i)];
  const meal=meals[i][0],entry={meal,name,cal,p,f,c},foods=day().foods;
  const old=foods.findIndex(item=>item.meal===meal);
  if(old===-1) foods.push(entry); else foods[old]=entry;
  save();
};
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
let monthOffset=0;
function renderWidgets(){
  const today=date(),week=currentWeek(), pair=sessionsFor(week);
  const done=pair.reduce((n,s)=>n+completedChecks(week,s),0);
  const total=pair.reduce((n,s)=>n+requiredChecks(week,s.type).length,0);
  const percent=Math.round(done/total*100);
  $('weekRing').style.setProperty('--done',percent+'%');
  $('weekRing').textContent=percent+'%';
  $('weekCaption').textContent=done+' из '+total+' пунктов · неделя '+week;
  const anchor=localDate(today);
  anchor.setDate(1);anchor.setMonth(anchor.getMonth()+monthOffset);
  $('monthLabel').textContent=anchor.toLocaleDateString('ru-RU',{month:'long',year:'numeric'});
  const sessions=new Map();
  for(let w=1;w<=52;w++) sessionsFor(w).forEach((s,i)=>sessions.set(s.key,{w,i,complete:isComplete(w,s)}));
  const cells=Array((anchor.getDay()+6)%7).fill('<span></span>');
  const month=anchor.getMonth();
  while(anchor.getMonth()===month){
    const key=dateKey(anchor),s=sessions.get(key);
    cells.push(s?'<button class="'+(s.complete?'finished':'planned')+'" data-week="'+s.w+'" data-which="'+s.i+'" aria-label="Тренировка '+shortDate(key)+'">'+anchor.getDate()+'</button>':'<span>'+anchor.getDate()+'</span>');
    anchor.setDate(anchor.getDate()+1);
  }
  $('monthGrid').innerHTML=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d=>'<small>'+d+'</small>').join('')+cells.join('');
}
$('monthBack').onclick=()=>{monthOffset--;renderWidgets()};
$('monthNext').onclick=()=>{monthOffset++;renderWidgets()};
$('monthGrid').onclick=e=>{const b=e.target.closest('[data-week]');if(b){selectedWeek=Number(b.dataset.week);selectedSession=Number(b.dataset.which);tab('training')}};
let restEnd=0,restLeft=90;
function paintTimer(){
  if(restEnd){restLeft=Math.max(0,Math.ceil((restEnd-Date.now())/1000));if(!restLeft)restEnd=0;}
  $('restClock').textContent=Math.floor(restLeft/60)+':'+String(restLeft%60).padStart(2,'0');
  $('restToggle').textContent=restEnd?'Пауза':restLeft===0?'Ещё раз':'Старт';
}
$('restToggle').onclick=()=>{paintTimer();restEnd=restEnd?0:Date.now()+(restLeft||90)*1000;paintTimer()};
$('restReset').onclick=()=>{restLeft=90;restEnd=0;paintTimer()};
setInterval(()=>{if(restEnd)paintTimer()},500);
window.addEventListener('tracker-change',renderWidgets);
renderWidgets();

function paintWellbeing(){
 const d=day();
 for(const b of $('energyButtons').querySelectorAll('button'))b.setAttribute('aria-pressed',String(d.energy===b.dataset.energy));
 $('bedTime').value=d.bedTime||'00:30';
 $('wakeTime').value=d.wakeTime||'';
 const [h,m]=$('bedTime').value.split(':').map(Number);
 const duration=d.energy==='Мало'?9:8;
 const wake=String((h+duration)%24).padStart(2,'0')+':'+String(m).padStart(2,'0');
 $('wakeHint').textContent='Для свободного утра можно выбрать '+wake+' — это '+duration+' ч от указанного времени. Ориентируйся на самочувствие.';
 $('recoveryChoice').value=d.recovery||'';
 $('restDay').textContent=d.rest?'Вернуться к обычному дню':'День отдыха';
 $('daySummary').textContent=(d.rest?'Сегодня можно отдохнуть. Выбери прогулку, CS, GTA, фильм или задачу для удовольствия. ':d.energy==='Мало'?'Сегодня можно выбрать спокойный темп. ':'')+(d.built?'Меню собрано: '+slots.map((_,i)=>recipes[selectedRecipe(i)][0]).join(' · '):'Собери пять приёмов пищи на сегодня.');
 if(d.rest)$('todayPlan').textContent='День восстановления. Дату зала можно выбрать отдельно.';
}
$('energyButtons').onclick=e=>{if(e.target.dataset.energy){day().energy=e.target.dataset.energy;save()}};
for(const [id,key] of [['bedTime','bedTime'],['wakeTime','wakeTime'],['recoveryChoice','recovery']])$(id).onchange=e=>{day()[key]=e.target.value;save()};
$('restDay').onclick=()=>{day().rest=!day().rest;save()};
$('pickTraining').onclick=()=>{selectedWeek=currentWeek();tab('training');$('moveDate').focus()};
$('buildDay').onclick=()=>{
 const target=Number(state.goal)||1700;
 let best,delta=Infinity;
 for(let k=0;k<120;k++){
 const menu=slots.map((_,i)=>10*i+Math.floor(Math.random()*10));
 const diff=Math.abs(menu.reduce((a,j)=>a+recipes[j][1],0)-target);
 if(diff<delta){delta=diff;best=menu}
 }
 day().menu=best;day().built=true;save();tab('food');
};
$('moveWorkout').onclick=()=>{
 const week=selectedWeek,pair=sessionsFor(week),session=pair[selectedSession],dest=$('moveDate').value;
 const start=addDays(planStart(),(week-1)*7);
 if(!dest||dest<start||dest>addDays(start,6)||dest===pair[1-selectedSession].key){$('moveStatus').textContent='Выбери отдельный день внутри этой недели.';return}
 if(dest!==session.key && state.sessions?.[dest]){$('moveStatus').textContent='На эту дату уже есть записи.';return}
 if(dest!==session.key && state.sessions?.[session.key]){state.sessions[dest]=state.sessions[session.key];delete state.sessions[session.key]}
 (state.schedule??={})[week+session.type]=dest;$('weekSelect').dataset.start='';save();$('moveStatus').textContent='Тренировка запланирована на '+shortDate(dest);
};
window.addEventListener('tracker-change',paintWellbeing);
paintWellbeing();