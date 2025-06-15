# api/models.py
from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE) # Görevin sahibi
    text = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text