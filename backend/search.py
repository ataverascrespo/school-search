from flask import Flask, request, jsonify
import pandas as pd
import os
import time
import requests
import re
from dotenv import load_dotenv
from datetime import datetime, timedelta

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

def search_school_rank(file_path, search_term):
    # Load the Excel file
    df = pd.read_excel(file_path)
    school_name_column = 'School Name'
    rank_column = 'LOI 2023\nRank' 

    if school_name_column not in df.columns or rank_column not in df.columns:
        print("Required columns are not present in the Excel file.")
        return

    # Filter rows where 'School Name' contains the search term
    matches = df[df[school_name_column].astype(str).str.contains(search_term, case=False, na=False)]
    
    return matches


def find_school_address(school_name):
    api_key = os.getenv('API_KEY')
    
    # URL for Places API search
    search_url = f'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={school_name}&inputtype=textquery&fields=formatted_address&key={api_key}'
    
    response = requests.get(search_url)
    results = response.json()

    if results['status'] == 'OK':
        school_address = results['candidates'][0]['formatted_address']
        return school_address
    else:
        print("Error finding school address:", results['status'])
        return None


def calculate_travel_times(start_address, destination_address):
    # Get the API key from environment variables
    api_key = os.getenv('API_KEY')
    
    travel_modes = ['walking', 'transit', 'driving']
    travel_times = {}

    print("hello")
    tomorrow = datetime.now() + timedelta(days=1)
    desired_time = tomorrow.replace(hour=9, minute=0, second=0, microsecond=0)
    print(desired_time)
    # Convert the desired time to a Unix timestamp (seconds since epoch)
    departure_time = int(time.mktime(desired_time.timetuple()))
    print(departure_time)

    for mode in travel_modes:
        # URL for Directions API with the specified travel mode
        directions_url = f'https://maps.googleapis.com/maps/api/directions/json?origin={start_address}&destination={destination_address}&mode={mode}&departure_time={departure_time}&key={api_key}'
        
        response = requests.get(directions_url)
        results = response.json()
        
        if results['status'] == 'OK':            
            if mode == 'driving':
                # Retrieve duration in traffic for driving mode
                duration_in_traffic = results['routes'][0]['legs'][0]['duration_in_traffic']['text']
                travel_times[mode] = duration_in_traffic
            else:
                duration = results['routes'][0]['legs'][0]['duration']['text']
                travel_times[mode] = duration

    # Return a tuple of the times (driving, walking, transit)
    return (travel_times.get('driving'), travel_times.get('walking'), travel_times.get('transit'))


def generate_maps_url(start_address, school_name, school_address):
    postal_code_pattern = r'[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d'
    # Replace postal codes with an empty string
    start_address = re.sub(postal_code_pattern, '', start_address)
    school_address = re.sub(postal_code_pattern, '', school_address)

    # Trim all whitespace from address strings
    start_address = "".join(start_address.split())
    school_address = "".join(school_address.split())
    school_name = "".join(school_name.split())

    # Generate the URLs
    google_url = f'https://www.google.com/maps/dir/?api=1&origin={start_address}&destination={school_name}&travelmode=best'
    apple_url = f'http://maps.apple.com/?saddr={start_address}&daddr=S{school_address}'
    return (google_url, apple_url)

@app.route('/search', methods=['GET'])
def search_data():
    df_file_path = 'TDSB_lio.xlsx' 
    df_school_name_column = 'School Name'
    df_rank_column = 'LOI 2023\nRank' 

    search_term = request.args.get('query', type=str)  
    school_matches = search_school_rank(df_file_path, search_term)
    
    # Check if any matches were found
    if not school_matches.empty:
        results = [] 
        for index, row in school_matches.iterrows():

            school_name = row[df_school_name_column]
            school_rank = row[df_rank_column]

            start_address = os.getenv('HOME_ADDRESS')
            school_address = find_school_address(school_name)
            print(f"School Address: {school_address}")

            driving_time, walking_time, transit_time = calculate_travel_times(start_address, school_name)
            print(f"Distance: {driving_time} drive, {transit_time} via TTC, or {walking_time} walk")
            
            google_maps_url, apple_maps_url = generate_maps_url(start_address, school_name, school_address)
            print(f"Google directions: {google_maps_url}")
            print(f"Apple directions: {apple_maps_url}")

            results.append({
                "school_name": school_name,
                "school_rank": school_rank,
                "school_address": school_address if school_address else "Address not found",
                "driving_time": driving_time,
                "walking_time": walking_time,
                "transit_time": transit_time,
                "google_maps_url": google_maps_url if google_maps_url else "URL not found",
                "apple_maps_url": apple_maps_url if apple_maps_url else "URL not found"
            })

        return jsonify(results)
                        
    else:
        return jsonify({"message": "No matches found. Make sure the spelling is correct!"}), 404
 
