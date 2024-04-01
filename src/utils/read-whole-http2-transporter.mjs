/**
 * @param {Http2Transport} dataTransport
 * @returns {Promise<Buffer>}
 * */
export const readWholeHttp2Transporter = (dataTransport) => {
    const chunks = [];
    let data;
    let currentLength = 0;
    dataTransport.startProcessingInput()
    return new Promise((resolve, reject) => {
        dataTransport.addListener("dataChunk", (chunk) => {
            chunks.push(chunk);
            currentLength += chunk.length;
        });
        dataTransport.addListener("error", (err) => {
            reject(err);
        })
        dataTransport.addListener("end", () => {
            data = Buffer.concat(chunks);
            resolve(data);
        })
    })
};
