import {createClient} from '@sanity/client'
import dotenv from 'dotenv'
import assert from 'node:assert/strict'
import {createReadStream} from 'node:fs'
import {readFile, writeFile} from 'node:fs/promises'
import {basename, dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

dotenv.config({quiet:true})
const dir=dirname(fileURLToPath(import.meta.url))
const root=resolve(dir,'../..')
const manifest=JSON.parse(await readFile(resolve(dir,'manifest.json'),'utf8'))
const write=process.argv.includes('--write')
assert(process.argv.slice(2).every((arg)=>['--write','--dry-run'].includes(arg)),'Unknown argument')
const token=process.env.SANITY_TOKEN||process.env.SANITY_WRITE_TOKEN
assert(token,'Missing Sanity write token')
const client=createClient({projectId:process.env.SANITY_PROJECT_ID,dataset:process.env.SANITY_DATASET||'production',apiVersion:'2026-03-16',token,useCdn:false,perspective:'published',timeout:120000})
const d=manifest.destination,t=manifest.trip
assert.equal(d.photos.filter((photo)=>photo.hero).length,1)
assert.equal(d.photos.length,3)
assert.equal(d.highlights.length,4)
assert(d.highlights.every((item)=>!/[\u{1F300}-\u{1FAFF}]/u.test(item)))
assert.equal(d.itinerary.length,11)
d.itinerary.forEach((day,index)=>assert.equal(day.day,index+1))
assert.equal((Date.parse(t.returnDate)-Date.parse(t.departureDate))/86400000+1,11)
assert.equal(t.totalPlaces,15)
assert.equal(t.placesLeft,15)
assert(/compressed\.pdf$/i.test(d.pdf))
const assetSpecs=[{path:d.pdf,type:'file',contentType:'application/pdf'},...d.photos.map((photo)=>({...photo,type:'image',contentType:'image/jpeg'}))]
for(const spec of assetSpecs) await readFile(resolve(root,spec.path))
const ids=[d.id,t.id]
const state=await client.fetch('{"collisions":*[_id in $ids]{_id,_type},"country":*[_id=="country-filipinas"][0]{_id},"continent":*[_id=="continent-asia"][0]{_id},"coordinator":*[_id==$coordinator][0]{_id}}',{ids,country:'country-filipinas',coordinator:t.coordinatorId})
assert.equal(state.collisions.length,0,'Destination or trip already exists; no overwrite performed')
assert(state.country&&state.continent&&state.coordinator,'Missing published references')
const report={mode:write?'write-published':'dry-run',createdAt:new Date().toISOString(),ids,assets:[],notes:manifest.notes}
await writeFile(resolve(dir,write?'result.json':'preflight.json'),JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({mode:report.mode,ids,photos:d.photos.length,pdf:d.pdf,notes:manifest.notes},null,2))
if(!write) process.exit(0)
const assets=new Map()
for(const spec of assetSpecs){
  const asset=await client.assets.upload(spec.type,createReadStream(resolve(root,spec.path)),{filename:basename(spec.path),contentType:spec.contentType})
  assets.set(spec.path,asset._id)
  report.assets.push({path:spec.path,id:asset._id,url:asset.url,size:asset.size})
  console.log('Uploaded '+spec.path)
}
const ref=(_ref)=>({_type:'reference',_ref})
const image=(photo,key)=>({_type:'image',_key:key,asset:ref(assets.get(photo.path)),alt:photo.alt})
const keyed=(items,type)=>items.map((item,index)=>({_type:type,_key:type+'-'+(index+1),...item}))
const hero=d.photos.find((photo)=>photo.hero)
const gallery=d.photos.filter((photo)=>!photo.hero).map((photo,index)=>image(photo,'photo-'+(index+1)))
assert(!gallery.some((item)=>item.asset._ref===assets.get(hero.path)))
const destination={_id:d.id,_type:'destination',name:d.name,slug:{_type:'slug',current:d.slug},country:ref('country-filipinas'),continent:ref('continent-asia'),description:d.description,shortDescription:d.shortDescription,heroImage:{_type:'image',asset:ref(assets.get(hero.path))},heroImageAlt:hero.alt,gallery,highlights:d.highlights,idealFor:d.idealFor,hasCoordinator:true,categories:d.categories,climate:d.climate,included:d.included,inheritDefaultNotIncluded:false,notIncluded:d.notIncluded,travelInsuranceIncluded:false,itinerary:keyed(d.itinerary,'itineraryDay'),faqs:keyed(d.faqs,'faqItem'),seo:{_type:'destinationSeo',...d.seo},pdfFile:{_type:'file',asset:ref(assets.get(d.pdf))}}
const trip={_id:t.id,_type:'trip',title:t.title,slug:{_type:'slug',current:t.slug},destination:ref(d.id),departureDate:t.departureDate,returnDate:t.returnDate,durationDays:t.durationDays,priceFrom:t.priceFrom,flightEstimate:t.flightEstimate,totalPlaces:t.totalPlaces,placesLeft:t.placesLeft,status:t.status,coordinator:ref(t.coordinatorId),tags:t.tags}
const result=await client.transaction().create(destination).create(trip).commit({visibility:'sync'})
report.transactionId=result.transactionId
const verification=await client.fetch('{"destination":*[_id==$destination][0]{_id,_rev,name,slug,heroImage,gallery,highlights,included,inheritDefaultNotIncluded,notIncluded,itinerary,pdfFile},"trip":*[_id==$trip][0]{_id,_rev,title,departureDate,returnDate,durationDays,priceFrom,flightEstimate,totalPlaces,placesLeft,status,coordinator,tags}}',{destination:d.id,trip:t.id})
assert(verification.destination&&verification.trip)
assert.equal(verification.destination.gallery.length,2)
assert(!verification.destination.gallery.some((item)=>item.asset._ref===verification.destination.heroImage.asset._ref))
assert.equal(verification.destination.itinerary.length,11)
assert.equal(verification.trip.totalPlaces,15)
report.verifiedAt=new Date().toISOString()
report.verification=verification
await writeFile(resolve(dir,'result.json'),JSON.stringify(report,null,2)+'\n')
await writeFile(resolve(dir,'verification.json'),JSON.stringify(verification,null,2)+'\n')
console.log(JSON.stringify({published:true,transactionId:result.transactionId,verification},null,2))
