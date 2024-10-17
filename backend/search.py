from flask import Flask, request, jsonify
import pandas as pd
import os
import requests
import re
from dotenv import load_dotenv

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
    
    travel_modes = ['driving', 'walking', 'transit']
    travel_times = {}
    
    for mode in travel_modes:
        # URL for Directions API with the specified travel mode
        directions_url = f'https://maps.googleapis.com/maps/api/directions/json?origin={start_address}&destination={destination_address}&mode={mode}&key={api_key}'
        
        response = requests.get(directions_url)
        results = response.json()
        
        if results['status'] == 'OK':
            # Get the duration text (e.g., '15 mins', '1 hour 20 mins')
            duration = results['routes'][0]['legs'][0]['duration']['text']
            travel_times[mode] = duration
        else:
            # If there's an error (e.g., no transit routes available), set the time to None
            travel_times[mode] = None
            print(f"Error calculating {mode} time:", results['status'], results.get('error_message', ''))

    # Return a tuple of the times (driving, walking, transit)
    return (travel_times.get('driving'), travel_times.get('walking'), travel_times.get('transit'))


def generate_maps_url(start_address, school_name):
    postal_code_pattern = r'[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d'
    # Replace postal codes with an empty string
    start_address = re.sub(postal_code_pattern, '', start_address)

    # Trim all whitespace from address strings
    start_address = "".join(start_address.split())
    school_name = "".join(school_name.split())

    # Generate the URL
    directions_url = f'https://www.google.com/maps/dir/?api=1&origin={start_address}&destination={school_name}&travelmode=best'
    
    return directions_url

@app.route('/search', methods=['GET'])
def search_data():
    df_file_path = 'TDSB_lio.xlsx' 
    df_school_name_column = 'School Name'
    df_rank_column = 'LOI 2023\nRank' 

    search_term = "Shaw"
    school_matches = search_school_rank(df_file_path, search_term)
    
    # Check if any matches were found
    if not school_matches.empty:
        results = [] 
        for index, row in school_matches.iterrows():

            school_name = row[df_school_name_column]
            school_rank = row[df_rank_column]

            start_address = os.getenv('HOME_ADDRESS')
            school_address = find_school_address(school_name)
            if school_address:
                print(f"School Address: {school_address}")

                # Get driving, walking, and transit times from start address to school name
                driving_time, walking_time, transit_time = calculate_travel_times(start_address, school_name)
                print(f"Distance: {driving_time} drive, {transit_time} via TTC, or {walking_time} walk")
                
                # Calculate driving time from start address to school name
                maps_url = generate_maps_url(start_address, school_name)
                
                if maps_url:
                    print(f"Directions: {maps_url}")

                # Add each result as a dictionary to the results list
                results.append({
                    "school_name": school_name,
                    "school_rank": school_rank,
                    "school_address": school_address if school_address else "Address not found",
                    "driving_time": driving_time,
                    "walking_time": walking_time,
                    "transit_time": transit_time,
                    "maps_url": maps_url if maps_url else "URL not found"
                })

         # Return the list of results as JSON
        return jsonify(results)
                        
    else:
        return jsonify({"message": "No matches found. Make sure the spelling is correct!"}), 404
 
