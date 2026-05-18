import requests,json,urllib.parse
qs=['site:amazon.com "Homemory Rechargeable Tea Lights"', 'site:amazon.com "GenSwin 12 Rechargeable Tea Lights"', 'site:amazon.com ceramic candle jar scented', 'site:wayfair.com ceramic candle jar', 'site:homedepot.com rechargeable tealight', 'site:homedepot.com rattan side table glass', 'site:homedepot.com bamboo shower stool', 'site:lowes.com bamboo shower stool', 'site:wayfair.com rattan side table glass', 'site:houzz.com rattan side table glass', 'site:lumens.com rattan side table', 'site:houzz.com ceramic candle', 'site:homedepot.com flameless remote candle', 'site:wayfair.com flameless candle remote']; out=[]
for q in qs:
 u='https://search.yahoo.com/search?p='+urllib.parse.quote(q)
 try:r=requests.get(u,headers={'User-Agent':'Mozilla/5.0'}); out.append((q,r.status_code,len(r.content),r.text[:200000]))
 except Exception as e: out.append((q,str(e)))
json.dump({'status':'no-games'},open('scripts/raw_slate.json','w'));open('public/data.js','w').write('FETCHOUT='+json.dumps(out))
