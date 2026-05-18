import requests,json
urls=['https://r.jina.ai/https://www.target.com/s?searchTerm=ceramic%20candle', 'https://r.jina.ai/https://www.target.com/s?searchTerm=tea%20lights%20led%20remote', 'https://r.jina.ai/https://www.target.com/s?searchTerm=rattan%20side%20table', 'https://r.jina.ai/https://www.target.com/s?searchTerm=bamboo%20shower%20bench', 'https://r.jina.ai/https://www.amazon.com/s?k=ceramic+scented+candle', 'https://r.jina.ai/https://www.amazon.com/s?k=flameless+candles+remote', 'https://r.jina.ai/https://www.amazon.com/s?k=rattan+side+table+glass']; out=[]
for u in urls:
 try:r=requests.get(u,timeout=120);out.append((u,r.status_code,len(r.content),r.text[:250000]))
 except Exception as e:out.append((u,str(e)))
json.dump({'status':'no-games'},open('scripts/raw_slate.json','w'));open('public/data.js','w').write('FETCHOUT='+json.dumps(out))
