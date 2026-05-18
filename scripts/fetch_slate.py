import requests,json,urllib.parse,time
qs=['site:homedepot.com rattan side table glass', 'site:homedepot.com bamboo shower bench', 'site:lowes.com bamboo shower bench', 'site:wayfair.com rattan side table glass', 'site:houzz.com rattan side table', 'site:lumens.com rattan side table', 'site:wayfair.com ceramic candle jar', 'site:houzz.com ceramic candle jar', 'site:homedepot.com rechargeable tealight', 'site:walmart.com rechargeable tea lights charging base', 'site:wayfair.com rechargeable tealights'];out=[]
for q in qs:
 u='https://search.yahoo.com/search?p='+urllib.parse.quote(q)
 for tries in range(3):
  try:r=requests.get(u,headers={'User-Agent':'Mozilla/5.0'}); print(q,r.status_code)
  except Exception as e:r=None
  if r and r.status_code==200:break
  time.sleep(15)
 out.append((q,r.status_code if r else 0,len(r.content) if r else 0,r.text[:150000] if r else '')); time.sleep(10)
json.dump({'status':'no-games'},open('scripts/raw_slate.json','w'));open('public/data.js','w').write('FETCHOUT='+json.dumps(out))
