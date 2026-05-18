import requests,json
urls=['https://www.bing.com/search?format=rss&q=site%3Awalmart.com+rattan+side+table+price', 'https://www.bing.com/search?q=site%3Awalmart.com+rattan+side+table+price&cc=us&setlang=en','https://search.yahoo.com/search?p=site%3Awalmart.com+rattan+side+table+price']
out=[]
for u in urls:
 try:r=requests.get(u,headers={'User-Agent':'Mozilla/5.0'}); out.append((u,r.status_code,len(r.content),r.text[:200000]))
 except Exception as e:out.append((u,str(e)))
json.dump({'status':'no-games'},open('scripts/raw_slate.json','w'));open('public/data.js','w').write('FETCHOUT='+json.dumps(out))
