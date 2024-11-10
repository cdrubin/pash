
pash:
	curl -L https://github.com/cdrubin/quickjs/releases/latest/download/qjs -o pash && chmod +x pash

zip:
	curl -L https://cosmo.zip/pub/cosmos/bin/zip -o zip && chmod +x zip




.PHONY: build

build: pash zip
	./zip pash .init.mjs pash.mjs marked.esm.js chromium-base64.js
