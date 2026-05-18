import requests,json
urls=['https://www.google.com/search?q=homedepot+336127740+price&hl=en&gbv=1', 'https://www.google.com/search?udm=28&q=homedepot+336127740', 'https://www.google.com/search?tbm=shop&q=homedepot+336127740', 'https://www.bing.com/shop?q=homedepot+336127740', 'https://www.bing.com/search?format=rss&q=homedepot+336127740+price', 'https://search.yahoo.com/search?p=homedepot+336127740+price', 'https://html.duckduckgo.com/html/?q=homedepot+336127740', 'https://lite.duckduckgo.com/lite/?q=homedepot+336127740', 'https://www.ecosia.org/search?q=homedepot+336127740', 'https://search.brave.com/search?q=homedepot+336127740'];out=[]
for u in urls:
 try:r=requests.get(u,headers={'User-Agent':'Mozilla/5.0'},timeout=120);out.append((u,r.status_code,len(r.content),r.text[:200000]))
 except Exception as e:out.append((u,str(e)))
json.dump({'status':'no-games'},open('scripts/raw_slate.json','w'));open('public/data.js','w').write('FETCHOUT='+json.dumps(out))
