import requests,json
urls=['https://www.homedepot.com/p/ESILOO-Round-Rattan-Side-Table-Foldable-Outdoor-Wicker-Table-with-Tempered-Glass-Top-for-Patio-Garden-Balcony-Brown-ESDB0223/336127740', 'https://www.lowes.com/pd/Zyerch-Natural-Bamboo-Shower-Bench-220LBS-Capacity-with-Storage-Shelf-Waterproof-Indoor-Outdoor-Bath-Stool-Step-Stool/5018361503', 'https://www.wayfair.com/outdoor/pdp/wildon-home-bonia-wicker-rattan-side-table-with-built-in-glass-w010484423.html', 'https://www.lumens.com/gabriella-side-table-by-woven-WOVP556703.html', 'https://www.houzz.com/products/query/rattan'];out=[]
for u in urls:
 try:r=requests.get(u,headers={'User-Agent':'Mozilla/5.0 (X11; Ubuntu) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36','Accept-Language':'en-US,en;q=0.9'});out.append((u,r.status_code,len(r.content),r.text[:400000]))
 except Exception as e:out.append((u,str(e)))
json.dump({'status':'no-games'},open('scripts/raw_slate.json','w'));open('public/data.js','w').write('FETCHOUT='+json.dumps(out))
