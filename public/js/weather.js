
function getForecast(){
	const latitude = 63.370;
	const longitude = 10.360;

	fetch("https://api.met.no/weatherapi/locationforecast/1.9/?lat="+latitude+"&lon="+longitude)
		.then(function (response){
			return response.text();
		}).then(function (res){
			let time = new Date();
			let tYear = time.getFullYear();
			let tMonth = time.getMonth() + 1;
			
			if (tMonth.toString().length == 1) {
				tMonth = "0" + tMonth;
			}
			let tDate = time.getDate();
			if (tDate.toString().length == 1) {
				tDate = "0" + tDate;
			}
			let tHour = time.getHours();
			if (tHour.toString().length == 1) {
				tHour = "0" + tHour;
			}

			let fullTimeDate = tYear + "-" + tMonth + "-" + tDate + "T" + tHour + ":00:00Z";
			
			if (window.DOMParser){
			    parser = new DOMParser();
			    xmlDoc = parser.parseFromString(res, "text/xml");
			}
			else{
			    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			    xmlDoc.async = false;
			    xmlDoc.loadXML(txt);
			}
			
			let x = xmlDoc.getElementsByTagName("time");

			for(let i = 0; i < x.length; i++){
				if (x[i].getAttribute('from') == fullTimeDate) {
					let tempEl = x[i].getElementsByTagName("temperature")[0];
					document.getElementById('temperature').innerHTML = tempEl.getAttribute("value");
					let humidEl = x[i].getElementsByTagName("humidity")[0];
					document.getElementById('humidity').innerHTML = humidEl.getAttribute("value");
					let cloudEl = x[i].getElementsByTagName("cloudiness")[0];
					document.getElementById('cloudiness').innerHTML = cloudEl.getAttribute("percent");
					let fogEl = x[i].getElementsByTagName("fog")[0];
					document.getElementById('fogginess').innerHTML = fogEl.getAttribute("percent");
					let lowCloudEl = x[i].getElementsByTagName("lowClouds")[0];
					document.getElementById('lowClo').innerHTML = lowCloudEl.getAttribute("percent");
					let mediumCloudEl = x[i].getElementsByTagName("mediumClouds")[0];
					document.getElementById('medClo').innerHTML = mediumCloudEl.getAttribute("percent");
					let highCloudEl = x[i].getElementsByTagName("highClouds")[0];
					document.getElementById('highClo').innerHTML = highCloudEl.getAttribute("percent");
					let windEl = x[i].getElementsByTagName('windSpeed')[0];
					document.getElementById('wind').innerHTML = windEl.getAttribute('mps');
					let windDir = x[i].getElementsByTagName('windDirection')[0];
					document.getElementById('windDirection').innerHTML = windDir.getAttribute('name');
					let rainEl = x[i+1].getElementsByTagName('precipitation')[0];
					document.getElementById('rain').innerHTML = rainEl.getAttribute('value');
					let symbolID = x[i+1].getElementsByTagName('symbol')[0];
					document.getElementById('symbol').setAttribute('src', 'https://api.met.no/weatherapi/weathericon/1.1?content_type=image%2Fpng&symbol=' + symbolID.getAttribute('number'));

					break;
				}
			}
		})
}

getForecast();

// function getTextForecast(){
	
// 	fetch("https://api.met.no/weatherapi/textforecast/2.0/?forecast=landoverview")
// 	.then(function(response){
// 		return response.text();		
// 	})
// 	.then(function(res) {
		
// 		if (window.DOMParser){
// 		    parser = new DOMParser();
// 		    xmlDoc = parser.parseFromString(res, "text/xml");
// 		}
// 		else{
// 		    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
// 		    xmlDoc.async = false;
// 		    xmlDoc.loadXML(txt);
// 		}

// 		console.log(xmlDoc);

// 		let x = xmlDoc.getElementsByTagName("location");
// 		for(let i = 0; i < x.length; i++){
// 			if (x[i].getAttribute('id') == "0504") {
// 				console.log(x[i]);
// 			}
// 		}
// 		// let y = x.childNodes[0];
// 		// let z = y.nodeValue;
// 		// let regex = /(?<=id="0504">).*/;
// 		console.log(x);
// 	})
// }

// getTextForecast();