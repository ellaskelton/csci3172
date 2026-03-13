# Lab 5 - Music Discovery

Music Discovery is a web application that lets users search for artists by name and view “similar” artist recommendations. 

* *Date Created*: 10 March 2026  
* *Last Modification Date*: 13 March 2026    
* *Lab Netlify URL*: <https://sprightly-valkyrie-573990.netlify.app/>
* *Lab Gitlab URL*: <https://git.cs.dal.ca/eskelton/csci3172>


## Authors

If what is being submitted is an individual Lab or Assignment, you may simply include your name and email address. Otherwise list the members of your group.

* [Ella](el423421@dal.ca) - (Author)


## Built With

* [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) - Markup language for structuring the Music Discovery pages  
* [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) - Styling for the responsive, dark-themed UI and layout  
* [JavaScript ES6](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Client-side logic (search form, quick picks, rendering results, Fetch API calls)  
* [Node.js](https://nodejs.org/) - Runtime for the Netlify Function backend  
* [Express](https://expressjs.com/) - Backend routing for the `/api/health`, `/api/search`, and `/api/related` endpoints  
* [Netlify](https://www.netlify.com/) - Hosting for the static frontend and serverless backend functions  
* [MusicBrainz Web Service](https://musicbrainz.org/doc/MusicBrainz_API) - Public API used to search artists and derive simple “related artist” suggestions  
* [Jest](https://jestjs.io/), [Supertest](https://github.com/ladjs/supertest), [JSDOM](https://github.com/jsdom/jsdom) - Testing libraries for backend and frontend unit tests  


## Unit Testing

**What was tested**

* **Backend API** (`tests/api.test.js`): The Express routes (`/api/health`, `/api/search`, `/api/related`) were tested. The MusicBrainz API was isolated by mocking `global.fetch` in Jest so that no real HTTP requests are made; tests only verify that the server returns the correct status codes and response shape (e.g. health returns `{ ok: true }`, search/related return 400 when required parameters are missing, and with mocked responses the mapping to `items` / artist fields works as expected). All backend tests passed; no errors needed to be addressed.
* **Frontend UI** (`tests/frontend.test.js`): The structure of `frontend/index.html` was tested using JSDOM (no browser or live server). Tests check that the search input, Search button, search form, results and related sections, hero quick-pick buttons, and error section with `role="alert"` are present. The frontend logic (e.g. fetch calls) was not run; only the static HTML was verified. All frontend structure tests passed.

**How components were isolated**

* Backend: The API was isolated from the real MusicBrainz service by mocking `fetch` in the test file; each test that needs a specific response uses `jest.spyOn(global, "fetch").mockResolvedValue(...)` and restores mocks in `afterEach` so tests do not depend on network or external APIs.
* Frontend: The HTML was loaded in a headless DOM (JSDOM) without loading the JavaScript or hitting any server, so the presence and attributes of key elements could be asserted in isolation.

**Outcome**

All unit tests pass (`npm test`). The components tested behaved as expected; no errors required fixing as a result of these tests.


## Sources Used

N.A


## Acknowledgments

* CSCI 3172, 2171, 1170 course materials for general web development concepts  
