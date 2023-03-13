const utils = {
    isEqualObject(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    },
    either(thiis, that) {
        return thiis ? thiis : that
    },
    dateBeautify(date) {
        if(date === undefined){
            return "NA"
        }
        const dateSplit = date.split('T')
        if (dateSplit.length == 2) {
            const hour = dateSplit[1].split('.')
            if(hour.length == 2){
                return dateSplit[0] + " @ " + hour[0]
            }
            return "NA"
        }
        return "NA"
    },
    getMaxMinCoordinatesInterval(coordinates) {
        const numbers = coordinates.filter(elems => typeof elems === 'number')
        if (numbers.length !== 0) {
            return {
                minLat: numbers[0],
                maxLat: numbers[0],
                minLong: numbers[1],
                maxLong: numbers[1],
            }
        } else {
            return coordinates[0].reduce((prev, curr) => {
                if (Array.isArray(prev)) {
                    return {
                        minLat: Math.min(curr[0], prev[0]),
                        maxLat: Math.max(curr[0], prev[0]),
                        minLong: Math.min(curr[1], prev[1]),
                        maxLong: Math.max(curr[1], prev[1]),
                    }
                } else {
                    return {
                        minLat: Math.min(curr[0], prev.minLat),
                        maxLat: Math.max(curr[0], prev.maxLat),
                        minLong: Math.min(curr[1], prev.minLong),
                        maxLong: Math.max(curr[1], prev.maxLong),
                    }
                }
            })
        }
    }
}

export default utils;