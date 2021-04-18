/**
 * Splits the full list of channels into smaller chunks of channels,
 * creating a two dimensional array.
 * @param channelChunkSize - the size of the chunks to join at a time. Keep join limits on Twitch in mind.
 * @param botChannels - the full json structure
 * including the channels to join under botChannels.joined_channels
 * @returns multi dimensional array containing the channelChunks. The chunks contains IRC keys e.g '#channel'
 */
exports.channelArraySplitter = async function (channelChunkSize, channelsArray) {
    const listOfChannelChunks = [];
    let chunkSize = channelChunkSize;
    let channelListLength = channelsArray.length;
    let channelsJoined = 0;
    let latestArrayBreak = 0;
    for (let i = 1; i< channelListLength; i++) {
        if (i % channelChunkSize === 0) {
            let splitArrayOfObjects = channelsArray.slice(latestArrayBreak,i);
            let chunkArray = [];
            let j = 0;
            while (channelChunkSize !== j) {
                let splitKey = splitArrayOfObjects[j];
                chunkArray.push(splitKey);
                j++;
            }
            channelsJoined += chunkSize;
            latestArrayBreak += chunkSize;
            listOfChannelChunks.push(chunkArray);
        }
        if (channelListLength - channelsJoined <= chunkSize) {
            let remainingCount = channelListLength - channelsJoined;
            let splitEndOfArray = channelsArray.slice(latestArrayBreak,channelListLength);
            let chunkArray = [];
            let k = 0;
            while (k < remainingCount) {
                let splitKey2 = splitEndOfArray[k];
                chunkArray.push(splitKey2);
                i = channelListLength;
                k++;
            }
            listOfChannelChunks.push(chunkArray);
        }
    }
    return listOfChannelChunks;
}