
.PHONY: build clean

build: pash chmod curl unzip zip 
	./zip pash .init.mjs pash.mjs marked.esm.js chromium-base64.js chmod curl unzip zip



chmod:
	curl -L https://cosmo.zip/pub/cosmos/bin/chmod.ape -o chmod && chmod +x chmod

curl:
	curl -L https://cosmo.zip/pub/cosmos/bin/curl -o curl && chmod +x curl

pash:
	curl -L https://github.com/cdrubin/quickjs/releases/latest/download/qjs -o pash && chmod +x pash

unzip:
	curl -L https://cosmo.zip/pub/cosmos/bin/unzip -o unzip && chmod +x unzip

zip:
	curl -L https://cosmo.zip/pub/cosmos/bin/zip -o zip && chmod +x zip



clean:
	rm -f curl chmod pash unzip zip
