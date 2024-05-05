from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import User
from .serializers import *


class ClickView(APIView):

    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        users = User.objects.filter(session=self.request.session.session_key)
        if users.exists():
            if request.data.get("click") == 0:
                print("Brak kliknięć")
                return Response("Brak kliknięć", status=200)
            user = users[0]
            click_before = user.click
            user.click += request.data.get("click")
            user.save()

            print(f" -> {user.name} | {click_before} + {request.data.get('click')} = {user.click}")

            return Response("Dodano kliknięcia", status=200)
        return Response("Nie znaleziono użytkownika", status=404)
    

class UserView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GetUserView(APIView):

    def get(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        users = User.objects.filter(session=self.request.session.session_key)
        if users.exists():
            return Response({ "name": users[0].name }, status=200)
        return Response({ "name": None }, status=404)
    

class CreateUserView(APIView):

    def post(self, request):
        if not request.data.get("name"):
            return Response({"name": None}, status=400)
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        users = User.objects.filter(name=request.data.get("name"))
        if users.exists():
            user = users[0]
        else:
            user = User.objects.create()
            user.name = request.data.get("name")
        user.session = self.request.session.session_key
        user.save()

        return Response({ "name": user.name, "id": user.id }, status=201)
    

class LogoutView(APIView):

    def post(self, request):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        users = User.objects.filter(session=self.request.session.session_key)
        if users.exists():
            user = users[0]
            user.session = None
            user.save()

            return Response("Wylogowano", status=200)
        return Response("Nie znaleziono użytkownika", status=404)

        