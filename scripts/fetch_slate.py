import requests,json
urls=['https://www.amazon.com/s?k=rechargeable+tea+lights','https://www.amazon.com/s?k=rattan+side+table','https://www.amazon.com/s?k=bamboo+shower+bench']
out=[]
for u in urls:
 try:r=requests.get(u,headers={'User-Agent':'Mozilla/5.0'}); out.append((u,r.status_code,len(r.content),r.text[:300000]))
 except Exception as e: out.append((u,str(e)))
json.dump({'status':'no-games'},open('scripts/raw_slate.json','w'));open('public/data.js','w').write('FETCHOUT='+json.dumps(out))
