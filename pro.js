(function(){
'use strict';
const labels={
ar:{budget:'ميزانية الشهر',used:'المصروف من الميزانية',none:'حدّد الميزانية الشهرية من الإعدادات',good:'باقي داخل الميزانية',near:'تنبيه: وصلتي لـ 80% من الميزانية',over:'تنبيه: تجاوزتي الميزانية!',compare:'مقارنة آخر 6 شهور',last:'الشهر السابق',diff:'الفرق عن الشهر السابق',settings:'الميزانية والتنبيهات',limit:'الحد الأقصى للمصاريف الشهرية (€)',hint:'0 = بدون حد. التنبيه كيبان ملي توصل لـ 80% أو تفوت الحد.',save:'حفظ الميزانية',saved:'تحفظات الميزانية'},
de:{budget:'Monatsbudget',used:'Vom Budget ausgegeben',none:'Monatslimit in den Einstellungen festlegen',good:'Im Budget',near:'Warnung: 80 % des Budgets erreicht',over:'Warnung: Budget überschritten!',compare:'Vergleich der letzten 6 Monate',last:'Vormonat',diff:'Unterschied zum Vormonat',settings:'Budget und Warnungen',limit:'Monatliches Ausgabenlimit (€)',hint:'0 = kein Limit. Warnung bei 80 % und Überschreitung.',save:'Budget speichern',saved:'Budget gespeichert'},
fr:{budget:'Budget mensuel',used:'Dépensé sur le budget',none:'Définissez le plafond dans les paramètres',good:'Dans le budget',near:'Attention : 80 % du budget atteint',over:'Attention : budget dépassé !',compare:'Comparaison des 6 derniers mois',last:'Mois précédent',diff:'Différence avec le mois précédent',settings:'Budget et alertes',limit:'Plafond mensuel des dépenses (€)',hint:'0 = pas de plafond. Alerte à 80 % et en cas de dépassement.',save:'Enregistrer le budget',saved:'Budget enregistré'}
};
const el=id=>document.getElementById(id);
function updatePro(){
 const tr=labels[lang]||labels.ar;
 const names={proBudgetTitle:'budget',proBudgetSpentLabel:'used',proCompareTitle:'compare',proLastLabel:'last',proDifferenceLabel:'diff',proSettingsTitle:'settings',proLimitLabel:'limit',proLimitHint:'hint',proLimitSave:'save'};
 for(const [id,k] of Object.entries(names))el(id).textContent=tr[k];
 const now=new Date(), ym=month(), current=sum(expenses.filter(e=>key(e.date)===ym));
 const limit=Math.max(0,Number(localStorage.getItem('mb-monthly-limit'))||0);
 el('proLimit').value=limit||'';
 el('proBudgetNumbers').textContent=limit?eur(current)+' / '+eur(limit):eur(current);
 const pct=limit?current/limit*100:0;
 const fill=el('proBudgetFill');fill.style.width=Math.min(100,pct)+'%';fill.className='profill'+(pct>=100?' over':pct>=80?' warning':'');
 el('proNotice').textContent=!limit?tr.none:pct>=100?tr.over:pct>=80?tr.near:tr.good;
 const months=Array.from({length:6},(_,i)=>{let d=new Date(now.getFullYear(),now.getMonth()-5+i,1);return {id:d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'),label:d.toLocaleDateString(lang==='de'?'de-DE':lang==='fr'?'fr-FR':'ar-MA',{month:'short'})}});
 const values=months.map(m=>sum(expenses.filter(e=>key(e.date)===m.id)));
 const max=Math.max(1,...values);
 const chart=el('proChart');chart.replaceChildren();
 months.forEach((m,i)=>{let col=document.createElement('div');col.className='procol';let val=document.createElement('b');val.textContent=eur(values[i]);let bar=document.createElement('div');bar.className='barcol';bar.style.height=Math.max(3,values[i]/max*95)+'px';let caption=document.createElement('small');caption.textContent=m.label;col.append(val,bar,caption);chart.append(col)});
 el('proLastAmount').textContent=eur(values[4]);
 const diff=values[5]-values[4];el('proDifference').textContent=(diff>0?'+':'')+eur(diff);
 el('proDifference').style.color=diff>0?'#c43d4e':diff<0?'#24885b':'inherit';
}
const oldRender=render;render=function(){oldRender();updatePro()};
const oldLang=applyLang;applyLang=function(){oldLang();updatePro()};
el('proLimitSave').addEventListener('click',()=>{
 let v=Number(el('proLimit').value);
 if(!Number.isFinite(v)||v<0)return;
 localStorage.setItem('mb-monthly-limit',String(Math.round(v*100)/100));updatePro();toast((labels[lang]||labels.ar).saved);
});
updatePro();
})();
