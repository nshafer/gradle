build:
	npm run build

dev:
	npm run dev

check:
	npm run typecheck
	npm run lint

test:
	npm run test:unit

preview: build
	npm run preview

push: build
	./push.sh

.PHONY: build dev test preview push
