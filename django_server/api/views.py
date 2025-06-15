# api/views.py

from rest_framework.response import Response
# 'permission_classes' dekoratörünü buraya import ediyoruz
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer

# ... geri kalan kod (get_routes, register, task_list fonksiyonları)
# ... get_routes fonksiyonu burada ...
@api_view(['GET'])
def get_routes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
        '/api/register',
        '/api/tasks',
    ]
    return Response(routes)

# YENİ FONKSİYON
@api_view(['POST'])
def register(request):
    """
    Yeni bir kullanıcı oluşturur.
    """
    try:
        # Gelen POST isteğinin 'data'sından username ve password'u al
        username = request.data.get('username')
        password = request.data.get('password')

        # Alanlar boş mu diye kontrol et
        if not username or not password:
            return Response(
                {'error': 'Kullanıcı adı ve şifre zorunludur.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Kullanıcı adı daha önce alınmış mı diye kontrol et
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Bu kullanıcı adı zaten kullanılıyor.'},
                status=status.HTTP_409_CONFLICT
            )
        
        # Yeni kullanıcıyı oluştur. Django şifreyi otomatik olarak güvenli bir şekilde hash'ler.
        user = User.objects.create_user(username=username, password=password)
        
        return Response(
            {'message': f'{user.username} kullanıcısı başarıyla oluşturuldu!'},
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    # api/views.py dosyasının altına ekle

from rest_framework.permissions import IsAuthenticated # İzin kontrolü için
from .models import Task
from .serializers import TaskSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) # Bu satır, bu view'e sadece giriş yapmışların erişebileceğini söyler
def task_list(request):
    user = request.user # Token'dan gelen kullanıcı bilgisi

    if request.method == 'GET':
        tasks = Task.objects.filter(owner=user) # Sadece o kullanıcının görevlerini getir
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Gelen veriye, görevin sahibinin o anki kullanıcı olduğunu ekle
        request.data['owner'] = user.id
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # api/views.py dosyasının en altına ekle

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):
    """
    Belirli bir görevi günceller veya siler.
    'pk' parametresi URL'den gelen görev ID'sidir.
    """
    user = request.user
    
    try:
        # Sadece o kullanıcıya ait olan görevi bulmaya çalış
        task = Task.objects.get(pk=pk, owner=user)
    except Task.DoesNotExist:
        # Eğer görev yoksa veya başkasına aitse, 404 Not Found hatası döndür.
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT': # Güncelleme isteği
        # Mevcut görevi, gelen yeni veriyle güncelle
        # partial=True, sadece gönderilen alanları (örn: sadece 'completed') günceller
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    elif request.method == 'DELETE': # Silme isteği
        task.delete()
        # 204 No Content, silme işleminin başarılı olduğunu ama döndürecek bir içerik olmadığını belirtir.
        return Response(status=status.HTTP_204_NO_CONTENT)