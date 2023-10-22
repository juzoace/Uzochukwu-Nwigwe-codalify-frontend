<template>
  <div id="app">
    <h1>YouTube Channel Finder</h1>
    <form @submit.prevent="fetchData">
      <div>
        
        <label for="channelName"></label>
        <input v-model="channelName" type="text" id="channelName" required />
      </div>
      <button type="submit" class="watch-video-button">Fetch Channel</button>
      <button type="button" @click="clearData" class="clear-button">Clear Data</button>
    </form>

    <div class="instruction">Type a name of a valid youtube channel. e.g google or game</div>

    <div v-if="isLoading">
      <Spinner />
    </div>

    <div id="channelContainer" v-if="channel">
      <div class="card">
        <h1 class="section-title">Channel Information</h1>
        <h2>{{ channel.channel_name }}</h2>
        <p>{{ channel.channel_description }}</p>
        <img :src="channel.channel_profile_picture" alt="Channel Profile" />
      </div>
    </div>

    <div v-if="videos.length > 0">
      <div id="video-section">
        <h1 class="section-title">Videos</h1>
        <div v-for="video in displayedVideos" :key="video.uuid" class="video-card">
          <h3 class="video-title">{{ video.title }}</h3>
          <p class="video-description">{{ video.description }}</p>
          <img :src="video.thumbnail" alt="Video Thumbnail" id="video-thumbnail" />
          <a :href="video.link" target="_blank" class="watch-video-button">Watch Video</a>
        </div>
        <button @click="paginate" :disabled="isLoadMoreDisabled" class="load-more-button">
          Load More
        </button>
        <div v-if="isNoMoreVideos" class="no-more-videos">No more videos to show</div>
      </div>
    </div>
    <div id="error" v-if="message">{{ message }}</div>
  </div>
</template>

<script>

import { syncYoutubeChannel } from './sync_youtube_channel';
import Spinner from './Spinner.vue';

export default {
  data() {
    return {
      channelName: "",
      channel: null,
      videos: [],
      displayedVideos: [],
      currentPage: 1,
      videosPerPage: 20,
      message: "",
      isLoading: false,
      isNoMoreVideos: false, // Added property to track no more videos
    };
  },
  computed: {
    isLoadMoreDisabled() {
      return this.isNoMoreVideos || this.displayedVideos.length === this.videos.length;
    },
  },
  components: {
    Spinner, 
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = true; 
        const { channel, videos } = await syncYoutubeChannel(this.channelName);
        this.channel = channel;
        this.videos = videos;
        this.displayedVideos = this.videos.slice(0, this.videosPerPage);
        this.currentPage = 1;
        this.message = "";
        this.isNoMoreVideos = false; // Reset no more videos flag
        this.isLoading = false;
      } catch (error) {
        console.error("There was an error:", error);
        this.message = "Error fetching data. Please use a valid channel name.";
        this.isLoading = false; // Stop loading on error
      }
    },
    paginate() {
      const nextPage = this.currentPage + 1;
      const startIndex = (nextPage - 1) * this.videosPerPage;
      const endIndex = startIndex + this.videosPerPage;
      const nextVideos = this.videos.slice(startIndex, endIndex);
      this.displayedVideos = [...this.displayedVideos, ...nextVideos]; // Append next videos
      this.currentPage = nextPage;

      if (nextVideos.length === 0) {
        this.isNoMoreVideos = true; // Set no more videos flag when there are no more to display
      }
    },
    clearData() {
      // Clear all data properties
      this.channelName = "";
      this.channel = null;
      this.videos = [];
      this.displayedVideos = [];
      this.currentPage = 1;
      this.message = "";
      this.isNoMoreVideos = false;
    },
  },
};
</script>

<style scoped>
/* ... (previous styles) ... */

.instruction{
  text-align: center;
}

.clear-button {
  background-color: #e53e3e;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
}

.clear-button:hover {
  background-color: #c53030;
}
</style>



<style scoped>


/* Extra Large Screens */
@media screen and (max-width: 1536px) {

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Additional global styles */
body {
  font-family: Arial, sans-serif;
}

  /* Your CSS styles for desktop screens go here */
  h1 {
    font-size: 3rem;
    display: flex;
    justify-content: center;
    padding: 1rem;
    background-color: #e74c3c;
    margin-bottom: 3rem;
  }

  #error {
  display: flex;
  align-items: center;
  justify-content: center;
}

  #channelName {
    padding: .6rem;
  }

  .section-title {
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    
    /* flex-direction: column; */
  }

  #app {
   
    height: 100vh;
    /* margin-top: -40px; */
  }

  #channelContainer {
    background-color:rgb(239, 244, 244);
  }

  .card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 100%; /* Adjust the maximum width as needed */
  text-align: center;
}

.card h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card h2 {
  font-size: 20px;
  margin: 10px 0;
}

