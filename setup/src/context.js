import React, { useContext, useEffect, useReducer } from 'react';

import {
   SET_LOADING,
   SET_STORIES,
   REMOVE_STORY,
   HANDLE_PAGE,
   HANDLE_SEARCH,
} from './actions';
import reducer from './reducer';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?';

const initialState = {
   isLoading: true,
   hits: [],
   query: 'react',
   page: 0,
   nbPages: 0,
};
   
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
   const [state, dispatch] = useReducer(reducer, initialState);

   const fetchStories = async url => {
      dispatch({ type: SET_LOADING });

      try {
         const response = await fetch(url);
         const data = await response.json();

         dispatch({
            type: SET_STORIES,
            payload: { hits: data.hits, nbPages: data.nbPages },
         });
      } catch (error) {
         console.log(error);
      }
   };

   const removeStory = id => {
      dispatch({ type: REMOVE_STORY, payload: id });
   };

   const handleSearch = query => {
      dispatch({ type: HANDLE_SEARCH, payload: query });
   };

   const handlePage = value => {
      dispatch({ type: HANDLE_PAGE, payload: value });
   };

   useEffect(() => {
      fetchStories(`${API_ENDPOINT}query=${state.query}&page=${state.page}`);
   }, [state.query, state.page]);

   return (
      <AppContext.Provider
         value={{ ...state, removeStory, handleSearch, handlePage }}
      >
         {children}
      </AppContext.Provider>
   );
};

// make sure use
export const useGlobalContext = () => {
   return useContext(AppContext);
};

export { AppContext, AppProvider };

/*
Items
GET
http://hn.algolia.com/api/v1/items/:id

Sorted by relevance, then points, then number of comments
GET
http://hn.algolia.com/api/v1/search?query=...



let hits = {
   hits: [
      {
         created_at: '2014-08-01T18:59:15.000Z',
         title: 'Dan Ariely’s Timeful App Helps You Better Apply Your Time',
         url: 'http://recode.net/2014/07/31/dan-arielys-timeful-app-helps-you-better-apply-your-time/',
         author: 'mhb',
         points: 104,
         story_text: '',
         comment_text: null,
         num_comments: 37,
         story_id: null,
         story_title: null,
         story_url: null,
         parent_id: null,
         created_at_i: 1406919555,
         relevancy_score: 5470,
         _tags: ['story', 'author_mhb', 'story_8122171'],
         objectID: '8122171',
         _highlightResult: {
            title: {
               value: 'Dan \u003cem\u003eAriel\u003c/em\u003ey’s Timeful App Helps You Better Apply Your Time',
               matchLevel: 'full',
               fullyHighlighted: false,
               matchedWords: ['ariel'],
            },
            url: {
               value: 'http://recode.net/2014/07/31/dan-\u003cem\u003eariel\u003c/em\u003eys-timeful-app-helps-you-better-apply-your-time/',
               matchLevel: 'full',
               fullyHighlighted: false,
               matchedWords: ['ariel'],
            },
            author: { value: 'mhb', matchLevel: 'none', matchedWords: [] },
            story_text: { value: '', matchLevel: 'none', matchedWords: [] },
         },
      },
      ...
   ],
   nbHits: 7893,
   page: 0,
   nbPages: 50,
   hitsPerPage: 20,
   exhaustiveNbHits: true,
   exhaustiveTypo: true,
   query: 'ariel',
   params:
      'advancedSyntax=true\u0026analytics=true\u0026analyticsTags=backend\u0026query=ariel',
   renderingContent: {},
   processingTimeMS: 3,
};

*/
