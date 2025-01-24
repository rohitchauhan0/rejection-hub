import { addDoc, collection, getDocs, orderBy, query } from "firebase/firestore";

const { db } = require("@/config/firebase");


export const postData = async ({ formData, songName }) => {
    try {
        // Create a reference to the "posts" collection
        const postsCollection = collection(db, "posts");

        // Prepare data to be sent to Firestore
        const postData = {
            topic: formData.topic,
            message: formData.message,
            songName: songName,
            youtubeLink: formData.youtubeLink,
            createdAt: new Date(),
        };

        // Add the new post to Firestore
        await addDoc(postsCollection, postData);
    } catch (error) {
        console.error("Error adding post: ", error);
    }
};



export const getAllPosts = async () => {
    try {
        // Create a reference to the "posts" collection
        const postsCollection = collection(db, "posts");

        // Create a query to fetch posts ordered by the "createdAt" field (ascending)
        const postsQuery = query(postsCollection, orderBy("createdAt", "desc")); // "desc" for descending, "asc" for ascending

        // Fetch the posts using the query
        const querySnapshot = await getDocs(postsQuery);

        // Map through the results and extract data
        const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return posts;
    } catch (error) {
        console.error("Error fetching posts: ", error);
    }
};