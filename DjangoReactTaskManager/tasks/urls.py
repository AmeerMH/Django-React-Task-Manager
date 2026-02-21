from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import TaskViewSet, RegisterView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='tasks')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
] + router.urls
