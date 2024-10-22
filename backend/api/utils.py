import requests
from django.conf import settings

def fetch_place_suggestions(input_text):
    api_key = settings.GOOGLE_API_KEY
    # Updated URL to include 'types=(cities)' for filtering results to cities
    url = f"https://maps.googleapis.com/maps/api/place/autocomplete/json?input={input_text}&types=(cities)&key={api_key}"
    response = requests.get(url)
    return response.json()
