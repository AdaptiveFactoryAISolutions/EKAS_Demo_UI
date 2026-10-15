/** Separate, deterministic broad simulation. Never edits northworks-demo-v1. */
export type Fact={id:string;assetId:string;partId:string;revision:string;operationId:string;jobId:string;shiftId:string;at:string;recordedAt:string;[field:string]:string|number|boolean};
export type PlatformFixture={version:'ekas-platform-synthetic-v2';generatedFor:string;tables:Record<string,Fact[]>;hierarchy:{id:string,parentId:string|null,kind:string}[];assets:{id:string,lineId:string,constraint:boolean}[];definitions:{id:string,version:number,value:number,unit:string,effectiveFrom:string,effectiveTo:string|null}[]};
const minute=60000;
export function buildPlatformFixture():PlatformFixture{
 const tables:Record<string,Fact[]>={};const add=(name:string,row:Fact)=>{(tables[name]??=[]).push(row)};
 const hierarchy=[{id:'NW',parentId:null,kind:'enterprise'},{id:'SITE-A',parentId:'NW',kind:'site'},{id:'AREA-A',parentId:'SITE-A',kind:'area'},...[1,2,3].map(n=>({id:`LINE-${n}`,parentId:'AREA-A',kind:'line'}))];
 const assets=[1,2,3].flatMap(line=>[1,2].map(n=>({id:`ASSET-${line}-${n}`,lineId:`LINE-${line}`,constraint:n===1})));
 const definitions=[{id:'ideal-cycle:P2:OP-030',version:1,value:.5,unit:'min/unit',effectiveFrom:'2026-09-01T00:00:00Z',effectiveTo:null},{id:'ideal-cycle:P3:OP-030',version:1,value:.6,unit:'min/unit',effectiveFrom:'2026-10-07T00:00:00Z',effectiveTo:null},{id:'spec:P2',version:1,value:10,unit:'mm',effectiveFrom:'2026-09-01T00:00:00Z',effectiveTo:null},{id:'spec:P3',version:1,value:11,unit:'mm',effectiveFrom:'2026-10-07T00:00:00Z',effectiveTo:null}];
 for(let day=0;day<28;day++)for(const [index,asset] of assets.entries()){
  const start=Date.UTC(2026,9,6+day,6),end=start+480*minute,at=new Date(end).toISOString();
  const revision=day>=7&&index%2?'P3':'P2',ideal=revision==='P3'?.6:.5;
  const shiftId=`SHIFT-${day}-${asset.id}`,jobId=`JOB-${day}-${asset.id}`,base={assetId:asset.id,partId:revision==='P3'?'NW-B':'NW-A',revision,operationId:'OP-030',jobId,shiftId,at,recordedAt:new Date(end+5*minute).toISOString()};
  const fact=(id:string,values:Record<string,string|number|boolean>):Fact=>({id,...base,...values});
  const downtime=45+(day%4)*5+index*3,run=480-downtime,total=Math.floor(run/ideal*.9),scrap=8+index+(day%3),rework=4+day%2,good=total-scrap;
  add('shifts',fact(shiftId,{start:new Date(start).toISOString(),end:at,plannedMinutes:480,calendarMinutes:1440,availableMinutes:480}));
  add('jobs',fact(jobId,{release:new Date(start-60*minute).toISOString(),completion:at,plannedCompletion:at,plannedQuantity:Math.floor(480/ideal*.8),standardSetupMinutes:20,standardLaborHours:good*.002,lotId:`LOT-${jobId}`}));
  add('plans',fact(`PLAN-${jobId}`,{version:1,quantity:Math.floor(480/ideal*.8),ratedCapacity:480/ideal,availableCapacity:run/ideal,promise:at}));
  add('counts',fact(`COUNT-${jobId}`,{total,good,scrap,rework,firstPassGood:good-rework,inspected:total,defective:scrap+rework,defects:scrap+rework+2,opportunitiesPerUnit:3,idealCycleMinutes:ideal}));
  add('runIntervals',fact(`RUN-${jobId}`,{start:new Date(start+downtime*minute).toISOString(),end:at,minutes:run,productive:true}));
  add('downtimeEvents',fact(`STOP-${jobId}`,{start:new Date(start).toISOString(),end:new Date(start+downtime*minute).toISOString(),minutes:downtime,reason:day%2?'feeder-jam':'setup',planned:day%2===0,overlapGroup:`STOP-${jobId}`,failure:day%2===1}));
  add('changeovers',fact(`CHANGE-${jobId}`,{lastGood:new Date(start-5*minute).toISOString(),firstGood:new Date(start+20*minute).toISOString(),minutes:25,standardMinutes:20,internalMinutes:18,externalMinutes:7}));
  add('unitJourneys',fact(`JOURNEY-${jobId}`,{release:new Date(start-60*minute).toISOString(),completion:at,queueMinutes:downtime+20,setupMinutes:20,runMinutes:run,moveMinutes:10,waitMinutes:10,valueAddedMinutes:run}));
  for(let sample=0;sample<20;sample++)add('qualitySamples',fact(`SAMPLE-${jobId}-${sample}`,{subgroupId:`GROUP-${jobId}-${Math.floor(sample/5)}`,value:(revision==='P3'?11:10)+((sample%5)-2)*.035+(day%3)*.01,unit:'mm',lsl:revision==='P3'?10.5:9.5,usl:revision==='P3'?11.5:10.5,specVersion:1}));
  add('workOrders',fact(`WO-${jobId}`,{status:'completed',kind:day%4?'planned':'reactive',scheduledAt:new Date(start).toISOString(),completedAt:at,activeRepairMinutes:20,restorationMinutes:downtime,laborHours:1.5,emergency:day%10===0,repeatFailure:day%7===0}));
  add('technicianNotes',fact(`NOTE-${jobId}`,{workOrderId:`WO-${jobId}`,text:'Synthetic inspection: guide wear suspected; observations alone do not prove cause.',author:'TECH-DEMO',knowledgeVersion:1}));
  add('pmSchedules',fact(`PM-${jobId}`,{dueAt:at,completedAt:day%5?at:new Date(end+60*minute).toISOString(),scheduled:true}));
  add('laborBookings',fact(`LABOR-${jobId}`,{paidHours:16,productiveHours:12,directAvailableHours:16,directProductiveHours:12,overtimeHours:1,scheduledHours:16,absentHours:day%6===0?1:0,laborRate:30,directLaborCost:480}));
  for(const [category,amount] of Object.entries({directLabor:480,overhead:320,materials:total*.8,prevention:20,appraisal:30,internalFailure:scrap*2+rework*3,externalFailure:15,warranty:5,standardBudget:1600,sales:good*4,cogs:good*1.9}))add('costLedger',fact(`COST-${jobId}-${category}`,{category,amount,currency:'USD',unit:'USD/shift',costVersion:1,financialValidation:false}));
  add('materialIssues',fact(`MAT-${jobId}`,{actualQuantity:total*1.02,standardQuantity:total,standardPrice:.8}));
  add('meterIntervals',fact(`ENERGY-${jobId}`,{kWh:100+run*.15,idleKWh:downtime*.2,waterLitres:good*.25,wasteKg:scrap*.2,kgCO2e:(100+run*.15)*.35,emissionFactorVersion:1}));
  add('demandSamples',fact(`DEMAND-${jobId}`,{kW:18+index,intervalMinutes:15}));
  add('inventorySnapshots',fact(`INV-${jobId}`,{rawValue:3000,wipValue:1600,fgValue:2000,totalValue:6600,wipUnits:100+day,obsoleteValue:100,excessValue:200,materialUsage:total*.8,checkedRecords:20,correctRecords:19}));
  const delivery=day%5===0?new Date(end+1440*minute).toISOString():at;
  add('customerOrders',fact(`ORDER-${jobId}`,{at:delivery,recordedAt:new Date(Date.parse(delivery)+5*minute).toISOString(),ordered:good,promisedAt:at,shipped:good-(day%6===0?10:0),shippedImmediately:good-5,deliveredAt:delivery,customerRejected:day%4===0?1:0,documentsCorrect:day%8!==0,undamaged:true}));
  add('safetyEvents',fact(`SAFETY-${jobId}`,{recordable:day===20&&index===0?1:0,dart:0,lostTime:0,nearMiss:day%11===0?1:0,hoursWorked:16,policyVersion:1}));
  add('improvementActions',fact(`ACTION-${jobId}`,{caseId:`CASE-${asset.id}`,owner:'CI-DEMO',dueAt:at,completed:day%4!==0,completedAt:day%4!==0?at:'',interventionId:`INTERVENTION-${asset.id}`,primaryMetric:'feeder-jam-minutes-per-eligible-shift',baselineMinutes:60,observedMinutes:day<10?60:30,eligible:true,verifiedFinancialSavings:false}));
 }
 const context=tables.jobs[0];
 for(const [name,kind] of Object.entries({controlledDocuments:'standard-work',fmeaRows:'pfmea',controlPlanRows:'control-plan',engineeringChanges:'unreleased-EC',ontologyNodes:'asset-concept',ontologyEdges:'has-operation',mlScenarios:'deterministic-untrained-score',monitorDefinitions:'threshold',scheduleDefinitions:'local-delivery-simulation',spares:'ready',auditEvents:'synthetic-only'}))add(name,{...context,id:`${name}-1`,kind,version:1,state:'synthetic',notDispatched:true,notGranted:true});
 return {version:'ekas-platform-synthetic-v2',generatedFor:'2026-11-03T14:30:00Z',tables,hierarchy,assets,definitions};
}
export function visibleFacts(fixture:PlatformFixture,table:string,asOf:string,filters:Partial<Pick<Fact,'assetId'|'partId'|'revision'|'operationId'|'jobId'|'shiftId'>>={}){
 return (fixture.tables[table]||[]).filter(row=>Date.parse(row.at)<=Date.parse(asOf)&&Date.parse(row.recordedAt)<=Date.parse(asOf)&&Object.entries(filters).every(([key,value])=>row[key]===value));
}
