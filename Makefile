.PHONY: build up down restart logs migrate createsuperuser clean

build:
	docker compose build --no-cache

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

migrate:
	docker compose exec backend python manage.py makemigrations
	docker compose exec backend python manage.py migrate
	docker compose exec backend python manage.py collectstatic --noinput

createsuperuser:
	docker compose exec backend python manage.py createsuperuser

clean:
	docker compose down -v --remove-orphans
