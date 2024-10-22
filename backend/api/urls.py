# backend/api/urls.py
from django.urls import path
from .views import fetch_restaurants, get_suggestions
from .views import fetch_places
from .views import google_places_proxy
from .views import get_landmarks
from .views import fetch_restaurants
from .views import fetch_hotels

urlpatterns = [
    path('place-suggestions/', get_suggestions, name='place-suggestions'),
    path('fetch_places/', fetch_places, name='fetch_places'),
    path('google-places/', google_places_proxy, name='google-places-proxy'),
    path('landmarks/', get_landmarks, name='landmarks'),
    path('restaurants/', fetch_restaurants, name='fetch_restaurants'),
    path('hotels/', fetch_hotels, name='fetch_hotels'),
]