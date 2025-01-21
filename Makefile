
COSMOS_VERSION=3.2.4

.PHONY: build clean

build: pash curl make unzip zip
	zip pash .init.mjs pash.mjs marked.esm.js chromium-base64.js curl make unzip zip

build-alone: pash
	zip pash .init.mjs pash.mjs marked.esm.js chromium-base64.js

#chmod:
#	curl -L https://cosmo.zip/pub/cosmos/bin/chmod.ape -o chmod && chmod +x chmod

curl:
	curl -L https://cosmo.zip/pub/cosmos/v/${COSMOS_VERSION}/bin/curl -o curl && chmod +x curl

pash:
	#curl -L https://github.com/cdrubin/quickjs/releases/download/v2.0/qjs-compiled-with-cosmocc-3.6.2 -o pash && chmod +x pash
	curl -L https://github.com/cdrubin/quickjs/releases/download/v2.0/qjs-compiled-with-cosmocc-3.2.4 -o pash && chmod +x pash
	#curl -L https://github.com/cdrubin/quickjs/releases/latest/download/qjs -o pash && chmod +x pash	curl -L https://github.com/cdrubin/quickjs/releases/download/v2.0/qjs-compiled-with-cosmocc-3.6.2 -o pash && chmod +x pash

make:
	curl -L https://cosmo.zip/pub/cosmos/v/${COSMOS_VERSION}/bin/make -o make && chmod +x make

unzip:
	curl -L https://cosmo.zip/pub/cosmos/v/${COSMOS_VERSION}/bin/unzip -o unzip && chmod +x unzip

zip:
	curl -L https://cosmo.zip/pub/cosmos/v/${COSMOS_VERSION}/bin/zip -o zip && chmod +x zip



clean:
	rm -f curl make pash unzip zip