.card p {
  font-size: 16px;
  color: #333;
}

.card img {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
}

#video-section {
  margin-top: 20px;
  padding: 20px;
  max-width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color:rgb(239, 244, 244);
}

#video-section h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  width: 100%;
}

.video-card {
  max-width: 24rem;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  padding: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.video-card:hover {
  transform: scale(1.05); /* Increase size on hover */
}


.video-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.video-description {
  margin: 2rem;
  font-size: 16px;
  color: #333;
}

#video-thumbnail {
  /* width: 50%; */
  margin: 2rem;
}

.watch-video-button {
  background-color: #3490dc;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
  margin: 2rem;
}
.watch-video-button:hover {
  background-color: #2779bd;
}

.section-title {
  /* color: #3498db; */
}

.load-more-button {
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  margin: 2rem;
}

.no-more-videos {
  color: #e74c3c;
}

}

/* Large Screens (Desktop) */
@media screen and (max-width: 1280px) {

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Additional global styles */
body {
  font-family: Arial, sans-serif;
}


  /* Your CSS styles for desktop screens go here */
  h1 {
    font-size: 3rem;
    display: flex;
    justify-content: center;
    padding: 1rem;
    background-color: #e74c3c;
    margin-bottom: 3rem;
  }

  #error {
  display: flex;
  align-items: center;
  justify-content: center;
}

  #channelName {
    padding: .6rem;
  }

  .section-title {
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    
    /* flex-direction: column; */
  }

  #app {
   
    height: 100vh;
    /* margin-top: -40px; */
  }

  #channelContainer {
    background-color:rgb(239, 244, 244);
  }

  .card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 100%; /* Adjust the maximum width as needed */
  text-align: center;
}

.card h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card h2 {
  font-size: 20px;
  margin: 10px 0;
}

.card p {
  font-size: 16px;
  color: #333;
}

.card img {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
}

#video-section {
  margin-top: 20px;
  padding: 20px;
  max-width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color:rgb(239, 244, 244);
}

#video-section h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  width: 100%;
}

.video-card {
  max-width: 24rem;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  padding: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.video-card:hover {
  transform: scale(1.05); /* Increase size on hover */
}


.video-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.video-description {
  margin: 2rem;
  font-size: 16px;
  color: #333;
}

#video-thumbnail {
  /* width: 50%; */
  margin: 2rem;
}

.watch-video-button {
  background-color: #3490dc;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
  margin: 2rem;
}
.watch-video-button:hover {
  background-color: #2779bd;
}

.section-title {
  /* color: #3498db; */
}

.load-more-button {
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}

.no-more-videos {
  color: #e74c3c;
}

}

/* Medium Screens (Laptop) */
@media screen and (max-width: 1024px) {

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Additional global styles */
body {
  font-family: Arial, sans-serif;
}

  /* Your CSS styles for desktop screens go here */
  h1 {
    font-size: 3rem;
    display: flex;
    justify-content: center;
    padding: 1rem;
    background-color: #e74c3c;
    margin-bottom: 3rem;
  }

  #error {
  display: flex;
  align-items: center;
  justify-content: center;
}

  #channelName {
    padding: .6rem;
  }

  .section-title {
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    
    /* flex-direction: column; */
  }

  #app {
   
    height: 100vh;
    /* margin-top: -40px; */
  }

  #channelContainer {
    background-color:rgb(239, 244, 244);
  }

  .card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 100%; /* Adjust the maximum width as needed */
  text-align: center;
}

.card h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card h2 {
  font-size: 20px;
  margin: 10px 0;
}

.card p {
  font-size: 16px;
  color: #333;
}

.card img {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
}

#video-section {
  margin-top: 20px;
  padding: 20px;
  max-width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color:rgb(239, 244, 244);
}

#video-section h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  width: 100%;
}

.video-card {
  max-width: 24rem;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  padding: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.video-card:hover {
  transform: scale(1.05); /* Increase size on hover */
}


.video-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.video-description {
  margin: 2rem;
  font-size: 16px;
  color: #333;
}

#video-thumbnail {
  /* width: 50%; */
  margin: 2rem;
}

.watch-video-button {
  background-color: #3490dc;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
  margin: 2rem;
}
.watch-video-button:hover {
  background-color: #2779bd;
}

.section-title {
  /* color: #3498db; */
}

.load-more-button {
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}

.no-more-videos {
  color: #e74c3c;
}

}

/* Small Screens (Tablet) */
@media screen and (max-width: 768px) {
  /* Your CSS styles for tablet screens go here */
  h1 {
    font-size: 2rem;
  }
}

/* Extra Small Screens (Mobile) */
@media screen and (max-width: 640px) {
  /* Your CSS styles for mobile screens go here */
  h1 {
    font-size: 1.5rem;
  }
}


</style>
