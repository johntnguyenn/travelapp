from django.http import JsonResponse
from .utils import fetch_place_suggestions
import requests
from django.conf import settings

def get_suggestions(request):
    user_input = request.GET.get('input', '')
    data = fetch_place_suggestions(user_input)
    return JsonResponse(data)

def fetch_places(request):
    city = request.GET.get('city')
    api_key = settings.GOOGLE_API_KEY  
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=points+of+interest+in+{city}&key={api_key}"
    response = requests.get(url)
    return JsonResponse(response.json())

def google_places_proxy(request):
    city = request.GET.get('city')
    api_key = settings.GOOGLE_API_KEY
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=landmarks+in+{city}&key={api_key}"
    response = requests.get(url)
    return JsonResponse(response.json())

def get_landmarks(request):
    city = request.GET.get('city')
    api_key = settings.GOOGLE_API_KEY
    if not city:
        return JsonResponse({'error': 'City parameter is missing'}, status=400)
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=landmarks+in+{city}&key={api_key}"
    response = requests.get(url)
    return JsonResponse(response.json())

def fetch_restaurants(request):
    city = request.GET.get('city')
    api_key = settings.GOOGLE_API_KEY
    if not city:
        return JsonResponse({'error': 'City parameter is missing'}, status=400)
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+{city}&key={api_key}"
    response = requests.get(url)
    return JsonResponse(response.json())
   

def fetch_hotels(request):
    city = request.GET.get('city')
    api_key = settings.GOOGLE_API_KEY
    if not city:
        return JsonResponse({'error': 'City parameter is missing'}, status=400)
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+{city}&key={api_key}"
    response = requests.get(url)
    return JsonResponse(response.json())