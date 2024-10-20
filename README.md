# School Search 
I made this project for my partner, who is an Occasional Teacher in Toronto. 
 
There are so many schools in Toronto, that it can be hard to keep track of them all. This tool is designed to help search schools in Toronto, providing key school information and details that will help my partner make the best decision when picking jobs. 

This project is a TypeScript/React front-end application that interacts with a Python/Flask API back-end. The Flask API uses Pandas to search an Excel spreadsheet containing all of the relevant school information. 

## Features
- Search for schools, with various criteria (keywords, starting time)
- View key details for searched schools, and save them to a list
- Google Maps Directions API calculates travel times from your starting location via driving, transit and walking
- Integrated links to Google Maps and Apple Maps
- Responsive UI for easy use on mobile and desktop devices
- Uses local storage to store your data such as starting/home address and saved schools on your devices without an account

## Setup and Installation
### Prerequisites
Before installing the app, you'll need:

- Python3 on your machine
- A Google API key associated with the [Directions API](https://developers.google.com/maps/documentation/directions/overview).
    - _API is free under $200 of usage_
  
### Setup Guide
To set up a local installation of the app:

1. Clone the repository:
   ```bash
    git clone https://github.com/ataverascrespo/school-search.git
    ```
   
2. In the cloned repository, download the Python dependencies needed to run the back-end Flask API:
    ```bash
    cd backend
    pip install -r requirements.txt
     ```

3. Create a .env file in the /backend subdirectory with your Google API key stored in an `API_KEY` variable

4. The Flask API can be run with the command:
    ```bash
    python3 app.py
    # or
    flask run 
     ```

5. Download the dependencies needed to run the front-end
   ```bash
    cd frontend
    npm install
     ```

6. Create a .env file in the /frontend subdirectory with your Flask API URL key stored in an `VITE_API_URL` variable _(i.e localhost:5000)_

7. The TypeScript/React app can be run with the command:
    ```bash
    npm run dev
     ```
8. If you'd like to make changes to the Excel spreadsheet (like changing school boards), you'll have to:

   - Create a spreadsheet with the names of all your schools. Give them unique keys (i.e UUIDs) and add any other important info
   - Save the spreadsheet in the /backend directory with any name
   - Make whatever changes necessary to the API JSON return/ingestion in both `backend/app.py` and `frontend/src/models/schoolResult.ts`
