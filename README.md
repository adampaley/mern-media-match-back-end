# Media Match App (Back End)
This repository contains the back-end code for **Media Match**, a MERN stack app that helps users build a game library based on their preferences, with future support for other media. It offers a simple interface for discovering new content.  

Developing this app allowed our team to showcase full CRUD capabilitiy while working with both embedded and referenced data. We were also able to implement a third-party API fetch to get product data for our users.


## The Development Team
- Adam Paley: [GitHub](https://github.com/adampaley), [LinkedIn](https://www.linkedin.com/in/adampaley/)
- Ryan Deist: [GitHub](https://github.com/ryandeist), [LinkedIn](https://www.linkedin.com/in/ryantdeist/)
- Matt Hurst: [GitHub](https://github.com/mhurst66), [LinkedIn](https://www.linkedin.com/in/matthew-hurst-85627b56/)

## Overview
- This Express API powers the [Media Match React](https://github.com/adampaley/mern-media-match-front-end) front end for rendering and integrates with the [IGDB API](https://api-docs.igdb.com/#getting-started) for game data.  
- It features basic JWT authorization for protected routes, including validation to prevent incorrect credentials and duplicate accounts.  
- The ERD consists of five schemas, demonstrating one-to-one, one-to-many, and many-to-many relationships.  
- Controller functions are structured to handle CRUD operations for each data type.  
- User data, including settings, cart, and purchases, persist after sign-out.  


[**Deployed App**](https://media-match.netlify.app/)

[**Front-End Repo**](https://github.com/adampaley/mern-media-match-front-end)

[**IGDB API**](https://api-docs.igdb.com/#getting-started)

## ERD Diagrams
![ERD Diagram](public/video-games/genres/images/ERD-Relationships.png)

## Planning Materials:
- [Trello Board](https://trello.com/b/a6q0CveD/mediamatch)
- [Excalidraw](https://excalidraw.com/#room=e85b8168469433527c79,5qeao3pG57lc7VZd0PgBRg)

## Built with:
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-%23F04D35?style=for-the-badge&logo=mongoosedotws&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-%235FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23000000?style=for-the-badge)
![Heroku](https://img.shields.io/badge/heroku-%23430098?style=for-the-badge)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

## Next Steps:
- Integrate Stripe Purchase Workflow
- Add Books, TV, Music, and Movies to available products.
- Social Network Functionality (Friend Feed, Friend List, Like/Dislike)
- Unit Testing 