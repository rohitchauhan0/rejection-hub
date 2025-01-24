"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./_components/Navbar";
import { getAllPosts } from "@/controllers/PostData";
import { FaPlay, FaPause } from "react-icons/fa";
import Image from "next/image";
import ReactPlayer from "react-player";

const Page = () => {
  const [postData, setPostData] = useState([]);
  const [playingSong, setPlayingSong] = useState(null); // to track the currently playing song
  const [progress, setProgress] = useState(0); // to track the progress of the song
  const [player, setPlayer] = useState(null); // to store the player instance for controlling play/pause
  const [duration, setDuration] = useState(0); // to store the song duration

  // Handle play/pause functionality
  const handlePlayPause = (songName, youtubeLink) => {
    if (playingSong === songName) {
      setPlayingSong(null); // If the same song is clicked, pause it
    } else {
      setPlayingSong(songName); // Set the new song as playing
    }
  };

  // Handle progress bar update
  const handleProgress = (state) => {
    setProgress(state.played * 100); // Update progress bar based on current played time
    setDuration(state.loaded * 100); // Update duration of the song
  };

  // Handle seek functionality
  const handleSeek = (event) => {
    if (player) {
      const newTime = (event.target.value / 100) * player.getDuration(); // Calculate new time based on the progress bar value
      player.seekTo(newTime); // Seek to the new time
    }
  };

  // Fetch posts data from API
  useEffect(() => {
    const getPost = async () => {
      try {
        const posts = await getAllPosts();
        setPostData(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    getPost();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-black">
      <Navbar />
      <div className="w-full max-w-screen-sm mx-auto flex items-center justify-between p-5 flex-col space-y-5">
        {postData.map((post) => {
          return (
            <div
              className="bg-gradient-to-r from-blue-400 via-blue-500  to-red-700 p-6 rounded-lg shadow-lg w-full mx-auto flex flex-col items-center"
              key={post.id}
            >
              {/* Top section: Logo and User */}
              <div className="flex items-center justify-between w-full mb-4">
                <div className="flex items-center gap-2">
                  <Image src="/logo.png" alt="logo" width={40} height={40} />
                  <p className="text-white font-semibold text-lg">Anonymous user</p>
                </div>
                <p className="text-white text-sm font-light">
                  {post?.createdAt
                    ? new Date(post?.createdAt.seconds * 1000).toLocaleString()
                    : "Loading..."}
                </p>
              </div>

              {/* Music Section */}
              <div className="w-full flex items-center justify-between bg-black rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 w-1/2">
                  <p className="text-white font-medium">{post?.songName}</p>
                  {/* Play/Pause button */}
                  <button
                    onClick={() => handlePlayPause(post?.songName, post?.youtubeLink)}
                    className="text-white p-2 rounded-full bg-blue-600 hover:bg-blue-500"
                  >
                    {playingSong === post?.songName ? <FaPause /> : <FaPlay />}
                  </button>
                </div>
                {/* Progress Bar */}
                {/* Progress Bar */}
                {playingSong === post?.songName && (
                  <div className="w-1/2 mt-2 relative">
                    {/* Played portion (red) */}
                    <div
                      className="absolute top-0 left-0 h-1 bg-red-500"
                      style={{ width: `${progress}%` }} // Set width based on progress
                    />
                    {/* Unplayed portion (white) */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      className="w-full h-1 bg-white rounded-md cursor-pointer"
                      onChange={handleSeek} // Add functionality to seek through the song
                    />
                  </div>
                )}

              </div>

              {/* YouTube Player (hidden video, only controls visible) */}
              {playingSong === post?.songName && (
                <div className="w-full">
                  <ReactPlayer
                    ref={(playerInstance) => setPlayer(playerInstance)}
                    url={post?.youtubeLink}
                    playing={playingSong === post?.songName}
                    controls={true}
                    width="100%"
                    height="0" // Hide the video, only controls are visible
                    onProgress={handleProgress} // Update progress
                  />
                </div>
              )}

              {/* Message & Topic Section */}
              <div className="w-full mt-4 text-white">
                <p className="text-xl underline font-semibold">{post?.topic}</p>
                <p className="text-base mt-2">{post?.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
