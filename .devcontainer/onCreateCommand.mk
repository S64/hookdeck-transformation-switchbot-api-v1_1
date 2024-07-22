.DEFAULT_GOAL:=setup
NODE_VERSION:=$(shell cat ./.node-version)

.PHONY: setup
setup: prerequisites install-node install-pnpm

.PHONY: prerequisites
prerequisites:
	command -v curl
	command -v bash
	test -n '$(NODE_VERSION)'

.PHONY: install-node
install-node: prerequisites
	curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
	apt-get install -y nodejs=$(NODE_VERSION)-1nodesource1

.PHONY: install-pnpm
install-pnpm: install-node
	corepack enable pnpm
