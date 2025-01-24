"use client";
import { songmodel } from '@/config/gemini';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaCross } from "react-icons/fa";
import { postData } from '@/controllers/PostData';
import { ImCross } from "react-icons/im";

const PostModal = ({ setshowModal }) => {
    const [formData, setformData] = useState({ topic: "", message: "", song: "", youtubeLink: "" });
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef(null);
    const [playerReady, setPlayerReady] = useState(false);
    const [songName, setsongName] = useState("");
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [songSuggested, setSongSuggested] = useState(false); 
    useEffect(() => {
        if (window.YT) return;
        const script = document.createElement('script');
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
        window.onYouTubeIframeAPIReady = () => {
            setPlayerReady(true);
        };
    }, []);

    useEffect(() => {
        if (formData.youtubeLink && playerReady) {
            const videoId = new URL(formData.youtubeLink).searchParams.get("v");
            if (videoId && window.YT) {
                if (!playerRef.current) {
                    playerRef.current = new window.YT.Player('youtube-player', {
                        height: '0',
                        width: '0',
                        videoId,
                        events: {
                            onReady: () => {
                                setIsPlaying(true);
                                playerRef.current.playVideo();
                            },
                            onStateChange: handlePlayerStateChange,
                        },
                    });
                } else {
                    playerRef.current.loadVideoById(videoId);
                }
            }
        }
    }, [formData.youtubeLink, playerReady]);

    const suggestSong = async () => {
        setLoading(true);
        try {
            const prompt = `Mujhe ek Hindi song chahiye jo is mood ko perfectly reflect kare: "${formData.message}". Sirf ek song ka naam chahiye jo iss situation (like heartbreak, betrayal, sadness, etc.) se match kare.`;
            const response = await songmodel.sendMessage(prompt);
            const data = await response.response?.text();
            searchYouTube(data.trim());
            setsongName(data.trim());
            setSongSuggested(true);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const searchYouTube = async (songName) => {
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${songName}&type=video&key=${apiKey}`;
        try {
            const result = await axios.get(url);
            const videoId = result.data.items[0]?.id?.videoId;
            if (videoId) {
                const youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;
                setformData({ ...formData, youtubeLink });
            }
        } catch (error) {
            console.error('Error searching YouTube:', error);
        }
    };

    const handlePlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
        } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
        }

        if (event.data === window.YT.PlayerState.PLAYING) {
            setInterval(() => {
                if (playerRef.current) {
                    const currentTime = playerRef.current.getCurrentTime();
                    const duration = playerRef.current.getDuration();
                    setCurrentTime(currentTime);
                    setDuration(duration);
                }
            }, 1000);
        }
    };

    const handlePlayPause = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const seekTo = (x / rect.width) * duration;
        playerRef.current.seekTo(seekTo);
    };



    const suggestNextSong = () => {
        suggestSong(); 
    };


    return (
        <div className='fixed top-0 left-0 lg:px-0 px-2 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-lg inset-0 z-[10000]'>
            <div className='lg:w-1/3 w-full flex flex-col gap-5 rounded-lg bg-gray-300 z-30 py-10 px-6'>
            <div className='flex justify-end'>
                <ImCross className=' text-gray-600 cursor-pointer hover:text-red-600 transition-all duration-300 -mt-7' size={20} onClick={() => setshowModal(false)} />
            </div>
                <div className='flex items-center justify-center px-4'>
                    <Image src="/logo.png" alt="logo" width={50} height={50} />
                    <p className='text-3xl font-bold uppercase'>Add a post</p>
                </div>
                <div className='flex items-center justify-center w-full'>
                    <div className='flex flex-col gap-3 w-full'>
                        <input
                            type="text"
                            placeholder='Topic (Crush birthday)'
                            className='p-2 rounded-md'
                            onChange={(e) => setformData({ ...formData, topic: e.target.value })}
                        />
                        <textarea
                            type="text"
                            placeholder='Message'
                            className='p-2 rounded-md min-h-52'
                            onChange={(e) => setformData({ ...formData, message: e.target.value })}
                        />
                    </div>
                </div>

                {formData.youtubeLink && (
                    <div className="flex justify-center">
                        <div id="youtube-player"></div>
                    </div>
                )}

                {formData.youtubeLink && (
                    <div
                        className="w-full bg-gray-200 rounded-md h-2 relative cursor-pointer"
                        onClick={handleSeek}
                    >
                        <div
                            className="bg-red-500 h-2 rounded-md"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        ></div>
                    </div>
                )}

                <div className='flex justify-between items-center gap-3'>
                   {
                    songName &&  <p className='text-center'>{songName.slice(1, 20)}....</p>
                   }
                    {formData.youtubeLink && (
                        <div className="flex justify-center ">
                            <button
                                onClick={handlePlayPause}
                                className="bg-green-500 text-white px-4 py-2 rounded-md "
                            >
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                        </div>
                    )}
                </div>

                {formData.youtubeLink && (
    <div className="flex justify-center">
        <button
            onClick={suggestNextSong}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
            Suggest Next Song
        </button>
    </div>
)}


                {songSuggested ? (
                    <div className="flex justify-center">
                        <button
                            onClick={() => postData({ formData, songName,  }) && setshowModal(false)}
                            className="bg-red-600 text-white p-2 rounded-md flex items-center justify-center"
                        >
                            Post This
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <button
                            onClick={suggestSong}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loader">Loading...</span>
                            ) : (
                                "Suggest a Song"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostModal;
