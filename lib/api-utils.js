// {
//     "copyright": "Wah!",
//     "date": "2006-01-10",
//     "explanation": "Venus goes through phases.  Just like our Moon, Venus can appear as full as a disk or as a thin as a crescent.  Venus, frequently the brightest object in the post-sunset or pre-sunrise sky, appears so small, however, that it usually requires binoculars or a small telescope to clearly see its current phase.  The above time-lapse sequence, however, was taken over the course of many months and shows not only how Venus changes phase but how it's apparent angular size also changes.  In the middle negative image, Venus is in a new phase, the same phase that occurred during its rare partial eclipse of the Sun in 2004.",
//     "title": "The Phases of Venus",
//     "url": "https://apod.nasa.gov/apod/image/0601/venusphases_wah.gif"
// }

function mungeApod(data) {
  return data.filter(item=>item.media_type === 'image').map(item => {
    return {
      copyright: item.copyright,
      date: item.date,
      explanation: item.explanation,
      title: item.title,
      url: item.url
      
    };
  });
}

function mungeLocation(data) {
	const city = data[0];
	return {
		name: city.display_name,
		lat: city.lat,
		lon: city.lon,
	};
}

function mungeLookup(data) {
	return {
		name: data.target.name,
		referenceOrg: data.service.name,
		referenceLink: data.service.href,
		ra: data.ra.h + ':' + data.ra.m + ':' + data.ra.s,
		dec: data.dec.d + ':' + data.dec.m + ':' + data.dec.s,
		galacticCords: `${data.galactic.lat}, ${data.galactic.lon}`,
		image: data.image.src,
		category: data.category.avmdesc,
	};
}

module.exports = {
	mungeApod,
	mungeLocation,
	mungeLookup,
};
