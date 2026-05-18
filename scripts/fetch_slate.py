import requests,json,os,base64
# fetch test
urls=["https://serpapi.com/search.json?engine=google_shopping&q=walmart%20rattan%20side%20table&api_key=60617fb4dcd0b1caf604c422b4908a90b384531fdf0be4b33a75f0df5b355417"]
out=[]
for u in urls:
 try:r=requests.get(u);out.append({'status':r.status_code,'text':r.text[:100000]})
 except Exception as e:out.append({'err':str(e)})
os.makedirs('scripts',exist_ok=True); json.dump({'status':'no-games'},open('scripts/raw_slate.json','w'))
os.makedirs('public',exist_ok=True);open('public/data.js','w').write('FETCHOUT='+json.dumps(out))
