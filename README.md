Para executar a aplicação será necessário o gerenciador de “containers” “Docker”.


É possível buscar as imagens diretamente do “docker-hub”:
docker pull tuliomoreira77/tcc-front-end
docker pull tuliomoreira77/tcc-back-end


Caso seja necessário é possível construir a imagem a partir do “Dockerfile” na raiz
dos projetos.


Para executar o projeto basta executar os dois containers:

docker container run -p 4200:80 tuliomoreira77/tcc-front-end
docker container run -p 5000:5000 tuliomoreira77/tcc-back-end


Para realizar login do sistema utilizar o usuário e senha:
11111111102
teste123
