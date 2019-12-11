test:
	bin/mocha specs

eslint:
	node_modules/.bin/eslint .

.PHONY: test
