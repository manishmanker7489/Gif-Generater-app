// giphySearch.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';



// import { redirect } from "next/navigation";


// Define the Gif type
const Gif = {
  id: "",
  url: "",
  title: "",
};

// GiphySearch component
const GiphySearch = () => {

  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession = sessionStorage.getItem('user');

  console.log({user})
 
  if (!user && !userSession){
    router.push('/sign-up')
  }


  const [query, setQuery] = useState(""); // State for the search query
  const [gifs, setGifs] = useState([]); // State for storing fetched gifs
  const [offset, setOffset] = useState(0); // State for paginating gifs
  const limit = 3; // Number of gifs per page
  

  const GIPHY_API_KEY = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65";

  const GIPHY_API_URL = "https://api.giphy.com/v1/gifs/search";

  // Function to fetch gifs from Giphy API
  const searchGifs = async (url) => {

    try {
      const response = await axios.get(url, {
        params: {
          api_key: GIPHY_API_KEY,
          q: query,
          offset,
        },
      });

      // Process the response data and update the state
      const newGifs = response.data.data.map((gif) => ({
        id: gif.id,
        url: gif.images.fixed_height.url,
        title: gif.title,
      }));

      if (offset === 0) {
        setGifs(newGifs);
      } else {
        setGifs((prevGifs) => [...prevGifs, ...newGifs]);
      }
    } catch (error) {
      console.error("Oops, Something went wrong!", error);
    }
  };

  // Effect to fetch gifs when the query or offset changes
  
  useEffect(() => {
    if (query !== "") {
      searchGifs(GIPHY_API_URL);
    }
  }, [query, offset]);

  // Function to handle search button click
  const handleSearch = () => {
    setOffset(0);
    searchGifs(GIPHY_API_URL);
  };

  // Function to handle next button click
  const handleNext = () => {
    setOffset(offset + limit);
  };

  // Function to handle previous button click
  const handlePrevious = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  // Function to handle sign out
  const handleSignOut = async () => {
    await signOut();
    redirect("/signin");
  };

  // JSX structure for the component
  return (
    
    <>
      {/* Background divs */}
 

        <div class="bg-all">
                <div class="culd"></div>
                <div class="culd"></div>
                <div class="culd"></div>
                <div class="culd"></div>
                <div class="culd"></div>
            </div>
      

      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8">


        {/* Search input and button */}
        <div className="max-w-4xl w-full space-y-8 p-8 bg-gray-100 rounded-lg shadow-md">
          <div className="flex justify-between">
            <div className="relative flex-grow">
              
              <input
                type="text"
                placeholder="Search for GIFs"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full rounded-lg border-gray-300 bg-gray-100 py-2 px-4 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              />

              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 bottom-0 px-4 py-2 bg-black text-white rounded-r-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Search 🔍
              </button>
            </div>
          </div>

          {/* Display searched gifs */}
          <div className="flex flex-wrap justify-center rounded-lg overflow-hidden">
            {gifs.slice(offset, offset + limit).map((gif) => (
              <img
                key={gif.id}
                src={gif.url}
                alt={gif.title}
                className="w-1/3 p-3 rounded-2xl"
              />
            ))}
          </div>

          {/* Pagination buttons */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handlePrevious}
              disabled={offset === 0}
              className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow-sm disabled:opacity-40 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mr-2"
            >
              ⬅️ Previous
            </button>
            <button
              onClick={handleNext}
              disabled={offset + limit >= gifs.length}
              className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow-sm disabled:opacity-40 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Next ➡️
            </button>
          </div>
        </div>

        {/* Logout button */}
        {/* <button
          className="text-white mt-4 bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg"
          onClick={handleSignOut}
        >
          Logout
        </button> */}


        <button className="text-white mt-4 bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg"
         onClick={() => {
          router.push('/sign-up')
        signOut(auth)
        sessionStorage.removeItem('user');
        
        }}>
        Log out
      </button>

        {/* Footer */}
        <footer>
          <h5>
            <b>
              Designed  with{"❤️"}
               by{" "}
              <a href="https://www.linkedin.com/in/manishmanker/" target="_blank">
                Manish Manker
              </a>
            </b>
          </h5>
        </footer>
      </div>
    </>
    
  );
};

export default GiphySearch;