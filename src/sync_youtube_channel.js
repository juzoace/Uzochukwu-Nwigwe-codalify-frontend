export async function syncYoutubeChannel(channelName) {

    
    const apiUrl = process.env.VUE_APP_API_BASE_URL;
   
    const YOUTUBE_API_KEY = 'AIzaSyBOxsjNmhHPvRYRVXAx3BXmA7-YtlVWamQ'
      

    const localResponse = await fetch(`${apiUrl}/api/youtube/${channelName}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
        console.log(localResponse)
        if (localResponse.status === 200) {
           
            // Parse the JSON response to extract the data
            const backendData = await localResponse.json();

            // Return the data to the calling function or handle it accordingly
            console.log(backendData);
            return backendData;
         
        } else if (localResponse.status === 404) {
            
            const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?key=${YOUTUBE_API_KEY}&forUsername=${channelName}&part=snippet`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log(channelResponse);

            const channelDataJson = await channelResponse.json();
            
            // Check if channel data is found
            if (channelDataJson.pageInfo.totalResults > 0) {
                
                const channelId = channelDataJson.items[0].id;
                
                const videosApiUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet&type=video&maxResults=100`;

                const videosResponse = await fetch(videosApiUrl);

                const videoData = await videosResponse.json();

                if (videosResponse.status !== 200) {
                    console.error("No videos found for the provided channel.");
                }

                const dataToSend = {
                    channel_info: channelDataJson.items[0],
                    videos: videoData.items
                };

                // console.log(dataToSend.videos);

                const backendResponse = await fetch(`${apiUrl}/api/youtube`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });

                // const responseAf = await backendResponse.json();

                // console.log(backendResponse);

                if (backendResponse.status === 200) {
                    console.log("Data sent successfully!");
                    console.log(dataToSend);
                    return dataToSend;
                } else {
                    console.error("Error sending data to backend.");
                }

            } else {

                throw new Error(`Channel  doesn't exist`)

            }
        }
}
