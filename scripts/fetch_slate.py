import requests,json,os
urls=['https://www.google.com/search?q=site%3Awalmart.com+rattan+side+table+price','https://www.bing.com/search?q=site%3Awalmart.com+rattan+side+table+price','https://duckduckgo.com/html/?q=site%3Awalmart.com+rattan+side+table+price','https://www.walmart.com/search?q=rattan+side+table','https://www.target.com/s?searchTerm=rattan%20side%20table','https://www.wayfair.com/keyword.php?keyword=rattan+side+table']
out=[]
for u in urls:
 try:r=requests.get(u,headers={'User-Agent':'Mozilla/5.0'}); out.append((u,r.status_code,str(r.url),len(r.content),r.text[:100000]));
 except Exception as e: out.append((u,str(e)))
json.dump({'status':'no-games'},open('scripts/raw_slate.json','w'));open('public/data.js','w').write('FETCHOUT='+json.dumps(out))
