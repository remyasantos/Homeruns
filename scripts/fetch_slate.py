import requests,json
urls=['https://r.jina.ai/https://www.walmart.com/search?q=bamboo+shower+bench','https://r.jina.ai/https://www.homedepot.com/s/rechargeable%20tealight','https://r.jina.ai/https://www.lowes.com/search?searchTerm=bamboo+shower+bench','https://r.jina.ai/https://www.wayfair.com/keyword.php?keyword=ceramic+candle','https://r.jina.ai/https://www.amazon.com/s?k=rechargeable+tea+lights','https://r.jina.ai/https://www.target.com/s?searchTerm=flameless+candle','https://r.jina.ai/https://www.houzz.com/products/query/rattan-side-table','https://r.jina.ai/https://www.lumens.com/search?q=rattan']
out=[]
for u in urls:
 try:r=requests.get(u,headers={'User-Agent':'Mozilla/5.0'},timeout=120); out.append((u,r.status_code,len(r.content),r.text[:300000]))
 except Exception as e: out.append((u,str(e)))
json.dump({'status':'no-games'},open('scripts/raw_slate.json','w'));open('public/data.js','w').write('FETCHOUT='+json.dumps(out))
