export const url = 'http://127.0.0.1:8000/api/message/publish'

export function getFormDataFromData(data) {
    const formData = new FormData();
    for (let dataKey in data) {
        if (dataKey === 'payload') {
            for (let payloadKey in data[dataKey]) {
                const dataItem = !Array.isArray(data[dataKey][payloadKey])
                    ? data[dataKey][payloadKey]
                    : JSON.stringify(data[dataKey][payloadKey])

                formData.append(`payload[${payloadKey}]`, dataItem);
            }
        }

        if (dataKey !== 'payload') {
            formData.append(dataKey, data[dataKey]);
        }
    }

    return formData
}
