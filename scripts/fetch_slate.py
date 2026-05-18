import requests,json
urls=['https://www.walmart.com/ip/499164167','https://www.walmart.com/ip/Acadia-Rattan-Side-Table/2344233304','https://r.jina.ai/https://www.walmart.com/ip/499164167','https://r.jina.ai/http://www.walmart.com/ip/499164167','https://r.jina.ai/https://www.amazon.com/dp/B0TEST','https://r.jina.ai/https://www.google.com/search?q=site:walmart.com+499164167+price']
out=[]
for u in urls:
 try:r=requests.get(u,headers={'User-Agent':'Mozilla/5.0'}); out.append((u,r.status_code,len(r.content),r.text[:100000]))
 except Exception as e:out.append((u,str(e)))
json.dump({'status':'no-games'},open('scripts/raw_slate.json','w'));open('public/data.js','w').write('FETCHOUT='+json.dumps(out))
