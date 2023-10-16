build:
	npm run build

pull_answers:
	bin/pull_answers.sh
	cp bin/answers/v2/list.json public/answers/v2/

dev:
	npm run dev

devs:
	npm run devs

check:
	npm run typecheck
	npm run lint

test:
	npm run test:unit

preview: build
	npm run preview

push: build
	bin/push.sh

.PHONY: build download_answers dev devs check test preview push
