import requests,json
out=[]
for u in ['https://r.jina.ai/https://www.walmart.com/ip/18549510136', 'https://r.jina.ai/https://www.walmart.com/ip/16439902839']:
 try:r=requests.get(u,timeout=200);out.append((u,r.status_code,len(r.content),r.text[:200000]))
 except Exception as e:out.append((u,str(e)))
json.dump({'status':'no-games'},open('scripts/raw_slate.json','w'));open('public/data.js','w').write('FETCHOUT='+json.dumps(out))