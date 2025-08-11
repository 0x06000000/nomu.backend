var a= await fetch('https://apis.data.go.kr/B490001/gySjbPstateInfoService/getEopjongSjBoheomTariffPyoPstateList?serviceKey=iaxjwmL9Hxpw3MSZ6XSYR0wcx1bWX0%2B18BmyAuILHPob%2BQjn%2FF%2BVt3sez2SsejjveYC0Ck%2B4EsAENKZ6JB2jTA%3D%3D&pageNo=1&numOfRows=10')

console.log(await a.text())