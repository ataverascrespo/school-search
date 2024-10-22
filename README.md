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

### Deployment Instructions

If you want to deploy this for your own use, feel free to do so. I've set this project up in a way that deploying it is extremely easy (but most importantly, super cheap)

- For deploying the front-end application, I always recommend [Netlify](https://www.netlify.com/). It integrates right into your GitHub repos with automatic CI/CD, and costs $0.
- For deploying the back-end API, a cloud-hosted VM is the easiest way to get the API deployed. I recommend AWS EC2 (1 year of a t2.micro for free) or GCP Compute Engine (e2-micro instances are always free). Whichever VM you choose to use, you can [follow this guide I wrote for another project on my blog](https://blog.alextaverascrespo.ca/how-to-deploy-a-net-8-api-using-docker-aws-ec2-and-nginx#heading-configuring-our-ec2-instance) - the general steps should be the same regardless:
   - SSH into your VM
   - Install Git and Docker Engine
   - Clone this forked git repository onto your VM
   - `cd school-search/backend`, then run `docker build -t school-search .` to build the Docker image using the included Dockerfile
   - Next, run `sudo docker run -d -p 5000:5000 -v TDSB_lio.xlsx:/TDSB_lio.xlsx -e EXCEL_FILE_PATH=TDSB_lio.xlsx -e API_KEY=your_key school-search`. You can change the name of the mounted .xlsx file as necessary, and make sure to add your Google Directions API key.
   - Buy the cheapest domain you can find, and follow the above blog's instructions to configure NGINX as a reverse proxy and Certbot for HTTPS/SSL certification

If you follow all those steps, you'll have a deployed app! For reference, this app cost me a whole $1.16 CAD for the year ($0 webapp hosting, always free GCP VM, and $1.16 for the domain).
