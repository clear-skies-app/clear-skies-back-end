# Clear Skies Server | [Live App](https://clear-skies.netlify.app/)

# Description
Clear Skies is an app designed by amateur astronomers eager to help other budding astronomers explore the vast expanse of our universe. We strive to make the app as user-friendly as possible and provide useful tips throughout to help guide new astronomers on their star-gazing adventures.

The name of our app was inspired by the colloquial sign-off amongst the astronomy community. By saying "Clear Skies" you are wishing for the other astronomers to have a clear view of the skies when they go out stargazing.

Visitors can browse various high-definition photos from NASA's Astronomy Picture of the Day, create their own account to plan their own star-gazing adventure, store their personal observations to their own catalog to keep track of their progress, and even get a personalized virtual sky map displayed for their location.

# External APIs
We used several different APIs throughout our app to help generate unique, informative, and picturesque content for the most immersive experience. The APIs that we've utilized are listed below:

-   [NASA APOD](https://apod.nasa.gov/apod/astropix.html)
-   [LocationIQ](https://locationiq.com/)
-   [lookUP](https://www.strudel.org.uk/lookUP/)
-   [VirtualSky](https://virtualsky.lco.global/)
-   [WikiMedia](https://api.wikimedia.org/)

# Example Calls
| Request 	| Endpoint              	| Params                       	| Restricted (token)            	| External               	|
|---------	|-----------------------	|------------------------------	|-------------------------------	|------------------------	|
| GET     	| /apod                 	| count, API_Key               	| No                            	| [NASA APOD](https://apod.nasa.gov/apod/astropix.html)            	|
| GET     	| /api/lat-lon          	| city, API_Key                         	| Yes, token required 	| [LocationIQ](https://locationiq.com/)           	|
| POST    	| /api/observations     	| name, image, notes, userID   	| Yes, token required           	| N/A - Internal                      	|
| GET     	| /api/observations     	| userID                       	| Yes, token required           	| N/A - Internal                       	|
| PUT     	| /api/observations/:id 	| notes, userID, observationId 	| Yes, token required           	| N/A - Internal                       	|
| DELETE  	| /api/observations/:id 	| observationId, userID        	| Yes, token required           	| N/A - Internal                       	|
| GET     	| /api/lookup           	| objName                      	| Yes, token required           	| [lookUP](https://www.strudel.org.uk/lookUP/) and [WikiMedia](https://api.wikimedia.org/) 	|

# Technologies Used
- React
    - React Bootstrap 
    - react-cookies
    - react-image-gallery
    - react-router-dom
- Node + Express
- JavaScript
- HTML5/CSS3
- PostgreSQL
- Heroku/Netlify

# The Team Behind Clear Skies

-   Julianne Vela
    -   [GitHub](https://www.github.com/julianne-vela) | [LinkedIn](https://www.linkedin.com/in/juliannevela/) | [Porfolio](https://www.juliannevela.dev) (in-progress) | [Twitter](https://www.twitter.com/NessimaSkye)
-   Cameron Zimmerman
    -   [GitHub](https://github.com/CameronZimmerman) | [LinkedIn](https://www.linkedin.com/in/cameron-zimmerman/) | [Twitter](https://twitter.com/CameronZimmer20)
-   Lori Winston
    -   [GitHub](https://github.com/LoriWinston) | [LinkedIn](https://www.linkedin.com/in/loriwinston/) | [Twitter](https://twitter.com/LoriWinston8)
-   Jake Thrasher
    -   [GitHub](https://github.com/jakethrasher) | [LinkedIn](https://www.linkedin.com/in/m-jake-thrasher/) | [Twitter](https://twitter.com/mjakethrasher)

# License
#### Copyright (c) 2021 _**Julianne Vela,**_ _**Jake Thrasher,**_ _**Lori Winston,**_ _**Cameron Zimmerman**_ 
