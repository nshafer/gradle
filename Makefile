

.PHONY : dev
dev:
	npm run dev

.PHONY : build
build:
	npm run build

.PHONY : preview
preview: build
	npm run preview

.PHONY : push
push: build
	rsync -e "ssh -p 442" -P -rvzc --cvs-exclude dist/ nate@wordle-helper.app:/web/wordle-helper.app
